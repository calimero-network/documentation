---
title: "Getting Started"
description: "Welcome to Calimero!"
---

Welcome to Calimero!

This short guide shows you how to install and run a Calimero node (Merod), build and test out an application for Calimero.

## Quick Start Paths

Choose your path based on what you want to do:

| Goal | Path | Time |
| --- | --- | --- |
| **GUI setup (no CLI)** | [Download Desktop](https://calimero.network/download) → install → launch | 5 min |
| **Run a local network** | Installation → Launch network | 10 min |
| **Build an application** | Installation → Create app → Deploy | 30 min |
| **Explore examples** | Installation → Run example | 15 min |
| **Publish an app** | Build → Sign with mero-sign → Bundle → Push | See [Publishing](/app-directory/#publishing-an-app) |

> **Tip: Prefer a GUI?**
> [Calimero Desktop](/tools-apis/desktop/) handles node setup, identity management, and app launching with a graphical interface. [Download it here](https://calimero.network/download) and skip the CLI setup below.
>
## Step 1: Installation

This guide walks you through setting up and running a local network with [merobox](https://pypi.org/project/merobox/). Other installation options—such as using [Homebrew](https://brew.sh/) or building from [source](https://github.com/calimero-network/core)—are also supported and are covered in other sections of the documentation.

### Prerequisites

**Required:**

- **[Docker](https://www.docker.com/)** 20.10+ (for running nodes)

- **[Python](https://www.python.org/)** 3.8+ (for running merobox)

- **[Pipx](https://github.com/pypa/pipx)** 1.7.0+ (for installing merobox)

- **[Node.js](https://nodejs.org/en)** 18+ (for client SDKs and building JavaScript apps)

- **[Rust toolchain](https://rust-lang.org/tools/install/)** (for building Rust applications)
    - **Cargo** 1.92.0+
    - **Rustup** 1.28.2+
    - **Rustc** 1.92.0+


**Optional:**
- `merod` and `meroctl` (if building from source)

### Merobox
Merobox is the easiest way to run Calimero nodes for local development:

```bash
# Using pipx (recommended)
$: pipx --version
> 1.7.1

$: pipx install merobox
> Installing to existing venv 'merobox'
>  installed package merobox 0.2.13, installed using Python 3.13.3
>  These apps are now globally available:  merobox
> done! ✨ 🌟 ✨

# Or on macOS with Homebrew
$: brew install calimero-network/tap/merobox
> ...
> 🍺  /opt/homebrew/Cellar/merobox/0.1.23: 4 files, 15.6MB, built in 0 seconds
> ==> Running `brew cleanup merobox`...

# Verify installation
$: merobox --version
> merobox, version 0.2.16
```


### merod & meroctl *(Optional)*
```bash
$: brew install merod
> ==> Fetching downloads for: merod
> ✔︎ Formula merod (0.10.0-rc.32)                                                                                                     > Verified     11.2MB/ 11.2MB
> ==> Installing merod from calimero-network/tap
> 🍺  /opt/homebrew/Cellar/merod/0.10.0-rc.32: 4 files, 8.0MB, built in 1 second
> ==> Running `brew cleanup merod`...
> Disable this behaviour by setting `HOMEBREW_NO_INSTALL_CLEANUP=1`.
> Hide these hints with `HOMEBREW_NO_ENV_HINTS=1` (see `man brew`).

$: merod --version
> merod (release 0.10.0-rc.32) (build f69f6b6) (commit f69f6b6) (rustc 1.88.0)

$: brew install meroctl
> ==> Fetching downloads for: meroctl
> ✔︎ Formula meroctl (0.10.0-rc.32)                                                                                                   Verified      > 4.1MB/  4.1MB
> ==> Installing meroctl from calimero-network/tap
> 🍺  /opt/homebrew/Cellar/meroctl/0.10.0-rc.32: 4 files, 8.0MB, built in 1 second
> ==> Running `brew cleanup meroctl`...
> Disable this behaviour by setting `HOMEBREW_NO_INSTALL_CLEANUP=1`.
> Hide these hints with `HOMEBREW_NO_ENV_HINTS=1` (see `man brew`).

$: meroctl --version
> meroctl (release 0.10.0-rc.32) (build f69f6b6) (commit f69f6b6) (rustc 1.88.0)
```


### Install Rust Toolchain (for building applications)

```bash
# Install Rust
$: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
> info: downloading installer
> ...
> Rust is installed now. Great!

# Add WASM target
$: rustup target add wasm32-unknown-unknown
> ...
> info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date

# Verify installation
$: cargo --version
> cargo 1.92.0 (344c4567c 2025-10-21)
$: rustc --version
> rustc 1.92.0 (ded5c06cf 2025-12-08)
```

### Install Node.js SDKs (for client development)

```bash
# Install Calimero JavaScript SDK
$: npm install @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
> ...
> added 213 packages in 2m
> 12 packages are looking for funding
>  run `npm fund` for details

# Or with pnpm
$: pnpm add @calimero-network/calimero-cli-js @calimero-network/calimero-sdk-js
> ...
> dependencies:
> + @calimero-network/calimero-cli-js 0.2.0
> + @calimero-network/calimero-sdk-js 0.2.1

> Done in 2m 29.8s
```

NPM resources:

- [calimero-sdk-js](https://www.npmjs.com/package/@calimero-network/calimero-sdk-js)

- [calimero-cli-js](https://www.npmjs.com/package/@calimero-network/calimero-cli-js)

See [`merobox/README.md`](https://github.com/calimero-network/merobox#readme) for complete installation options.

## Step 2: Run a Local Network

### Merobox (Recommended)
> **Note**: If Docker app is not running you will get the following error:
>
> Failed to connect to Docker: Error while fetching server API version: 
> ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))
> Make sure Docker is running and you have permission to access it.
>
> To fix it you just need to run the Docker app and continue.

```bash
# Run one node with Merobox
$: merobox run --count 1
> ...
> Deployment Summary: 1/1 nodes started successfully

# Check status
$: merobox list
>                              Running Calimero Nodes                             
> ┏━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━┓
> ┃           ┃         ┃           ┃          ┃ RPC/Adm… ┃           ┃          ┃
> ┃ Name      ┃ Status  ┃ Image     ┃ P2P Port ┃ Port     ┃ Chain ID  ┃ Created  ┃
> ┡━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━┩
> │ calimero… │ running │ ghcr.io/… │ 2429     │ 2529     │ testnet-1 │ 2026-01… │
> └───────────┴─────────┴───────────┴──────────┴──────────┴───────────┴──────────┘

>                           Running Auth Infrastructure                           
> ┏━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┓
> ┃ Service     ┃ Status  ┃ Image       ┃ Ports       ┃ Networks    ┃ Created    ┃
> ┡━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━┩
> │ Auth        │ running │ ghcr.io/ca… │ 3001/tcp    │ calimero_i… │ 2026-01-07 │
> │ Service     │         │             │             │ calimero_w… │ 17:33:33   │
> │ Traefik     │ running │ traefik:v2… │ 80:80/tcp,  │ calimero_w… │ 2026-01-07 │
> │ Proxy       │         │             │ 8080:8080/… │             │ 17:33:16   │
> └─────────────┴─────────┴─────────────┴─────────────┴─────────────┴────────────┘
> Auth Data Volume: calimero_auth_data (created: 2025-12-05T12:10:52)

# View logs
$: merobox logs calimero-node-1 --follow
> ...
> [2mlibp2p_ping::handler[0m[2m:[0m ping succeeded [3mrtt[0m[2m=[0m41.628459ms
> 2026-01-12T15:05:40.468844633Z [2m2026-01-12T15:05:40.468600Z[0m [34mDEBUG[0m  [2mcalimero_network::handlers::stream::swarm::ping[0m[2m:[0m
> \x1b[33mping\x1b[39m: Event { peer: PeerId("12D3KooWDm8a27m5HA8jJYGNKA2iZt8YSYHyM6s3aNHhuXLPspiR"), connection: ConnectionId(86), result: 
> Ok(41.628459ms) }
```


### merod
```bash
$: merod --node node1 init
> 2025-12-16T11:47:34.861762Z  INFO merod::cli::init: Generated identity: PeerId("12D3KooW9xPd2gxAouQ29vMfG1B3fpYPPS87VEZyrqzhuVQWc2VL")
> 2025-12-16T11:47:34.870745Z  INFO merod::cli::init: Initialized a node in "/Users/X/.calimero/node1"

$: merod --node node1 run
...
2025-12-16T11:49:59.649884Z  INFO calimero_server::admin::service: Admin Dashboard UI available on /ip6/::1/tcp/2528/http{/admin-dashboard}
```


See [Running Nodes](/operator-track/run-a-local-network/) for detailed node management.

## Step 3: Build Your First Application

Calimero applications consist of two parts: `frontend logic` and `backend logic`.

The frontend logic can be written in any frontend language and must include the `calimero-client` dependency, which handles user authentication and JSON-RPC requests to the node.

The backend logic is the core of a Calimero application. It can be written in Rust or JavaScript and is compiled into WebAssembly (WASM) using `calimero-sdk-rs` or `calimero-sdk-js`. This WASM module is then installed on a node, where its logic (mutate and query methods) is executed. Data storage is handled by RocksDB, while CRDTs are responsible for keeping data persistent and synchronized across nodes.

### Option A: Create from Template
```bash
# Create a new application
$: npx create-mero-app my-first-app
> ? Select backend template › - Use arrow-keys. Return to submit.
> ❯   Rust (kv-store)
>     JavaScript (kv-store-js)
> ...
> ✔ Select backend template › Rust (kv-store)
> ...
> Scaffolding project in /Users/X/Desktop/my-first-app
> Using template: Rust (kv-store)
> Cloning into '/var/folders/p2/_b7fvy792s3458_0jlf6r0jm0000gn/T/mero-create-SY6uxl/repo'...
> Done.

> Next steps:
> cd my-first-app
> pnpm install
> pnpm dev

# Navigate to project
$: cd my-first-app

# Install dependencies
$: pnpm install
> ...
> Progress: resolved 152, reused 152, downloaded 0, added 152, done

> dependencies:
> ...

> devDependencies:
> ...

# Build Rust backend
$: pnpm run logic:build
> ...
> Finished `app-release` profile [optimized] target(s) in 14.04s

# This creates:
# - logic/build/my_first_app.wasm: The compiled WebAssembly binary that contains your application's business logic. This is installed on Calimero nodes (merod) where the WASM code is executed.
# - logic/build/my_first_app.abi.json: The Application Binary Interface (ABI) file that defines your application's API structure, including available functions, parameters, and return types. Used by client SDKs to generate type-safe interfaces for frontend integration.
```


### Option B: Build from Core Examples
For this, we will use the same key-value (KV) store example, but you can explore other available applications in the core repository.

```bash
# Clone core repository
$: git clone https://github.com/calimero-network/core
> Cloning into 'core'...
> ...
> Resolving deltas: 100% (16148/16148), done.
$: cd core/apps/kv-store

# Build WASM
$: ./build.sh
> ...
> Finished `app-release` profile [optimized] target(s) in 14.04s
```


### Option C: Build from Scratch
**1. Create Rust project:**
```bash
$: cargo new --lib my-app
>     Creating library `my-app` package
> note: see more `Cargo.toml` keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
$: cd my-app
```

**2. Add dependencies and update `Cargo.toml`:**
```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
calimero-sdk     = "0.10"
calimero-storage = "0.10"

[build-dependencies]
calimero-wasm-abi = "0.10"
serde_json        = "1.0"

[profile.app-release]
inherits        = "release"
codegen-units   = 1
opt-level       = "z"
lto             = true
debug           = false
strip           = "symbols"
panic           = "abort"
overflow-checks = true

[profile.app-profiling]
inherits = "release"
debug    = true
```

**3. Write your application in `src/lib.rs`:**
```rust
use calimero_sdk::app;
use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_storage::collections::{LwwRegister, UnorderedMap};

#[app::state]
#[derive(Debug, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct MyApp {
    items: UnorderedMap<String, LwwRegister<String>>,
}

#[app::logic]
impl MyApp {
    #[app::init]
    pub fn init() -> MyApp {
        MyApp {
            items: UnorderedMap::new(),
        }
    }

    pub fn add_item(&mut self, key: String, value: String) -> app::Result<()> {
        self.items.insert(key, value.into())?;

        Ok(())
    }

    pub fn get_item(&self, key: &str) -> app::Result<Option<String>> {
        Ok(self.items.get(key)?.map(|v| v.get().clone()))
    }
}
```
**4. Add custom build.rs file and build.sh script**
```rust
// build.rs
use std::fs;
use std::path::Path;

use calimero_wasm_abi::emitter::emit_manifest;

fn main() {
    println!("cargo:rerun-if-changed=src/lib.rs");

    // Parse the source code
    let src_path = Path::new("src/lib.rs");
    let src_content = fs::read_to_string(src_path).expect("Failed to read src/lib.rs");

    // Generate ABI manifest using the emitter
    let manifest = emit_manifest(&src_content).expect("Failed to emit ABI manifest");

    // Serialize the manifest to JSON
    let json = serde_json::to_string_pretty(&manifest).expect("Failed to serialize manifest");

    // Write the ABI JSON to the res directory
    let res_dir = Path::new("res");
    if !res_dir.exists() {
        fs::create_dir_all(res_dir).expect("Failed to create res directory");
    }

    let abi_path = res_dir.join("abi.json");
    fs::write(&abi_path, json).expect("Failed to write ABI JSON");

    // Extract and write the state schema
    if let Ok(mut state_schema) = manifest.extract_state_schema() {
        state_schema.schema_version = "wasm-abi/1".to_owned();

        let state_schema_json =
            serde_json::to_string_pretty(&state_schema).expect("Failed to serialize state schema");
        let state_schema_path = res_dir.join("state-schema.json");
        fs::write(&state_schema_path, state_schema_json)
            .expect("Failed to write state schema JSON");
    }
}
```

```bash
# build.sh
#!/bin/bash
set -e

cd "$(dirname $0)"

TARGET="${CARGO_TARGET_DIR:-target}"

rustup target add wasm32-unknown-unknown

mkdir -p res

# Use app-profiling profile when WASM_PROFILING is set to preserve function names
if [ "${WASM_PROFILING:-false}" = "true" ]; then
    echo "Building with profiling profile "
    PROFILE="app-profiling"
else
    PROFILE="app-release"
fi

RUSTFLAGS="--remap-path-prefix $HOME=~" cargo build --target wasm32-unknown-unknown --profile "$PROFILE"

cp $TARGET/wasm32-unknown-unknown/$PROFILE/my_app.wasm ./res/

# Skip wasm-opt for profiling builds to preserve debug info
if [ "$PROFILE" = "app-release" ] && command -v wasm-opt > /dev/null; then
  wasm-opt -Oz ./res/my_app.wasm -o ./res/my_app.wasm
fi

```

**5. Build WASM by using custom script:**
```bash
$: chmod +x build.sh && ./build.sh
```


## Step 4: Install application on the node
> **NOTE**: If you followed the setup with merobox continue with the merobox commands. By using merobox start command you will have a node with id `calimero-node-1` running.
> If you used merod to initialize and run the node it will have the node id you selected while running the command.
> If you used default commands from this tutorial you will have node with id `node1` running.

### Merobox
```bash
# Install my_app or kv_store; configure path accordingly
$:  merobox install --node calimero-node-1 --dev --path res/my_app.wasm
> ✓ Application installed successfully!
> Application ID: 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
```


### meroctl
```bash
# Install my_app or kv_store; configure path accordingly
# Using meroctl (for nodes started with merod tool)
$: meroctl --node node1 app install --path res/my_app.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯
```


See [SDK Guide](/builder-directory/sdk-guide/) or [JavaScript SDK Guide](/builder-directory/js-sdk-guide/) for detailed development guides.

## Step 5: Create Context and call mutate and view methods

To understand what contexts are and how they work read [here](/core-concepts/contexts/) for more.

### Merobox
**Create a context:**
```bash
# Merobox command for creating contexts
$: merobox context create --node <NODE_ID> --protocol <PROTOCOL> --application-id <APP_ID>

# Creating context with application ID from previous steps using NEAR protocol
$: merobox context create --node calimero-node-1 --protocol near  --application-id 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
> Creating context for application 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s on node calimero-node-1

> ✓ Context created successfully!
> Context ID: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS
> Member Public Key: CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos

# Merobox command to view created context data
$: merobox context list --node calimero-node-1
> Listing contexts on node calimero-node-1

> Found 1 context(s):
> Fetching member public keys...
>                                                     Contexts                                                     
> ╭─────────────────────────────────────────────┬─────────────────────────────────────────────┬─────────────────────────────────────────────╮
> │ Context ID                                  │ Application ID                               │ Member Public Key                           │
> ├─────────────────────────────────────────────┼─────────────────────────────────────────────┼─────────────────────────────────────────────┤
> │ FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS│ 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx… │ CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos │
> ╰─────────────────────────────────────────────┴─────────────────────────────────────────────┴─────────────────────────────────────────────╯

# Merobox command for viewing context data
$: Getting context FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS from node calimero-node-1
> ✓ Context details:
> Context ID: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS
> Application ID: 7mHCKUsCeb84hDF8trn1eNzcqH8L1LNbdZiCcvFUWx7s
> Root Hash: 3qKcevhyARug9bwrfn4mWWHyVdTYGEokgvxJ5NpJiFU9
```

**Call methods:**
```bash
# Merobox - call a mutation command
$: merobox call --node <NODE_ID> --context-id <CONTEXT_ID> --function <METHOD_NAME> --args <ARGS_IN_JSN> --executor-key <IDENTITY_PUBLIC_KEY>

# Commands from previous steps 
$: merobox call --node calimero-node-1 --context-id FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS --function add_item --args '{"key": "hello", "value": "world"}' --executor-key CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos
> Using RPC endpoint: http://localhost:59603
> ...
> 🔍 JSON-RPC Parsed Response: {
>  jsonrpc: 2.0,
>  id: 1,
>  result: {
>    output: null
>  }}
> ╭─────────────────────────────────────────────────────── Function Call Result ────────────────────────────────────────────────────────╮
> │ Function call successful!                                                                                                           │
> │                                                                                                                                     │
> │ Function: add_item                                                                                                                  │
> │ Context: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS                                                                               │
> │ Node: calimero-node-1                                                                                                               │
> │ Result: {'id': '1', 'jsonrpc': '2.0', 'result': {'output': None}}                                                                   │
> ╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

# Merobox - call a view command
$: merobox call --node <NODE_ID> --context-id <CONTEXT_ID> --function <METHOD_NAME> --args <ARGS_IN_JSN> --executor-key <IDENTITY_PUBLIC_KEY>

# Commands from previous steps 
$: merobox call --node calimero-node-1 --context-id FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS --function get_item --args '{"key": "hello"}' --executor-key CgZxoj9mMECAGFVrGQ3mA8X57bWt38jvTPuAo3RAPhos
> Using RPC endpoint: http://localhost:59603
> ...
> 🔍 JSON-RPC Parsed Response: {
>  jsonrpc: 2.0,
>  id: 1,
>  result: {
>    output: world
>  }
> }
> ╭─────────────────────────────────────────────────────── Function Call Result ────────────────────────────────────────────────────────╮
> │ Function call successful!                                                                                                           │
> │                                                                                                                                     │
> │ Function: get_item                                                                                                                  │
> │ Context: FCaGbSngPec9u2mTSXJy1jRjzqLZUfHuuEppPiaRKJHS                                                                               │
> │ Node: calimero-node-1                                                                                                               │
> │ Result: {'id': '1', 'jsonrpc': '2.0', 'result': {'output': 'world'}}                                                                │
> ╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```


### meroctl
**Create a context:**
```bash
# Meroctl command for creating contexts
$: meroctl --node <NODE_ID> context create \
 --protocol <PROTOCOL> --application-id <APP_ID>

# Creating context with application ID from previous steps using NEAR protocol
$: meroctl --node node1 context create \
  --protocol near --application-id A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo
> +------------------------------+
> | Context Created              |
> +==============================+
> | Successfully created context |
> +------------------------------+

# Meroctl command to view created context data
$: meroctl --node node1 context ls
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+
> | Context ID                                   | Application ID                               | Root Hash                                            |
> +====================================================================================================================================================+
> | H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak | A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo | Hash("2NxXdVKqeMU7S957bitBfeTzWPZXPvyUN2VhgjwNn4Yn") |
> +----------------------------------------------+----------------------------------------------+------------------------------------------------------+

# Meroctl command for viewing context identity
$: meroctl --node <NODE_ID> context identity list --context <CONTEXT_ID>

$: meroctl --node node1 context identity list --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak
> +----------------------------------------------+------------------+
> | Identity                                     | Type             |
> +=================================================================+
> | FvjDfnCbQdgAT88K1VMQjQ7APpNMJspWC7RqqZHtdqoS | Context Identity |
> +----------------------------------------------+------------------+
```

**Call methods:**
```bash
# Meroctl - call a mutation command
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON>

# Command with values from previous steps
$: meroctl --node node1 call add_item \
 --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
 --args '{"key": "hello", "value": "world"}'
> 🔍 JSON-RPC Request to http://127.0.0.1:2528/jsonrpc: {
> ...
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+

# Meroctl - call a view command
$: meroctl --node <NODE_ID> call <METHOD_NAME> \
  --context <CONTEXT_ID> \
  --args <ARGS_IN_JSON>

# Command with values from previous steps
$: meroctl --node node1 call get_item \
  --context H6Q7qGQY3h4P8HiX2eHtRiR2jZrauovvDhGnymt9nxak \
  --args '{"key": "hello"}'
> 🔍 meroctl call output: {
>   jsonrpc: 2.0,
>   id: null,
>   result: {
>     output: world
>   }
> }
> +-------------------+---------+
> | Response          | Status  |
> +=============================+
> | JSON-RPC Response | Success |
> +-------------------+---------+
```


As this is the final step of this guide, let’s recap what we accomplished:
 
 1. Installed the Calimero tooling: Merobox or merod and meroctl.
 
 2. Initialized and started nodes using Merobox (recommended for local development) or merod.
 
 3. Walked through writing and building a Rust application for Calimero—either by compiling an existing example or recreating one from scratch.
 
 4. Installed the application WASM on the node using Merobox or meroctl.
 
 5. Created a context for the installed application on the NEAR Protocol to store its configuration using Merobox or meroctl.
 
 6. Invoked a change method using Merobox or meroctl to save a key–value pair, then used a view method to verify that the data was saved correctly.


See [Contexts](/core-concepts/contexts/) for context management details.

## Step 6: Explore Examples

### Core Examples

Examples in [`core/apps`](https://github.com/calimero-network/core/tree/master/apps):

- **abi-conformance** - ABI compatibility and conformance testing example
- **access-control** - Role-based and capability-based access control patterns
- **blobs** - File and blob storage with content addressing
- **collaborative-editor** - Real-time text collaboration using CRDTs
- **kv-store** - Simple key-value store (great for learning the basics)
- **kv-store-init** - Minimal key-value store initialization example
- **kv-store-with-handlers** - Key-value store with request handlers and routing
- **kv-store-with-user-and-frozen-storage** - User-scoped storage with immutable (frozen) data
- **nested-crdt-test** - Experiments with nested CRDT data structures
- **private-data** - Patterns for private and restricted data storage
- **state-schema-conformance** - State validation and schema conformance checks
- **team-metrics-custom** - Custom team metrics built with nested CRDTs
- **team-metrics-macro** - Macro-based approach to team metrics and aggregation
- **xcall-example** - Cross-context and cross-application communication example
... and many more

**Run an example:**
```bash
$: cd core/apps/kv-store
$: ./build.sh
...
 calimero-storage` to apply 1 suggestion)
    Finished `app-release` profile [optimized] target(s) in 18.11s
$: meroctl --node node1 app install --path res/kv_store.wasm
> ╭───────────────────────────────────────────────────────────────────────────────────╮
> │ Application Installed                                                             │
> ╞═══════════════════════════════════════════════════════════════════════════════════╡
> │ Successfully installed application 'A1fKrY7kkbqiJJU9oaG65NPRw2MCvrNESs31ERqg7gLo' │
> ╰───────────────────────────────────────────────────────────────────────────────────╯
> ...

```

### Application Examples

- **Mero Chat** — A modern multi-channel chat application, similar to Slack or Microsoft Teams

- **MeroSign** — A peer-to-peer application for exchanging and digitally signing documents

- **Battleships** — A real-time, multiplayer Battleships game with synchronized gameplay

- **Shared Todo** — A collaborative task management application for shared to-do lists

See [Examples](/examples/) for complete list.

## What's Next?

### For Builders

- **[Core Concepts](/core-concepts/)** - Deep dive into architecture, contexts, identity
- **[Rust SDK Guide](/builder-directory/sdk-guide/)** - Complete Rust development guide
- **[JavaScript SDK Guide](/builder-directory/js-sdk-guide/)** - JavaScript/TypeScript development
- **[Examples](/examples/core-apps-examples/)** - Working example applications

### For Operators

- **[Running Nodes](/operator-track/run-a-local-network/)** - Node setup and management
- **[Monitoring](/operator-track/monitor-and-debug/)** - Observability and troubleshooting
- **[meroctl CLI](/tools-apis/meroctl-cli/)** - Command-line reference

### For Everyone

- **[Architecture Overview](/core-concepts/architecture/)** - How Calimero works
- **[Tools & APIs](/tools-apis/)** - SDKs, CLI, developer tools

## Common Questions

**Q: Do I need to run my own node?**  
A: For local development, yes. Use `merobox` to run nodes locally. For production, you can use hosted nodes or run your own by using merod and meroctl setup.

**Q: Which language should I use?**  
A: Applications can be written in Rust (compiled to WASM) or JavaScript/TypeScript (using `@calimero-network/calimero-sdk-js`). Clients can use JavaScript/TypeScript or Python.

**Q: How do I handle authentication?**  
A: Calimero supports User/Password and NEAR wallet-based authentication. See [Identity](/core-concepts/identity/) and [Client SDKs](/tools-apis/client-sdks/).

**Q: Can I use this offline?**  
A: Yes! Calimero is offline-first. Apps work offline and sync when online.
