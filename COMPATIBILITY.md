# Browser compatibility

BlinkSend is built around standard WebRTC plus progressive enhancement for browser file/storage APIs.

## Automated desktop-engine checks

The `Browser E2E` workflow runs on every pull request and on `main` against Playwright's current:

| Engine | Automated flow |
| --- | --- |
| Chromium | launch → pair → compare verification code → mutually verify → WebRTC clipboard transfer |
| Firefox | launch → pair → compare verification code → mutually verify → WebRTC clipboard transfer |
| WebKit | launch → pair → compare verification code → mutually verify → WebRTC clipboard transfer |

Playwright WebKit is useful compatibility coverage, but it is **not a substitute for physical Safari/iPhone testing**.

## Capability-dependent features

| Feature | Requirement / fallback |
| --- | --- |
| Basic pairing + WebRTC transfer | Modern WebRTC + WebSocket browser |
| Restart-safe sender resume | Persistent File System Access handles |
| Direct folder reconstruction | `showDirectoryPicker` |
| Large receiver streaming | Save-file picker or OPFS |
| In-app QR scan | `BarcodeDetector` + camera permission |
| Native share | Web Share API |
| OS Share Target | Installed PWA + platform Share Target support |

BlinkSend feature-detects these APIs and keeps fallbacks where practical.

## Manual device/network matrix

Before a stable 1.0 release, releases should be manually checked on representative physical devices for:

- Chrome / Edge on Windows
- Chrome / Firefox on Linux
- Chrome / Safari / Firefox on macOS where available
- Chrome on Android
- Safari on iOS/iPadOS

Network scenarios should include same-LAN direct transfer, separate networks, TURN-required paths, VPN, IPv4/IPv6 where available, and a deliberately interrupted/mobile-network transition.

Known results should be recorded per release rather than assuming Playwright engine coverage proves platform-specific file APIs.

## Known limitations for 0.4 beta

- The server is still intentionally single-process/in-memory; horizontal scaling needs shared room/signaling/discovery/rate-limit state.
- Playwright WebKit does not prove physical iOS/iPadOS Safari file-picker, PWA, Share Target, or persistent-handle behavior.
- Reload-safe resume depends on browser support for persisting File System Access handles.
- Direct folder reconstruction depends on `showDirectoryPicker`; fallback browsers may receive files individually.
- Nearby discovery groups clients by the server-observed network address, so a school/hotel/café/CGNAT/VPN exit can contain unrelated users. Nearby remains opt-in and never replaces fingerprint verification.
- Current client safety bounds intentionally cap a single announced file at 256 GiB, an accepted batch at 10,000 files / 512 GiB, and a receive transfer at 4,194,304 chunks. These are anti-resource-exhaustion bounds, not benchmark targets.
