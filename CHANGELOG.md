# Changelog

## 0.4.0-beta.4 — sustained multi-gigabyte transfer stability

### Throughput and stability
- Add receiver-credit flow control: the destination periodically reports bytes actually committed/processed and a bounded receive window, so the sender cannot flood a slower browser even when the WebRTC send buffer still looks healthy.
- Use adaptive 8–48 MiB receiver windows with frequent credit acknowledgements to keep fast links full without allowing unbounded receive backlog.
- Expand fast-link payload selection to 256 KiB when the negotiated SCTP limit safely permits it.
- Increase fast-device sender read-ahead to 16 MiB and receiver contiguous write batches up to 8 MiB.
- Move durable resume checkpoints to 128 MiB intervals to reduce close/reopen overhead on very large transfers while preserving reload recovery.
- Carry receiver credit across resume/reconnect and reset it safely during verification retries.
- Add validation for flow-control messages so a peer cannot advertise impossible progress or abusive receive windows.
- Expand cross-browser E2E binary coverage from 8 MiB to 32 MiB in Chromium, Firefox, and WebKit.

## 0.4.0-beta.3 — high-throughput transfer engine

### Performance
- Raise the negotiated peer-input chunk ceiling to 256 KiB while respecting the WebRTC SCTP max-message-size advertised by the active connection.
- Dynamically select 64/128/192/256 KiB payload chunks instead of forcing every transfer through 64 KiB messages.
- Read sender files in multi-megabyte blocks and split them into DataChannel packets in memory, drastically reducing asynchronous file-read calls.
- Batch persistent receiver writes into larger contiguous writes and remove the unconditional seek before every normal in-order chunk.
- Increase adaptive DataChannel buffering to keep higher-bandwidth links fed while retaining backpressure.
- Reduce expensive reload-resume disk checkpoints from every 8 MiB to an adaptive 64 MiB interval.
- Throttle progress/ETA DOM rendering to roughly 10 Hz and bound estimator samples so UI work cannot dominate a fast transfer.
- Expand connection calibration from 512 KiB to 2 MiB for a more useful high-speed measurement.
- Add an 8 MiB real WebRTC file-transfer smoke test to the Chromium/Firefox/WebKit E2E matrix.

## 0.4.0-beta.2 — mobile layout, localization, and ETA accuracy

### UI and localization
- Fix the cramped mobile header shown on narrow phones by allowing the header controls to wrap cleanly without overlap or horizontal overflow.
- Choose the initial language from the browser's ordered locale preferences; unsupported locales fall back to English, while an explicit user choice remains saved locally.
- Add complete Spanish, French, German, Portuguese, Simplified Chinese, Japanese, and Arabic UI packs alongside English and Swedish.
- Apply right-to-left document direction for Arabic.
- Add automated mobile-layout, locale-selection, fallback, RTL, key-completeness, and placeholder-integrity checks.

### Transfer accuracy and update reliability
- Replace the per-chunk smoothed ETA with a measured 8-second recent-throughput window. After a multi-second stall the estimate resets and waits for fresh transfer data instead of racing to catch up.
- Refresh the service-worker shell cache and switch shell assets to network-first while online, preventing old JavaScript/CSS from remaining stuck after a deployment.

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
