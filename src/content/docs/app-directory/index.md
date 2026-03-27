---
title: "App Directory"
description: "The App Directory showcases existing **Calimero applications** you can deploy, and explains how to **publish your own app** to the registry."
---

The App Directory showcases existing **Calimero applications** you can deploy, and explains how to **publish your own app** to the registry.

---

## In this section

| Page | Focus |
| --- | --- |
| [Registry Overview](/app-directory/registry-overview/) | Bundle format, validation path, and install-time trust model |
| [Registry API & CLI](/app-directory/registry-api-and-cli/) | Backend endpoints, typed client usage, and local registry workflows |
| [Organizations & Ownership](/app-directory/organizations-and-ownership/) | Shared ownership, signer rotation, and team publishing practices |

---

## Browse the Registry

Browse and install apps from the **Calimero App Registry**:

👉 [Calimero App Registry](https://github.com/calimero-network/app-registry)

To get started with an existing app:

1. Find the app in the registry.
2. Follow its README for build instructions.
3. Install the `.mpk` bundle onto your node via [Calimero Desktop](/tools-apis/desktop/) or `meroctl`.

---

## Featured Apps

| App | Description | Repo |
| --- | --- | --- |
| Battleships | Turn-based multiplayer with private boards and Merobox workflows | [README](https://github.com/calimero-network/battleships#readme) |
| Mero Chat | Rich messaging UI with cross-device workflows | [README](https://github.com/calimero-network/mero-chat#readme) |
| KV Store | Minimal read/write example — ideal first integration | [README](https://github.com/calimero-network/kv-store#readme) |
| Demo Blob App | File-style payload handling with frontend wiring | [README](https://github.com/calimero-network/demo-blob-app#readme) |

---

## Publishing an App

To publish your Calimero app to the registry you need two tools:

- **`mero-sign`** — signs your bundle with Ed25519 (/app-directory/[guide](../tools-apis/mero-sign/))
- **`calimero-registry`** CLI — packages and pushes the signed bundle

### Step 1 — Install the tools

```bash
# Signing tool
cargo install mero-sign

# Registry CLI
npm install -g calimero-registry
# or: pnpm add -g calimero-registry
```

### Step 2 — Build your app

Build your Rust application to WASM and prepare your frontend bundle. Your output directory should contain:

```
dist/myapp-1.0.0/
├── app.wasm
├── manifest.json
└── frontend/          # optional
```

### Step 3 — Generate a signing key (one-time)

```bash
mero-sign generate-key --output my-key.json
echo "my-key.json" >> .gitignore
```

Keep `my-key.json` outside your project. Never commit it.

### Step 4 — Sign the manifest

```bash
mero-sign sign dist/myapp-1.0.0/manifest.json --key my-key.json
```

> **Warning**
> Sign **before** bundling. mero-sign operates on a standalone `manifest.json`, not on a packed archive.
>
### Step 5 — Create the bundle

```bash
calimero-registry bundle create \
  --output myapp-1.0.0.mpk \
  dist/myapp-1.0.0/app.wasm \
  com.yourorg.myapp
```

This produces a `.mpk` file containing the signed manifest and WASM binary.

### Step 6 — Publish

```bash
calimero-registry bundle push myapp-1.0.0.mpk \
  --key my-key.json
```

The registry validates the Ed25519 signature and, if your email is verified against an org, associates the bundle with that org.

---

## Publishing Requirements

| Requirement | Details |
| --- | --- |
| Valid Ed25519 signature | Produced by `mero-sign`. Any key is accepted; org membership is validated separately via email. |
| Manifest format | Must include `name`, `version`, `description`, `repository`, and a `signature` block. |
| WASM binary | Must be a valid Calimero WASM application targeting the `calimero-sdk` runtime. |
| Semantic versioning | Version strings must follow `MAJOR.MINOR.PATCH`. |

For the full manifest schema and registry API see the [App Registry README](https://github.com/calimero-network/app-registry#readme).

---

## Signing tool reference

See the full [mero-sign guide](/tools-apis/mero-sign/) for key management, team workflows, and how the Ed25519 signing process works end-to-end.
