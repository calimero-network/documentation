// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const DESCRIPTION =
	'Build, publish and run apps on Calimero: sandboxed WASM replicated across attested Intel TDX nodes, reached through a sealed channel, signed in with passkeys.';

export default defineConfig({
	site: 'https://docs.calimero.network',
	// Pages that moved. Old links (the landing, search engines, bookmarks) land on the page that covers it now.
	redirects: {
		'/intro/': '/concepts/',
		'/vision/why-calimero/': '/concepts/',
		'/vision/architecture/': '/concepts/',
		'/vision/ecosystem/': '/concepts/',
		'/vision/comparison/': '/concepts/',
		'/core-concepts/': '/concepts/',
		'/core-concepts/architecture/': '/concepts/',
		'/core-concepts/contexts/': '/concepts/app-model/',
		'/core-concepts/applications/': '/concepts/app-model/',
		'/core-concepts/identity/': '/concepts/organizations/',
		'/core-concepts/nodes/': '/security/',
		'/privacy-verifiability-security/': '/security/',
		'/privacy-verifiability-security/mero-tee/': '/security/attestation/',
		'/builder-directory/': '/guide/example/',
		'/builder-directory/sdk-guide/': '/guide/example/',
		'/app-directory/': '/guide/publish/',
		'/app-directory/registry-overview/': '/guide/publish/',
		'/app-directory/registry-api-and-cli/': '/guide/publish/',
		'/app-directory/organizations-and-ownership/': '/guide/publish/',
		'/operator-track/': '/reference/',
		'/operator-track/run-a-local-network/': '/getting-started/',
		'/operator-track/monitor-and-debug/': '/reference/',
		'/calimero-cloud/': '/guide/deploy/',
		'/calimero-cloud/cloud-dashboard/': '/guide/deploy/',
		'/calimero-cloud/operator-architecture/': '/security/',
		'/tools-apis/': '/guide/clients/',
		'/tools-apis/client-sdks/': '/guide/clients/',
		'/tools-apis/meroctl-cli/': '/guide/clients/',
		'/tools-apis/mero-sign/': '/guide/publish/',
		'/tools-apis/developer-tools/': '/guide/clients/',
		'/tools-apis/desktop/': '/guide/clients/',
		'/tools-apis/desktop-internals/': '/guide/clients/',
		'/tools-apis/merobox/': '/getting-started/',
		'/examples/': '/guide/example/',
		// The one linear path (2026-11): the guide's pages and the merged concepts page.
		'/what-is-calimero/': '/concepts/',
		'/how-it-works/': '/concepts/',
		'/build/': '/guide/example/',
		'/build/first-app/': '/guide/example/',
		'/build/publish/': '/guide/publish/',
		'/build/app-model/': '/concepts/app-model/',
		'/clients/': '/guide/clients/',
		'/clients/verify/': '/security/verify/',
		'/cloud/': '/guide/deploy/',
		'/cloud/deploy/': '/guide/deploy/',
		'/cloud/organizations/': '/concepts/organizations/',
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
						{ label: 'Quickstart', slug: 'getting-started' },
					],
				},
				{
					label: 'Guide',
					items: [
						{ label: '1. The example, line by line', slug: 'guide/example' },
						{ label: '2. Call it from code', slug: 'guide/clients' },
						{ label: '3. Package & publish', slug: 'guide/publish' },
						{ label: '4. Deploy & install', slug: 'guide/deploy' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'How Calimero works', slug: 'concepts' },
						{ label: 'What an app sees', slug: 'concepts/app-model' },
						{ label: 'Organizations & access', slug: 'concepts/organizations' },
					],
				},
				{
					label: 'Security',
					items: [
						{ label: 'Verify a cluster', slug: 'security/verify' },
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
