# UI review record

The user requested iterative independent UI assessment and improvement until every
reviewer in the final round assigns at least 9/10 overall. Ratings are subjective,
not a certification. The [neutral criteria](CRITERIA.md) keep weights fixed.

## Review independence

Reviewer contexts contain only the current application, neutral criteria, local
browser setup, and report destination. They do not receive the optimization target,
previous ratings, previous reports, conversation history, or iteration framing.
The initial reviewer briefs included improvement context; those agents were stopped
and their work was discarded before the baseline below. No scores were used from
those attempts. Later user design feedback interrupted another unfinished pair;
that pair also supplies no accepted scores.

The baseline uses three independent reviewers. They converged on the same problems,
so the user authorized reducing later rounds to two fresh reviewers. Each completed
round freezes the app revision during assessment. Each reviewer uses its own browser
tab; subsequent setups separate local origins to avoid shared storage interference.
Reports preserve actual verification limits, including preview automation failures.

## Completed baseline

Application: `9049751`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Amber](assessment-amber.md) | 6.5 | 7.5 | 7.5 | 6.5 | 8.5 | 7.15 |
| [Birch](assessment-birch.md) | 7.0 | 7.5 | 8.0 | 6.5 | 8.5 | 7.35 |
| [Cedar](assessment-cedar.md) | 6.5 | 7.5 | 7.5 | 6.0 | 8.5 | 7.03 |

The shared issues were small low-contrast text, results below the first screen,
small touch targets, mobile category visibility, saved-view ambiguity, and guide
inconsistencies. The reports explain the evidence and limits independently.

## Implemented changes

Application: `2146042` (including `27fc909`).

- Larger text and 44px main controls; stronger light/dark contrast; system fonts.
- Smaller introduction, no decorative slogans, no filled navigation tiles, and no
  redundant getting-started panel. Plain text identifies the selected navigation.
- Visible mobile category selector and compact maintainer/sort disclosure; sticky
  desktop category navigation and an explicit results jump.
- Removable active filters; category filtering composes with Saved; counts show
  matching saves versus the collection total. Clear filters preserves Saved.
- Distinct empty collection and filtered-save messages; saved-link sharing explains
  that only public filters travel, and omits device-local saved mode from the URL.
- Escape clears search while retaining focus. Removing saves/filter chips restores
  focus to a predictable destination. Explicit filter changes have browser history.
- Topic-specific choice links, real source/review disclosures, guide contents,
  shared theme, and return links preserving directory filters.
- Correct ordered lists and continuation semantics; focusable overflow tables;
  regression tests for guide navigation, choice anchors and Markdown list structure.

Further accepted reviews and changes are recorded below as they complete.

## Second completed assessment

Application: `2146042`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Fern](assessment-fern.md) | 8.5 | 8.0 | 8.0 | 8.0 | 9.0 | 8.20 |
| [Granite](assessment-granite.md) | 8.0 | 8.0 | 8.2 | 7.8 | 9.0 | 8.08 |

This round did not meet the requested threshold. The remaining shared concerns were
card density on mobile, secondary link targets, owner attribution for same-name
projects, and mobile curation/category clarity. No major issue was established, but
both reviewers identified room for meaningful improvement. Their verification limits
are retained in their reports rather than counted as application failures.

## Changes following that assessment

Application: `5f387aa`.

- Compact list is the default; an explicit List/Cards control allows expanded cards.
  The selected layout is represented in the URL. Library categories appear before
  the introductory resource group in the all-resources browse order.
- Exact repository links visibly include owner/package identity and have full
  accessible names. Non-GitHub official documentation is attributed to aardappel.
- Resource titles and direct choice links have padded 44px hit areas. Compact rows
  reduce repeated card chrome and keep descriptions and evidence near each other.
- Mobile category options include resource totals. Very narrow navigation and
  filters use a deliberate stacked arrangement. Curation remains directly visible.
- Singular result/status wording is corrected. The unbounded empty-state SVG is
  removed rather than replaced with decorative artwork.
- External Markdown source links retain their original URLs; only local guide links
  are rewritten to generated HTML. A regression test first reproduced the external
  source-link defect and passes after the fix.

## Third completed assessment

Application: `5f387aa`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Harbor](assessment-harbor.md) | 8.5 | 8.0 | 8.0 | 8.5 | 9.0 | 8.33 |
| [Iris](assessment-iris.md) | 8.4 | 8.0 | 8.3 | 8.2 | 8.7 | 8.26 |

This round did not meet the requested threshold. Both reviewers identified the
inconsistent placement of foundational references, a clipboard-failure fallback
that could preserve `saved=1`, and remaining small-screen/guide navigation friction.
One also identified choice links whose destination did not cover the linked entry.

## Changes following that assessment

- Foundational resources now come first in both navigation and default results.
  Their default list presentation is plain reference links with a route to full
  details/saving, rather than a promo panel or five large cards.
- Clipboard failure exposes the same sanitized URL as successful copying, in a
  focused selectable field. Its Close control restores focus to Share. A real
  denied-clipboard check confirmed that `saved=1` was omitted from the fallback.
- Directory actions and the 320px header/browse switches occupy fewer initial rows.
  At very narrow widths, layout selection remains available inside Filters.
- Guide contents have explicit plus/minus disclosure indicators. Entry-specific
  choice links appear once and use contextual labels; resources without matching
  guidance retain their independent source/review disclosure.
- Automated checks cover share URL normalization, nonduplicated/contextual choice
  links, first-party attribution, local/remote guide links, list semantics and
  generated navigation. Normal text palette tokens exceed 4.5:1 on configured
  surfaces (minimum calculated 5.48:1 light, 6.17:1 dark); this is not a formal audit.

Publication: `5f387aa` was pushed during the iteration at the user's request. Its
catalog and Pages workflows succeeded. Further validated corrections are pushed
periodically rather than withheld until the final ratings.

## Fourth completed assessment

Application: `4d505db`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Juniper](assessment-juniper.md) | 8.8 | 8.1 | 8.2 | 8.4 | 9.0 | 8.42 |
| [Kestrel](assessment-kestrel.md) | 8.8 | 8.3 | 8.7 | 8.1 | 8.8 | 8.48 |

This round did not meet the target. The remaining findings concerned explicit
language/maturity context, layout switching at 320px, responsive guide contents,
and horizontal comparison tables concealing qualifications on small screens.

## Following corrections

- The introduction names and links aardappel's Goose programming language and gives
  a visible early-ecosystem compatibility link.
- A visible layout toggle remains alongside Share even at 320px; presentation is
  no longer hidden inside Filters.
- Mobile reference links collapse behind their Start here disclosure. Desktop
  references remain available directly, with per-layout user expansion preferences.
- Guide contents responds to breakpoint changes while remembering deliberate user
  expansion/collapse separately for mobile and desktop.
- Comparison tables retain native headers and explicit roles, and show stacked
  labelled cells on mobile. Reasons and limits are visible without horizontal
  exploration. A regression test covers column-label and qualification preservation.

## Independent FMHY assessments

The user requested ratings of FMHY as an additional site. Two fresh contexts were
given only `https://fmhy.net/`, the same five general directory criteria and weights,
and independent report destinations. Neither brief mentioned Awesome Goose, prior
scores, an improvement target, or a comparison request. These assessments are not
part of the Awesome Goose stopping criterion and do not justify changing its scores.

- [North](assessment-fmhy-north.md): raw weighted score **7.075**, reported as **7.1/10**.
- [Oak](assessment-fmhy-oak.md): weighted score **7.0/10**.

Both reviewed live desktop/mobile behavior and recorded verification limits. Their
findings and scores are preserved as separate observations, not a joint ranking.
The user subsequently authorized up to three reviewers when useful; the following
Awesome Goose round uses three fresh reviewers with distinct primary emphases.

## Fifth completed assessment

Application: `1e4ad6e`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Pine](assessment-pine.md) | 8.5 | 8.0 | 9.0 | 8.5 | 9.0 | 8.53 |
| [Quartz](assessment-quartz.md) | 8.5 | 8.4 | 8.9 | 8.4 | 8.8 | 8.56 |
| [Reed](assessment-reed.md) | 8.5 | 8.0 | 8.5 | 8.0 | 9.0 | 8.30 |

This round did not meet the threshold. The principal remaining friction was mobile
filter-to-results travel and navigation within long reading guides. Other findings
included introductory cards, ambiguous category counts, clipped search guidance,
unlinked recommendations, and one dangling sentence after choice-link extraction.

## Following corrections

- Expanded mobile filters include a current-count Show resources action. It closes
  the controls, focuses the result group's heading, and scrolls directly to results.
  A 320×568 check placed the first matching resource about 126px below the top.
- Start here remains a compact disclosure in both layouts. Full reference entries
  remain available through the explicit details action and selected category.
- Category counts now account for search, maintainer and saved filters, excluding
  only the current category selection. The sidebar identifies matching counts.
- Search has a short placeholder and a visible, programmatically associated fields
  hint. The clipped example/control row is replaced with the concise help/results row.
- Mobile guides have a compact persistent Directory/Contents bar. Every return link
  preserves filters, and the contents include third-level comparison topics.
- The recommendation table links directly to its recommended repositories or the
  inspected client source. Source evidence and existing qualifications are retained.
- The extracted crypto warning remains a complete sentence. Structured automated
  checks cover this, facet counts, guide navigation, and source-link preservation.
- Built CSS/JS/modules use content fingerprints so deployments do not mix new entry
  scripts with stale imported modules or styles. Generated asset hashes/imports are
  validated automatically. No external runtime dependency was added.

Structured platform/dependency facets remain a possible future enhancement; current
entries and choice notes state their specific evidence-backed requirements in prose.
They were not inferred or generalized into unsupported compatibility promises.
