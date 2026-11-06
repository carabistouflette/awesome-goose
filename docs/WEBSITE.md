# Website and automatic publishing

Public directory: https://carabistouflette.github.io/awesome-goose/

## Source of truth

Edit README.md for admitted entries and categories, docs/sources.json for reviewed
snapshots, and the curation/choice/comparison/research Markdown for the field guide.
Do not edit generated data or maintain a second list by hand.

`scripts/build-site.py` produces `_site/` with searchable resource data, the HTML
shell, CSS/JavaScript, and rendered guides. The build uses Python's standard library,
performs no network requests, and requires no package installation. Generated output
is ignored by Git. Site source is under `site/`. Asset filenames include content hashes, including
module import targets, to keep browser caches consistent across deployments.

The directory defaults to a compact list, with an optional Cards layout. Both
layouts use the same resources and filters. Foundational language references appear
under a compact Start here disclosure. Expanding it shows the same full entries,
save controls and review evidence as the rest of the directory.

The directory provides case-insensitive multiword search, category and maintainer
filters, category/name/maintainer sorting, local favorites, shareable filtered URLs,
light/dark themes, keyboard search (`/` or Ctrl/Cmd+K), and source-review disclosures that remain open across layout changes. Reading-guide tables show labelled, stacked values
on mobile so their reasons and qualifications remain visible. Mobile uses a visible category selector and a
collapsible maintainer/sort section. Active filters can be removed individually;
category filters also work within the saved collection. Category counts reflect
the other active filters. On mobile, Show resources closes expanded filters and
moves directly to the matching entries. The search field also exposes the current
matching count as a jump-to-results link. All/Saved share one persistent collection
bar; switching collections preserves the search, category and maintainer filters.
Favorites and theme settings stay in browser storage; no server account is required.
If storage is blocked, the directory still works and favorites last for that visit.
“Copy filters link” shares search/category/maintainer/sort settings, not a saved
collection; the copied URL intentionally omits device-local saved mode. If the
clipboard is unavailable, a selectable field exposes the same normalized URL.
Guides retain the selected theme, include section/subsection navigation and a
persistent mobile Directory/Contents bar, and link back to the
current directory filters, including from the desktop contents rail and header brand.
Where the comparison reviewed a different snapshot, the evidence disclosure links
that separate baseline explicitly. The Markdown list remains available without JavaScript.

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
filters and saved-only behavior. They do not run upstream projects or replace browser
layout/accessibility review.

## GitHub Pages CI

`.github/workflows/pages.yml` builds and tests every pull request. It publishes only
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
