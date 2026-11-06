# Library development gaps

These are possible additions to carabistouflette's libraries, based on the
[documented comparison baselines](COMPARISONS.md). They are not implemented features
or compatibility promises. For selecting an existing package, use [Choice notes](CHOICES.md).

## Ethereum support

Useful gaps to pursue in carabistouflette's ecosystem, in dependency order:

1. **Keccak-256 and checked uint256 codecs/arithmetic.** Ethereum uses Keccak-256,
   not SHA-256 or SHA3-256. Establish selector/hash vectors, overflow behavior, byte
   order, and strict hex-quantity versus fixed-data rules before higher layers.
2. **ABI and read-only JSON-RPC.** Build a separate Ethereum package over existing
   HTTP and JSON capabilities. Define dynamic offsets, nesting bounds, RPC error
   objects, request-id matching, and null results explicitly. Generic JSON, HTTP,
   and URI libraries should keep their protocol-independent jobs.
3. **secp256k1 and protocol signing.** Use a reviewed native backend for secret-key
   operations, with recovery and canonical signature behavior. Add EIP-191/EIP-712
   and transaction envelopes only with independent reference vectors, chain-id
   coverage, and explicit ownership of key handling.
4. **Application adapters only with a real consumer.** Hyperliquid and trading
   integrations can then compose the stack, rather than driving all concerns into
   a generic crypto library.

The existing strict JSON-to-struct codec cannot represent every JSON-RPC envelope:
null/optional values and dynamic result shapes need selective standard-library JSON
reads or an opt-in richer codec. Evaluate reusable POST, additional HTTP verbs, and
structured RPC errors before building a second transport. The detailed comparison
records acceptance criteria for these cross-cutting gaps.

This is a feature-gap plan, not an implementation or a decision to copy code. Reuse
an existing package where its contracts fit. Any source adaptation needs its license
and notices preserved and an independently tested compatibility contract.

## Logging

A useful additive experiment is an independently usable
content-pattern sanitizer for goose-log, with cases covering missed secrets and false positives.
Keep application control over output and avoid a global policy change.

## Compression and archives

A future pure-Goose archive backend would need
an explicit decompressed-output budget and the existing archive path policies.
