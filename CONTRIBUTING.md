# Contributing

Suggest additions, corrections, removals, and better explanations through issues or
pull requests. Please read [the curation policy](docs/CURATION.md).

For an addition, include:

- The canonical repository and its license.
- A working example or install guide and the tested Goose revision/platforms.
- A short factual description: `- [owner/project](https://github.com/owner/project) — Purpose; material limit.`
- Why it helps a Goose user, and how it differs from an existing entry if they overlap.
- Public evidence for features and limitations; disclose your affiliation.

Use the closest category and alphabetical owner/repository ordering. Do not add
empty categories, duplicate forks, advertising, star counts, or unsupported speed
and security claims. Substantial tradeoffs belong in docs/CHOICES.md. Watchlist
candidates belong there until they meet the admission criteria.

Update docs/sources.json with an immutable reviewed commit and README link.
Run `python3 scripts/check.py` before submitting. This checks local links, anchors,
and catalog/source-inventory consistency. It does not execute linked projects or
claim their current online availability.

Text contributed here is dedicated under CC0 1.0. Upstream code is not copied into
this repository and keeps its own license.
