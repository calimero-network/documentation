---
title: "Service SDK (Rust)"
description: "The Rust Service SDK (calimero-sdk) for writing the application logic that runs inside a node: the app model, CRDT collections, events, and storage kinds. Links to the full Core reference."
---

The **Service SDK** is what you use to write the application logic that runs *inside* a node (compiled to WASM). The **Rust** SDK (`calimero-sdk`, plus `calimero-storage` for CRDT collections) is production-ready and the recommended path today. This page is a high-level tour of the app model; for the complete, authoritative API reference see the **[Core Build docs](https://calimero-network.github.io/core/build/)**.

:::note[JavaScript Service SDK — in development]
A JavaScript/TypeScript Service SDK (`calimero-sdk-js`) is in active development and not yet production-ready. To write app logic today, use Rust; to follow the JS effort, see [`calimero-network/calimero-sdk-js`](https://github.com/calimero-network/calimero-sdk-js). (This is separate from the JS **client** SDK, [mero.js](https://calimero-network.github.io/mero-js/), which talks to a node from the outside.)
:::

## The app model

An application is a single state struct plus the methods that operate on it:

- `#[app::state]` marks the struct that is persisted and synchronized across context members.
- `#[app::logic]` marks the `impl` block whose public methods become callable endpoints.
- `#[app::init]` marks the one-time initializer run when a context is created.
- Methods taking `&mut self` are **mutations** (they produce deltas that sync to peers); methods taking `&self` are **views** (read-only, no delta).
- Methods return `app::Result<T>` for error handling.

```rust
use calimero_sdk::app;
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_storage::collections::{LwwRegister, UnorderedMap};

#[app::state]
#[derive(Debug, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct KvStore {
    items: UnorderedMap<String, LwwRegister<String>>,
}

#[app::logic]
impl KvStore {
    #[app::init]
    pub fn init() -> KvStore {
        KvStore { items: UnorderedMap::new() }
    }

    pub fn set(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key, value.into())?;
        Ok(())
    }

    pub fn get(&self, key: &str) -> app::Result<Option<String>> {
        Ok(self.items.get(key)?.map(|v| v.get().clone()))
    }
}
```

The caller's identity is available inside any method via `calimero_sdk::env::executor_id()` — use it for authorization and per-user data.

## CRDT collections

Synchronized state must use CRDT collections (not plain Rust collections) so that concurrent edits on different nodes merge deterministically. The collection you pick decides the merge behavior:

| Collection | Use case | Merge strategy |
| --- | --- | --- |
| `Counter` | Counters, metrics | Sum |
| `LwwRegister<T>` | Single values | Latest timestamp wins |
| `ReplicatedGrowableArray` | Text, documents | Character-level |
| `UnorderedMap<K,V>` | Key-value storage | Recursive per-entry |
| `Vector<T>` | Ordered lists | Element-wise |
| `UnorderedSet<T>` | Unique values | Union |

Custom structs made of CRDT fields can derive `Mergeable` to merge field-by-field (implement `Mergeable` manually when you need validation or custom logic during merge). Primitives like `String`/`u64` are not `Mergeable` — wrap them in `LwwRegister<T>`.

## Events

State changes can emit events that propagate with the delta and run handlers on peer nodes — useful for driving real-time UI updates. Declare the event type with `#[app::event]`, enable emission with `#[app::state(emits = ...)]`, and emit with `app::emit!(...)`. See the [Core Build docs](https://calimero-network.github.io/core/build/) for the full lifecycle.

## Storage kinds

Beyond the shared CRDT state, the SDK offers three specialized storage kinds:

- **Private storage** (`#[app::private]`) — node-local data (secrets, caches). Never replicated, never in deltas, only readable on the executing node.
- **User storage** (`UserStorage<T>`) — per-user data keyed by the owner's public key. Writes are signed by the executor and verified by other nodes (with replay protection).
- **Frozen storage** (`FrozenStorage<T>`) — immutable, content-addressed values keyed by their SHA-256 hash. Insert-only; good for audit logs, versioned documents, and attestations.

## Build to WASM

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --profile app-release
# Output: target/wasm32-unknown-unknown/app-release/<crate>.wasm
```

A `build.rs` that calls the `calimero-wasm-abi` emitter generates `res/abi.json` (and `res/state-schema.json`) during the build; feed the ABI to `calimero-abi-codegen` to generate a typed client. The Core reference documents the exact `Cargo.toml`, profile, and build-script setup.

## Full reference

- **Core Build docs** — complete SDK and storage API: <https://calimero-network.github.io/core/build/>
- **Example apps** — [Core Apps Examples](/examples/core-apps-examples/) and [`core/apps`](https://github.com/calimero-network/core/tree/master/apps)

## Related topics

- [Getting Started](/getting-started/)
- [Builder Directory](/builder-directory/) — the end-to-end build path
- [Applications](/core-concepts/applications/) — application architecture overview
- [Client SDKs](/tools-apis/client-sdks/) — calling your app from JS, Python, Kotlin, or Swift
