---
title: "Calimero and JavaScript"
description: "Calimero application logic is written in Rust and compiled to WASM. The JavaScript story is the client side: use mero.js to call your app, subscribe to events, and drive admin APIs from JS/TS."
---

Calimero **application logic is written in Rust** with `calimero-sdk` and compiled to WASM (see the [SDK Guide](/builder-directory/sdk-guide/)). JavaScript and TypeScript come in on the **client side** — the code that calls your deployed app, subscribes to its events, and manages contexts, groups, and members.

The client library for that is **mero.js**.

## mero.js

`@calimero-network/mero-js` is the pure-TypeScript client for Calimero. It has no framework dependency and runs in Node.js and the browser. Use it to:

- Call application methods over JSON-RPC and read results.
- Subscribe to context events over WebSocket or SSE.
- Drive the admin API — namespaces, groups, members, contexts, metadata, and capabilities.

```bash
npm install @calimero-network/mero-js
# or: pnpm add @calimero-network/mero-js
```

```typescript
import { createMeroJs } from '@calimero-network/mero-js';

const mero = createMeroJs({
  nodeUrl: 'http://localhost:2528',
  accessToken: 'YOUR_JWT',
});

const namespaces = await mero.admin.listNamespaces();
```

For the full API — client construction, calling methods, event subscriptions, and every admin method — see the **[mero.js reference site](https://calimero-network.github.io/mero-js/)**.

## Generating a typed client

Your Rust app's build produces an ABI manifest (`res/abi.json`). Feed it to `calimero-abi-codegen` to generate a typed TypeScript client so method names and argument shapes are checked at compile time:

```bash
calimero-abi-codegen -i res/abi.json -o src/generated
```

See [Developer Tools](/tools-apis/developer-tools/) and the [mero-devtools-js reference](https://calimero-network.github.io/mero-devtools-js/).

## Choosing a client

mero.js is the primary JS/TS client, but Calimero has clients for several ecosystems. See [Client SDKs](/tools-apis/client-sdks/) for the full catalog (Python, Kotlin, Swift, and more).

## Related topics

- [SDK Guide (Rust)](/builder-directory/sdk-guide/) — writing the application logic
- [Client SDKs](/tools-apis/client-sdks/) — all client libraries
- [Builder Directory](/builder-directory/) — the end-to-end build path
- [Getting Started](/getting-started/)
