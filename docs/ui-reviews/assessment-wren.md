# Awesome Goose UI assessment — Wren

Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. Revision: `f9068103bf4d760405f1077d5b72eedf1a8b95b4` (`f906810`). Rendered target: the frozen build at `http://localhost:18891/`. This is an independent, subjective assessment of the directory as a developer resource; no other assessment reports were read and no application files were changed.

The directory is useful and unusually explicit about fit and limitations. The list makes similarly named libraries distinguishable by maintainer, purpose, dependencies, and qualifications. Search, combined filters, saving, and guide navigation worked in the completed checks. One reproducible narrow-screen overflow needs correction; the other findings are smaller improvements to discoverability and evidence lookup.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Reason |
| --- | --- | --- | --- | --- |
| Visual clarity and typography | 20% | 9.0 | 1.80 | Calm palette, strong grouping, readable descriptions, and restrained metadata. Both themes remain legible. Desktop list rows and mobile entries have clear hierarchy. |
| Discovery and information architecture | 25% | 9.0 | 2.25 | Search matches topics and maintainers; category counts, explicit alternatives, and task-oriented choice notes help a developer choose. The smallest viewport hides advanced filters behind an ambiguous symbol, and the evidence index is laborious to scan on mobile. |
| Interaction and feedback | 20% | 9.0 | 1.80 | Combinations, counts, removable filters, reset, saved-state recovery, URL restoration, sharing, and feedback worked. The local-only nature of saved items is clearly explained. |
| Responsive layout and accessibility | 25% | 8.0 | 2.00 | Good reflow, labeled native selects, pressed states, skip links, focus outlines, keyboard shortcuts, and deliberate focus movement. Long search text breaks the compact results summary at 320px. |
| Content trust and consistency | 10% | 9.5 | 0.95 | Clear scope, date, attribution, immutable README links, separate comparison baselines, and candid review limits. Directory descriptions and the sampled choice guide agree. |
| **Overall** | **100%** | **8.80** | **8.80** | **88.0 / 100** |

Exact calculation: `9.0 × 0.20 + 9.0 × 0.25 + 9.0 × 0.20 + 8.0 × 0.25 + 9.5 × 0.10 = 8.80 / 10`.

## Rendered coverage and interactions

Actual `window.innerWidth`/`innerHeight` were checked after resizing, rather than relying on the requested viewport setting alone.

| Viewport | Rendered views inspected |
| --- | --- |
| 1440 × 1000 desktop | Default directory list, SQLite cards, expanded requirement filters and source evidence, Choice notes overview/table/outline. |
| 834 × 1112 intermediate/tablet | Default list and filtered card, expanded requirements, Choice notes HTTP table and prose. |
| 390 × 844 mobile | Default list, combined HTTP filters, options open/closed, current-filter panel, search editing, dark theme. |
| 320 × 740 narrow mobile | Default list, advanced-filter symbol, long-query empty state and filter panel, Choice notes SQLite and review-method sections, Source evidence owner section. |

Completed flows:

- **Discovery and combinations:** `toml` returned four entries, including the relevant configuration package. Adding maintainer `Macho0x` and category `Data formats and text` left one reader, with its lack of a writer visible. On mobile, `http` + `Networking and web` + `kaitk` returned two entries. `sqlite` + native implementation note + Linux platform note left the system-SQLite package. Search `map` returned two entries and explicitly marked the JSON library's map limitation instead of implying support.
- **Sorting and layouts:** changed between List and Cards, selected Name A–Z and Maintainer, observed matching URL parameters and grouping, and loaded a shared cards/name-sort URL successfully. Two SQLite alternatives remained easy to compare on desktop; intermediate and mobile views used a single column.
- **Empty and saved recovery:** an initially empty collection explained how to save and offered Browse all resources. Saved a SQLite entry, reloaded to verify persistence, applied a nonmatching search, and used Clear filters in saved to recover the collection. Removing its last saved item showed Nothing saved yet and moved focus to the Saved control. The ordinary zero-results state also offered a working reset.
- **Sharing and history:** clipboard copying worked in isolated Chromium. A query plus native/Linux notes, name sort, and cards layout round-tripped through the copied URL. Sharing from Saved removed `saved=1` and retained the search; the toast explained that the collection was local. Browser Back/Forward restored the selected category and URL.
- **Mobile filter controls:** Show results closed options and focused the result-group heading; the current-filter panel showed the full query, category, maintainer, collection, and sort. Escape closed it, and Edit filters returned focus to search. Long-query text remained readable inside that panel even when the summary row overflowed.
- **Keyboard and theme:** first Tab exposed Skip to resources with a visible 3px outline; Enter focused `#directory`. `/` focused search, and Escape cleared its text. Labeled selects, named save buttons, and pressed states were present in the rendered controls. The theme button changed the palette and its accessible label, and the choice survived reload.
- **Guide navigation and evidence:** followed Compare SQLite options from an entry to `CHOICES.html#sqlite`. At 320px, the heading landed about 64px below the viewport top, clear of the sticky navigation; option tables became readable blocks labeled Use for and Note. Contents opened the outline and focused its summary. A section link reached Evidence and review method and updated `aria-current`. Returning to the directory restored `?q=sqlite`. Opened the directory's Source & review disclosure and the rendered Source evidence index; review dates, licenses, pinned README URLs, and distinct comparison-baseline fields were present.

## Ranked observed issues

### 1. Long queries make the compact results summary overflow at 320px

**Severity: Medium.** With options closed, type `goose sqlite bounded linux dependencies search long question`. With the Databases category also selected, `innerWidth` was 320 while `document.documentElement.scrollWidth` was 343; the `.results-title` right edge was approximately 342.7px. Without the category, the same query produced 336px of document width. Opening the current-filter panel did not remove the overflow. The shorter query `toml` and the same long query at 390px stayed within their viewports.

**Impact:** the sticky summary extends past the narrow screen, introduces horizontal panning, and can shift the surrounding content when the browser brings its controls into view. Query truncation exists but does not keep the complete flex row inside the viewport.

**Recommendation:** constrain the results row to the available inline size, give its flexible summary a real shrink budget after the result count, padding, and gap, and allow a second line where necessary. Keep the full query in the existing panel. Verify both one and multiple active filters at 320px with long queries; do not merely hide page overflow.

**Source support:** `site/style.css:436` fixes the heading's flex size; `site/style.css:475` limits the scope control to 72%, while `site/style.css:479` truncates only its query child. `site/app.js:273` constructs the combined query preview and filter count. The observed result concerns the complete row's sizing, not a proven single-property root cause.

### 2. Advanced filters lose their visible label on the smallest viewport

**Severity: Low.** At 320px on the unfiltered directory, the control beside Category displays only `⋯`. Its underlying text is Options and its accessible name describes maintainer, sort, and requirement notes, but the rendered font size is 0px and the symbol supplies the visible content. At 390px, Options is spelled out.

**Impact:** a sighted newcomer on a narrow phone must infer that an overflow symbol contains maintainer filtering, sorting, and dependency/platform notes. These are useful developer decisions, and their availability is clearer one breakpoint above.

**Recommendation:** retain a short visible label such as Filters or Options; wrapping it below Category is preferable to making its purpose implicit. Preserve the current accessible name and 44px target.

**Source support:** `site/style.css:493`–`501` changes the collapsed summary to an ellipsis; the control's rendered box measured 44 × 44px. `site/index.html:40` contains the disclosure.

### 3. The mobile source index is costly to scan for a known repository

**Severity: Low.** At 320px in `SOURCES.html#carabistouflette`, the four-column evidence rows become tall blocks with repeated field labels. Roughly two entries fit in a 740px viewport; the outline navigates to an owner, rather than a repository. The large owner section therefore requires substantial scrolling to inspect a known library's directory/comparison snapshots.

**Impact:** the evidence is readable and complete, but locating one item in the standalone index is slower than its small amount of distinguishing information warrants. This is a lookup/density issue, not missing attribution.

**Recommendation:** add a lightweight repository search or repository-level anchors, or use a compact disclosure per repository that keeps its name, date, and snapshot visible while expanding secondary metadata. Retain all baseline labels and the distinction between inspection and recommendation.

**Source support:** `scripts/build-site.py:151` generates an owner-level section and repeated four-field table rows; `scripts/build-site.py:243` builds the outline from document headings. The mobile rendering was directly inspected and had no horizontal overflow.

## Supporting strengths and source checks

- `site/app.js:70` handles saved-state persistence and updates accessible labels/pressed state; its empty-state branches distinguish an empty collection from a filtered collection. The rendered recovery flows matched those branches.
- `site/catalog.mjs` combines category, owner, saved, implementation, platform, and search criteria. Its `shareUrl` removes saved scope; the copied URL verified that behavior. Requirement controls explicitly say that missing notes are unknown and that a Goose core is not a promise of native-free execution (`site/index.html:44`).
- `site/app.js:100` builds source disclosures with the review date, source pin, curation policy, and a separate comparison pin when applicable. Source evidence showed full immutable GitHub README URLs, not floating branch references.
- `docs/CHOICES.md` states that recommendations use documentation and selected source inspection, with no independent benchmark or security audit. Its SQLite guidance agrees with the directory's system-versus-bundled distinction. The guide also distinguishes directory pins from comparison baselines rather than implying that every claim was revalidated at the newest pin.
- `site/theme.js:20` manages responsive contents navigation and `site/theme.js:33` tracks the active section. The rendered Contents and return-to-directory flows behaved accordingly.

## Tool failures and verification limits

Preview tools were discovered first; `preview_status` ran before opening a new background tab with `reuseExistingTab:false`. Only the returned tab ID was used. The resize setting initially changed before the DOM viewport did; a subsequent evaluation confirmed 1440 × 1000 before continuing.

The preview automation then failed on native disclosures/selections. Exact error text included:

> Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "#requirement-options > summary" still matches an element after the timeout.

> Preview automation select timed out after 15000ms.

The select timeout occurred twice, and a subsequent Source & review click also timed out with the same click-error form and its source-summary selector. After the second failure in this requirement-filter step, I switched to the supplied isolated fallback: `/usr/bin/chromium` with `/tmp/moss-ui/node_modules/playwright-core`. The requirement disclosure, both selects, and source disclosure worked there. These timeouts are recorded as preview-tool failures, not scored as application defects. The preview tab and isolated browser were closed; the shared build server was left running.

This was a Chromium review with CSS viewport resizing, not testing on physical touch devices or multiple browser engines. Keyboard operation and selected semantics/focus states were checked, but no screen reader, complete accessibility audit, automated contrast audit, browser zoom matrix, storage-denied scenario, or clipboard-denied fallback was exercised. Immutable source destinations and review metadata were inspected; upstream repositories were not independently re-audited or benchmarked. The strongest claims here concern the rendered directory and the sampled guide/evidence flows, not the correctness or safety of the listed libraries.
