# Website and automatic publishing

Public directory: https://carabistouflette.github.io/awesome-goose/

## Source of truth

Edit README.md for admitted entries and categories, docs/sources.json for reviewed
snapshots and their editorial search aliases/cautions, and the curation/choice/comparison/research/development Markdown for the field guide.
Do not edit generated data or maintain a second list by hand.

The site uses **Astro 7** with static output. `npm run build` produces `_site/` with
searchable resource data, the HTML shell, bundled CSS/JavaScript, and rendered guides.
There is no runtime server. Generated output is ignored by Git; Astro fingerprints
bundled assets so browser caches stay consistent across deployments.

- `src/pages/` defines the directory, six static guide routes and JSON endpoints.
- `src/layouts/` contains the shared document/theme and guide navigation layouts.
- `src/components/` contains the directory and evidence lookup controls.
- `src/lib/content.mjs` reads README/JSON evidence at build time. Markdown rendering
  uses Astro's Markdown processor with local-link and accessible-table plugins.
- `src/scripts/` retains the browser search, filters, saved state and theme behavior;
  `src/styles/global.css` contains the shared design.

`astro.config.mjs` sets the public site and `/awesome-goose` base for GitHub Pages.
File-format output retains existing `CHOICES.html` and other guide URLs and anchors.
The README and evidence inventory remain the single curation source; no content
needs to be duplicated in Astro pages. Python is only used for catalog/link checks,
not for website generation.

## Local development

Use Node 24 and npm. The minimum supported Node version is 22.23.4.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

Open the `/awesome-goose/` path printed by Astro. To inspect production output:

```sh
npm run build
npm run preview
```

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

With Python 3.11+ and the Node/npm dependencies above installed:

```sh
python3 scripts/check.py
npm run build
python3 -m unittest discover -s tests
npm test
```

Checks cover Markdown links, anchors and inventory consistency; generated page links,
assets and anchors; safe HTML rendering; complete catalog coverage; guide navigation, ordered lists and continuation semantics; combined search
filters and saved-only behavior. They do not run upstream projects or replace a complete accessibility review.

Browser regression checks use a pinned development-only Playwright dependency
and serve the production output beneath the real GitHub Pages base path:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install playwright-core install --with-deps chromium
npm run test:browser
```

The five browser checks cover long-query reflow at 320–390px, requirement context
and focus recovery, source lookup and URL restoration, repeated Saved selection,
and guide/theme/directory-return behavior with bundled assets.
To use an existing Chromium installation, set `AWESOME_GOOSE_BROWSER_PATH` to its
executable path. Playwright and Chromium are not shipped with the site or needed for an Astro build.

## GitHub Pages CI

`.github/workflows/pages.yml` installs pinned dependencies on Node 24, builds with
Astro and tests every pull request, including Chromium regression checks before
uploading the Pages artifact. It publishes only
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
