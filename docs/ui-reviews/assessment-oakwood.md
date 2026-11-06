# Awesome Goose directory assessment — Oakwood

Reviewed 2026-11-06, independently against `docs/ui-reviews/CRITERIA.md`. Revision: `f1fa6081da3e4da979664c46d89dc81f969717d9` (`f1fa608`). Frozen application: `http://localhost:18883/`. No other assessment, review history or peer findings were consulted. Scores are subjective judgments of the rendered developer directory and its reading material.

## Assessment and scores

This is a strong, usable developer resource directory. It makes its language scope explicit, keeps package owners visible, offers useful one-sentence limitations, and makes source provenance unusually easy to inspect. The main interactions completed successfully. Remaining issues concern search interpretation and small-screen reading efficiency rather than broken primary flows.

| Criterion | Weight | Score / 10 | Weighted contribution | Reason |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.800 | Restrained light/dark palettes, strong resource titles, readable descriptions and clear separators. Dense desktop rows become readable vertical entries at smaller widths. Some repeated controls and mobile table labels add visual work. |
| Discovery and information architecture | 25% | 8.7 | 2.175 | Fourteen categories, contextual category counts, search and maintainer filtering work together. Owners distinguish same-name packages; links lead directly to relevant comparisons. Dependency/platform discovery still relies on uneven prose and substring matching. |
| Interaction and feedback | 20% | 9.3 | 1.860 | Accurate matching counts, removable chips, URL state, sort/layout active states, saved persistence and tailored empty recovery all worked. Copy success and a denied-clipboard fallback both gave useful feedback. Mobile filter entry points could be clearer. |
| Responsive layout and accessibility | 25% | 8.9 | 2.225 | Verified desktop, intermediate and narrow layouts without document overflow. Keyboard skip links, search shortcuts, result focus, native selects and final-item unsave focus worked. Narrow guide tables remain readable but require much more vertical scanning. Screen-reader and physical-device behavior were not verified. |
| Content trust and consistency | 10% | 9.6 | 0.960 | Review dates, immutable source links, licenses, baseline differences and limits of the review are explicit. The TOML guide distinguishes ownership and writing capabilities without invented benchmark claims. External source accuracy was sampled through link structure and local evidence, not independently re-audited. |
| **Overall** | **100%** | **9.02** | **9.020** | **9.0×0.20 + 8.7×0.25 + 9.3×0.20 + 8.9×0.25 + 9.6×0.10 = 9.020 / 10.** |

## Rendered coverage and representative flows

The principal viewports were **1440×1000**, **900×1100**, **360×800** and an additional **320×740** narrow check. Each size was applied and checked through actual `innerWidth`/`innerHeight`; these are CSS viewport dimensions, not assumed device presets. Document `scrollWidth` was respectively 1425, 885, 345 and 305 pixels with Chromium's scrollbar present, so none showed document-level horizontal overflow. An incidental fallback reconnect also rendered at 780×437; it was not used as the principal desktop or tablet evidence.

- **Initial discovery:** inspected the desktop list, category rail, official compiler/docs/stdlib shortcuts, ownership/license presentation and lower directory groups. At 900 pixels the category rail remained available and package information stacked comfortably. At 360 and 320 pixels the category select replaced the rail; collection, list/cards and share controls remained usable.
- **Combined discovery:** `toml` returned four resources. Combining Data & text and maintainer `carabistouflette` returned the two TOML packages, excluding the configuration package in another category and the other maintainer's reader. Category counts changed with the query/maintainer context. Also checked `http`, `libcurl`, `native` and a deliberately unmatched query.
- **Sorting/layouts/navigation:** exercised Category, Name A–Z and Maintainer sorts, list and cards layouts, reload restoration, a browser Back transition and URL query updates. HTTP cards kept the client, server and framework descriptions distinct. The mobile category/maintainer combination for Macho0x produced three data resources; Show 3 closed advanced filters and focused the resource group about 12 pixels below the 102-pixel sticky toolbar.
- **Saved and empty recovery:** opened the initially empty Saved collection; Browse all resources returned to the directory. Saved a package, reloaded and retained it. A conflicting query produced “No saved resources match these filters” with the saved count and a recovery action that retained Saved scope. Removing the final item moved focus to the Saved collection button and showed “Nothing saved yet.” An ordinary zero-result query recovered to all 56 resources through Clear filters.
- **Sharing:** a successful copy from Saved produced the explanatory device-local message. With clipboard permissions granted, reading the actual clipboard returned `http://localhost:18883/?q=http&view=cards`, preserving filters/layout and omitting `saved`. Separately simulated a rejected `clipboard.writeText` in the review browser: the fallback exposed the complete readonly URL, selected all 64 characters, focused the field and explained manual copying. Close restored focus to Share. This denial was injected test state, not an application failure.
- **Keyboard/focus:** Tab exposed the first skip link with a visible three-pixel outline. The second skip link focused Search. `/` and Ctrl+K focused Search; Escape cleared the query. Activating the matching-results link focused the resource-group heading with an outline; the next Tab reached the first resource link. A native maintainer select operated with ArrowDown/Enter and retained focus. No exhaustive assistive-technology audit was performed.
- **Theme and long content:** switched light/dark, inspected both rendered palettes, and verified the dark preference after reload. A long unbroken query wrapped inside its removable chip at 360 pixels without expanding the page. At 320 pixels the search placeholder truncated, but the field retained its accessible label and remained usable.
- **Reading guide:** followed Compare TOML from a resource into `CHOICES.html#toml`. Viewed the side-by-side desktop table and stacked mobile version. Mobile Contents opened and focused the contents summary; selecting Cryptography landed its heading at approximately y=64 beneath the sticky reading navigation and updated the current-section marker. Directory returned to the previous TOML/category/maintainer/sort state.
- **Evidence:** expanded the Macho0x TOML source disclosure and inspected its exact README snapshot link (`589f168…`). The HTTP client disclosure explicitly showed directory snapshot `0fa7d19` and separate comparison baseline `6dc7a98`, including the warning that they differ. Opened Source evidence from the guide and inspected its rendered owner-grouped index, date/license fields and snapshot/baseline columns.

## Ranked observed issues

### 1. Dependency-oriented searches have ambiguous coverage — medium

**Observed:** searching `native` returned Packages, goose-compress, goose-json, goose-hash and robtandy/goose.go, while the libcurl-backed carabistouflette/goose-http appeared only after searching `libcurl`. The goose.go description begins “Alternative compiler backend…” and describes operation without cgo. There is no structured native-dependency or platform filter explaining these differences.

**Impact:** a developer trying to avoid native prerequisites cannot treat a natural dependency query as a complete or clean shortlist. They must know implementation-library names and inspect individual descriptions. This is a discovery limitation; the directory does not claim a dependency filter exists.

**Source support:** [`site/catalog.mjs:17–30`](https://github.com/carabistouflette/awesome-goose/blob/f1fa6081da3e4da979664c46d89dc81f969717d9/site/catalog.mjs) normalizes selected words and uses substring inclusion over prose, category and labels. `Alternative` contains `native`; there is no dependency metadata in this search predicate. [`site/index.html`](https://github.com/carabistouflette/awesome-goose/blob/f1fa6081da3e4da979664c46d89dc81f969717d9/site/index.html) exposes category, maintainer and sort controls.

**Recommendation:** add consistent searchable dependency/platform tags, for example pure Goose, native helper, libcurl and system library; optionally offer a dependency filter. Use token-aware matching or explain/highlight the matched field so incidental substrings are easier to interpret.

### 2. Mobile active-filter state presents two similarly named entry points — low

**Observed:** at 360 pixels with an active search, the sticky matching-results row offered “Filters · 1” while the category row immediately below also offered “Filters +”. In the expanded state the former became “Show N ↓” and the latter remained “Filters −”. Both control the same advanced disclosure; the category select is outside that disclosure.

**Impact:** the repeated label makes the distinction between editing the whole filter context and opening maintainer/sort options less obvious. The sticky shortcut is useful when scrolled, but initially the same area has two nearly synonymous controls.

**Source support:** [`site/app.js`](https://github.com/carabistouflette/awesome-goose/blob/f1fa6081da3e4da979664c46d89dc81f969717d9/site/app.js) implements `closeAndShowResults`, the toolbar button and `updateFilterControls`; [`site/style.css:377–383`](https://github.com/carabistouflette/awesome-goose/blob/f1fa6081da3e4da979664c46d89dc81f969717d9/site/style.css) reveals the toolbar control when mobile context is active.

**Recommendation:** retain the scrolled shortcut but clarify the inline disclosure label, for example “Maintainer & sort”, or hide the redundant inline trigger when its equivalent toolbar control is visibly adjacent. Preserve the successful Show-results action and focus placement.

### 3. Stacked guide tables trade too much comparison density for repeated labels — low

**Observed:** at 360 pixels the TOML table repeated Need, Option and Qualification for every package. Its three alternatives occupied most of a viewport before the explanatory prose. At 1440 pixels the same alternatives fit in approximately 190 pixels and could be compared together.

**Impact:** mobile content remains readable and does not overflow, but comparing two alternatives requires remembering the previous record and scrolling. The longer source-evidence index compounds the vertical cost.

**Source support:** [`site/style.css:270–278`](https://github.com/carabistouflette/awesome-goose/blob/f1fa6081da3e4da979664c46d89dc81f969717d9/site/style.css) converts every table cell into a block and repeats its `data-label` above it below 1000 pixels.

**Recommendation:** use a compact comparison-card treatment for short choice tables: lead with the package name, then combine need and qualification into a concise block. Keep explicit field labels in the evidence index where they materially help attribution, with tighter spacing. Preserve real table semantics or equivalent accessible relationships.

No high-severity issue or failed primary user workflow was observed in this sample.

## Evidence, tooling and verification limits

The browser procedure began with preview tool discovery and `preview_status`, then created a new owned background tab using `reuseExistingTab:false`. Preview resizing to 1440×1000 was confirmed using page evaluation. Two successive screenshot/snapshot attempts failed with the exact same tool error: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** This was a preview automation failure, not evidence that the application hung.

After the two failures, the owned preview tab was closed and review continued in an isolated `/usr/bin/chromium` instance using `/tmp/moss-ui/node_modules/playwright-core`, its own user-data directory and debugging port 19883. A fallback script initially tried to click the deliberately hidden initial `#toolbar-apply`, yielding **“locator.click: Timeout 30000ms exceeded”** and **“element is not visible”**. The script was corrected to activate the visible inline Filters disclosure; the flow then succeeded. That locator mistake is not counted as an application defect. No shared tab or shared server was closed.

Rendered screenshots were inspected directly, including `/tmp/oakwood-desktop.png`, `/tmp/oakwood-tablet.png`, `/tmp/oakwood-mobile.png`, `/tmp/oakwood-mobile320.png`, `/tmp/oakwood-mobile-filters.png`, `/tmp/oakwood-mobile-results.png`, `/tmp/oakwood-guide-desktop.png`, `/tmp/oakwood-guide-mobile.png`, `/tmp/oakwood-guide-toc-mobile.png`, `/tmp/oakwood-sources-desktop.png`, `/tmp/oakwood-desktop-evidence.png`, `/tmp/oakwood-desktop-dark1440.png` and `/tmp/oakwood-long-query.png`. These are temporary review artifacts, not committed report assets.

Supporting source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, `scripts/build-site.py` and the relevant `docs/CHOICES.md` text. The report is based principally on rendered interaction, not source inspection alone. Only this report file was written in the repository.

Limits: Chromium only; CSS viewport resizing rather than physical touch devices, mobile user agents or a software keyboard. No screen reader, Safari/Firefox, forced-colors mode, exhaustive contrast measurement, reduced-motion audit or storage-denial test. Not every external repository or source link was fetched, and upstream package correctness, benchmarks and security were not independently validated. The initial origin was fresh; saved/theme state subsequently belonged to this isolated review browser. Other guide pages and every resource-specific disclosure were not exhaustively reviewed.

Owner archive note (Astro migration): source links above now resolve to the reviewed
commit because the implementation moved to `src/`. Findings and scores are unchanged.
