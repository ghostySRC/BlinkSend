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
- Partial-transfer resume works in-page everywhere the transfer path supports it. On browsers that persist File System Access handles in IndexedDB, BlinkSend can also recover the active transfer after a reload once the user grants file access again.
- Optional device names and transfer history are local browser data; device names are sent only to the currently connected peer unless the user explicitly enables Nearby discovery. Nearby records are limited to the same observed network address, expire after five minutes, expose only the chosen device name plus an ephemeral code, and never bypass the DTLS fingerprint verification step.

## Public deployment

The built-in controls are a baseline, not a complete internet-facing abuse platform. Public operators should additionally use a reverse proxy or edge service for distributed rate limiting, monitor TURN bandwidth, keep dependencies patched, terminate HTTPS correctly, and avoid logging room URLs or TURN credentials.
