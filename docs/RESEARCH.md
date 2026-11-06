# Research trail

Review date: 2026-11-06. Scope: initial catalog, not an exhaustive ecosystem audit.
Immutable public README snapshots are indexed in [sources.json (JSON)](sources.json).

## Method

Started with the public carabistouflette library documentation and the
[awesome-rust](https://github.com/rust-unofficial/awesome-rust) organization model.
Searched GitHub for `user:Macho0x goose` and
`"aardappel/goose" in:readme fork:false`, excluding the language author's and the
two initial library authors' accounts to find independent projects. Read candidate
READMEs, followed their ecosystem links, and inspected selected overlapping APIs.
This produced the Kaitk web/database stack, scientific libraries, graphics bindings,
editor plugins, and Gooslings alongside the initial libraries.

Initial choices are documentation/source-based. No third-party build, correctness
suite, performance benchmark, or security audit was performed for this catalog.
The choice notes distinguish documented features from proposed follow-up work.

## Reddit discovery

Searches included `Goose programming language libraries reddit Macho0x`,
`site:reddit.com "goose" "Macho0x"`,
`site:reddit.com "goose" "library" "aardappel"`, and related library-name queries.
Search results contained substantial noise from other projects named Goose.

Two relevant discussions were found:

- [r/altprog introduction](https://www.reddit.com/r/altprog/comments/1wkcxqz/goose_programming_language_wouter_van_oortmerssen/)
- [r/Compilers discussion](https://www.reddit.com/r/Compilers/comments/1x0ej26/goose_a_stack_allocation_flat_data_structure/)

These establish community context only. The bounded search did not yield additional
library candidates that could be verified from those threads. It is not evidence
that no such Reddit posts or libraries exist. Inclusion decisions therefore rely on
first-party repository material rather than Reddit popularity.

## Candidates held back

See [the watchlist](CHOICES.md#watchlist-and-exclusions). Personal experiments,
compiler forks, and unrelated projects sharing the name were filtered rather than
inflating the catalog. The list includes a few experimental packages with especially
useful coverage, provided their material restrictions are visible in the entry.

## Attribution

[awesome-rust](https://github.com/rust-unofficial/awesome-rust) inspired the list's
category-based organization and contribution approach. Descriptions and choice notes
here are original. Linked project names and features are attributed through links;
no upstream source code, mascots, or artwork is redistributed.

## Reader-supplied leads

Also reviewed robtandy/goose.go, voidssx1/gosh, and exaroth/coc-goose after they
were suggested during curation. Added them for Go integration, a concrete shell
application, and coc.nvim support respectively. The supplied ZHENGSY/goose-zed,
lamweilun/raygoose, and kaitk/plod links were already covered by the GitHub discovery
pass; each remains listed once. Their snapshots are in sources.json.
