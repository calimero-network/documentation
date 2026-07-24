---
title: "Calimero Developer Tools"
description: "The local development toolchain for Calimero: merobox for local multi-node networks, calimero-abi-codegen for typed clients, and create-mero-app for scaffolding."
---

These tools cover the local development loop — spinning up nodes, generating typed clients, and scaffolding new projects.

| Tool | Purpose | Install |
| --- | --- | --- |
| **merobox** | Local multi-node networks, workflow orchestration, testing | `pipx install merobox` or `brew install calimero-network/tap/merobox` |
| **calimero-abi-codegen** | Generate a typed TypeScript client from a Rust app's ABI | part of [mero-devtools-js](https://calimero-network.github.io/mero-devtools-js/) |
| **create-mero-app** | Scaffold a new Calimero project | `npx create-mero-app@latest my-app` |

## merobox

merobox is a Python CLI that runs Calimero nodes (merod) in Docker. It's the standard way to run a local network for development and testing: start one or more nodes, install apps, create contexts, invite members, call methods, and script all of it as a repeatable YAML workflow.

Common commands:

```bash
merobox run --count 2                       # start a 2-node local network
merobox list                                # list running nodes
merobox health --node calimero-node-1       # check node health
merobox logs calimero-node-1 --follow       # tail node logs
merobox bootstrap run workflow.yml          # run a YAML workflow end-to-end
merobox stop calimero-node-1                # stop a node
merobox nuke --prefix calimero-node-1       # delete node data (destructive)
```

A workflow YAML declares nodes and a sequence of steps (install an app, create a context, generate identities, invite/join, call methods, assert results), making a full multi-node scenario reproducible in one command.

For the complete command and workflow-step reference, see the [merobox repository](https://github.com/calimero-network/merobox).

## calimero-abi-codegen

`calimero-abi-codegen` reads the ABI manifest your Rust app emits at build time (`res/abi.json`) and generates a fully typed TypeScript client plus type definitions — so method names, argument shapes, events, and errors are checked at compile time.

```bash
calimero-abi-codegen -i abi.json -o <outdir>
```

Wire it into your build (for example, a `generate:client` script that runs before your app build) so the client regenerates whenever the Rust API changes. Full options and programmatic usage are documented in the [mero-devtools-js reference](https://calimero-network.github.io/mero-devtools-js/).

## create-mero-app

`create-mero-app` scaffolds a ready-to-run Calimero project from a starter template (Rust application logic, a frontend, build scripts, and merobox workflows).

```bash
npx create-mero-app@latest my-app
cd my-app
# follow the printed next steps (install deps, build the WASM, run the dev loop)
```

See the [mero-devtools-js reference](https://calimero-network.github.io/mero-devtools-js/) for template options and the generated project layout.

## Related topics

- [Client SDKs](/tools-apis/client-sdks/) — client libraries for interacting with nodes
- [meroctl CLI](/tools-apis/meroctl-cli/) — command-line node management
- [SDK Guide](/builder-directory/sdk-guide/) — building Calimero applications
- [Examples](/examples/) — reference implementations
