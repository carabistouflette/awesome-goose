# Awesome Goose 🪿

A curated flock of libraries, tools, and learning resources for the
[Goose programming language](https://github.com/aardappel/goose) by Wouter van Oortmerssen.
Inspired by [awesome-rust](https://github.com/rust-unofficial/awesome-rust).

Start small, know the tradeoffs, and build something worth honking about.

Goose and its ecosystem are young. Inclusion means a useful, documented project,
not an API stability or production-readiness promise. Check each project's compiler
revision, native dependencies, and supported platforms. Pin reviewed commits for
reproducible builds.

[How we curate](docs/CURATION.md) · [Choice notes](docs/CHOICES.md) ·
[Research trail](docs/RESEARCH.md) · [Contribute](CONTRIBUTING.md)

## Contents

- [Start here](#start-here)
- [Libraries](#libraries)
  - [Command line and configuration](#command-line-and-configuration)
  - [Data formats and text](#data-formats-and-text)
  - [Files, processes, and artifacts](#files-processes-and-artifacts)
  - [Networking and web](#networking-and-web)
  - [Databases](#databases)
  - [Cryptography](#cryptography)
  - [Ethereum and signing](#ethereum-and-signing)
  - [Numbers and scientific computing](#numbers-and-scientific-computing)
  - [Graphics](#graphics)
  - [Time and identifiers](#time-and-identifiers)
- [Applications](#applications)
- [Development tools](#development-tools)
- [Learning and community](#learning-and-community)

## Start here

- [Goose](https://github.com/aardappel/goose) — Compiler, releases, and source of the language.
- [Documentation](https://aardappel.github.io/goose/) — Tutorial, reference, specification, and standard library.
- [Standard library](https://github.com/aardappel/goose/blob/master/docs/stdlib.md) — Check here first for built-in JSON, CSV, regex, binary, graphics, audio, and other modules.
- [Packages](https://github.com/aardappel/goose/blob/master/docs/packages.md) — Official guide to importing Git/path packages and integrating native code.
- [Samples](https://github.com/aardappel/goose/tree/master/samples) — Complete programs maintained with the compiler.

## Libraries

Owner names distinguish unrelated packages with the same name. Entries are
alphabetical by owner/repository within each category. External dependencies and
important scope limits appear where they affect the choice.

### Command line and configuration

- [carabistouflette/goose-argparse](https://github.com/carabistouflette/goose-argparse) — Command-line argument parsing.
- [carabistouflette/goose-config](https://github.com/carabistouflette/goose-config) — JSON/TOML settings with environment and CLI overrides, typed bindings generation, and reload.
- [carabistouflette/goose-log](https://github.com/carabistouflette/goose-log) — Explicit logging with byte escaping; useful when the application owns output policy.
- [Macho0x/goose-logger](https://github.com/Macho0x/goose-logger) — UTC event lines, named fields, and pattern-based secret redaction. [Choosing a logger](docs/CHOICES.md#logging).

### Data formats and text

- [carabistouflette/goose-csv](https://github.com/carabistouflette/goose-csv) — Bounded streaming CSV reader and atomic row writer.
- [carabistouflette/goose-json](https://github.com/carabistouflette/goose-json) — Strict JSON ↔ struct mapping with owned decoded values; requires native C++ support. Null/optional values and maps are outside its documented model.
- [carabistouflette/goose-text](https://github.com/carabistouflette/goose-text) — Strict UTF-8 validation and conversion.
- [carabistouflette/goose-toml](https://github.com/carabistouflette/goose-toml) — Owned TOML document parsing, mutation, and writing, with explicit limits and opt-in TOML 1.1.
- [carabistouflette/goose-toml-edit](https://github.com/carabistouflette/goose-toml-edit) — Targeted TOML edits that preserve comments and untouched formatting.
- [kaitk/goose-compress](https://github.com/kaitk/goose-compress) — Streaming gzip, zlib, raw DEFLATE, and zstd encoding; includes native helpers and no decoder.
- [Macho0x/goose-deflate](https://github.com/Macho0x/goose-deflate) — Goose DEFLATE decoding and a simpler encoder, with gzip/zlib wrappers. [Compression choices](docs/CHOICES.md#compression-and-archives).
- [Macho0x/goose-msgpack](https://github.com/Macho0x/goose-msgpack) — MessagePack codec and value tree; preserves map insertion order. Strings are raw bytes without UTF-8 validation.
- [Macho0x/goose-toml](https://github.com/Macho0x/goose-toml) — TOML 1.0 reader with source-borrowing strings where possible; no writer. [TOML choices](docs/CHOICES.md#toml).

### Files, processes, and artifacts

- [carabistouflette/goose-archive](https://github.com/carabistouflette/goose-archive) — Bounded tar.gz inspection and extraction.
- [carabistouflette/goose-artifact](https://github.com/carabistouflette/goose-artifact) — Bounded verified downloads with explicit publication outcomes.
- [carabistouflette/goose-fs](https://github.com/carabistouflette/goose-fs) — Filesystem I/O, retained handles, metadata, roots, locks, and rename operations.
- [carabistouflette/goose-process](https://github.com/carabistouflette/goose-process) — Bounded subprocess execution, incremental I/O, and managed two-stage pipelines.

### Networking and web

- [carabistouflette/goose-http](https://github.com/carabistouflette/goose-http) — Bounded HTTP/HTTPS client and streaming GET using libcurl.
- [carabistouflette/goose-url](https://github.com/carabistouflette/goose-url) — RFC 3986 URI parsing, resolution, and query helpers; does not implement browser URL rules.
- [kaitk/goose-acme](https://github.com/kaitk/goose-acme) — ACME certificate orders and renewal using TLS-ALPN-01; documented validation is primarily against Pebble, with public-CA completion still outstanding.
- [kaitk/goose-http](https://github.com/kaitk/goose-http) — Event-loop HTTP server, routing, streaming, and WebSockets; optional TLS and newer HTTP protocols have platform limits. Experimental.
- [kaitk/goose-tls](https://github.com/kaitk/goose-tls) — Bytes-in/bytes-out TLS using OpenSSL primitives; its default server protocol is implemented in Goose and its client uses libssl.
- [kaitk/plod](https://github.com/kaitk/plod) — REST framework over kaitk/goose-http with typed extractors, middleware, and optional OpenAPI generation; intended for prototypes today.

[Why both HTTP packages?](docs/CHOICES.md#http-and-web)

### Databases

- [carabistouflette/goose-sqlite](https://github.com/carabistouflette/goose-sqlite) — Synchronous binding to system SQLite with prepared statements and explicit recovery contracts; Linux validated.
- [kaitk/goose-postgres](https://github.com/kaitk/goose-postgres) — PostgreSQL wire protocol, pipelining, and a blocking facade; TLS transport and several data decoders remain unimplemented.
- [kaitk/goose-sqlite](https://github.com/kaitk/goose-sqlite) — Bundled SQLite with transaction/savepoint blocks; no system SQLite installation required.

[System versus bundled SQLite](docs/CHOICES.md#sqlite)

### Cryptography

- [carabistouflette/goose-crypto](https://github.com/carabistouflette/goose-crypto) — SHA-256, strict hexadecimal codecs, and detached Ed25519 verification through system libsodium.
- [kaitk/goose-hash](https://github.com/kaitk/goose-hash) — Hashing, HMAC/PBKDF2, and OS random bytes, with native hardware/OS helpers.
- [Macho0x/goose-crypto](https://github.com/Macho0x/goose-crypto) — Broad pure-Goose algorithm collection, including Keccak-256 and secp256k1. Its author documents that it is **not constant-time**; see the [crypto choice note](docs/CHOICES.md#cryptography).

### Ethereum and signing

- [Macho0x/goose-ethereum](https://github.com/Macho0x/goose-ethereum) — Checked uint256 arithmetic, ABI words/selectors, and JSON-RPC request/result helpers. Transport and transaction signing are separate; callers assemble dynamic ABI offsets.
- [Macho0x/goose-signature](https://github.com/Macho0x/goose-signature) — Ethereum messages, typed data, and transaction signing, plus Bitcoin and Solana formats. Depends on Macho0x/goose-crypto and inherits its timing limitations.

[What belongs in an Ethereum stack](docs/CHOICES.md#ethereum)

### Numbers and scientific computing

- [guillochon/goose-fft](https://github.com/guillochon/goose-fft) — Pure-Goose complex, real, and 2-D FFTs, reusable plans, and convolution; check its compiler prerequisites before use.
- [guillochon/goose-random](https://github.com/guillochon/goose-random) — PRNGs, probability distributions, shuffling, and split streams for simulations; not a cryptographic random source.
- [Macho0x/goose-bigint](https://github.com/Macho0x/goose-bigint) — Growable signed integers with arithmetic, bit operations, modular operations, and byte codecs.
- [Macho0x/goose-decimal](https://github.com/Macho0x/goose-decimal) — Checked decimal arithmetic using a 96-bit coefficient and scale up to 28; distinct from arbitrary-precision integers and uint256.

### Graphics

- [kaitk/goose-ngfx](https://github.com/kaitk/goose-ngfx) — NoGraphicsAPI bindings using Metal/Vulkan and Slang; requires the corresponding SDKs and hardware, with Linux presentation unavailable in the documented snapshot.
- [lamweilun/raygoose](https://github.com/lamweilun/raygoose) — Generated raylib bindings and a Goose raymath port; desktop 64-bit targets, with documented callback and platform limitations.

### Time and identifiers

- [carabistouflette/goose-semver](https://github.com/carabistouflette/goose-semver) — Semantic versions and version requirements.
- [carabistouflette/goose-time](https://github.com/carabistouflette/goose-time) — Checked time arithmetic, Gregorian UTC calendars, and bounded RFC 3339 parsing/formatting.
- [Macho0x/goose-uuid](https://github.com/Macho0x/goose-uuid) — UUID versions and text codecs; default random generation has platform-specific entropy limits. Supply suitable random bytes where required.

## Applications

- [voidssx1/gosh](https://github.com/voidssx1/gosh) — Unix shell with Goose parsing, expansion, builtins, and line editing over a substantial POSIX C execution backend. Linux/Unix-oriented; no verified claim of full POSIX shell conformance.

## Development tools

- [carabistouflette/goose-check](https://github.com/carabistouflette/goose-check) — Command regression testing with binary fixtures, exit expectations, limits, and deadlines; Linux-specific today.
- [carabistouflette/honk](https://github.com/carabistouflette/honk) — Experimental project manager with Git/path dependencies, lockfiles, workspaces, and test/build commands; Linux x86-64/glibc. No package registry publishing yet.
- [exaroth/coc-goose](https://github.com/exaroth/coc-goose) — Goose language-server integration for coc.nvim; requires Goose filetype detection and compiler/stdlib configuration.
- [exaroth/goose-lang.vim](https://github.com/exaroth/goose-lang.vim) — Vim/Neovim highlighting, indentation, and basic compiler integration.
- [Official editor support](https://github.com/aardappel/goose/blob/master/docs/editors.md) — The compiler's language server and editor configuration, including the upstream VS Code extension.
- [robtandy/goose.go](https://github.com/robtandy/goose.go) — Alternative compiler backend emitting Go and a pure-Go data-stack runtime, for embedding Goose in Go services without cgo. [Backend choice](docs/CHOICES.md#go-integration).
- [ZHENGSY/goose-zed](https://github.com/ZHENGSY/goose-zed) — Zed language support, Tree-sitter grammar, and compiler-backed LSP integration.

## Learning and community

- [Goose discussions](https://github.com/aardappel/goose/discussions) — Upstream community questions and ideas.
- [Goose on r/altprog](https://www.reddit.com/r/altprog/comments/1wkcxqz/goose_programming_language_wouter_van_oortmerssen/) — Introductory community discussion, including comments from the language designer.
- [Goose on r/Compilers](https://www.reddit.com/r/Compilers/comments/1x0ej26/goose_a_stack_allocation_flat_data_structure/) — Discussion of the language and its memory model.

## Contributing

Suggest a useful project with a short description and evidence for its inclusion.
Read [the contribution guide](CONTRIBUTING.md), especially when proposing an alternative
to an existing entry. Maintainer affiliation does not decide inclusion.

## License

The original text of this list is dedicated to the public domain under
[CC0 1.0](LICENSE). Linked projects keep their own licenses.
