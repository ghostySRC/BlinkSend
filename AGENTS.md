# AGENTS.md

BlinkSend is a two-browser, peer-to-peer file and clipboard transfer project.

## Read before changing protocol or security behavior

1. README.md
2. SECURITY.md
3. public/app.js
4. public/protocol.js
5. public/persistence.js
6. server.js
7. public/sw.js and public/manifest.webmanifest for PWA/share-target changes
8. test/

## Core invariants

- no accounts and no cloud file storage
- at most two signaling peers per room
- peer verification before new transfers
- SHA-256 verification before a file is reported as successful
- normal file bytes stay off the BlinkSend application server
- incoming relative paths must reject traversal
- signaling validation, room limits, rate limits and protected ICE/TURN credentials stay enforced
- Nearby discovery remains opt-in and does not bypass verification
- Web Share Target staging stays device-local
- browser capability fallbacks remain usable
- keep user-facing controls simple; automatic tuning belongs behind the UI

## Required checks

For user-visible behavior, update README.md in the same logical commit.

Run:

```bash
npm ci
npm test
npm run bench
```

When changing the transfer protocol, update both sender and receiver paths and add deterministic tests for malformed, interrupted, duplicate, missing, or corrupted data as applicable.
