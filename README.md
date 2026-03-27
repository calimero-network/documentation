# Calimero Docs

Official documentation site for the [Calimero network](https://calimero.network), built with [Astro Starlight](https://starlight.astro.build).

Live at **[docs.calimero.network](https://docs.calimero.network)**

## Contents

- **Core Concepts** — architecture, contexts, identity, nodes, and applications
- **Build** — Rust SDK, JavaScript SDK, app examples, and the app registry
- **Run & Integrate** — node operations, CLI, Desktop, client SDKs, Merobox, and Calimero Cloud
- **Privacy & Security** — TEE, KMS, and attestation
- **Reference** — API and JSON-RPC reference

## Local development

```bash
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview production build locally
```

## Project structure

```
src/
├── assets/          # images and icons
├── components/      # custom Astro components
├── content/
│   └── docs/        # all documentation pages (.md)
├── pages/           # custom pages (e.g. 404)
└── styles/          # global CSS overrides
astro.config.mjs     # Starlight config, sidebar, and nav
```

## Contributing

All docs live as Markdown files under `src/content/docs/`. To add or edit a page:

1. Create or edit a `.md` file in the relevant section folder
2. Add it to the sidebar in `astro.config.mjs` if it's a new page
3. Run `npm run dev` to preview locally
4. Open a pull request

## Built with

- [Astro](https://astro.build)
- [Starlight](https://starlight.astro.build)
- [astro-mermaid](https://github.com/sjwall/astro-mermaid) — diagram support
