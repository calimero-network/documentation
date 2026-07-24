---
title: "meroctl CLI Reference"
description: "meroctl is the command-line client for Calimero: install apps, create and manage contexts, call methods, and manage blobs. Overview of the most-common commands, with a link to the full reference."
---

`meroctl` is the command-line client for Calimero nodes. Use it to install applications, create and manage contexts, call application methods, and work with blobs. This page covers the handful of commands you'll use most; for the exhaustive command reference see **[the Core operate docs](https://calimero-network.github.io/core/operate/meroctl/)**.

## Install

```bash
brew install calimero-network/tap/meroctl
```

## Connecting to a node

Target a node by alias (configured in `~/.calimero/config.toml`) or by direct URL:

```bash
meroctl --node node1 <command>
meroctl --api http://localhost:2528 <command>
```

## Most-common commands

Install an app — this **returns an application id** (it does not take one):

```bash
meroctl --node node1 app install --path res/my_app.wasm
```

Create a context for an installed app:

```bash
meroctl --node node1 context create --application-id <APP_ID>
```

List contexts:

```bash
meroctl --node node1 context ls
```

Call a method — the method name is **positional**; `--context` and `--args` follow, and `--as` optionally selects the executor public key:

```bash
# mutation
meroctl --node node1 call set --context <CTX> --args '{"key":"hello","value":"world"}'

# view (read-only)
meroctl --node node1 call get --context <CTX> --args '{"key":"hello"}'

# call as a specific identity
meroctl --node node1 call set --context <CTX> --args '{...}' --as <PUBLIC_KEY>
```

Work with blobs:

```bash
meroctl --node node1 blob ls
meroctl --node node1 blob upload --file demo.png --context-id <CTX>
meroctl --node node1 blob download --blob-id <BLOB_ID> --output demo.png
```

> Health checks are not a meroctl command. Use `merobox health` or `GET /admin-api/health` on the node.

## Full reference

The complete command set — application packages, context aliases and sync, namespaces and groups for multi-node participation, peers, output formats (`--output-format json`), and every flag — is documented at:

- **meroctl reference**: <https://calimero-network.github.io/core/operate/meroctl/>

## Related topics

- [Applications](/core-concepts/applications/) — building applications the CLI drives
- [Contexts](/core-concepts/contexts/) — understanding context operations
- [Developer Tools](/tools-apis/developer-tools/) — merobox and local development
- [Operator Track](/operator-track/) — running and managing nodes
