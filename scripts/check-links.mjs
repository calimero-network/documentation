#!/usr/bin/env node
// Every internal link on the site resolves: a `/...` link (and https://docs.calimero.network/...)
// to a page of this site, a redirect in astro.config.mjs or a file in public/; a
// https://calimero-network.github.io/core/... link to a page of core's reference (docs/ in
// calimero-network/core, served under base /core). A `#fragment` must name a heading (or an
// explicit id) on the page it points at. External links are not checked.
//
//   node scripts/check-links.mjs [CORE_DOCS]
//
// CORE_DOCS is core's docs/src/content/docs (default: $CORE_DOCS, else ../core/docs/src/content/docs).

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src/content/docs');
const CORE_DOCS = resolve(process.argv[2] ?? process.env.CORE_DOCS ?? join(ROOT, '../core/docs/src/content/docs'));
const CORE_URL = 'https://calimero-network.github.io/core';
const SITE_URL = 'https://docs.calimero.network';

function walk(dir, exts) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) out.push(...walk(p, exts));
		else if (exts.some((e) => name.endsWith(e))) out.push(p);
	}
	return out;
}

// Text outside fenced code blocks, line by line (with line numbers kept).
function prose(text) {
	let fence = null;
	return text.split('\n').map((line) => {
		const m = line.match(/^\s*(`{3,}|~{3,})/);
		if (m) {
			if (!fence) fence = m[1];
			else if (m[1].startsWith(fence[0]) && m[1].length >= fence.length) fence = null;
			return '';
		}
		return fence ? '' : line;
	});
}

// github-slugger, as Starlight's heading ids use it.
function slugger() {
	const seen = new Map();
	return (text) => {
		const original = text
			.toLowerCase()
			.replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
			.replace(/ /g, '-');
		let s = original;
		while (seen.has(s)) {
			seen.set(original, seen.get(original) + 1);
			s = `${original}-${seen.get(original)}`;
		}
		seen.set(s, 0);
		return s;
	};
}

function headingText(raw) {
	return raw
		.replace(/\{#([^}]+)\}\s*$/, '')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/[`*]/g, '')
		.trim();
}

// The ids a page's headings (and explicit id="...") give it.
const anchorCache = new Map();
function anchors(file) {
	if (anchorCache.has(file)) return anchorCache.get(file);
	const ids = new Set(['_top']);
	const slug = slugger();
	const text = readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
	for (const line of prose(text)) {
		const h = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
		if (h) {
			const custom = h[1].match(/\{#([^}]+)\}\s*$/);
			ids.add(custom ? custom[1] : slug(headingText(h[1])));
		}
		for (const m of line.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1]);
	}
	anchorCache.set(file, ids);
	return ids;
}

// The source file of a page path ('a/b') under a content dir, or null.
function pageFile(dir, path) {
	const p = path.replace(/^\/+|\/+$/g, '');
	const candidates = p === '' ? ['index.mdx', 'index.md'] : [`${p}.mdx`, `${p}.md`, `${p}/index.mdx`, `${p}/index.md`];
	for (const c of candidates) if (existsSync(join(dir, c))) return join(dir, c);
	return null;
}

function redirectsOf(configFile) {
	if (!existsSync(configFile)) return new Map();
	const text = readFileSync(configFile, 'utf8');
	const block = text.match(/redirects:\s*\{([\s\S]*?)\n\t?\s*\}/);
	const map = new Map();
	if (block) for (const m of block[1].matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)) map.set(m[1], m[2]);
	return map;
}

const norm = (p) => (p.endsWith('/') ? p : `${p}/`);
const siteRedirects = redirectsOf(join(ROOT, 'astro.config.mjs'));
const coreRedirects = redirectsOf(join(CORE_DOCS, '../../../astro.config.mjs'));

// Resolve a site path (no base) to a file, following redirects; returns { file } or { error }.
function resolveSite(path, redirects, dir, publicDir) {
	for (let i = 0; i < 5; i++) {
		const file = pageFile(dir, path);
		if (file) return { file };
		if (publicDir && existsSync(join(publicDir, path)) && statSync(join(publicDir, path)).isFile()) return { file: null };
		const to = redirects.get(norm(path)) ?? redirects.get(path.replace(/\/$/, ''));
		if (!to) return { error: 'no such page' };
		path = to;
	}
	return { error: 'redirect loop' };
}

const sources = [
	...walk(join(ROOT, 'src'), ['.mdx', '.md', '.astro']),
	join(ROOT, 'astro.config.mjs'),
];
const LINK = /(?:\]\(|\bhref=["']|\blink:\s*["']?)((?:\/|#|https:\/\/calimero-network\.github\.io\/core|https:\/\/docs\.calimero\.network)[^)"'\s>]*)/g;

if (!existsSync(CORE_DOCS)) {
	console.error(`core's docs not found at ${CORE_DOCS} (pass the path, or set CORE_DOCS)`);
	process.exit(2);
}

let checked = 0;
const errors = [];
for (const src of sources) {
	const rel = relative(ROOT, src);
	const lines = src.endsWith('.astro') || src.endsWith('.mjs') ? readFileSync(src, 'utf8').split('\n') : prose(readFileSync(src, 'utf8'));
	lines.forEach((line, i) => {
		for (const m of line.matchAll(LINK)) {
			const url = m[1];
			if (url.startsWith('//')) continue; // protocol-relative: external
			checked++;
			const [pathPart, frag] = url.split('#');
			let target;
			let what;
			if (url.startsWith(CORE_URL)) {
				what = 'core reference';
				const p = pathPart.slice(CORE_URL.length) || '/';
				target = resolveSite(p, coreRedirects, CORE_DOCS, null);
			} else {
				what = 'this site';
				let p = pathPart.startsWith(SITE_URL) ? pathPart.slice(SITE_URL.length) || '/' : pathPart;
				if (p === '') target = src.startsWith(DOCS) ? { file: src } : { file: null }; // same-page #fragment
				else target = resolveSite(p, siteRedirects, DOCS, join(ROOT, 'public'));
				if (target.error && existsSync(join(ROOT, 'src/pages', `${p.replace(/^\/|\/$/g, '')}.astro`))) target = { file: null };
			}
			if (target.error) {
				errors.push(`${rel}:${i + 1}: ${url} (${what}: ${target.error})`);
				continue;
			}
			if (frag && target.file && !anchors(target.file).has(frag)) {
				errors.push(`${rel}:${i + 1}: ${url} (${what}: no heading #${frag} in ${relative(ROOT, target.file)})`);
			}
		}
	});
}

for (const e of errors) console.log(`BROKEN  ${e}`);
console.log(`check-links: ${checked} internal links, ${errors.length} broken`);
process.exit(errors.length ? 1 : 0);
