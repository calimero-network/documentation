---
title: "Calimero Desktop"
description: "Calimero Desktop is the GUI application for managing Calimero nodes, identities, contexts, and installed apps from a single interface — no CLI required."
---

Calimero Desktop is the GUI application for managing Calimero nodes, identities, contexts, and installed apps from a single interface — no CLI required.

[Download Calimero Desktop :material-download:](https://calimero.network/download){ .md-button .md-button--primary target="_blank" }

---

## What It Does

| Capability | Description |
| --- | --- |
| Node management | Start, stop, and monitor your local Calimero node |
| Identity management | Create and manage root keys and client identities |
| Context management | Browse, create, and join application contexts |
| App launcher | Install apps from the registry and open them with one click |
| Single sign-on | Passes auth tokens directly to apps — no manual login needed |

---

## Installation

Download the latest release for your platform from [calimero.network/download](https://calimero.network/download).

| Platform | Format |
| --- | --- |
| macOS | `.dmg` universal binary |
| Linux | `.AppImage` / `.deb` |
| Windows | `.exe` installer |

---

## Getting Started

1. **Download and install** Desktop from [calimero.network/download](https://calimero.network/download).
2. **Start the app** — it will launch and manage a local `merod` node automatically on first run.
3. **Create an identity** — generate your root key and first client identity inside the app.
4. **Install an app** — browse the [App Registry](https://github.com/calimero-network/app-registry) and install an app to your node.
5. **Open the app** — click Open; Desktop injects your auth tokens so you're logged in immediately.

---

## Single Sign-On (SSO) for App Developers

When a user opens an app from Desktop, it passes authentication tokens directly to the app's frontend via the URL hash:

```
https://your-app-frontend.com/#access_token=...&refresh_token=...&node_url=...&application_id=...
```

Apps built with [`@calimero-network/calimero-client`](https://github.com/calimero-network/calimero-client-js) read these values automatically from `window.location.hash` and skip the manual auth flow.

**Hash parameters passed by Desktop:**

| Parameter | Description |
| --- | --- |
| `access_token` | JWT for authenticated node calls |
| `refresh_token` | Token used to obtain a new access token |
| `node_url` | URL of the local node the app should connect to |
| `application_id` | The installed application's ID on the node |

If your app uses `calimero-client`, SSO works out of the box — no extra integration needed. If you're building a custom frontend, read these four values from the hash on startup and use them to initialize your node connection.

---

## Desktop vs CLI

| Task | Desktop | CLI (`meroctl`) |
| --- | --- | --- |
| Daily use by non-developers | ✅ Recommended | ⚠️ Possible but steep |
| Automated scripts / CI | ❌ | ✅ Recommended |
| Local dev multi-node testing | ❌ | ✅ Use Merobox |
| Opening apps with SSO | ✅ Built-in | ❌ Manual |

For CLI-based node management see [meroctl](/tools-apis/meroctl-cli/). For local multi-node dev environments see [Developer Tools](/tools-apis/developer-tools/).
