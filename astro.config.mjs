// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const DESCRIPTION =
	'Build, publish and run apps on Calimero: sandboxed WASM replicated across attested Intel TDX nodes, reached through a sealed channel, signed in with passkeys.';

export default defineConfig({
	site: 'https://docs.calimero.network',
	// Pages that moved. Old links (the landing, search engines, bookmarks) land on the page that covers it now.
	redirects: {
		'/intro/': '/what-is-calimero/',
		'/vision/why-calimero/': '/what-is-calimero/',
		'/vision/architecture/': '/what-is-calimero/',
		'/vision/ecosystem/': '/what-is-calimero/',
		'/vision/comparison/': '/what-is-calimero/',
		'/core-concepts/': '/what-is-calimero/',
		'/core-concepts/architecture/': '/what-is-calimero/',
		'/core-concepts/contexts/': '/build/app-model/',
		'/core-concepts/applications/': '/build/app-model/',
		'/core-concepts/identity/': '/cloud/organizations/',
		'/core-concepts/nodes/': '/security/',
		'/privacy-verifiability-security/': '/security/',
		'/privacy-verifiability-security/mero-tee/': '/security/attestation/',
		'/builder-directory/': '/build/',
		'/builder-directory/sdk-guide/': '/build/first-app/',
		'/app-directory/': '/build/publish/',
		'/app-directory/registry-overview/': '/build/publish/',
		'/app-directory/registry-api-and-cli/': '/build/publish/',
		'/app-directory/organizations-and-ownership/': '/build/publish/',
		'/operator-track/': '/reference/',
		'/operator-track/run-a-local-network/': '/getting-started/',
		'/operator-track/monitor-and-debug/': '/reference/',
		'/calimero-cloud/': '/cloud/',
		'/calimero-cloud/cloud-dashboard/': '/cloud/',
		'/calimero-cloud/operator-architecture/': '/security/',
		'/tools-apis/': '/clients/',
		'/tools-apis/client-sdks/': '/clients/',
		'/tools-apis/meroctl-cli/': '/clients/',
		'/tools-apis/mero-sign/': '/build/publish/',
		'/tools-apis/developer-tools/': '/clients/',
		'/tools-apis/desktop/': '/clients/',
		'/tools-apis/desktop-internals/': '/clients/',
		'/tools-apis/merobox/': '/getting-started/',
		'/examples/': '/build/',
	},
	integrations: [
		starlight({
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
				// The home page's hero, in the landing's type.
				Hero: './src/components/Hero.astro',
			},
			title: 'Calimero Docs',
			description: DESCRIPTION,
			// The landing's wordmark, in ink on paper and paper on ink.
			logo: {
				light: './src/assets/calimero-logo-light.svg',
				dark: './src/assets/calimero-logo-dark.svg',
				alt: 'Calimero',
				replacesTitle: true,
			},
			titleDelimiter: '|',
			// src/pages/404.astro is the site's 404, in the landing's design.
			disable404Route: true,
			defaultLocale: 'root',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/calimero-network' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/CalimeroNetwork' },
				{ icon: 'external', label: 'calimero.network', href: 'https://calimero.network' },
			],
			customCss: ['./src/styles/calimero.css'],
			head: [
				// The landing's faces: Inter Tight and JetBrains Mono.
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
					},
				},
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { property: 'og:title', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { property: 'og:description', content: DESCRIPTION } },
				{ tag: 'meta', attrs: { property: 'og:url', content: 'https://docs.calimero.network' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://docs.calimero.network/og-image.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:site', content: '@CalimeroNetwork' } },
				{ tag: 'meta', attrs: { name: 'twitter:title', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { name: 'twitter:description', content: DESCRIPTION } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://docs.calimero.network/og-image.png' } },
			],
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: {
					borderRadius: '0',
					codeFontFamily: "'JetBrains Mono', ui-monospace, monospace",
					uiFontFamily: "'Inter Tight', system-ui, sans-serif",
				},
			},
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Home', slug: '' },
						{ label: 'What is Calimero', slug: 'what-is-calimero' },
						{ label: 'Quickstart', slug: 'getting-started' },
					],
				},
				{
					label: 'Build',
					items: [
						{ label: 'Overview', slug: 'build' },
						{ label: 'Your first app', slug: 'build/first-app' },
						{ label: 'What an app sees', slug: 'build/app-model' },
						{ label: 'Package & publish', slug: 'build/publish' },
					],
				},
				{
					label: 'Calimero Cloud',
					items: [
						{ label: 'Overview', slug: 'cloud' },
						{ label: 'Deploy & instances', slug: 'cloud/deploy' },
						{ label: 'Organizations & access', slug: 'cloud/organizations' },
					],
				},
				{
					label: 'Connect',
					items: [
						{ label: 'Clients', slug: 'clients' },
						{ label: 'Verify a cluster', slug: 'clients/verify' },
					],
				},
				{
					label: 'Security',
					items: [
						{ label: 'Security model', slug: 'security' },
						{ label: 'Attestation', slug: 'security/attestation' },
					],
				},
				{
					label: 'Reference',
					items: [{ label: 'Glossary & further reading', slug: 'reference' }],
				},
			],
		}),
	],
});
