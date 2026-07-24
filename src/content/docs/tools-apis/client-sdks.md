---
title: "Calimero Client SDKs"
description: "A catalog of the client libraries for talking to Calimero nodes — calling app methods, subscribing to events, and driving admin APIs — across TypeScript, Python, Kotlin, and Swift."
---

Client SDKs let you interact with Calimero nodes from your own code: call application methods over JSON-RPC, subscribe to context events, and drive the admin API (contexts, namespaces, groups, members).

## App SDK vs client SDKs

These are two different things, and it's easy to confuse them:

- **App SDK** — the Rust `calimero-sdk` you use to *write* application logic that runs inside the node as WASM. See the [SDK Guide](/builder-directory/sdk-guide/).
- **Client SDKs** — the libraries below that *talk to* a node from the outside (web apps, scripts, tools, mobile apps).

## The client catalog

| SDK | Language | Best for | Reference |
| --- | --- | --- | --- |
| **mero.js** | TypeScript / JavaScript | Web apps, Node.js tools, admin UI; the primary JS/TS client | <https://calimero-network.github.io/mero-js/> |
| **calimero-client-py** | Python | Automation scripts, monitoring, CI/CD, driving merobox workflows | <https://calimero-network.github.io/calimero-client-py/> |
| **mero-kotlin** | Kotlin | Android and JVM applications | <https://calimero-network.github.io/kotlin-sdk/> |
| **MeroKit** | Swift | iOS / macOS applications | <https://calimero-network.github.io/swift-sdk/> |
| **mero-devtools-js** | TypeScript / Node.js | ABI codegen (`calimero-abi-codegen`) and other dev tooling | <https://calimero-network.github.io/mero-devtools-js/> |

Each reference site documents installation, authentication, calling methods, event subscriptions (WebSocket / SSE), and the full admin API for that language. Code examples live there rather than being duplicated here.

## Related topics

- [meroctl CLI](/tools-apis/meroctl-cli/) — the command-line client
- [Developer Tools](/tools-apis/developer-tools/) — merobox, ABI codegen, scaffolding
- [JavaScript SDK Guide](/builder-directory/js-sdk-guide/) — using mero.js
- [Contexts](/core-concepts/contexts/) and [Identity](/core-concepts/identity/)
