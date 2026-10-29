# Calimero Docs

Official documentation site for the [Calimero network](https://calimero.network), built with [Astro Starlight](https://starlight.astro.build).

Live at **[docs.calimero.network](https://docs.calimero.network)**

## Contents

- **Start here** — what Calimero is, and a quickstart on a local cluster
- **Build** — your first app on the Rust SDK, what an app sees on a cluster, packaging and publishing to the registry
- **Calimero Cloud** — shared and dedicated clusters, deploying a version, an instance per organization, organizations and access
- **Connect** — the clients (mero-js, Python, Rust, meroctl) and verifying a cluster
- **Security** — the security model and attestation
- **Reference** — glossary, and links to the [core reference](https://calimero-network.github.io/core/) for the protocol, the full SDK and running nodes

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
├── components/      # the home hero and the diagrams (Flow, ClusterDiagram, OrgDiagram)
├── content/
│   └── docs/        # all documentation pages (.md)
├── pages/           # custom pages (e.g. 404)
└── styles/          # global CSS overrides
astro.config.mjs     # Starlight config, sidebar, and nav
```

## Contributing

All docs live as MDX files under `src/content/docs/`. To add or edit a page:

1. Create or edit a `.mdx` file in the relevant section folder
2. Add it to the sidebar in `astro.config.mjs` if it's a new page
3. Run `npm run dev` to preview locally
4. Open a pull request

## Built with

- [Astro](https://astro.build)
- [Starlight](https://starlight.astro.build)

## Design

The site uses the calimero.network landing's design: paper and ink with one seal red, Inter Tight and JetBrains Mono,
hairline rules and square corners, in light and dark. The tokens are in `src/styles/calimero.css`, mapped onto
Starlight's `--sl-color-*` scale. Diagrams are Astro components drawn from the same tokens, so they follow the theme;
use `Flow` for a sequence of steps rather than an image or a diagram library.
