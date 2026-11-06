# Choice notes

Reviewed 2026-11-06. These are recommendations about fit, based on public documentation
and selected source inspection. They are not independent security audits or reproduced
performance comparisons. [The source inventory](sources.json) records immutable README
links. [Detailed Macho0x comparisons](COMPARISONS.md) provide the supporting inspection.

## HTTP and web

Choose [carabistouflette/goose-http](https://github.com/carabistouflette/goose-http)
for a bounded libcurl-backed client. Choose
[kaitk/goose-http](https://github.com/kaitk/goose-http) when serving HTTP with event-loop
workers, routing, streaming, or WebSockets. The shared name hides different primary
jobs. Kaitk also offers an optional blocking client; check its per-platform limits.
[Plod](https://github.com/kaitk/plod) adds framework concerns above that server.

The Macho0x HTTP repository's README points to Kaitk's server ecosystem. Prefer the
upstream catalog link unless a fork demonstrates distinct maintained functionality;
a second copy of the same server is not a separate recommendation.

## Cryptography

Choose [carabistouflette/goose-crypto](https://github.com/carabistouflette/goose-crypto)
for its small libsodium-backed SHA-256/hex/Ed25519-verification surface. It does not
supply Ethereum primitives, signing, encryption, or a general crypto toolkit.

[Macho0x/goose-crypto](https://github.com/Macho0x/goose-crypto) adds pure-Goose
Keccak-256, secp256k1, signing, ciphers, and other algorithms. Keep it discoverable for
that coverage and for studying Goose implementations. Its README explicitly says it
is not constant-time and excludes uses where a secret's timing can be observed.
Published test vectors alone do not establish side-channel resistance. The wider API
does not make it a drop-in replacement for a native-backed secret-key implementation.

[kaitk/goose-hash](https://github.com/kaitk/goose-hash) is another useful choice for
HMAC, PBKDF2, hardware-assisted hashes, and OS entropy. Its scope complements a
verification-only library; inspect actual primitives rather than comparing names.

## Ethereum

Keep [goose-ethereum](https://github.com/Macho0x/goose-ethereum) and
[goose-signature](https://github.com/Macho0x/goose-signature) as separate entries.
The former supplies uint256, ABI pieces, and RPC bytes; the latter supplies protocol
signing. Neither is a complete wallet or an Ethereum node client. Dynamic ABI values
still need caller-computed head offsets. JSON-RPC result parsing collapses several
failure cases into a boolean. Signing inherits the crypto backend's timing limits.

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

## TOML

Prefer [carabistouflette/goose-toml](https://github.com/carabistouflette/goose-toml)
when the document must own decoded data, be edited/written, or opt into TOML 1.1.
Use its [separate text editor](https://github.com/carabistouflette/goose-toml-edit)
when comments and untouched formatting must survive targeted changes.

[Macho0x/goose-toml](https://github.com/Macho0x/goose-toml) earns a place as a
reader with source-borrowing strings where possible. Keep its input, node storage,
and escape storage alive. It has no writer and targets TOML 1.0. This is an ownership
and feature choice; no matched benchmark was run to rank speed.

## Logging

[carabistouflette/goose-log](https://github.com/carabistouflette/goose-log) emphasizes
explicit logging and escaping. [Macho0x/goose-logger](https://github.com/Macho0x/goose-logger)
offers timestamped process events, named fields, and secret-pattern sanitization.
Both belong because their output policies differ. Escaping prevents control-byte
confusion; redaction addresses recognizable secret content. Neither replaces the
other, and pattern matching cannot promise to catch every secret.

A useful additive experiment is an independently usable
content-pattern sanitizer for goose-log, with cases covering missed secrets and false positives.
Keep application control over output and avoid a global policy change.

## Compression and archives

[goose-archive](https://github.com/carabistouflette/goose-archive) owns bounded tar.gz
inspection/extraction. [Macho0x/goose-deflate](https://github.com/Macho0x/goose-deflate)
owns compression streams and wrappers, including a decoder. They are different
layers. The pure-Goose encoder is deliberately simpler than a full compression-level
implementation.

[kaitk/goose-compress](https://github.com/kaitk/goose-compress) earns a separate entry
for streaming encoding and zstd. Its documented API does not decode. Choose based on
format, direction, flush needs, and native dependencies. No cross-project speed
ranking is supported by this review. A future pure-Goose archive backend would need
an explicit decompressed-output budget and the existing archive path policies.

## SQLite

[carabistouflette/goose-sqlite](https://github.com/carabistouflette/goose-sqlite)
uses system SQLite and documents recovery and platform requirements.
[kaitk/goose-sqlite](https://github.com/kaitk/goose-sqlite) bundles SQLite and offers
transaction/savepoint blocks. The latter removes a system dependency but makes the
package pin responsible for its SQLite revision. Review its documented early-return
and statement-finalization rules. Both belong; packaging and error handling matter
more here than a shared repository name.

## Watchlist and exclusions

- [Gooslings](https://github.com/scriptmaster/gooslings): useful compiler-checked
  exercises and a runner, but the inspected repository has no LICENSE and its README
  only states the compiler's license. Hold outside the recommended list until the
  exercises/runner licensing is explicit.

- [Macho0x/goose-hyperliquid](https://github.com/Macho0x/goose-hyperliquid): interesting
  integration of signing, decimal normalization, and MessagePack. Keep on the
  watchlist: the documented WebSocket connection depends on a module not yet on
  goose-http main, and the crypto timing limitations apply. Promote when its
  standalone dependency setup and supported end-to-end paths are verified.
- Compiler forks and personal experiments can be useful references, but are not
  independent library entries without a distinct supported package.
- Block/AAIF's Goose agent, SQL migration tools, and unrelated languages also named
  Goose are outside this list's scope.

## Go integration

[robtandy/goose.go](https://github.com/robtandy/goose.go) is a distinct compiler/backend
project, not another Goose library or the upstream compiler's documented default.
It reuses a vendored Goose frontend and emits Go code plus an mmap-backed runtime.
Include it for the specific use case of embedding Goose kernels into Go services
without cgo. Its README provides build steps, exported-function examples, integration
docs, and a test runner. No independent validation of its zero-copy, allocation,
performance, or safety claims was performed here, so those claims are not catalog
endorsements. Native C-backed packages in this list should not be assumed compatible
with this backend. Check its runtime/platform and FFI contracts separately.

## Shell and editor additions

[gosh](https://github.com/voidssx1/gosh) belongs under applications: a concrete shell
program shows Goose parsing and interactive tooling in use. It is not a replacement
for goose-process's bounded child-process API. Its own README says the POSIX C backend
is substantial; calling it a C-free shell or claiming POSIX conformance would overstate
the evidence.

[coc-goose](https://github.com/exaroth/coc-goose) complements
[goose-lang.vim](https://github.com/exaroth/goose-lang.vim): the former connects
coc.nvim to the language server; the latter supplies filetype/highlighting/indentation
and basic compiler integration. They can be installed together. ZHENGSY's Zed
extension serves a different editor and remains independently useful.
