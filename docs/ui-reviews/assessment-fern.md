# Directory UI assessment — Fern

Revision: `2146042` (confirmed from the current checkout). Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. This is an independent, bounded review of the current source and local site; no other assessment or git history was consulted. Scores are subjective judgments.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Strong title, search, results, group, and card hierarchy. Restrained colors, readable descriptions, consistent borders and spacing. Some metadata consumes more space than its decision value warrants. |
| Discovery and information architecture | 25% | 8.0 | Useful task categories, counts, search examples, maintainer filtering, and real distinctions between alternatives. Identical package names need stronger visible attribution, and mobile browsing has substantial vertical distance. |
| Interaction and feedback | 20% | 8.0 | Verified combined filters, active chips, counts, reset, keyboard search shortcuts, URL state, and copy feedback. Saved empty messaging is precise. End-to-end save/unsave and clipboard contents were not successfully verified. |
| Responsive layout and accessibility | 25% | 8.0 | Desktop sidebar becomes mobile tabs and a category select; advanced filters collapse. Labels, semantic headings, pressed states, live status, and explicit focus styling are present. Mobile directory showed no horizontal overflow. Some secondary links remain small targets. |
| Content trust and consistency | 10% | 9.0 | Maintainers, licenses, source-review disclosures, immutable source links, dates, and explicit limitations make the directory unusually useful for informed choices. The guide clearly distinguishes inspection from audits and benchmarks. |

**Weighted overall: 8.20 / 10** (`8.5×.20 + 8×.25 + 8×.20 + 8×.25 + 9×.10`).

## Evidence and coverage

- Desktop: **1440 × 900 CSS pixels**, confirmed with `innerWidth`/`innerHeight` after resize and snapshot. The screenshot service sometimes returned a scaled 1280 × 800 image; layout measurements confirmed the requested CSS viewport. The default directory rendered 56 resources in two columns with a separately scrolling category sidebar.
- Mobile: **390 × 844 CSS pixels**, likewise confirmed after resize and snapshot. The content width was 375 pixels with the browser scrollbar; document scroll width was 375, so no page-level horizontal overflow was observed. Search, result count, category selection, collapsed More filters, and the first card were visually inspected.
- Desktop search `sqlite` + category `Databases` + maintainer `carabistouflette` produced one result, three removable active-filter chips, and URL `?q=sqlite&category=Databases&owner=carabistouflette`. Changing maintainer to `aardappel` produced the explicit no-match state. Its reset restored 56 cards and cleared URL parameters.
- Copy filters link displayed **“Filters link copied.”** for the combined view. URL reconstruction also restored state on navigation. The clipboard payload itself was not read, and browser Back/Forward was not exercised. Source inspection confirms that sharing removes `saved` and the fragment.
- `/` focused search; entering `sqlite` then pressing Escape cleared the query, retained search focus, restored 56 cards, and cleared the search URL. Tab moved from a category button to the next category; another Tab from a newly navigated page reached the visible skip link. The screenshot showed a clear search focus boundary. This was a representative keyboard check, not an exhaustive keyboard or screen-reader audit.
- Mobile category selection worked. Searching `sqlite` displayed two separately attributed `goose-sqlite` alternatives. An existing device-local saved item was preserved. Loading `?saved=1&q=nonexistent-ferntest` produced **“Saved resources (0 of 1)”**, **“No saved resources match these filters”**, a collection count, and **“Clear filters in saved.”** Save/unsave was attempted, but click automation did not complete reliably; the saved collection was unchanged. The zero-saved collection state was inspected in source, not rendered.
- Reading guide: `CHOICES.html#sqlite` loaded on mobile, scrolled to the SQLite section, and retained the previous directory query in **Back to directory**. DOM measurements showed no page-level overflow. The guide text and source styles were inspected, including its review date, scope disclaimer, comparisons, and source attribution. Two guide screenshot attempts timed out, so its visual reading comfort and rendered table behavior are not confirmed.
- Source inspected: `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, and `docs/CHOICES.md`. Semantic labels, native controls, focus-visible styling, saved persistence handling, and theme styles were checked in source. Theme switching, dark-mode rendering, storage-denial handling, external repository accuracy, and assistive technology behavior were not tested end to end.

Browser automation intermittently timed out on clicks and snapshots and briefly lost its host connection. Successful retries and DOM checks were used where available. Those tool failures are **not reported as application defects**. No application code was changed.

## Findings, ranked by severity

### 1. Medium — Mobile browsing spends substantial space before exposing alternatives

**Observed:** At 390 × 844, the first resource card begins about 538 CSS pixels down the page and is about 248 pixels tall. The five-item Start here group occupies roughly 1,328 pixels. A developer browsing beyond introductory resources must cross several screens before reaching the library categories. The desktop layout also allocates a full-width, tall row to maintainer and sort controls before any cards.

**Impact:** Search is prominent and effective, but exploratory comparison is slower than the 56-item catalog size suggests. Cards show only a small number of alternatives per screen, especially on mobile.

**Recommendation:** Offer a compact resource-list view or reduce nonessential card chrome and metadata spacing while retaining readable descriptions and 44-pixel controls. Consider a compact Start here block with links, so the library groups become visible sooner. Keep the current expanded cards available for deeper evaluation.

### 2. Low — Identical package titles weaken at-a-glance comparison

**Observed:** The SQLite results contain two links titled `goose-sqlite`; maintainer attribution appears separately in smaller, muted text. The descriptions distinguish system SQLite/Linux validation from bundled SQLite and transaction behavior, but the primary link names do not identify whose project is being opened.

**Impact:** Users comparing alternatives have to reconnect title, owner, and description each time, and a list of links offers ambiguous repeated names.

**Recommendation:** Use a visible `owner / package` treatment for collisions, or integrate an owner badge beside the title. Give resource links a full owner/package accessible name while keeping the package name visually prominent.

### 3. Low — Secondary decision links have smaller touch areas than neighboring controls

**Observed:** The rendered SQLite card's Choice notes link was approximately 19 CSS pixels high; card titles were about 20 pixels high. Source CSS gives hearts, filter controls, and source disclosures 44-pixel targets but does not give these card links equivalent target padding.

**Impact:** The links that open a resource or explain its tradeoffs require more precise taps than the save action. This is a touch-usability concern; no WCAG conformance failure is asserted from this measurement alone.

**Recommendation:** Increase the clickable padding or minimum block height of card title and Choice notes links, preserving separation from the heart and source disclosure.

### 4. Low — Mobile category selection loses the counts available on desktop

**Observed:** Desktop category buttons display resource totals; the mobile native select contains names alone. The selection can also truncate long category names in the closed control because it shares a row with More filters.

**Impact:** Mobile users cannot estimate category breadth before selecting it and may need to reopen the select to confirm a long label. The active filter chip mitigates confirmation after selection.

**Recommendation:** Include totals in option labels, and let the category select span the row when a long category is selected or at narrow widths. Preserve the native select and its visible label.

No critical or high-severity defect was established in the representative flows that completed successfully.
