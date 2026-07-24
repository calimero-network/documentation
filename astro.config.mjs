// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://docs.calimero.network',
	integrations: [
		mermaid({
			autoTheme: true,
			enableLog: false,
			mermaidConfig: {
				theme: 'dark',
				flowchart: { curve: 'basis', nodeSpacing: 32, rankSpacing: 48 },
				themeVariables: {
					fontFamily: 'DM Sans, Inter, ui-sans-serif, system-ui, sans-serif',
					fontSize: '13px',
					primaryColor: '#18181b',
					primaryTextColor: '#e4e4e7',
					primaryBorderColor: '#3f3f46',
					lineColor: '#52525b',
					secondaryColor: '#27272a',
					tertiaryColor: '#1c1c1e',
				},
			},
		}),
		starlight({
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
			},
			title: 'Calimero Docs',
			description: 'Lightweight documentation for the Calimero network and developer stack.',
			logo: {
				src: './src/assets/calimero-logo.svg',
				alt: 'Calimero',
				replacesTitle: true,
			},
			titleDelimiter: '|',
			defaultLocale: 'root',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/calimero-network' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/CalimeroNetwork' },
				{ icon: 'external', label: 'calimero.network', href: 'https://calimero.network' },
			],
			customCss: ['./src/styles/calimero.css'],
			head: [
				// Fonts
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{ tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap' } },
				// Open Graph
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { property: 'og:title', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { property: 'og:description', content: 'Official documentation for the Calimero network — core concepts, SDKs, node operations, tooling, and the app registry.' } },
				{ tag: 'meta', attrs: { property: 'og:url', content: 'https://docs.calimero.network' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://docs.calimero.network/og-image.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'Calimero Docs' } },
				// Twitter / X card
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:site', content: '@CalimeroNetwork' } },
				{ tag: 'meta', attrs: { name: 'twitter:title', content: 'Calimero Docs' } },
				{ tag: 'meta', attrs: { name: 'twitter:description', content: 'Official documentation for the Calimero network — core concepts, SDKs, node operations, tooling, and the app registry.' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://docs.calimero.network/og-image.png' } },
			],
			sidebar: [
				{
					label: 'Start Here',
					collapsed: false,
					items: [
						{ label: 'Home', slug: '' },
						{ label: 'Introduction', slug: 'intro' },
						{ label: 'Getting Started', slug: 'getting-started' },
					],
				},
				{
					label: 'Vision',
					collapsed: false,
					items: [
						{ label: 'Why Calimero', slug: 'vision/why-calimero' },
						{ label: 'Architecture at a Glance', slug: 'vision/architecture' },
						{ label: 'The Ecosystem', slug: 'vision/ecosystem' },
						{ label: 'How Calimero Compares', slug: 'vision/comparison' },
					],
				},
				{
					label: 'Concepts',
					collapsed: false,
					items: [
						{ label: 'Core Concepts', slug: 'core-concepts' },
						{ label: 'System Architecture', slug: 'core-concepts/architecture' },
						{ label: 'Contexts', slug: 'core-concepts/contexts' },
						{ label: 'Identity', slug: 'core-concepts/identity' },
						{ label: 'Applications', slug: 'core-concepts/applications' },
						{ label: 'Nodes', slug: 'core-concepts/nodes' },
						{ label: 'Privacy & Security', slug: 'privacy-verifiability-security' },
						{ label: 'mero-tee, KMS & Attestation', slug: 'privacy-verifiability-security/mero-tee' },
					],
				},
				{
					label: 'Build',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'builder-directory' },
						{ label: 'Examples', slug: 'examples' },
						{ label: 'Core App Examples', slug: 'examples/core-apps-examples' },
						{ label: 'App Directory & Registry', slug: 'app-directory' },
						{ label: 'Registry Overview', slug: 'app-directory/registry-overview' },
						{ label: 'Registry API & CLI', slug: 'app-directory/registry-api-and-cli' },
						{ label: 'Organizations & Ownership', slug: 'app-directory/organizations-and-ownership' },
					],
				},
				{
					label: 'Service SDK',
					collapsed: false,
					items: [
						{ label: 'Rust', slug: 'builder-directory/sdk-guide' },
						{ label: 'JavaScript', link: 'https://github.com/calimero-network/calimero-sdk-js', badge: { text: 'In dev', variant: 'caution' }, attrs: { target: '_blank' } },
					],
				},
				{
					label: 'Client SDKs',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'tools-apis/client-sdks' },
						{ label: 'JavaScript', link: 'https://calimero-network.github.io/mero-js/', attrs: { target: '_blank' } },
						{ label: 'Python', link: 'https://calimero-network.github.io/calimero-client-py/', attrs: { target: '_blank' } },
						{ label: 'Kotlin', link: 'https://calimero-network.github.io/kotlin-sdk/', attrs: { target: '_blank' } },
						{ label: 'Swift', link: 'https://calimero-network.github.io/swift-sdk/', attrs: { target: '_blank' } },
					],
				},
				{
					label: 'Run & Operate',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'operator-track' },
						{ label: 'Run a Local Network', slug: 'operator-track/run-a-local-network' },
						{ label: 'Monitoring', slug: 'operator-track/monitor-and-debug' },
						{ label: 'Calimero Cloud & MDMA', slug: 'calimero-cloud' },
						{ label: 'Cloud Dashboard & Plans', slug: 'calimero-cloud/cloud-dashboard' },
						{ label: 'Operator Architecture', slug: 'calimero-cloud/operator-architecture' },
					],
				},
				{
					label: 'Tools & Reference',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'tools-apis' },
						{ label: 'Desktop', slug: 'tools-apis/desktop' },
						{ label: 'How Desktop Works', slug: 'tools-apis/desktop-internals' },
						{ label: 'CLI (meroctl)', slug: 'tools-apis/meroctl-cli' },
						{ label: 'Developer Tools', slug: 'tools-apis/developer-tools' },
						{ label: 'Merobox', slug: 'tools-apis/merobox' },
						{ label: 'mero-sign', slug: 'tools-apis/mero-sign' },
						{ label: 'API Reference', slug: 'reference' },
					],
				},
			],
		}),
	],
});
