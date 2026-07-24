---
title: "Introduction"
description: "What Calimero is, the handful of concepts that make it work, and where to go next — a peer-to-peer application layer where users own their data and apps sync without servers."
---

## What is Calimero?

Calimero is a **peer-to-peer application layer** for building self-sovereign, local-first apps. Users own their data, apps keep working offline, and state syncs directly between peers when they reconnect — with no central server in the middle.

Instead of reaching global agreement through **consensus** like a blockchain, Calimero uses **[CRDTs](https://crdt.tech/)** (Conflict-free Replicated Data Types): independent nodes apply changes locally and merge them, converging on the same state without leaders, ordering, or coordination.

New here for the bigger picture? Start with [Why Calimero](/vision/why-calimero/), then see [how it compares to other P2P protocols](/vision/comparison/).

## The mental model

Four ideas cover most of Calimero. Learn them once and the rest follows:

| Concept | What it is |
| --- | --- |
| **[Applications](/core-concepts/applications/)** | Your logic, written in Rust and compiled to WebAssembly. State is declared as CRDT collections; methods read and write it and emit events. |
| **[Contexts](/core-concepts/contexts/)** | A running instance of an app with its own isolated, encrypted state, shared among a group of members — a private network per app, per group. |
| **[Identity](/core-concepts/identity/)** | Hierarchical keypairs: a root identity delegates per-device keys, and every operation is signed. |
| **[Nodes](/core-concepts/nodes/)** | `merod` — the runtime that executes apps, stores state, and syncs with peers. One node can run many contexts at once. |

## How it works

Under the hood, every change becomes a **signed operation** in a causal **DAG**, replicated on two complementary paths: a fast **broadcast** (~100–200 ms) for real-time updates, and a periodic **catch-up sync** so a peer that was offline still converges. Because the state is a CRDT, order doesn't matter — everyone lands on the same result, and divergence is *detected* rather than prevented by locking.

For the full walkthrough, see [Architecture at a glance](/vision/architecture/); for the normative spec, the [Core protocol reference](https://calimero-network.github.io/core/protocol/overview/).

## What you can build

| Use case | Why Calimero |
| --- | --- |
| **Collaborative editing** | Real-time documents and boards; concurrent edits merge automatically. |
| **Private team data** | A group's records replicated only among its members, with per-member access and revocation. |
| **Multiplayer & real-time** | Game and presence state that syncs in ~100 ms and heals after a disconnect. |
| **Decentralized social** | User-run nodes; data ownership and privacy by default. |
| **Device & [IoT](https://en.wikipedia.org/wiki/Internet_of_things) coordination** | Devices coordinate without a central server; offline-tolerant by design. |

See [Examples](/examples/) for working apps.

## Where to go next

| If you want to… | Start here |
| --- | --- |
| Run something in minutes | [Getting Started](/getting-started/) |
| Build an app | [Builder Directory](/builder-directory/) → [Core Build reference](https://calimero-network.github.io/core/build/) |
| Understand the design | [Architecture](/vision/architecture/) · [Core Concepts](/core-concepts/) |
| Add Calimero to a frontend | [Client SDKs](/tools-apis/client-sdks/) |
| Run or host a node | [Operate Nodes](/operator-track/) · [Calimero Cloud](/calimero-cloud/) |

Questions? Join us on [Discord](https://discord.gg/wZRC73DVpU) or open a [GitHub issue](https://github.com/calimero-network/core/issues).
