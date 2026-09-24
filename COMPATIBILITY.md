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
