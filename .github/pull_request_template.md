## What changed?

<!-- Keep this focused. -->

## Why?

<!-- Bug, reliability issue, compatibility problem, documentation improvement, etc. -->

## Validation

- [ ] `npm test`
- [ ] `npm run bench` when transfer/protocol code changed
- [ ] `npm run loadtest` when signaling/server behavior changed
- [ ] Browser E2E passes when browser-facing behavior changed
- [ ] README / SECURITY / COMPATIBILITY updated where relevant

## Security / protocol checklist

- [ ] Peer verification remains required before new transfers
- [ ] SHA-256 completion verification remains enforced
- [ ] Untrusted input remains bounded before allocation/disk work
- [ ] No secrets, invite links, private tokens, or sensitive logs are included
