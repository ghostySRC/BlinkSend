# Changelog

## 0.4.0-beta.1 — reliability and hostile-peer hardening

### Security and protocol
- Require mutual six-digit peer verification before new file, folder, text, benchmark, completion, retry, or save-acknowledgement controls are processed.
- Centralize peer-controlled limits for file/batch metadata, paths, identifiers, control JSON, clipboard framing, queue length, resume ranges, and chunk count.
- Reject resource-exhaustion metadata before chunk maps, arrays, folders, or text buffers are allocated.
- Enforce accepted folder batch file-count and byte-total envelopes through completion.
- Validate persisted reload-resume records before restoring handles/writers/chunk maps.
- Refuse sender reload-resume if the source file changed size or modification timestamp.
- Bound legacy resume positions to the actual file chunk count.
- Fix final sender verification after missing-range resume to use the precomputed full-file SHA-256.

### Recovery and testing
- Add deterministic recovery-state coverage for disconnect at 37%, sparse ranges, a second interruption, reload reconstruction, and final completion.
- Add duplicate/short/oversized chunk tests and hostile control-order policy tests.
- Add 5,000-case malformed file-request fuzz-style coverage.
- Add Chromium, Firefox, and WebKit browser E2E for pairing, matching fingerprint code, mutual verification, and real WebRTC clipboard transfer.

### Client structure
- Extract DTLS fingerprint verification into `public/verification.js`.
- Extract selected WebRTC candidate-pair summarization into `public/connection.js`.
- Extract transfer chunk/bitmap/hash primitives into `public/transfer-core.js`.
- Extract bounded filesystem traversal into `public/storage.js`.
- Extract pre-/post-verification control policy into `public/control-policy.js`.
- Keep resource validation in `public/security.js` and persistence in `public/persistence.js`.

### Compatibility
- Add `COMPATIBILITY.md` with automated engine coverage, progressive-enhancement requirements, a manual device/network matrix, and beta limitations.

## 0.3.0

- Transfer queue with reorder/remove/clear for pending individual files.
- Session reuse with **Send another**.
- Recent local peer labels and richer local history.
- Explicit reconnect / reverify / resume / retry states.
- Hidden connection diagnostics.
- Real browser-captured README walkthroughs.
