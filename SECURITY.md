# Security policy

## Reporting a vulnerability

Please do not open a public issue for a vulnerability that could expose users, room links, relay credentials, or transferred data.

Use GitHub's private vulnerability reporting for this repository when available. Include:
- the affected BlinkSend commit or version
- browser and operating system
- whether TURN was enabled
- reproduction steps
- expected and actual behavior
- any proof-of-concept that is safe to share

## Security model

BlinkSend is designed for direct, ephemeral transfers between two browsers.

- Room links are bearer secrets. Anyone who gets a valid link can attempt to join the room. Manual pairing codes are shorter convenience identifiers, are rate-limited and expire after 10 minutes; they are not a replacement for the six-digit DTLS fingerprint comparison.
- A six-digit peer verification code is derived from the established WebRTC DTLS fingerprints. Users should compare the code on both devices before confirming.
- File data is carried by WebRTC data channels and checked with SHA-256 at the application layer.
- The signaling server forwards connection metadata but does not normally receive file contents.
- A configured TURN relay carries encrypted WebRTC traffic and can observe connection metadata and traffic volume.
- Partial-transfer resume works in-page everywhere the transfer path supports it. On browsers that persist File System Access handles in IndexedDB, BlinkSend can also recover the active transfer after a reload once the user grants file access again.
- Optional device names and transfer history are local browser data; device names are sent only to the currently connected peer unless the user explicitly enables Nearby discovery. Nearby records are limited to the same observed network address, expire after five minutes, expose only the chosen device name plus an ephemeral code, and never bypass the DTLS fingerprint verification step.
- Web Share Target payloads are intercepted by the service worker and staged in device-local IndexedDB until the user pairs with a receiver; they are not uploaded to the signaling server.
- QR scanning requests camera permission only after the user presses Scan QR. Microphone and geolocation permissions remain disabled by policy.

## Public deployment

The built-in controls are a baseline, not a complete internet-facing abuse platform. Public operators should additionally use a reverse proxy or edge service for distributed rate limiting, monitor TURN bandwidth, keep dependencies patched, terminate HTTPS correctly, and avoid logging room URLs or TURN credentials. `TRUST_PROXY` must only be enabled when BlinkSend is reachable exclusively through a trusted proxy that overwrites `X-Forwarded-For`; BlinkSend validates the forwarded value as an IP, but direct access to a proxy-trusting origin could still let clients spoof rate-limit/discovery identity. `/metrics` stays disabled unless `METRICS_TOKEN` is configured.

## Untrusted peer resource limits

The receiving browser validates peer-controlled metadata before allocating chunk maps, file arrays, folder structures, or text buffers. Current client-side bounds cover file/batch size, file count, path depth and byte length, identifiers, chunk count, resume-range count, control JSON size, queue length, and clipboard framing. Oversized or contradictory messages are rejected before transfer state is created. These limits live in `public/security.js` so protocol handlers and tests use the same definitions.

## Verification boundary

The data channel may exist before a user confirms the six-digit code, but BlinkSend does not treat that as an authorized transfer session. Before mutual verification, the control policy accepts only device hello, verification confirmation, cancellation, and matching resume metadata needed to preserve an already-existing interrupted transfer. New files, folders, clipboard data, benchmarks, completion messages, retries, and save acknowledgements are ignored until the peer is verified.

Persisted reload-resume metadata is validated again before permissions, writers, chunk maps, or restored batch entries are used. Sender-side restore also compares the current source file size and modification timestamp with the saved session to avoid resuming against a changed file.

Accepted folder batches are treated as a manifest envelope: each batch-tagged file must match the accepted batch ID, cannot push completed bytes beyond the declared total, cannot exceed the declared file count, and `batch-complete` is accepted only when both declared totals have actually been reached.
