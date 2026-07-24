---
title: "Examples"
description: "A catalog of working Calimero example apps. Each includes source, a README, and merobox workflows — clone one and adapt its patterns."
---

Learn Calimero by exploring working examples. Each has source code, a README, and merobox workflow configs so you can run it locally.

## Reference apps in Core

The `core/apps` directory holds small, focused reference implementations that demonstrate SDK patterns and CRDT usage. See [Core Apps Examples](/examples/core-apps-examples/) for one-paragraph descriptions of each, or browse the source:

| Example | Demonstrates | Repo |
| --- | --- | --- |
| kv-store | Basic CRDT key-value storage, events | [core/apps/kv-store](https://github.com/calimero-network/core/tree/master/apps/kv-store) |
| kv-store-with-handlers | Event handlers on peer nodes | [core/apps/kv-store-with-handlers](https://github.com/calimero-network/core/tree/master/apps/kv-store-with-handlers) |
| blobs | File/blob storage with content addressing | [core/apps/blobs](https://github.com/calimero-network/core/tree/master/apps/blobs) |
| collaborative-editor | RGA CRDT for collaborative text | [core/apps/collaborative-editor](https://github.com/calimero-network/core/tree/master/apps/collaborative-editor) |
| private-data | Node-local private storage | [core/apps/private-data](https://github.com/calimero-network/core/tree/master/apps) |
| team-metrics | Nested CRDT structures | [core/apps/team-metrics-macro](https://github.com/calimero-network/core/tree/master/apps/team-metrics-macro) |
| xcall-example | Cross-context calls | [core/apps/xcall-example](https://github.com/calimero-network/core/tree/master/apps/xcall-example) |

## Full applications

- **Battleships** — a multiplayer game showing private per-player state and turn-based logic: [calimero-network/battleships](https://github.com/calimero-network/battleships).
- **Starter template** — scaffold a fresh app (Rust logic + frontend + workflows) with `npx create-mero-app@latest my-app`. See [Developer Tools](/tools-apis/developer-tools/).

To discover apps already built on Calimero, see the [App Directory](/app-directory/).

## Running an example

1. Clone or browse the repo and read its README.
2. Build the WASM (`./build.sh` or the repo's build step).
3. Install it on a local node: `meroctl app install --path <file.wasm>` (returns an application id).
4. Create a context: `meroctl context create --application-id <APP_ID>`.
5. Call methods with `meroctl call` or run the bundled merobox workflow.

See [Getting Started](/getting-started/) for installation and setup.
