---
title: "mero-sign"
description: "`mero-sign` is a CLI tool for Ed25519 key management and manifest signing. Every app bundle published to the Calimero registry must carry a valid Ed25519 signature — mero-sign is the tool that produces it."
---

`mero-sign` is a CLI tool for Ed25519 key management and manifest signing. Every app bundle published to the Calimero registry must carry a valid Ed25519 signature — mero-sign is the tool that produces it.

---

## Installation

### From crates.io
```bash
cargo install mero-sign
```


### From source
```bash
git clone https://github.com/calimero-network/core
cd core
cargo install --path tools/mero-sign
```


**Source:** [`calimero-network/core/tools/mero-sign`](https://github.com/calimero-network/core/tree/master/tools/mero-sign)

---

## Generating a Key

Run once per developer. Keep this file outside your project directory.

```bash
mero-sign generate-key --output key.json
```

This writes a JSON file you use for all signing operations:

```json
{
  "private_key": "PZbZ5yM9t63qOHMM-CCzExbNv8u79XTxZT9UW8GQJ60",
  "public_key":  "yuKE404BaldXazEIUC4XrVGFyXxxyoRVjrrGhcKk1P4",
  "signer_id":   "did:key:z6Mkt7Ejb12a1BxvRiUpd5YWkMrk8KVjaShW2vMt6trm7FGH"
}
```

| Field | Description |
| --- | --- |
| `private_key` | Base64url-encoded 32-byte Ed25519 secret. Never share this. |
| `public_key` | Base64url-encoded 32-byte public key. Embedded in every signed manifest. |
| `signer_id` | `did:key` DID representation of the public key. |

> **Warning: Key security**
> Store `key.json` **outside** your project directory and add it to `.gitignore`. Never commit private keys to version control.
>
---

## Signing a Manifest

```bash
mero-sign sign manifest.json --key key.json
# → writes signature block into manifest.json in-place
```

### How signing works

```
  manifest.json  (signature field absent or empty)
       │
       ▼  Remove signature + all _* prefixed fields
       │
       ▼  RFC 8785 JSON Canonicalization
       │  (sorts all object keys recursively → deterministic bytes)
       │
       ▼  SHA-256 hash of canonical bytes
       │
       ▼  Ed25519 sign(hash, private_key)
       │
       ▼  Inject signature block into manifest:
          {
            "alg":      "ed25519",
            "pubkey":   "base64url-32-bytes",
            "sig":      "base64url-64-bytes",
            "signedAt": "ISO-8601"
          }
```

The registry re-runs this exact process on every upload and verifies the signature matches. A mismatch returns `400 invalid_signature`.

> **Tip: Sign before packing**
> mero-sign operates on a standalone `manifest.json` file — not on a packed archive. **Always sign first, then bundle.**
>
---

## Team / Org Workflows

Org members each keep their own personal signing key — there is no shared org key. The registry validates org membership via the authenticated email, not by which key was used.

```bash
# Each developer generates their own key (one-time)
mero-sign generate-key --output my-key.json
echo "my-key.json" >> .gitignore

# Sign as usual — the registry validates org membership via your email
mero-sign sign manifest.json --key my-key.json
```

---

## Full Publishing Workflow

For a complete guide from build to publish see [Publishing Apps](/app-directory/#publishing-an-app).
