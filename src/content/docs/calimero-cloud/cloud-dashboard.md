---
title: "Cloud Dashboard & Plans"
description: "See how the Calimero Cloud frontend presents sign-in, subscriptions, dashboards, and node management for hosted Calimero usage."
---

The **Calimero Cloud** frontend is the user-facing application built on top of MDMA.

From the source repo, it is responsible for:

- Google-based sign-in,
- plan and subscription presentation,
- dashboard views,
- node and account UX,
- integration with the Manager backend.

## Typical user flow

1. Sign in with Google.
2. Land in the dashboard.
3. Inspect or create hosted node resources.
4. Manage plan-related capabilities.
5. Use provided node endpoints, keys, or invitations in downstream tooling.

## Product responsibilities

| Area | What users see |
| --- | --- |
| Authentication | Browser sign-in and session handling |
| Subscription layer | Plan visibility and billing-aware gating |
| Dashboard | Node inventory and account-centric overview |
| Lifecycle actions | Provision, view, and manage resources through backend APIs |
| Account access | One-time keys, sign-in state, and related hosted UX |

## Where it stops

Cloud is not the low-level provisioning engine.

It delegates those responsibilities to MDMA services:

- the frontend talks to **Manager**,
- the Manager writes desired state,
- the Dispatcher performs background actions,
- infrastructure changes happen in external environments like GCP or Phala-backed services.

## What makes it different from Desktop

| Cloud | Desktop |
| --- | --- |
| Hosted account and plan experience | Local application on a user's machine |
| Browser-first | Native Tauri app |
| Uses MDMA-managed backend services | Works with a local node runtime |
| Best for managed nodes and hosted control | Best for local install, testing, and app launch |

## Builder and operator implications

Builders should understand Cloud when they need:

- a hosted onboarding path,
- a managed place for users to get node endpoints,
- a bridge between account-level UX and Calimero runtime usage.

Operators should understand Cloud because it shapes the public-facing expectations of the managed platform.

## Related backend concepts

The Cloud README and Manager docs point to a few recurring concepts:

- SSO
- user profile and account state
- plan-aware node lifecycle
- one-time join keys
- dashboard data aggregated by backend services

These are surfaced in the UI, but they depend on deeper operator architecture described in the next page.

## Recommended next reads

- [Calimero Cloud & MDMA Overview](/calimero-cloud/)
- [Operator Architecture](/calimero-cloud/operator-architecture/)
- [How Desktop Works](/tools-apis/desktop-internals/)
