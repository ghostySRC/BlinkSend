# AGENTS.md

This repository is BlinkSend, a browser-to-browser file transfer project.

Before modifying transfer behavior, read:
1. README.md
2. SECURITY.md
3. public/app.js
4. public/persistence.js
5. server.js
6. test/

Core invariants:
- no accounts or cloud file storage
- two peers per room
- peer verification before transfer
- SHA-256 verification before success
- signaling server should not receive normal file contents
- malformed signaling and abuse controls must remain enforced
- browser capability fallbacks should remain usable
- keep the UI simple

When changing the protocol, update both sender and receiver paths and add or update tests.
Run:
```bash
npm ci
npm test
```
