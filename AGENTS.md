# AGENTS.md

BlinkSend is a two-browser, peer-to-peer file and clipboard transfer project.

## Read first

Before modifying protocol, pairing, security, deployment, or persistence behavior, read:

1. README.md
2. SECURITY.md
3. llms.txt
4. public/app.js
5. public/protocol.js
6. public/persistence.js
7. server.js
8. public/sw.js and public/manifest.webmanifest
9. test/
10. Dockerfile / compose.yaml for server-runtime changes

## Core invariants

- no accounts and no cloud file storage
- at most two signaling peers per room
- random room IDs remain the canonical room identity
- manual pairing codes are temporary aliases only and never replace fingerprint verification
- peer verification is required before new transfers
- SHA-256 verification is required before a file is reported successful
- normal file bytes stay off the application signaling server
- incoming relative paths reject traversal
- signaling validation, rate limits, room limits and protected ICE/TURN credentials remain enforced
- Nearby remains opt-in and short-lived
- Web Share Target staging remains local to the browser
- TRUST_PROXY stays off by default and is safe only behind a proxy that overwrites forwarding headers
- metrics must not expose room IDs, pairing codes, filenames, client IPs, or TURN credentials
- the current architecture is single-process/in-memory; do not imply horizontal scaling support
- browser capability fallbacks remain usable
- keep advanced tuning automatic rather than adding a settings maze

## Required validation

For user-visible/deployment changes, update README.md in the same logical commit.

Run:

```bash
npm ci
npm test
npm run bench
npm run loadtest
docker build -t blinksend-test .
```

When changing the server lifecycle, keep the container health and SIGTERM smoke test passing. When changing transfer protocol state, add deterministic tests for malformed, duplicate, missing, interrupted, resumed, or corrupted data as applicable.
