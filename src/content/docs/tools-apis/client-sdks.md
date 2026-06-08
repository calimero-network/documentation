---
title: "Calimero Client SDKs"
description: "Client SDKs that let you interact with Calimero nodes from code using Python, Rust, or frontend stacks like Next.js, React, TypeScript, and Vite. Use them to build developer tools, monitoring, and automation around Calimero."
---

Client SDKs that let you interact with Calimero nodes from code using Python, Rust, or frontend stacks like Next.js, React, TypeScript, and Vite. Use them to build developer tools, monitoring, and automation around Calimero.

## Overview

Calimero provides client SDKs for different language ecosystems:

| SDK | Language | Repository | Primary Use Cases |
| --- | --- | --- | --- |
| **Rust Client** | Rust | [`core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client) | Sidecar tools, CLI utilities, developer tools |
| **Python Client** | Python | [`calimero-client-py`](https://github.com/calimero-network/calimero-client-py) | Automation scripts, monitoring tools, developer tools |
| **mero-js** | TypeScript | [`mero-js`](https://github.com/calimero-network/mero-js) | Pure-TS admin SDK, no React dependency, Node.js tools |
| **mero-react** | TypeScript/React | [`mero-react`](https://github.com/calimero-network/mero-react) | React apps, hooks-based admin UI |
| **calimero-client-js** | TypeScript/JavaScript | [`calimero-client-js`](https://github.com/calimero-network/calimero-client-js) | Web apps, browser extensions, full auth flows |

## Use Cases

### Sidecar Tools

Tools that run alongside Calimero nodes to provide additional functionality:

- **Metrics collectors** - Export node metrics to Prometheus, DataDog, etc.
- **Log aggregators** - Process and forward node logs
- **Health checkers** - Monitor node health and alert on issues
- **Backup services** - Periodically backup node state
- **Monitoring dashboards** - Custom dashboards for node status

### Developer Tools

Utilities for development and testing:

- **Test scripts** - Automated testing of Calimero applications
- **Deployment tools** - Scripts for deploying and managing applications
- **Debugging tools** - Utilities for inspecting node state
- **Development helpers** - Scaffolding and code generation tools

### Automation & CI/CD

Automated workflows for DevOps:

- **CI pipelines** - Automated testing and deployment
- **Release automation** - Scripts for packaging and releasing
- **Health monitoring** - Automated health checks and alerts
- **Data migration** - Scripts for migrating data between nodes

## mero-js SDK

`@calimero-network/mero-js` (v2.x) is the **primary pure-TypeScript admin SDK** for Calimero. It has no React dependency and works in Node.js, browsers, and any framework. `mero-react` wraps it with React hooks.

### Features

- **No framework dependency** — plain TypeScript, works anywhere
- **Full admin API** — namespaces, groups, members, contexts, metadata, capabilities
- **Capability helpers** — bitmask constants mirroring core's `MemberCapabilities`
- **SSE & WebSocket** — real-time event subscriptions
- **Cloud client** — enable/disable HA

### Installation

```bash
npm install @calimero-network/mero-js
# or
pnpm add @calimero-network/mero-js
```

### Quick Start

```typescript
import { createMeroJs } from '@calimero-network/mero-js';

const mero = createMeroJs({
  nodeUrl: 'http://localhost:2528',
  accessToken: 'YOUR_JWT',
});

// List namespaces
const namespaces = await mero.admin.listNamespaces();

// List subgroups of a group
const subs = await mero.admin.listSubgroups('GROUP_ID');
```

### Capability Constants

The SDK exports `CAPABILITIES` — a bitmask constant object matching core's `MemberCapabilities` — plus three helper functions:

```typescript
import {
  CAPABILITIES,
  hasCap,
  withCap,
  withoutCap,
} from '@calimero-network/mero-js';

// Check if a member has a specific capability
const canInvite = hasCap(member.capabilities, CAPABILITIES.CAN_INVITE_MEMBERS);
const canManage = hasCap(member.capabilities, CAPABILITIES.MANAGE_MEMBERS);

// Build a bitmask
const mask = withCap(0, CAPABILITIES.CAN_INVITE_MEMBERS);
const restricted = withoutCap(mask, CAPABILITIES.CAN_CREATE_SUBGROUP);
```

**Available capability bits:**

| Constant | Bit | Description |
| --- | --- | --- |
| `CAN_CREATE_CONTEXT` | 0 | Create contexts within a group |
| `CAN_INVITE_MEMBERS` | 1 | Invite new members |
| `CAN_JOIN_OPEN_SUBGROUPS` | 2 | Self-join open subgroups |
| `MANAGE_MEMBERS` | 3 | Add/remove members |
| `MANAGE_APPLICATION` | 4 | Change the group application |
| `CAN_CREATE_SUBGROUP` | 5 | Create child groups |
| `CAN_DELETE_SUBGROUP` | 6 | Delete child groups |
| `CAN_MANAGE_VISIBILITY` | 7 | Set subgroup visibility |
| `CAN_MANAGE_METADATA` | 8 | Write metadata records |

> **Note:** Bits 9+ are unassigned — do not use them for application data; a future core release may claim them.

### Admin API — New Methods (v2.x)

#### `joinSubgroupInheritance(groupId)`

Materialises inherited membership in an open subgroup. Returns whether the call had to publish a `MemberJoinedOpen` op (`wasInherited: true`) or the caller was already a direct member (`wasInherited: false`).

```typescript
const result = await mero.admin.joinSubgroupInheritance('GROUP_ID');
console.log(result.wasInherited); // true | false
```

#### Metadata Records

Generic key/value metadata records for groups, members, and contexts:

```typescript
// Group metadata
await mero.admin.setGroupMetadata('GROUP_ID', { name: 'Lobby', data: { color: 'blue' } });
const groupMeta = await mero.admin.getGroupMetadata('GROUP_ID');

// Member metadata
await mero.admin.setMemberMetadata('GROUP_ID', 'MEMBER_ID', { name: 'Alice' });
const memberMeta = await mero.admin.getMemberMetadata('GROUP_ID', 'MEMBER_ID');

// Context metadata
await mero.admin.setContextMetadata('GROUP_ID', 'CONTEXT_ID', { data: { key: 'value' } });
const ctxMeta = await mero.admin.getContextMetadata('GROUP_ID', 'CONTEXT_ID');
```

#### Subgroup Visibility

```typescript
const visibility = await mero.admin.getSubgroupVisibility('GROUP_ID');
// Returns: 'open' | 'closed' | 'private'
```

> **Breaking change (v2.0):** The enum `DefaultVisibility` was renamed to `SubgroupVisibility` to match core. Update any code that imports `DefaultVisibility`.

### Related Documentation

- **Repository**: [`calimero-network/mero-js`](https://github.com/calimero-network/mero-js)
- **NPM**: [`@calimero-network/mero-js`](https://www.npmjs.com/package/@calimero-network/mero-js)

---

## mero-react SDK

`@calimero-network/mero-react` (v2.x) wraps `mero-js` with React hooks. Use it for React/Next.js applications that need admin UI.

### Installation

```bash
pnpm add @calimero-network/mero-react @calimero-network/mero-js
```

### Available Hooks

All hooks follow the pattern: `{ result, loading, error, action }` where `result` is the data and `action` is the async function to call.

**Group management:**

```typescript
import {
  useNamespaceGroups,
  useSubgroups,
  useGroupInfo,
  useGroupMetadata,
  useSetGroupMetadata,
  useSetSubgroupVisibility,
  useSubgroupVisibility,
  useUpdateGroupSettings,
  useDeleteGroup,
  useNestGroup,
  useUnnestGroup,
  useCreateGroupInNamespace,
} from '@calimero-network/mero-react';
```

**Member management:**

```typescript
import {
  useGroupMembers,
  useMemberMetadata,
  useSetMemberMetadata,
  useSetDefaultCapabilities,
  useDefaultCapabilities,
  useJoinSubgroupInheritance,
  useGroupInvitations,
} from '@calimero-network/mero-react';
```

**Namespace & context management:**

```typescript
import {
  useNamespace,
  useNamespaceGroups,
  useCreateNamespace,
  useCreateNamespaceInvitation,
  useJoinNamespace,
  useDeleteNamespace,
  useSetContextMetadata,
  useDeleteContext,
  useJoinContext,
  useJoinGroup,
} from '@calimero-network/mero-react';
```

**Example — join via subgroup inheritance:**

```typescript
import { useJoinSubgroupInheritance } from '@calimero-network/mero-react';

function JoinButton({ groupId }: { groupId: string }) {
  const { joinSubgroupInheritance, loading, error } = useJoinSubgroupInheritance();

  const handleJoin = async () => {
    const result = await joinSubgroupInheritance(groupId);
    if (result?.wasInherited) {
      console.log('Joined via inheritance');
    }
  };

  return <button onClick={handleJoin} disabled={loading}>Join</button>;
}
```

**Example — group metadata:**

```typescript
import { useGroupMetadata, useSetGroupMetadata } from '@calimero-network/mero-react';

function GroupEditor({ groupId }: { groupId: string }) {
  const { metadata, loading } = useGroupMetadata(groupId);
  const { setGroupMetadata } = useSetGroupMetadata();

  return (
    <div>
      <p>Name: {metadata?.name}</p>
      <button onClick={() => setGroupMetadata(groupId, { name: 'New Name' })}>
        Rename
      </button>
    </div>
  );
}
```

> **Breaking changes (v2.0):**
> - `useSetGroupAlias` and `useSetMemberAlias` are **removed** — use `useSetGroupMetadata` and `useSetMemberMetadata` instead.
> - All group creation/invitation APIs changed `alias` field to `name`.
> - Invitation responses use `groupName` instead of `groupAlias`.

### Related Documentation

- **Repository**: [`calimero-network/mero-react`](https://github.com/calimero-network/mero-react)
- **NPM**: [`@calimero-network/mero-react`](https://www.npmjs.com/package/@calimero-network/mero-react)

---

## Rust Client SDK

The Rust client SDK (`core/crates/client`) provides a trait-based abstraction for interacting with Calimero nodes. It's designed for building command-line tools, sidecar services, and developer utilities.

### Features

- **Trait-based design** - Flexible authentication and storage backends
- **Async/await support** - Full async support with `tokio`
- **Comprehensive API** - Access to all Calimero admin endpoints
- **Error handling** - Robust error types and handling
- **Type safety** - Strongly typed with Rust's type system

### Installation

Add to your `Cargo.toml`:

```toml
[dependencies]
calimero-client = { path = "../core/crates/client" }
# Or from crates.io using "cargo add calimero-client"
# calimero-client = "0.9.0"
```

### Quick Start

```rust
use calimero_client::{create_connection, create_client, AuthMode, ConnectionInfo};
use calimero_client::traits::{ClientAuthenticator, ClientStorage};
use url::Url;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    // Create connection
    let api_url = Url::parse("http://localhost:2528")?;
    let authenticator = CliAuthenticator::new();
    let storage = FileStorage::new();
    
    let connection = ConnectionInfo::new(
        api_url,
        Some("node1".to_string()),
        authenticator,
        storage,
    );
    
    // Create client
    let client = Client::new(connection)?;
    
    // List contexts
    let contexts = client.list_contexts().await?;
    println!("Found {} contexts", contexts.data.len());
    
    // List applications
    let apps = client.list_applications().await?;
    println!("Found {} applications", apps.data.len());
    
    Ok(())
}
```

### Authentication

```rust
use calimero_client::{AuthMode, ConnectionInfo};

let connection = ConnectionInfo::new(
    api_url,
    Some("node1".to_string()),
    CliAuthenticator::new(),
    FileStorage::new(),
);
```

### API Examples

#### Context Management

```rust
// List all contexts
let contexts = client.list_contexts().await?;

// Get specific context
let context = client.get_context(&context_id).await?;

// Create new context
let create_request = CreateContextRequest {
    application_id: app_id,
    protocol: "near".to_string(),
    params: Some(json!({"network": "testnet"}).to_string()),
};
let new_context = client.create_context(create_request).await?;

// Delete context
client.delete_context(&context_id).await?;
```

#### Application Management

```rust
// List applications
let apps = client.list_applications().await?;

// Get application
let app = client.get_application(&app_id).await?;

// Install development application
let install_request = InstallDevApplicationRequest {
    path: "/path/to/app.wasm".to_string(),
    metadata: None,
};
client.install_dev_application(install_request).await?;

// Uninstall application
client.uninstall_application(&app_id).await?;
```

#### Function Execution

```rust
use calimero_client::client::Client;

// Execute function via JSON-RPC
let result = client.execute_function(
    &context_id,
    "set_value",
    r#"{"key": "test", "value": "hello"}"#,
    &executor_public_key,
).await?;
```

#### Blob Management

```rust
// Upload blob
let data = b"Hello, Calimero!".to_vec();
let blob_info = client.upload_blob(data, Some(&context_id)).await?;

// List blobs
let blobs = client.list_blobs().await?;

// Get blob info
let info = client.get_blob_info(&blob_id).await?;

// Delete blob
client.delete_blob(&blob_id).await?;
```

### Architecture

The Rust client uses a trait-based design for flexibility:

```rust
pub trait ClientAuthenticator {
    async fn authenticate(&self, url: &Url) -> Result<JwtToken>;
    // ...
}

pub trait ClientStorage {
    async fn load_tokens(&self, node_name: &str) -> Result<Option<JwtToken>>;
    async fn save_tokens(&self, node_name: &str, tokens: &JwtToken) -> Result<()>;
    // ...
}

pub struct Client<A, S> 
where
    A: ClientAuthenticator,
    S: ClientStorage,
{
    connection: ConnectionInfo<A, S>,
}
```

This allows you to implement custom authenticators and storage backends for your specific use case.

### Error Handling

```rust
use calimero_client::errors::ClientError;

match client.list_contexts().await {
    Ok(response) => println!("Success: {:?}", response),
    Err(ClientError::Network { message }) => {
        eprintln!("Network error: {}", message);
    }
    Err(ClientError::Authentication { message }) => {
        eprintln!("Auth error: {}", message);
    }
    Err(e) => eprintln!("Error: {:?}", e),
}
```

### Related Documentation

- **Repository**: [`calimero-network/core/crates/client`](https://github.com/calimero-network/core/tree/master/crates/client)
- **Source code**: [`core/crates/client/src`](https://github.com/calimero-network/core/tree/master/crates/client/src)

## Python Client SDK

The Python client SDK (`calimero-client-py`) provides Python bindings built with PyO3 for high-performance integration with Calimero nodes. Perfect for automation scripts, monitoring tools, and developer utilities.

### Features

- **High performance** - Built with Rust and PyO3 for optimal performance
- **Comprehensive API** - Full access to Calimero Network functionality
- **Type safety** - Strongly typed Python bindings
- **Synchronous API** - All methods are synchronous from Python's perspective; the Tokio runtime is managed internally by the Rust bindings
- **Easy installation** - Simple `pip install`

### Installation

```bash
$: pip install calimero-client-py
> ...
> Successfully installed calimero-client-py-0.6.18
```

### Quick Start

```python
from calimero_client_py import create_connection, create_client

# Create connection
connection = create_connection(
    api_url="http://localhost:2528",
    node_name="node1",
)

client = create_client(connection)

# All methods are synchronous — no await needed
contexts = client.list_contexts()
print(f"✓ Found contexts: {contexts}")

applications = client.list_applications()
print(f"✓ Found applications: {applications}")
```

### Authentication
For local development with merod the auth is disabled so you can write any value for JWT access and refresh tokens.

```bash
$: python main.py
> Starting authentication...
> Please authenticate at: http://localhost:2528/
> Enter access token: <ANY_VALUE>
> Enter refresh token (optional): <ANY_VALUE>
>
> ✓ Found contexts: {'data': {'contexts': [{'applicationId': ....
> ...
> ✓ Found applications: {'data': {'apps': [{'blob': {'bytecode': 'Ca2zM5hue4Te2EYQnKmigkN7WcQHzBCuLFVSJ7zQte58', ' ...
> ...
```

### API Examples

#### Context Management

```python
# List all contexts
contexts = client.list_contexts()

# Get specific context
context = client.get_context(context_id)

# Create new context
context = client.create_context(
    application_id="<APP_ID>",
    protocol="near",
    params='{"network": "testnet"}'
)

# Delete context
client.delete_context(context_id)
```

#### Application Management

```python
# List applications
apps = client.list_applications()

# Get application
app = client.get_application(app_id)

# Install development application
response = client.install_dev_application(
    path="absolute/path/to/app.wasm",
    metadata=None
)

# Uninstall application
client.uninstall_application(app_id)
```

#### Function Execution

```python
# Execute function via JSON-RPC
result = client.execute_function(
    context_id=context_id,
    method="set_value",
    args='{"key": "test", "value": "hello"}',
    executor_public_key=executor_public_key
)
```

#### Blob Management

```python
# Upload blob
with open("file.dat", "rb") as f:
    data = f.read()
blob_info = client.upload_blob(data, context_id=context_id)

# List blobs
blobs = client.list_blobs()

# Get blob info
info = client.get_blob_info(blob_id)

# Delete blob
client.delete_blob(blob_id)
```

### Group & Namespace Management

```python
# Namespaces
namespaces = client.list_namespaces()
ns = client.get_namespace(namespace_id)
client.create_namespace(application_id="<APP_ID>", upgrade_policy="manual", name="My Namespace")
invitation = client.create_namespace_invitation(namespace_id, expires_in_secs=3600)
client.join_namespace(namespace_id, invitation_json)
client.delete_namespace(namespace_id)

# Groups
subgroups = client.list_subgroups(group_id)
info = client.get_group_info(group_id)
client.create_group_in_namespace(namespace_id, name="Sub Group")
client.reparent_group(group_id, new_parent_id)
client.delete_group(group_id)

# Members
members = client.list_group_members(group_id)
client.add_group_members(group_id, '[{"memberPublicKey": "KEY", "role": "admin"}]')
client.remove_group_members(group_id, '["MEMBER_ID"]')
client.update_member_role(group_id, member_id, "admin")

# Capabilities
caps = client.get_member_capabilities(group_id, member_id)
client.set_member_capabilities(group_id, member_id, 7)          # bitmask
client.set_default_capabilities(group_id, 7)
client.set_member_auto_follow(group_id, member_id, True)

# Visibility & subgroup join
client.set_subgroup_visibility(group_id, "open")   # "open" | "closed" | "private"
client.join_subgroup_inheritance(group_id)          # materialise inherited open-subgroup membership

# Leave
client.leave_context(context_id)
client.leave_group(group_id)
client.leave_namespace(namespace_id)
```

### Metadata Records

Generic metadata records for groups, members, and contexts (v0.6.x+):

```python
# Group metadata
client.set_group_metadata(group_id, '{"name": "Lobby", "data": {"color": "blue"}}')
meta = client.get_group_metadata(group_id)

# Member metadata
client.set_member_metadata(group_id, member_id, '{"name": "Alice"}')
meta = client.get_member_metadata(group_id, member_id)

# Context metadata
client.set_context_metadata(group_id, context_id, '{"data": {"key": "value"}}')
meta = client.get_context_metadata(group_id, context_id)
```

### Migration

Methods for managing namespace application migrations (v0.6.17+):

```python
# Check cascade migration status across a namespace subtree
status = client.get_cascade_status(namespace_id)

# Logically abort an in-flight migration (idempotent)
client.abort_migration(namespace_id)

# Upgrade a group to a new application version, optionally cascading
client.upgrade_group(group_id, application_id, cascade=True)
```

### Error Handling

```python
from calimero_client_py import ClientError

try:
    contexts = client.list_contexts()
except ClientError as e:
    if e.error_type == "Network":
        print(f"Network error: {e.message}")
    elif e.error_type == "Authentication":
        print(f"Auth error: {e.message}")
    else:
        print(f"Error: {e.message}")
```

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-py`](https://github.com/calimero-network/calimero-client-py)
- **PyPI Package**: [`calimero-client-py`](https://pypi.org/project/calimero-client-py/)
- **Changelog**: [`CHANGELOG.md`](https://github.com/calimero-network/calimero-client-py/blob/master/CHANGELOG.md)

## calimero-client-js (Legacy Web SDK)

`@calimero-network/calimero-client` (`calimero-client-js`) is the **legacy web-focused SDK** providing full authentication flows, UI components, and the `apiClient` singleton for browser apps. For new projects building admin tooling or Node.js scripts, consider using `mero-js` or `mero-react` above.

### Features

- **Full authentication** - JWT token management, wallet-based auth, React components
- **Real-time updates** - WebSocket and SSE subscriptions
- **TypeScript support** - Full type definitions
- **React components** - Pre-built UI components for authentication
- **Browser & Node.js** - Works in both environments
- **Package management** - List and query package registry
- **Group management** - Full namespace/group/member admin via `apiClient.node()`

### Installation

```bash
# npm
npm install @calimero-network/calimero-client

# yarn
yarn add @calimero-network/calimero-client

# pnpm
pnpm add @calimero-network/calimero-client
```

### Quick Start

#### Basic Setup

The `rpcClient` allows you to make RPC calls to your node:

```typescript
// KV Store example
import {
  setAppEndpointKey,
  setApplicationId,
  rpcClient,
} from "@calimero-network/calimero-client";

// Configure node URL and application ID
setAppEndpointKey('http://localhost:2528');
setApplicationId('APP_ID');

const contextId = 'CONTEXT_ID';
const executorPublicKey = 'PUBLIC_KEY';

// Args = { key: string, value: string }
// Output = { result: string }
const setResponse = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'set',
    argsJson: { key: 'test', value: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);

const getResponse = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'get',
    argsJson: { key: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);
```

#### Authentication Flow

```typescript
import {
  AppMode,
  CalimeroProvider
  CalimeroConnectButton,
  useCalimero,
} from "@calimero-network/calimero-client";

const APPLICATION_ID = "<APPLICATION_ID>";
const APPLICATION_PAHT = "<APPLICATION_PATH>";

// Wrap application logic in CalimeroProvider
// CalimeroConnectButton -> handles connection to node; JWT generation and callback
// Logout -> handles state cleanup and kills the connection to the node
function App() {
  const { logout } = useCalimero();
  return (
    <CalimeroProvider
      clientApplicationId={APPLICATION_ID}
      mode={AppMode.MultiContext}
      applicationPath={APPLICATION_PATH}
    >
      <YourApp />
      <CalimeroConnectButton />
      <button onClick={() => logout()}>Logout</button>
    </CalimeroProvider>
  );
}
```

### Authentication

The JavaScript client has **full authentication support** including:

- **JWT token management** - Automatic token storage and refresh
- **Wallet-based authentication** - Support for NEAR wallet
- **React components** - Pre-built UI components (`CalimeroConnectButton`, `SetupModal`)
- **Manual token handling** - Direct token management APIs

#### Complete Authentication Flow

```typescript
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  AppMode,
  CalimeroProvider
  CalimeroConnectButton,
  useCalimero,
} from "@calimero-network/calimero-client";

function AuthPage() {
  return <CalimeroConnectButton />;
}

function HomePage() {
  const { logout } = useCalimero();
  return (
    <Wrapper>
      <App>
      <button onClick={() => logout()}>Logout</button>
    </Wrapper>
  )
}

function App() {
  const { isAuthenticated } = useCalimero();
  const navigate = useNavigate();

   useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    } else {
      navigate("/auth");
    }
  }, [isAuthenticated]);

  return (
    <CalimeroProvider
      clientApplicationId={APPLICATION_ID}
      mode={AppMode.MultiContext}
      applicationPath={APPLICATION_PATH}
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </CalimeroProvider>
  );
}
```

#### Manual Token Usage

```typescript
import {
  setAccessToken,
  getJWTObject,
  rpcClient
} from '@calimero-network/calimero-client';

// Set your token
setAccessToken('your-jwt-token-here');

// Get contextId and executorPublicKey from the token
const jwt = getJWTObject();
const contextId = jwt?.context_id;
const executorPublicKey = jwt?.executor_public_key;

// Use the client
const response = await rpcClient.execute<Args, Output>(
  {
    contextId,
    method: 'get',
    argsJson: { key: 'test' },
    executorPublicKey,
  },
  { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
);
```

### API Examples

The `WsSubscriptionsClient` enables real-time updates through WebSocket connections:

#### WebSocket Subscriptions

```typescript
import { useCalimero, getContextId } from "@calimero-network/calimero-client";
import { WsSubscriptionsClient } from '@calimero-network/calimero-client';


const { app } = useCalimero();

const eventCallback = useCallback(async (event: WebSocketEvent) => {
    eventListenersRef.current.forEach((event: WebSocketEvent) => {
      // handle event
      console.log(event);
    });
  }, []);

const subscriptionsClient = new WsSubscriptionsClient(
  process.env.NEXT_PUBLIC_API_URL,
  '/ws'
);
// Subscripe to context events
app.subscribeToEvents([getContextId()], eventCallback);
// Unsubscribe from context events
app.unsubscribeFromEvents([getContextId()]);
```

#### SSE Subscriptions

The `SseSubscriptionsClient` provides an HTTP-based alternative for real-time updates using Server-Sent Events:

```typescript
import { SseSubscriptionsClient } from '@calimero-network/calimero-client';

const sseClient = new SseSubscriptionsClient(
  // e.g. http://localhost:2528
  "<NODE-URL>",
  '/sse'
);

// Connect to SSE endpoint
await sseClient.connect();
// Subscribe to specific contexts
await sseClient.subscribe(["<APPLICATION_ID>"]);

// Handle incoming events
sseClient.addCallback((event) => {
  console.log('Received SSE event:', event);
});

// Unsubscribe from contexts
await sseClient.unsubscribe(["<APPLICATION_ID>"]);

// Clean up
sseClient.disconnect();
```

#### Admin API

The `Admin API` allows you to call node functionalities. These can be: fetch context, fetch applications, fetch identities, create context, install application, others...

```typescript
// apiClient automatically checks login authentication status so it needs to be paired with 
// CalimeroProvider and CalimeroConnectButton from previous steps
import {
  apiClient,
} from "@calimero-network/calimero-client";

// Contexts
const contexts = await apiClient.node().getContexts();
const context = await apiClient.node().getContext(contextId);
await apiClient.node().createContext({ applicationId: "<APP_ID>", protocol: "near" });
await apiClient.node().deleteContext(contextId);
await apiClient.node().joinContext(contextId);

// Applications
const applications = await apiClient.node().getInstalledApplications();
await apiClient.node().installApplication("<APPLICATION_URL_PATH>");
await apiClient.node().uninstallApplication(appId);

// Package registry
const packages = await apiClient.node().listPackages();
const versions = await apiClient.node().listPackageVersions("package-name");
const latest = await apiClient.node().getLatestPackageVersion("package-name");

// Namespaces & Groups
const namespaces = await apiClient.node().listNamespaces();
const ns = await apiClient.node().getNamespace(namespaceId);
await apiClient.node().createNamespace({ applicationId: "<APP_ID>", upgradePolicy: "manual" });
const invitation = await apiClient.node().createNamespaceInvitation(namespaceId, { expiresInSecs: 3600 });
await apiClient.node().joinNamespace(namespaceId, invitationJson);
const groups = await apiClient.node().listNamespaceGroups(namespaceId);
await apiClient.node().createGroupInNamespace(namespaceId, { name: "Sub Group" });
const members = await apiClient.node().listGroupMembers(groupId);
await apiClient.node().addGroupMembers(groupId, [{ memberPublicKey: "KEY", role: "admin" }]);
await apiClient.node().removeGroupMembers(groupId, ["MEMBER_ID"]);

// Root/client keys
const rootKeys = await apiClient.admin().getRootKeys();
const clientKeys = await apiClient.admin().getClientKeys();
await apiClient.admin().revokeClientKey("<ROOT_KEY_ID>", "<CLIENT_ID>");
```

### Error Handling

```typescript
try {
  const response = await rpcClient().execute<Args, Output>(...);
  if (response.error) {
    // Handle RPC error
    console.error('RPC Error:', response.error.message);
  } else {
    // Process successful response
    console.log('Result:', response.result);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Request failed:', error);
}
```

### Best Practices

**Token Management**

   - Use `CalimeroProvider and CalimeroConnectButton` for login and automatic token refresh
   - Store sensitive information in environment variables
   - Never expose tokens in client-side code

**Connection Management**

   - Always clean up WebSocket connections when done
   - Use unique connection IDs for multiple connections
   - Implement reconnection logic for production

**Error Handling**

   - Always check for errors in RPC responses
   - Implement proper error boundaries in React
   - Log errors appropriately for debugging

### Related Documentation

- **Repository**: [`calimero-network/calimero-client-js`](https://github.com/calimero-network/calimero-client-js)
- **NPM Package**: [`@calimero-network/calimero-client`](https://www.npmjs.com/package/@calimero-network/calimero-client)
- **README**: [`calimero-client-js/README.md`](https://github.com/calimero-network/calimero-client-js/blob/master/README.md)

## Comparison

| Feature | Rust Client | Python Client | mero-js | mero-react | calimero-client-js |
| --- | --- | --- | --- | --- | --- |
| **Language** | Rust | Python | TypeScript | TypeScript/React | TypeScript |
| **Performance** | High (native) | High (Rust bindings) | Good | Good | Good |
| **Authentication** | ✅ Full support | ✅ Full support | ✅ JWT | ✅ JWT | ✅ JWT + wallet |
| **Async Support** | ✅ Tokio | ✅ Sync (Tokio internal) | ✅ Native | ✅ Native | ✅ Native |
| **Type Safety** | ✅ Rust types | ✅ Python types | ✅ TypeScript | ✅ TypeScript | ✅ TypeScript |
| **React Components** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Capability Helpers** | ❌ | ❌ | ✅ | ✅ (via mero-js) | ❌ |
| **Metadata API** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Migration API** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **WebSocket / SSE** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Best For** | CLI tools, sidecars | Scripts, automation, CI | Node.js tools, admin SDK | React admin UI | Web apps, auth flows |

## Choosing the Right SDK

**Choose Rust Client if:**
- Building command-line tools or sidecar services
- Need maximum performance
- Already using Rust in your stack

**Choose Python Client if:**
- Building automation scripts, monitoring, or CI/CD pipelines
- Driving merobox workflows programmatically
- Need migration management (`get_cascade_status`, `abort_migration`)

**Choose mero-js if:**
- Building TypeScript/Node.js tools without a framework
- Need capability helpers or metadata records
- Integrating with non-React frameworks

**Choose mero-react if:**
- Building React or Next.js admin UIs
- Want hooks for group, namespace, and member management

**Choose calimero-client-js if:**
- Building web applications with full auth flows
- Need `CalimeroConnectButton` or wallet-based login
- Working with the existing `apiClient` singleton pattern

## Related Topics

- [meroctl CLI](/tools-apis/meroctl-cli/) - Command-line interface for Calimero
- [Merobox](/tools-apis/merobox/) - YAML workflow orchestration (uses calimero-client-py internally)
- [Introduction](/intro/) - Understanding Calimero's core concepts
- [Contexts](/core-concepts/contexts/) - Working with contexts
- [Identity](/core-concepts/identity/) - Authentication and identity management
