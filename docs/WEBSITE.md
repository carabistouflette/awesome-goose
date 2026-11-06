# Website and automatic publishing

Public directory: https://carabistouflette.github.io/awesome-goose/

## Source of truth

Edit README.md for admitted entries and categories, docs/sources.json for reviewed
snapshots and their editorial search aliases/cautions, and the curation/choice/comparison/research/development Markdown for the field guide.
Do not edit generated data or maintain a second list by hand.

`scripts/build-site.py` produces `_site/` with searchable resource data, the HTML
shell, CSS/JavaScript, and rendered guides. The build uses Python's standard library,
performs no network requests, and requires no package installation. Generated output
is ignored by Git. Site source is under `site/`. Asset filenames include content hashes, including
module import targets, to keep browser caches consistent across deployments.

The directory defaults to a compact list, with an optional Cards layout; intermediate desktop widths stack descriptions below
identity rather than compressing the reading column. Both
layouts use the same resources and filters. Desktop shows Compiler, Docs, Stdlib, Packages and Samples above the library groups.
On mobile, a named 5 official Goose resources disclosure opens their full entries,
save controls and evidence; the built-ins-first link remains visible in the introduction.

Search covers names, descriptions, comparison topics and curated category vocabulary.
It matches word prefixes, normalizes common logging/compression forms and UTF-8
spelling variants, and keeps AND matching across distinct query words. This avoids
incidental matches such as native inside Alternative. Recorded capability aliases
cover task vocabulary such as decompression. Search preserves matches to documented
limitations, labels them, and ranks them after other matches in the default grouped
view. Explicit name/maintainer sorts retain their selected order. Other controls include
category/maintainer filters, recorded implementation/platform-note facets, sorting, local favorites, shareable URLs, light/dark
themes, keyboard search (`/` or Ctrl/Cmd+K), and Skip to search. Expanded evidence
stays open when changing list/card layout.

All/Saved consistently selects the named collection and preserves the current
filters. Category counts reflect the other active filters. Mobile uses a category
selector and an Options disclosure for maintainer/sort. Requirement notes opens
the optional implementation/platform facets. These select documentation evidence,
including restrictions; absent notes remain unclassified. The persistent matching
bar offers Show N while those controls are open. Otherwise a compact query/count
summary opens the complete current context without moving the page. Its named
panel provides Edit, Clear and Close; Escape closes it and restores summary focus,
and leaving the panel closes it. Editing selects the full active query when
present, otherwise Category. Long query chips retain full accessible names and
inspection through this panel. Show closes Options and focuses results.
The search count also jumps to results.

Favorites and theme stay in browser storage; no server account is required. If
storage is blocked, favorites last for that visit. Copy filters link preserves
public filters, sort and layout while excluding device-local Saved mode. When the
clipboard is unavailable, a selectable field exposes the normalized URL.

Guides retain theme and directory context, with section/subsection navigation,
current-section emphasis and a persistent mobile Directory/Contents bar. Short
choice tables fit tablet reading columns and become compact option-first records
with inline Use for/Note labels on phones. Longer evidence/comparison tables use labelled records at narrower
widths, retaining qualifications and table semantics.

Choice notes focuses on selection and links separately to Development for the
Ethereum gap plan. Evidence disclosures explicitly link differing directory and
comparison pins. Source evidence is generated from the same JSON inventory, with
readable owner-grouped records and repository lookup. Lookup accepts an owner or
repository name, preserves its query in the URL, and has a keyboard shortcut (`/`)
and a clear action. Raw inventory links identify their JSON format.
The Markdown list remains available without JavaScript.

## Checks

With Python 3.11+ and Node 20+ installed:

```sh
python3 scripts/check.py
python3 scripts/build-site.py
python3 -m unittest discover -s tests
node --test tests/search.test.mjs
```

Checks cover Markdown links, anchors and inventory consistency; generated page links,
assets and anchors; safe HTML rendering; complete catalog coverage; guide navigation, ordered lists and continuation semantics; combined search
filters and saved-only behavior. They do not run upstream projects or replace a complete accessibility review.

Browser regression checks use a pinned development-only Playwright dependency:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install playwright-core install --with-deps chromium
npm run test:browser
```

The four browser checks cover long-query reflow at 320–390px, requirement context
and focus recovery, source lookup and URL restoration, and repeated Saved selection.
To use an existing Chromium installation, set `AWESOME_GOOSE_BROWSER_PATH` to its
executable path. These tools are not shipped with the site or needed to build it.

## GitHub Pages CI

`.github/workflows/pages.yml` builds and tests every pull request, including the
Chromium regression checks before uploading the Pages artifact. It publishes only
pushes to `main` or a manual dispatch on `main`. Deployment uses GitHub's Pages
artifact/deployment actions and the `github-pages` environment, with write and OIDC
permissions restricted to the deploy job. Action versions are pinned to commits.
No personal token or custom deployment secret is required.

GitHub repository Settings → Pages must use **GitHub Actions** as its build source.
The repository is public and its About website points to the directory.

Automatic updates mean approved Markdown changes automatically reach the website.
They do not mean unattended scraping or automatic admission of new libraries:
curation and explanations remain reviewed changes.

## UI review process

[Review history and scores](ui-reviews/LOG.md) records independent assessments and
the corrections they prompted. Reviewers receive the current site and the neutral
criteria only, without targets, prior scores, prior reports, or conversation history.
Scores are subjective; the reports preserve verification limits.
