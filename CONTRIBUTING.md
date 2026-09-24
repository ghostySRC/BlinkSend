# Contributing to BlinkSend

Thanks for helping improve BlinkSend.

The project is currently in a **reliability and compatibility phase**, so bug fixes, security hardening, browser/network testing, documentation, accessibility, and performance work are higher priority than new features.

## Good contributions right now

- reproduce and reduce browser-specific transfer bugs
- test Windows, macOS, Linux, Android, iOS/iPadOS, VPNs, IPv4/IPv6, restrictive NATs, and TURN-required networks
- improve automated recovery / hostile-peer test coverage
- fix accessibility or keyboard-navigation problems
- improve deployment documentation
- profile transfer performance without weakening integrity or safety limits

## Before opening a pull request

1. Search existing issues and pull requests.
2. Keep changes focused.
3. Do not weaken peer verification, SHA-256 verification, resource limits, signaling validation, or rate limits.
4. Update README / SECURITY / COMPATIBILITY when behavior or documented support changes.
5. Run:

```bash
npm ci
npm test
npm run bench
npm run loadtest
```

Browser-facing changes should also pass the Chromium / Firefox / WebKit E2E workflow.

## Bug reports

Include:

- browser and exact version
- operating system / device
- whether both peers were on the same LAN
- Direct or Relay status if visible
- approximate file/folder size
- whether resume/reload was involved
- exact reproduction steps
- relevant console/server errors with secrets removed

Never include invite links, TURN credentials, metrics tokens, or private filenames you do not want public.

## Security reports

Please follow [SECURITY.md](SECURITY.md) instead of opening a public issue for a vulnerability.
