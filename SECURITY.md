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

- Room links are bearer secrets. Anyone who gets a valid link can attempt to join the room.
- A six-digit peer verification code is derived from the established WebRTC DTLS fingerprints. Users should compare the code on both devices before confirming.
- File data is carried by WebRTC data channels and checked with SHA-256 at the application layer.
- The signaling server forwards connection metadata but does not normally receive file contents.
- A configured TURN relay carries encrypted WebRTC traffic and can observe connection metadata and traffic volume.
- Partial-transfer resume is currently in-page only. Reloading a browser loses the active resume state.

## Public deployment

The built-in controls are a baseline, not a complete internet-facing abuse platform. Public operators should additionally use a reverse proxy or edge service for distributed rate limiting, monitor TURN bandwidth, keep dependencies patched, terminate HTTPS correctly, and avoid logging room URLs or TURN credentials.
