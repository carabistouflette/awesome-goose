# Independent UI assessment — Dogwood

Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. Revision: `63419ccc69461d10258e47f173abca9e847cf221` (`63419cc`). Frozen site: `http://localhost:18879/`. Ratings are subjective judgments of the rendered directory as a developer discovery tool.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.800 | Restrained light/dark palettes, clear headings, readable descriptions, and useful separation of identity, scope, and evidence. The intermediate-width list becomes cramped. |
| Discovery and information architecture | 25% | 9.0 | 2.250 | Categories, matching counts, attribution, concise limitations, and comparison links support selection. The compact official-resource row conceals useful standard-library scope until expanded. |
| Interaction and feedback | 20% | 9.5 | 1.900 | Combined filters, sorting, layouts, resets, saved states, URL restoration, sharing, and theme worked. Copy failure has a selected-link fallback with focus restoration. |
| Responsive layout and accessibility | 25% | 8.5 | 2.125 | Narrow layouts and guide tables reflow without page overflow; tested controls have usable labels, keyboard order, focus, and touch sizes. The 768px arrangement is less comfortable than the phone arrangement. |
| Content trust and consistency | 10% | 9.0 | 0.900 | The language is identified, maintainers/licenses are visible, snapshots are dated and pinned, and the guide states evidence limits. Sampled directory and guide recommendations agree. |
| **Overall** | **100%** | **8.975** | **8.975** | **89.75 / 100** |

Exact calculation: `9×0.20 + 9×0.25 + 9.5×0.20 + 8.5×0.25 + 9×0.10 = 8.975 / 10`.

## Viewports and method

Actual `window.innerWidth × innerHeight` was checked after resizing: **1440×900**, **768×900**, **390×844**, and **320×700** CSS pixels. This was desktop Chromium with resized CSS viewports, not physical mobile-device testing. Both light and dark appearances were visually inspected. My own tab/context used the dedicated origin, initially with fresh browser storage.

Preview tooling was discovered and `preview_status` called first. I opened a background tab with `reuseExistingTab:false`, used only its returned ID, resized it, and confirmed actual 1440×900 dimensions. Both image snapshots failed: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** I closed only that tab and used an isolated headless `/usr/bin/chromium` through installed `playwright-core`. Screenshots were viewed directly, with DOM geometry supporting observations. These snapshot failures are tooling failures, not application defects. My browser was closed after testing; shared servers were left running.

Only the criteria file and relevant application source (`site/app.js`, `site/catalog.mjs`, `site/index.html`, `site/style.css`) were read to support this review; no peer assessments or review history were consulted. Application code was not changed.

## Flows checked

- **Discovery:** browsed the 56-resource directory, category rail, Compiler/Docs/Stdlib/Packages/Samples shortcuts, Start here category, and list/card presentations. Maintainer names distinguish identically named projects.
- **Combined filtering and sorting:** selected Networking & web, searched `http`, selected `kaitk`, and sorted Name A–Z. Exactly `kaitk/goose-http` and `kaitk/plod` remained in that order. Reloading restored query, category, owner, sort, and results from the URL. Category counts reflected other active filters. Also filtered Data & text and sorted by Maintainer in card mode; the five carabistouflette entries grouped together. Category sorting was inspected in the initial state.
- **Empty states and reset:** tested an unmatched search in All, an initially empty Saved collection, and a saved item excluded by filters. Each explained the situation and supplied recovery. “Clear filters in saved” retained Saved and revealed the collection; removing its last item returned to “Nothing saved yet.” Full reset restored browsing.
- **Saving:** saved `kaitk/goose-http`, entered Saved, reloaded, confirmed persistence, and unsaved it. Subsequently saved a TOML entry for sharing. Hearts, counts, accessible labels, pressed states, and device-local explanations matched the state.
- **Sharing:** inspected actual clipboard contents and successful feedback. From `?q=toml&saved=1`, the copied URL was `?q=toml`, excluding the local collection. A browser clipboard permission denial produced a visible read-only URL field, selected the entire URL, focused it, and explained manual copying. Close returned focus to Share. The denial was induced through browser permissions to exercise the real fallback; it is not an app failure.
- **Phone filters:** at 390px, changed category, maintainer, sorting, and search. “Show 2 resources” closed Filters, scrolled to results, and focused the `Resources A–Z` heading. Sampled toolbar buttons at 320px measured at least 44×44px.
- **Keyboard:** first Tab exposed Skip to resources; Enter focused the directory. Skip to search worked. `/` and Ctrl+K focused search; Escape cleared the query. At phone width, Tab proceeded through result jump, All, Saved, List, Cards, Share, category, Filters, search-removal chip, reset, repository, Source & review, save, and footer. Closed advanced controls were skipped. Visible focus outlines were observed on search and the sharing field.
- **Theme:** the control changed appearance and its accessible action label. Dark selection persisted after reload and through guide navigation. Both themes remained legible in the sampled states.
- **Guide:** Compare HTTP options opened `CHOICES.html#http-and-web`, with the heading below the sticky phone navigation. Read the HTTP distinctions, evidence disclaimer, and TOML guidance; used Contents; navigated to TOML; inspected its desktop table and stacked labelled rows at 320px; returned through Directory. Previous query/category/maintainer/sort persisted. The guide and directory consistently distinguish HTTP client/server roles and TOML ownership/writing capabilities.
- **Evidence:** expanded Source & review for HTTP and TOML. It exposed review dates, short revisions, immutable GitHub README snapshot links, and the curation-policy link. The guide explicitly distinguishes directory pins from comparison baselines and disclaims independent security audits and reproduced performance comparisons. No uncaught page errors were collected.

## Ranked observed issues

### 1. The list stays compressed just above the phone breakpoint

**Severity: medium usability issue; functionality remains available.** At **768×900**, the full category sidebar remains beside a list that splits identity and description into separate columns. For the `goose-json` result, the row was 498px wide and its description only about **206px** wide. The name wrapped across lines, and its short scope/limitations paragraph occupied six lines. The default list similarly split `goose-argparse` and `goose-config`. This is less comfortable to scan than the stacked 390px layout.

**Impact:** tablet/narrow-desktop users need more vertical space and eye movement to connect names with capabilities, despite having more total width than a phone.

**Recommendation:** stack identity and description at a wider breakpoint, or collapse the category rail earlier. Verify 768–1000px using long descriptions and duplicate repository names.

### 2. The compact starting-resource row hides useful built-in capability guidance

**Severity: low discovery issue.** Initially, the directory shows only **Stdlib**; “Check here first for built-in JSON, CSV, regex, binary, graphics, audio, and other modules” is inside Details or the explicit Start here category. The phone list begins with third-party CLI libraries below these terse shortcuts.

**Impact:** a developer new to Goose can overlook that a capability already exists in the standard library before considering external packages. The shortcut works, but its selection value is concealed.

**Recommendation:** add a short visible hint below the official shortcuts, such as “Check the standard library for built-in modules first,” without expanding all entries by default.

No critical/high-severity defect or broken primary flow was observed in this sample.

## Verification limits

This is a representative rendered review, not an exhaustive accessibility/content audit. No screen reader, forced colors, browser zoom, physical touch, Safari/Firefox, mobile browser chrome, or reduced-motion checks were performed. I did not inspect every resource, validate every external destination, reproduce library claims, or run the repository test suite. Guide testing concentrated on Choice notes, HTTP and TOML, including navigation and responsive tables. Source URLs were inspected as links; upstream correctness was not independently established. No horizontal document overflow was observed in sampled directory, evidence, sharing, and guide states at the reported narrow widths. The preview snapshot failure did not recur in the Chromium fallback.
