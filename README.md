<p align="center"><img src="public/favicon.svg" width="68" alt="BlinkSend logo"></p>
<h1 align="center">BlinkSend</h1>
<p align="center">A self-hosted file transfer tool for two browsers.</p>
<p align="center"><strong>Current package version:</strong> 0.3.0</p>
<p align="center"><a href="#features">Features</a> · <a href="#quick-start">Quick start</a> · <a href="#how-it-works">How it works</a> · <a href="#deploy-your-own-instance">Self-host</a></p>


> **Status:** BlinkSend is an actively developed self-hosted project. The automated suite covers the transfer protocol, signaling abuse controls, integrity checks, PWA metadata, and large-transfer simulations; real-device/browser behavior can still differ by platform APIs.

## See it in action

<p align="center">
  <img src="docs/media/desktop.webp" width="920" alt="BlinkSend v0.2.0 Send and Receive start screen">
</p>

<p align="center">
  <img src="docs/media/mobile.webp" width="270" alt="BlinkSend v0.2.0 mobile light theme">
  &nbsp;&nbsp;
  <img src="docs/media/mobile-dark.webp" width="270" alt="BlinkSend v0.2.0 mobile dark theme">
</p>

### Pair in seconds

<p align="center">
  <img src="docs/media/pairing.gif" width="720" alt="Animated BlinkSend pairing walkthrough with manual code and peer verification">
</p>

The pairing demo is recorded from two real BlinkSend Chromium sessions using the actual signaling and verification flow. A permanently visible high-contrast cursor moves to each control, pauses on hover, visibly presses, and produces a click ripple before the real action occurs.

### Send, watch progress, verify

<p align="center">
  <img src="docs/media/transfer.gif" width="720" alt="Animated BlinkSend transfer walkthrough with speed, ETA, progress and SHA-256 verification">
</p>

The transfer demo is also captured from the running app: two real browser sessions pair, transfer a real local test file over BlinkSend's WebRTC path, display the live progress/speed/ETA UI, reach SHA-256 verified completion, and show the connected **Send another** flow. The test filename and measured speed are demonstration data, not benchmark claims.

The README media is reproducible: `scripts/capture-readme-media.mjs` launches the real BlinkSend server and Chromium, then the on-demand **Refresh README media** workflow captures and commits fresh browser screenshots plus 30 FPS GIFs after UI changes.

## Current flow

1. Open BlinkSend and choose **Send** or **Receive**.
2. Pair with an invite link, QR code, in-app QR scanner, or optional Nearby discovery.
3. Compare the same six-digit verification code on both devices and confirm it.
4. Send files, folders, clipboard text, pasted screenshots/files, or content received from the operating system share sheet.
5. BlinkSend shows Direct/Relay connection quality, smoothed speed, ETA, current-file progress, and whole-batch progress.
6. Every file is SHA-256 verified. Interrupted transfers request missing chunk ranges; supported browsers can resume after a page reload.

BlinkSend can also be installed as a PWA on supporting browsers. No account is required, and normal file contents are not stored by the BlinkSend signaling server.

## Features

- Simple Send / Receive entry flow for computer ↔ computer and phone ↔ computer sharing through an invite link, QR code, or an eight-character manual pairing code. Manual codes expire after 10 minutes, the sender UI shows the local expiration time, and the six-digit fingerprint check is still required.
- Installable PWA on supporting browsers, with an application-shell service worker for fast relaunch. Peer-to-peer transfers still require both devices to be online.
- In-app QR scanning on browsers that expose the Barcode Detection API and camera access; unsupported browsers can still use the system camera or paste the link.
- Optional Nearby discovery is off by default. A sender can advertise a device name and short-lived code for five minutes to receivers seen behind the same network address; peer verification is still mandatory.
- Send one file, several files, or choose an entire folder as a batch. On browsers with the File System Access API, BlinkSend recreates the folder tree automatically under one chosen destination. Dragging folders onto the drop area is also supported through modern File System handles, with a legacy directory-entry fallback where available.
- Direct encrypted browser-to-browser transfer when the network allows it; optional TURN relay support for harder networks.
- Peer verification code derived from the WebRTC DTLS fingerprints. Both devices must confirm the same six-digit code before sending is unlocked.
- Incremental SHA-256 verification for every file. A transfer is only reported as verified after sender and receiver hashes match.
- Transfer progress, average speed, cancellation, connection status, and clear errors when pairing fails.
- Pending individual files are shown in a visible queue and can be reordered, removed, or cleared while another file is sending. Accepted folder batches lock their membership so sender and receiver stay consistent.
- A verified sender session stays connected after completion and exposes **Send another**, so repeated transfers do not require pairing again.
- Reconnect/resume states are shown explicitly: connection loss, re-verification, resume percentage, and verification retry are no longer silent state changes.
- A hidden Diagnostics section in Settings shows connection state, Direct/Relay path, candidate types without addresses, RTT, measured throughput, chunk size, send-buffer target, reconnect count, and browser capability support.
- SHA-256 mismatches trigger up to two retries of only the affected file, so a bad file inside a large folder does not automatically discard the whole batch.
- Network-interface changes (for example Wi-Fi to hotspot) trigger an ICE restart from the offerer; active transfers remain paused until the connection is usable again.
- Restart-safe resume on supported browsers: persistent file handles and IndexedDB session metadata allow an interrupted transfer to continue after a page reload. Receiver writes are checkpointed to disk and a chunk bitmap/range map records what is present, so reconnects can request missing ranges rather than blindly restarting.
- Send clipboard text, commands, snippets, or `http://` / `https://` links directly to the paired device without creating a file first. Text is capped at 256 KB and framed into small UTF-8 control messages instead of relying on one oversized SCTP message.
- Paste-to-send: when the sender page is focused, pasting a clipboard file/image queues it; pasting text sends it directly.
- Automatic connection calibration after peer verification: BlinkSend measures a small 512 KiB WebRTC sample, combines it with RTT/device capability, and tunes the data-channel buffer automatically. Transfer chunks remain conservatively capped at 64 KiB for browser compatibility.
- Live transfer speed uses smoothing instead of a noisy instant value, includes an ETA, and folder batches show whole-batch bytes plus the current file.
- Connection status reports Direct vs Relay plus a simple Excellent / Good / Fair / Poor quality label based on measured RTT and throughput.
- English and Swedish interface, plus light and dark modes. Your choices are saved on each device; the initial theme follows your system setting.
- Your device nickname is stored locally and sent only to the connected peer. BlinkSend also keeps a small local list of recent peer names for recognition and includes the peer name in local transfer history. These labels are not cryptographic identities. Optional completion sound/vibration stays off unless enabled.
- Local-only transfer history keeps the latest verified file transfers and text sends in IndexedDB; it can be cleared from Settings.
- Received files can be handed to the operating system's native share sheet when the browser supports Web Share files.
- On platforms that support the Web Share Target API, BlinkSend can appear in the system Share menu. Shared files/text are intercepted locally by the service worker, staged in device-local IndexedDB, and then sent through the normal peer-to-peer flow after pairing.
- Large files stream to disk on browsers with the File System Access API. A bounded memory download is used elsewhere.
- Two participants per room, random 128-bit room links, no accounts, and no server-side file storage.

## Quick start

**Requirements:** Node.js 20 or later, npm, and a modern browser with WebRTC data channels.

```bash
git clone https://github.com/ghostySRC/BlinkSend.git
cd BlinkSend
npm ci
npm start
```

Open **http://localhost:3000** and choose **Send**. Open the generated invite link on the other device (or choose **Receive** and paste it), compare the verification code on both screens, then transfer files or a folder. Set `PORT=4000` to change the listening port.

To use a phone, deploy the app to an **HTTPS** address that both devices can reach. The phone cannot access your computer's `localhost`, and many browser features require a secure origin. Keep both pages open until each transfer finishes.

## How it works

```mermaid
sequenceDiagram
    participant A as Device A
    participant S as BlinkSend server
    participant B as Device B
    A->>S: Join room
    B->>S: Join same room
    A-->>S: WebRTC connection details
    S-->>B: Forward details
    B-->>S: WebRTC answer
    S-->>A: Forward answer
    A->>B: File over encrypted data channel
```

The Node server serves the web interface and exchanges WebRTC connection details over `/signal`. File contents travel over the WebRTC data channel. When a TURN relay is configured and needed, the relay carries encrypted WebRTC traffic and consumes relay bandwidth. The server keeps room membership in memory, with a maximum of two sockets per room; inactive rooms expire after 30 minutes. Each live room also gets an eight-character code that maps to the random 128-bit room ID for 10 minutes. On SIGTERM/SIGINT, BlinkSend sends a restart notice, closes peers with WebSocket code 1012, and gives connections up to three seconds to drain before terminating WebSockets and any remaining HTTP connections.

For normal files, the recipient accepts the transfer before data starts. Folder transfers can be accepted once as a batch; on supported browsers the receiver chooses one destination and BlinkSend recreates nested directories automatically. Incoming relative paths are normalized and traversal segments such as `..` are rejected before any directory handle is opened. Files are split into numbered chunks. The receiver maintains a compact chunk bitmap and converts gaps into missing ranges during reconnect, allowing the sender to retransmit only those ranges. Network reconnects also attempt an ICE restart when the browser reports a network-interface change. When both sides use persistent File System Access handles, BlinkSend also stores the active session in IndexedDB so a page reload can resume the current transfer after the user grants access again. Browsers without persistent handles keep the in-page resume behavior only. Offline delivery is not supported, and only one file is active at a time.

## Browser and file limits

| Receiving browser capability | Save behavior | File limit in BlinkSend |
| --- | --- | --- |
| Supports `showSaveFilePicker` | Writes chunks to the chosen file as they arrive | No app-imposed size limit; disk space and browser limits still apply |
| No save picker, but supports Origin Private File System (OPFS) | Streams large files into temporary browser-managed disk storage, then starts the download | No app-imposed size limit; available storage/quota and browser limits still apply |
| No save picker and no OPFS | Buffers the file in memory, then starts a download | 200 MB per file |

The 200 MB memory fallback now applies only when the browser exposes neither a save-file picker nor OPFS. Transfer speed depends on the sender's upload connection, the receiver's download connection, Wi-Fi quality, browser performance, and whether a relay is required. BlinkSend performs a short post-verification calibration before enabling new sends, preventing calibration frames from overlapping real file data, and tunes its WebRTC send-buffer target while keeping file messages at or below 64 KiB for compatibility. It does not promise a fixed speed.

## Deploy your own instance

BlinkSend now includes a production-oriented `Dockerfile`, `compose.yaml`, and `deploy/Caddyfile.example`. The container runs as the unprivileged Node user, drops Linux capabilities in Compose, uses a read-only root filesystem, and exposes a health check.

### Docker / Compose

```bash
docker compose up -d --build
```

By default Compose binds BlinkSend to `127.0.0.1:3000` so a host reverse proxy can terminate HTTPS. Copy `deploy/Caddyfile.example`, replace the hostname, and set `TRUST_PROXY=1` only when that proxy is the only route to the Node process.

### Direct Node deployment

Run one long-lived Node process behind an HTTPS reverse proxy. The proxy must forward WebSocket upgrades at `/signal`. A static host such as GitHub Pages cannot run the signaling server by itself.

1. Point a domain name to your server and install Node.js 20 or later.
2. Run `npm ci --omit=dev`, then start `npm start` with a process manager.
3. Proxy HTTPS traffic to BlinkSend's listening port. For example, a Caddyfile can contain:

   ```caddyfile
   blinksend.example.com {
       reverse_proxy 127.0.0.1:3000
   }
   ```

4. Open `https://blinksend.example.com/health` to check the process, then test the site from two devices. The health endpoint returns `{"status":"ok"}`.

If the reverse proxy is the only process allowed to connect to BlinkSend, set `TRUST_PROXY=1` and configure the proxy to **overwrite** `X-Forwarded-For`; BlinkSend accepts the forwarded value only when it parses as an IP address. Otherwise leave proxy trust disabled. With `METRICS_TOKEN` set, `/metrics` exposes token-protected, per-IP-rate-limited Prometheus-style counters/gauges for rooms, peers, signaling, pair-code lookups, rate limits, and ICE issuance without room IDs or client IP labels.

Use one server process for now: room membership, manual pairing codes, Nearby records, and rate-limit buckets are held in that process's memory. Running multiple replicas behind a load balancer without shared room/signaling state will break pairing. The included container/Compose setup intentionally runs one application replica.

### Optional TURN relay

Direct WebRTC connections can fail behind restrictive NATs or firewalls. A TURN server can relay those transfers. BlinkSend supports a TURN server configured with a shared authentication secret, such as coturn's `use-auth-secret` mode.

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP and WebSocket listening port | `3000` |
| `TURN_URLS` | Comma-separated `turn:` or `turns:` URLs advertised to browsers | Empty |
| `TURN_SECRET` | Shared TURN authentication secret used to issue temporary credentials | Empty |
| `TRUST_PROXY` | Trust the first `X-Forwarded-For` address for rate limits/Nearby. Enable only behind a proxy that overwrites this header. | `false` |
| `METRICS_TOKEN` | Enables `/metrics` and requires `Authorization: Bearer <token>` | Empty / metrics disabled |
| `LOG_FORMAT` | `text` or `json` startup/shutdown logs without room IDs, codes, or IPs | `text` |
| `LOG_LEVEL` | Set to `silent` to disable server logs | `info` |

Set both TURN variables on the BlinkSend server. Configure the same shared secret on your TURN server; **never commit it to the repository**. BlinkSend returns credentials valid for one hour from `/ice`. A TURN relay carries file traffic and can create bandwidth costs. Without the two TURN variables, BlinkSend uses a public STUN server and direct connections only.

## Privacy and security

- The room identifier is random and is included in the invite link. Anyone with the link can attempt to join that room, so share it privately and create a new room when needed.
- After WebRTC connects, BlinkSend displays a six-digit verification code derived from both DTLS certificate fingerprints. Transfer controls remain locked until the user confirms that both screens show the same code. Nearby discovery does not bypass this verification step.
- File contents are verified end-to-end with SHA-256 before BlinkSend reports a verified transfer.
- WebRTC encrypts the data channel in transit. The BlinkSend server forwards connection details, but its normal transfer path does not receive file contents.
- The receiving browser sees a filename and size before accepting. The signaling server does not need the file bytes or filename to pair devices.
- A TURN server, if enabled, carries encrypted traffic and can observe connection metadata and traffic volume.
- Files are not uploaded for later retrieval. Both participants must be online at the same time. Transfer history, local device name, preferences, persistent resume metadata, and any pending PWA share-target payload remain in browser-local storage and are not synced to the BlinkSend server.

BlinkSend includes in-memory per-IP limits for room joins, WebSocket upgrades, QR generation, and ICE credential requests; malformed signaling is rejected and abusive sockets are closed. TURN credentials require a short-lived token issued through a successful room join. These controls are intentionally lightweight and single-process: a serious public deployment should also add reverse-proxy/CDN rate limiting, centralized abuse monitoring, TURN bandwidth quotas, and shared state before horizontal scaling.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Phone cannot open the invite | Use a public HTTPS URL; `localhost` on your computer refers only to that computer. |
| Room says “Room full” | Two connections are already present. Close an old tab or create a new room. |
| Devices stay at “Connecting” | Refresh both pages. Try the same Wi-Fi; for restrictive networks, configure TURN. |
| Incoming file cannot be accepted | The browser supports neither direct disk streaming nor OPFS and the file is over the 200 MB memory fallback limit. Try a newer browser. |
| A transfer stops midway | BlinkSend should resume after reconnect. On supported desktop browsers it can also recover the current transfer after a reload; click **Resume transfer** and grant file access if prompted. |
| Reverse proxy loads the page but pairing fails | Ensure `/signal` supports WebSocket upgrades and the page is served over HTTPS. |

## Development

Project/runtime documentation is kept in `README.md` and `SECURITY.md` so the repository stays focused on BlinkSend itself.

```bash
npm ci
npm test
npm run bench
npm run loadtest
npm start
```

`npm test` explicitly runs only `test/*.test.js` (so benchmark/load scripts can never be auto-discovered as tests) and covers signaling abuse controls, manual pairing and metrics, explicit trusted-proxy IP parsing, graceful restart notification/close behavior, SHA-256 vectors, browser-script syntax, PWA manifest invariants, UTF-8 text framing, path traversal rejection, corruption detection, a 10,000-file manifest, and a sparse chunk bitmap sized for a 5 GiB transfer without allocating 5 GiB of data. `npm run bench` prints repeatable timings for the 5 GiB-equivalent chunk map and 10,000-file manifest operations. `npm run loadtest` runs `scripts/load-benchmark.mjs`, boots the real signaling server, creates 10 simultaneous rooms / 20 WebSockets, forwards 500 validated signaling messages, resolves manual pairing codes, checks health, and shuts the server down.

`public/` contains the browser interface and transfer logic. `server.js` serves static files, QR codes, manual pairing resolution, optional Nearby/metrics endpoints, temporary ICE credentials, WebSocket signaling, and graceful shutdown handling. `test/` covers the server's room behavior. The project uses no frontend build step.

Contributions are welcome. For a bug report, include browser and operating system versions, whether the devices were on the same network, the connection status shown in BlinkSend, and steps to reproduce the problem. Do not post private invite links or TURN credentials.

## License

[MIT](LICENSE) © 2026 ghosty.
