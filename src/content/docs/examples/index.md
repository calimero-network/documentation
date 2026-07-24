---
title: "Examples"
description: "A catalog of working Calimero example apps — focused reference apps in core/apps plus full applications. Clone one and adapt its patterns."
---

Learn Calimero by exploring working examples. Each has source code, a README, and (mostly) merobox workflows you can run locally.

## Reference apps (`core/apps`)

Small, focused implementations that each demonstrate one set of SDK patterns. Clone one, read its README, and adapt it — the authoritative detail lives in the source.

| Example | Demonstrates | Repo |
| --- | --- | --- |
| **kv-store** | CRDT `UnorderedMap` + `LwwRegister`, mutations vs views, events, `app::Result` — the canonical starting point | [kv-store](https://github.com/calimero-network/core/tree/master/apps/kv-store) |
| **kv-store-with-handlers** | Event handlers that run on peer nodes (real-time, event-driven updates) | [kv-store-with-handlers](https://github.com/calimero-network/core/tree/master/apps/kv-store-with-handlers) |
| **blobs** | Content-addressed file/blob storage + P2P distribution outside the CRDT state | [blobs](https://github.com/calimero-network/core/tree/master/apps/blobs) |
| **collaborative-editor** | `ReplicatedGrowableArray` (RGA) for conflict-free character-level text | [collaborative-editor](https://github.com/calimero-network/core/tree/master/apps/collaborative-editor) |
| **private-data** | Node-local private storage that never syncs to other nodes | [private-data](https://github.com/calimero-network/core/tree/master/apps) |
| **team-metrics** | Nested CRDTs (map → map → counter); ships a `derive(Mergeable)` and a custom-merge variant | [macro](https://github.com/calimero-network/core/tree/master/apps/team-metrics-macro) · [custom](https://github.com/calimero-network/core/tree/master/apps/team-metrics-custom) |
| **xcall-example** | Cross-context calls (one context invoking another) with a ping/pong pattern | [xcall-example](https://github.com/calimero-network/core/tree/master/apps/xcall-example) |

## Full applications

- **Battleships** — a multiplayer game showing private per-player state and turn-based logic: [calimero-network/battleships](https://github.com/calimero-network/battleships).
- **Starter template** — scaffold a fresh app (Rust logic + frontend + workflows) with `npx create-mero-app@latest my-app`. See [Developer Tools](/tools-apis/developer-tools/).

To discover apps already built on Calimero, browse the [App Directory](/app-directory/).

## Running an example

Most examples ship a merobox workflow, so the fastest path is:

```bash
cd core/apps/kv-store
merobox bootstrap run workflows/kv-store.yml
```

To run it manually: build the WASM (`./build.sh`), install it (`meroctl app install --path res/kv_store.wasm` — returns an application id), create a context (`meroctl context create --application-id <APP_ID>`), then call methods (`meroctl call <METHOD> --context <CTX> --args '<JSON>'`). See [Getting Started](/getting-started/) for setup.

## Related

- [Service SDKs](/builder-directory/sdk-guide/) — the app model and CRDT reference
- [Applications](/core-concepts/applications/) — application architecture
- [Core Build docs](https://calimero-network.github.io/core/build/) — the full Rust SDK reference
