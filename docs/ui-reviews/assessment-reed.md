# UI assessment — Reed

Reviewed revision **1e4ad6e** on 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. These scores are subjective judgments of the rendered directory as a developer discovery tool.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Restrained color, clear headings, readable descriptions, and useful separation between identity and purpose. Small license/evidence text is secondary without overwhelming the entries. Both themes remain legible. |
| Discovery and information architecture | 25% | 8.0 | Categories, maintainer filtering, name disambiguation, and workload-specific choice notes make alternatives understandable. The comparison guide's initial recommendations do not link to their recommended packages. |
| Interaction and feedback | 20% | 8.5 | Combined filters, removable chips, URL state, save feedback, distinct empty states, and recovery work. Guide return links restore directory filters. The 320px layout's single layout-switch button has a descriptive accessible name. |
| Responsive layout and accessibility | 25% | 8.0 | Tested widths fit without page-level horizontal overflow. Native controls, substantial touch targets, explicit labels, visible keyboard focus, working skip navigation, and mobile table labels are strengths. Long-guide navigation becomes burdensome on phones. |
| Content trust and consistency | 10% | 9.0 | Review dates, immutable source snapshots, affiliation disclosure, and explicit limits distinguish inspected evidence from certification or reproduced testing. Same-name packages have clear ownership and scope. |

**Weighted overall: 8.30 / 10.** Calculation: `8.5×0.20 + 8.0×0.25 + 8.5×0.20 + 8.0×0.25 + 9.0×0.10`.

## Tested viewports and flows

Used only the isolated `http://localhost:18873` origin and my own preview tab. Verified `window.innerWidth` after resizing; the resize tool's immediate viewport result sometimes remained stale.

- **1440×900 desktop:** default list, category sidebar, SQLite search, combined maintainer filtering, cards, saved resources, source disclosure, share feedback, keyboard focus, skip navigation, and comparison-guide table layout. Initially opened at 1280×800, then performed the desktop review at verified 1440×900.
- **390×844:** filtered SQLite cards, category selection, active-filter chips, saved collection, last-item removal, empty-directory recovery, no-match search, theme switching, and choice-guide layout. Search results distinguish system SQLite/Linux validation from the bundled alternative.
- **320×740:** dark theme, both list and card layouts, expanded maintainer/sort filters, long “Ethereum and signing” category, source evidence, anchored Ethereum choice notes, and comparison tables. Repository names and technical prose wrap. The compact list/cards switch remains available.
- **Guides:** read the rendered `CHOICES.html#ethereum`, inspected the SQLite choice flow at desktop and 390px, and inspected `COMPARISONS.html` at desktop, 390px and 320px. Tables become labeled vertical blocks on phones; desktop tables fit their container. The comparison page measured approximately 33,859px tall at 320px and 28,464px at 390px.
- **State and feedback:** saved a SQLite entry, observed the persistence toast/count, entered Saved, shared filters, and removed the last saved item. Focus moved to Saved after removal. Separately verified “No saved resources match these filters” with one stored item; its recovery kept Saved active and focused the results heading. Returning from the SQLite guide restored the saved view. Filter URLs reconstructed the expected view on navigation. Share reported that device-local saved items are excluded; source confirms removal of `saved` and fragments.
- **Keyboard:** native Chromium Tab revealed the skip link with a 3px outline; Enter focused `#directory` below the header; `/` focused search with a visible enclosing ring; Escape cleared search while retaining focus. Inspected accessible names, pressed states, status announcements, native select labels, table header roles and mobile cell labels in source/rendered structure.

Source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/theme.js`, `site/style.css`, the guide generator, and the choice/curation/comparison content. No application code was changed, and no other UI assessment or git history was read.

## Severity-ranked findings

### 1. Medium — Mobile guide navigation is too remote during long reading

**Observed:** At phone widths, guide headers and contents are in normal document flow. Contents collapse by default and exist only near the beginning; the return link is also in the header, with another directory link at the end. The 320px comparison guide spans roughly 46 viewport heights. Its contents list only broad second-level sections, so “API-level overlaps” does not directly expose the HTTP, JSON or TOML subsections.

**Impact:** A reader comparing alternatives midway through the evidence must perform substantial scrolling to change topics or return to the filtered directory. The otherwise readable stacked tables increase this travel distance.

**Recommendation:** Provide an unobtrusive persistent mobile Contents/Back control, or repeat these controls at major section boundaries. Include the third-level API comparisons in an expandable contents list. Keep the existing filter-preserving return destination and ensure the navigation does not cover focused content.

### 2. Medium — The comparison guide's recommendation table offers no direct destinations

**Observed:** The first “Findings and listing recommendations” table contains zero links. Names such as `carabistouflette/goose-http`, `Macho0x/goose-crypto`, and `kaitk/goose-http` are plain text despite the column being labeled “Recommended discovery entry.” Working pinned links appear farther down in inventory/evidence sections.

**Impact:** The most decision-oriented part of the guide cannot take the developer to the selected package or its supporting comparison. On a phone, finding the corresponding evidence requires more scrolling or returning to search.

**Recommendation:** Link each recommended package to its directory result or repository, and add a short section anchor for the relevant detailed comparison. Preserve fork/upstream distinctions and the existing qualifications.

### 3. Low — Mobile search loses its visible explanation of searchable fields

**Observed:** At 320px the placeholder is clipped after “Search names, descrip…”. The persistent input label is visually hidden; maintainer matching is consequently less obvious to sighted mobile readers. This is a discoverability issue, not a missing accessible name.

**Impact:** Developers may assume only package names are searchable and miss the useful maintainer/description search behavior.

**Recommendation:** Use a short placeholder such as “Search resources…” with a concise visible hint naming the supported fields, or supply that hint when the field receives focus. Keep the existing programmatic label.

## Verification limits and tooling

The preview browser initially supported rendered inspection and clicks, then stopped reliably executing keyboard/click actions. Two attempts at the same `#all-resources` step returned:

> Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "#all-resources" still matches an element after the timeout.

> Preview automation click timed out after 3000ms. The click may have happened; check the page before retrying. "#all-resources" still matches an element after the timeout.

After those bounded failures, used the installed Chromium in a fresh temporary profile for native keyboard, desktop category, filtered-saved recovery and guide-return checks. Those checks passed; the preview failures are not counted as application defects. Terminated that Chromium subprocess and removed its temporary profile. Closed my own preview tab; no shared server was stopped.

This was a representative review, not exhaustive browser or assistive-technology certification. No physical touch device, Safari/Firefox, screen reader, browser zoom, storage-denied mode or clipboard-denied fallback was exercised. Clipboard success feedback was observed; clipboard contents were not independently read. Source markup supports accessibility findings, but actual screen-reader announcement order and mobile table navigation remain unverified. External repository claims, source pins and performance/security assertions were not independently re-audited or rerun. No high-severity defect was found in the exercised flows.
