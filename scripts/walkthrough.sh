#!/usr/bin/env bash
# Every shell command on the docs site, in page order, as a brand-new user, against the
# latest published core release (whatever the installer installs).
#
#   scripts/walkthrough.sh
#
# Needs: Docker (running), curl, git, rustup, Node.js with pnpm (or corepack), and network.
# It runs in a fresh HOME under a new temporary directory (WALKTHROUGH_DIR to choose one), so
# nothing in your own ~/.calimero or ~/.local/bin is read or touched; Rust's toolchains are
# reused from the RUSTUP_HOME/CARGO_HOME you already have.
#
# Keeping it in step with the pages: the steps below are grouped by page, in the order a reader
# meets them, and each group names the page (src/content/docs/...) and the section the commands
# come from. When a page's commands change, change the matching step here in the same PR: the
# `pull_request` trigger runs this script on any change under src/content/docs/. A command on a
# page that cannot run here (a Cloud API key, a registry key, Homebrew) is listed with `skip`,
# so the list stays a complete map of the pages.
#
# It prints PASS/FAIL/SKIP per step, exits non-zero if any step failed, and on exit (also after
# a failure or Ctrl-C) stops `meroctl local dev` and runs `meroctl local down`.

set -u
set -o pipefail

# ---------------------------------------------------------------------------------------------
# Harness
# ---------------------------------------------------------------------------------------------

STEP_TIMEOUT=${STEP_TIMEOUT:-1200}  # seconds per step; the first `app build` compiles the SDK
DEV_TIMEOUT=${DEV_TIMEOUT:-900}     # seconds for `meroctl local dev` to build, upload and serve

WORK=${WALKTHROUGH_DIR:-$(mktemp -d "${TMPDIR:-/tmp}/walkthrough.XXXXXX")}
mkdir -p "$WORK/home" "$WORK/work" "$WORK/logs"
LOGS=$WORK/logs

# Keep the toolchains the machine has, under the new HOME.
export RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}" CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"
export PATH="$CARGO_HOME/bin:$PATH"
export HOME="$WORK/home"
# Nothing from the caller's environment that changes what meroctl does.
unset MEROD MEROD_REGISTRY_URL CARGO_TARGET_DIR CALIMERO_INSTALL_DIR CALIMERO_API_KEY \
	CALIMERO_REGISTRY_API_KEY
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 CI=${CI:-true} RUST_BACKTRACE=0

PASSED=0 SKIPPED=0 FAILED=() N=0 PAGE="" SECTION="" OUT=/dev/null LAST_OK=1 DEV_PID=""

summary_line() { [ -n "${GITHUB_STEP_SUMMARY:-}" ] && printf '%s\n' "$1" >>"$GITHUB_STEP_SUMMARY"; return 0; }

# page FILE: the page (under src/content/docs/) the following steps come from.
page() {
	PAGE=$1 SECTION=""
	printf '\n== %s\n' "$PAGE"
	summary_line "| **$PAGE** | | |"
}

# section NAME: the heading (or numbered step) on the page.
section() {
	SECTION=$1
	printf -- '-- %s\n' "$SECTION"
}

where() { printf '%s%s' "$PAGE" "${SECTION:+ § $SECTION}"; }

pass() {
	PASSED=$((PASSED + 1))
	printf 'PASS  %s\n' "$1"
	summary_line "| PASS | $1 | $(where) |"
}

# fail NAME [LOG]: record a failure and show why.
fail() {
	FAILED+=("$(where): $1")
	printf 'FAIL  %s  [%s]\n' "$1" "$(where)"
	if [ -n "${2:-}" ] && [ -s "$2" ]; then
		tail -n 30 "$2" | sed 's/^/      | /'
	fi
	if [ -n "${GITHUB_ACTIONS:-}" ]; then
		printf '::error title=walkthrough: %s::%s\n' "$1" "$(where)"
	fi
	summary_line "| **FAIL** | $1 | $(where) |"
}

skip() {
	SKIPPED=$((SKIPPED + 1))
	printf 'SKIP  %s (%s)\n' "$1" "$2"
	summary_line "| skip | $1 ($2) | $(where) |"
}

# step NAME CMD...: run CMD (output to a log, which OUT names afterwards), PASS or FAIL.
step() {
	local name=$1
	shift
	N=$((N + 1))
	OUT=$(printf '%s/%03d.log' "$LOGS" "$N")
	printf '$ %s\n' "$*" >"$OUT"
	local rc=0
	timeout "$STEP_TIMEOUT" "$@" >>"$OUT" 2>&1 </dev/null || rc=$?
	if [ "$rc" = 0 ]; then
		LAST_OK=1
		pass "$name"
	else
		LAST_OK=0
		fail "$name (exit $rc)" "$OUT"
		return 1
	fi
}

# output: the last step's output (its log, without the command line it starts with).
output() { tail -n +2 "$OUT"; }

# expect NAME REGEX: the last step's output matches REGEX (grep -E), line by line or with all
# spaces and newlines removed (pretty-printed JSON). Not checked when that step failed (its
# failure is already reported).
expect() {
	[ "$LAST_OK" = 1 ] || return 0
	if output | grep -Eq -- "$2" || output | tr -d ' \n' | grep -Eq -- "$2"; then
		pass "$1"
	else
		fail "$1: no match for /$2/" "$OUT"
	fi
}

# show REGEX: print the lines of the last step's output that match, for the log.
show() { output | grep -Eo -- "$1" | head -n 5 | sed 's/^/      /'; }

# abort REASON: a step the rest depends on failed.
abort() {
	printf '\nABORT: %s; the steps after it cannot run.\n' "$1"
	FAILED+=("aborted: $1")
	exit 1
}

stop_dev() {
	[ -n "$DEV_PID" ] || return 0
	# Ctrl-C, as the page says, to the whole process group (meroctl and its vite).
	kill -INT -- "-$DEV_PID" 2>/dev/null
	for _ in $(seq 1 30); do kill -0 "$DEV_PID" 2>/dev/null || break; sleep 1; done
	kill -KILL -- "-$DEV_PID" 2>/dev/null
	wait "$DEV_PID" 2>/dev/null
	DEV_PID=""
}

finish() {
	local rc=$?
	trap - EXIT INT TERM
	stop_dev
	if command -v meroctl >/dev/null 2>&1; then
		echo
		echo "-- cleanup: meroctl local down"
		timeout 120 meroctl local down </dev/null 2>&1 | tail -n 3 | sed 's/^/      /'
	fi
	# Anything still running from the work directory (a dev server left behind).
	pkill -f -- "$WORK/work" 2>/dev/null
	echo
	printf 'walkthrough: %d passed, %d failed, %d skipped (logs in %s)\n' \
		"$PASSED" "${#FAILED[@]}" "$SKIPPED" "$LOGS"
	if [ "${#FAILED[@]}" -gt 0 ]; then
		printf 'FAILED  %s\n' "${FAILED[@]}"
		exit 1
	fi
	exit "$rc"
}
trap finish EXIT
trap 'exit 130' INT TERM

nodes() { output | grep -Eo 'http://127\.0\.0\.1:25[0-9]+' | sort -u | tr '\n' ' '; }

summary_line "## Docs walkthrough"
summary_line ""
summary_line "| | step | page |"
summary_line "|---|---|---|"

cd "$WORK/work" || exit 1

# ---------------------------------------------------------------------------------------------
# getting-started.mdx (Quickstart)
# ---------------------------------------------------------------------------------------------
page getting-started.mdx

section "Before you start"
step "docker is running" docker info || abort "Docker is not running"
step "rustup target add wasm32-wasip2" rustup target add wasm32-wasip2
step "install meroctl (curl | sh)" sh -c \
	'curl -fsSL https://raw.githubusercontent.com/calimero-network/core/master/scripts/install.sh | sh' ||
	abort "the installer failed"
# The bash tab: the profile line, then the PATH for this shell.
# shellcheck disable=SC2016 # the line the page has, unexpanded
echo 'export PATH="$HOME/.local/bin:$PATH"' >>~/.bashrc
export PATH="$HOME/.local/bin:$PATH"
skip "brew install calimero-network/tap/meroctl" "the installer is the path under test"
step "meroctl is the installed one" test "$(command -v meroctl)" = "$HOME/.local/bin/meroctl"
step "meroctl --version" meroctl --version && show '.+'
summary_line "| | release: \`$(meroctl --version 2>/dev/null | head -n 1)\` | |"

section "1. Run a node"
step "meroctl local up" meroctl local up || abort "the local cluster did not start"
printf '      nodes: %s\n' "$(nodes)"
expect "one node, on :2501" '127\.0\.0\.1:2501'

section "2. Clone an app"
# A reader's git has a name and email; without them `app new` makes no first commit.
git config --global user.name "Docs Walkthrough"
git config --global user.email "walkthrough@example.invalid"
step "meroctl app new my-app" meroctl app new my-app || abort "app new failed"
cd my-app || abort "no my-app directory"
step "git rev-list --count HEAD" git rev-list --count HEAD
expect "a git repository with one commit" '^1$'

section "3. Build it"
step "meroctl app build apps/kv-store/logic" meroctl app build apps/kv-store/logic ||
	abort "the build failed"
step "wrote app.component.wasm" test -s apps/kv-store/logic/app.component.wasm

section "4. Deploy it"
step "meroctl login --dev-passkey (sign up)" meroctl login --dev-passkey ~/.calimero/me.json --name me
expect "login answers accountId" '"accountId"'
step "instance create --path" meroctl instance create --name kv \
	--path apps/kv-store/logic/app.component.wasm --alias kv
expect 'instance create answers "replicas": [1]' '"replicas": ?\[ ?1 ?\]'

section "5. Call it"
step "call set" meroctl call --instance kv set --args '{"key":"a","value":"1"}'
expect "set emits Inserted" '"kind": ?"Inserted"'
step "call get --view" meroctl call --instance kv get --args '{"key":"a"}' --view
expect 'get answers "result": "1"' '"result": ?"1"'

# ---------------------------------------------------------------------------------------------
# guide/example.mdx (The example, line by line)
# ---------------------------------------------------------------------------------------------
page guide/example.mdx

section "The ABI"
cp apps/kv-store/logic/res/abi.json "$WORK/abi.before.json"
step "app abi show > res/abi.json" sh -c \
	'meroctl app abi show apps/kv-store/logic/app.component.wasm > apps/kv-store/logic/res/abi.json'
step "the checked-in abi.json is the built one" cmp "$WORK/abi.before.json" apps/kv-store/logic/res/abi.json

section "The tests"
step "meroctl local test apps/kv-store" meroctl local test apps/kv-store && show 'test result: .*'
skip "cargo test --manifest-path apps/kv-store/logic/Cargo.toml" "the same tests, the alternative spelling"

section "The development loop"
step "pnpm install" pnpm install
N=$((N + 1))
DEV_LOG=$(printf '%s/%03d-local-dev.log' "$LOGS" "$N")
setsid meroctl local dev apps/kv-store >"$DEV_LOG" 2>&1 </dev/null &
DEV_PID=$!
up=""
for _ in $(seq 1 $((DEV_TIMEOUT / 5))); do
	sleep 5
	kill -0 "$DEV_PID" 2>/dev/null || break
	if grep -q 'uploaded bundle' "$DEV_LOG" && curl -sf -o /dev/null http://localhost:5173/; then
		up=1
		break
	fi
done
if [ -n "$up" ]; then pass "meroctl local dev: uploaded, frontend on :5173"; else fail "meroctl local dev" "$DEV_LOG"; fi
stop_dev
# The page: Ctrl-C stops the cluster only if `local dev` started it; this one was already up.
if ! step "after Ctrl-C, the cluster local dev did not start still answers" \
	meroctl call --instance kv get --args '{"key":"a"}' --view; then
	step "meroctl local up (to go on)" meroctl local up
fi

# ---------------------------------------------------------------------------------------------
# guide/clients.mdx (Clients)
# ---------------------------------------------------------------------------------------------
page guide/clients.mdx

section "Python, Rust and meroctl"
skip "meroctl node add eu1 https://eu1.cloud.calimero.network/" "needs a Cloud API key"
skip "export CALIMERO_API_KEY=cal_..." "made in the Cloud console"
# The same calls on the local instance (`<app>` = kv).
step "call --instance kv set" meroctl call --instance kv set --args '{"key":"a","value":"1"}'
step "call --instance kv get --view" meroctl call --instance kv get --args '{"key":"a"}' --view
step "instance watch kv (first event)" timeout 30 meroctl instance watch kv --limit 1
expect "watch prints an event" 'Inserted'

# ---------------------------------------------------------------------------------------------
# guide/publish.mdx (Package & publish)
# ---------------------------------------------------------------------------------------------
page guide/publish.mdx
MPK=apps/kv-store/logic/dist/com.calimero.kv-store-1.0.0.mpk

section "1. Build the frontend"
step "pnpm -F kv-store build" pnpm -F kv-store build

section "2. Create a signing key"
step "app signer new ~/.calimero/release.key" meroctl app signer new ~/.calimero/release.key
step "app signer id ~/.calimero/release.key" meroctl app signer id ~/.calimero/release.key
expect "signer id is a did:key" 'did:key:z6Mk'

section "3. Pack and sign"
step "app pack" meroctl app pack apps/kv-store/logic --key ~/.calimero/release.key --app-version 1.0.0
step "wrote $MPK" test -s "$MPK"

section "4. Check it"
step "app inspect" meroctl app inspect "$MPK"
expect "inspect says verified" 'verified'

section "5. Publish"
skip "export CALIMERO_REGISTRY_API_KEY=... && app publish" "needs a registry key"
step "app publish without a registry key is refused" sh -c "! meroctl app publish $MPK"

section "A package of several services"
skip "app pack --service directory=... --service room=..." "the example has one service"

section "Private and public packages"
skip "app publish ... --public" "needs a registry key"

# ---------------------------------------------------------------------------------------------
# guide/deploy.mdx (Deploy)
# ---------------------------------------------------------------------------------------------
page guide/deploy.mdx

section "On a node, from the registry"
step "app install com.calimero.kv-store@1.0.0 (public registry)" \
	meroctl app install com.calimero.kv-store@1.0.0
step "instance create --package" meroctl instance create --name kv-release \
	--package com.calimero.kv-store --version 1.0.0 --alias kv-release
step "call --instance kv-release set" meroctl call --instance kv-release set \
	--args '{"key":"b","value":"2"}'
step "app install --path (the package you packed)" meroctl app install --path "$MPK"

# ---------------------------------------------------------------------------------------------
# getting-started.mdx § Three nodes (after the guide, as a reader comes back to it)
# ---------------------------------------------------------------------------------------------
page getting-started.mdx

section "Three nodes"
step "meroctl local down" meroctl local down
step "meroctl local up --nodes 3 --fresh" meroctl local up --nodes 3 --fresh
printf '      nodes: %s\n' "$(nodes)"
expect "three nodes, :2501-:2503" '127\.0\.0\.1:2503'
step "rm ~/.calimero/me.json" rm ~/.calimero/me.json
step "login signs up a new account" meroctl login --dev-passkey ~/.calimero/me.json --name me
step "instance create on three nodes" meroctl instance create --name kv \
	--path apps/kv-store/logic/app.component.wasm --alias kv
expect 'instance create answers "replicas": [1, 2, 3]' '"replicas": ?\[ ?1, ?2, ?3 ?\]'
# "Your app's code is the same either way": the step-5 calls.
step "call set on three nodes" meroctl call --instance kv set --args '{"key":"a","value":"3"}'
step "call get --view on three nodes" meroctl call --instance kv get --args '{"key":"a"}' --view
expect 'get answers "result": "3"' '"result": ?"3"'

section "1. Run a node: the state stays for the next up; a cluster keeps its node count"
step "meroctl local down" meroctl local down
step "meroctl local up keeps three nodes" meroctl local up
expect "still three nodes" '127\.0\.0\.1:2503'
step "the data is kept" meroctl call --instance kv get --args '{"key":"a"}' --view
expect 'get still answers "result": "3"' '"result": ?"3"'

section "Without Docker"
skip "meroctl local up --local" "needs merod on PATH; the Docker path is the one under test"
