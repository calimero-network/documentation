---
title: "Core Apps Examples"
description: "Short descriptions of the reference apps in core/apps — what each demonstrates and where to find it. Read the source and READMEs for the full method-by-method detail."
---

The [`core/apps`](https://github.com/calimero-network/core/tree/master/apps) directory contains small reference implementations, each focused on one set of SDK patterns. Clone one, read its README, and adapt it. The descriptions below are pointers — the authoritative detail lives in each app's source and README.

| Example | What it demonstrates | Key SDK features |
| --- | --- | --- |
| kv-store | Basic CRDT usage | `UnorderedMap`, `LwwRegister`, events |
| kv-store-with-handlers | Event handling on peers | Event emission and handlers |
| blobs | File/blob management | Blob storage and distribution |
| collaborative-editor | Text collaboration | `ReplicatedGrowableArray` (RGA) |
| private-data | Private storage | Node-local secrets and data |
| team-metrics | Nested CRDTs | Nested maps, counters |
| xcall-example | Cross-context calls | Inter-context communication |

## kv-store

A simple key-value store — the canonical starting point. Shows a CRDT `UnorderedMap<String, LwwRegister<String>>`, mutations vs views, event emission, and `app::Result<T>` error handling. Repo: [core/apps/kv-store](https://github.com/calimero-network/core/tree/master/apps/kv-store).

## kv-store-with-handlers

The same key-value store extended with event handlers that run on peer nodes when events propagate — the pattern behind real-time, event-driven UI updates. Repo: [core/apps/kv-store-with-handlers](https://github.com/calimero-network/core/tree/master/apps/kv-store-with-handlers).

## blobs

Stores and distributes files as content-addressed blobs across the network, with context-aware announcements and P2P discovery. Shows how large binary data is shared outside the CRDT state. Repo: [core/apps/blobs](https://github.com/calimero-network/core/tree/master/apps/blobs).

## collaborative-editor

A real-time collaborative text editor built on the `ReplicatedGrowableArray` (RGA) CRDT, giving conflict-free character-level inserts and deletes at arbitrary positions. Repo: [core/apps/collaborative-editor](https://github.com/calimero-network/core/tree/master/apps/collaborative-editor).

## private-data

Demonstrates node-local private storage — data that never syncs to other nodes — for secrets, caches, and per-node counters, and when to use it instead of shared state. Repo: [core/apps/private-data](https://github.com/calimero-network/core/tree/master/apps).

## team-metrics

Shows nested CRDT structures (a map of team to a map of member to counter) for aggregating metrics across a hierarchy. Available in both a `derive(Mergeable)` macro variant and a custom-merge variant: [team-metrics-macro](https://github.com/calimero-network/core/tree/master/apps/team-metrics-macro) and [team-metrics-custom](https://github.com/calimero-network/core/tree/master/apps/team-metrics-custom).

## xcall-example

Demonstrates cross-context calls — one context invoking a method in another — with a ping/pong pattern for inter-context coordination. Repo: [core/apps/xcall-example](https://github.com/calimero-network/core/tree/master/apps/xcall-example).

## Running an example

Most examples ship a merobox workflow, so the fastest path is:

```bash
cd core/apps/kv-store
merobox bootstrap run workflows/kv-store.yml
```

To run manually: build the WASM (`./build.sh`), install it (`meroctl app install --path res/kv_store.wasm` — returns an application id), create a context (`meroctl context create --application-id <APP_ID>`), then call methods with `meroctl call <METHOD> --context <CTX> --args '<JSON>'`.

## Related topics

- [SDK Guide](/builder-directory/sdk-guide/) — the app model and CRDT reference
- [Examples](/examples/) — the full example catalog
- [Getting Started](/getting-started/) — installation and setup
- [Applications](/core-concepts/applications/) — application architecture
- **Core Build docs**: <https://calimero-network.github.io/core/build/>
