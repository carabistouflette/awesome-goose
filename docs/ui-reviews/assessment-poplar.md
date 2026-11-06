# Independent UI assessment — Poplar

Reviewed 2026-11-06 at revision `f1fa6081da3e4da979664c46d89dc81f969717d9`, using the frozen build at `http://localhost:18884/`. Criteria and weights come solely from `docs/ui-reviews/CRITERIA.md`. No peer assessments or review history were read. Scores are subjective judgments about this rendered directory as a developer resource.

The directory is clear, useful, and unusually explicit about evidence and limitations. The tested discovery, filtering, saving, recovery, sharing, keyboard, theme, and reading-guide flows worked. I found small usability inconsistencies, but no blocking failure in the exercised paths.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Judgment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.800 | Restrained light/dark palettes, readable descriptions, clear repository identity, generous line spacing, and a compact desktop reading list. Tablet guide comparisons become substantially longer. |
| Discovery and information architecture | 25% | 8.7 | 2.175 | Useful categories and contextual counts; same-name alternatives identify their maintainers and different jobs. Search and comparison links lead to practical qualifications. The desktop official-resource disclosure has an uninformative visible label. |
| Interaction and feedback | 20% | 8.8 | 1.760 | Combined filters, chips, sort/layout states, saved recovery, URL state, copy feedback, and clipboard fallback work. Saved behaves inconsistently with the neighboring All scope control when clicked again. |
| Responsive layout and accessibility | 25% | 9.0 | 2.250 | No horizontal page overflow at tested widths; mobile filters and guide navigation remain usable. Native controls, labels, skip links, visible focus, result announcements, and large principal targets are present. This is not a screen-reader conformance audit. |
| Content trust and consistency | 10% | 9.4 | 0.940 | Clear scope, licenses, immutable source links, review dates, explicit differing comparison baselines, and candid validation limits. Choice notes consistently explain fit rather than asserting unsupported rankings. |
| **Overall** | **100%** | **8.925** | **8.925** | **8.93 / 10 rounded to two decimals.** |

Exact calculation: `9.0×0.20 + 8.7×0.25 + 8.8×0.20 + 9.0×0.25 + 9.4×0.10 = 8.925`.

## Rendered coverage and interactions

Confirmed actual `window.innerWidth` and `innerHeight` after resizing, rather than trusting resize acknowledgments:

| Viewport | Observed surfaces |
| --- | --- |
| 1440 × 1000 desktop | Initial directory, list/cards, combined filters, expanded evidence, light/dark, Choice notes TOML table and contents rail |
| 900 × 1000 intermediate/tablet | Directory in list/cards; Choice notes TOML comparison in stacked form with contents rail |
| 375 × 812 narrow mobile | Initial directory, combined filters expanded/collapsed, results, guide TOML section, Contents navigation, method section, Source evidence, dark guide |
| 320 × 720 narrow stress check | Filtered directory with long category/maintainer chips and expanded source evidence |

Document scroll width did not exceed viewport width in the checked directory and guide states. Desktop directory layout changes to stacked resource text at 900 pixels; the category rail stays readable. At 375 pixels the category select replaces that rail, the collection/layout/share controls fit one row, and compiler references collapse to a clearly named disclosure. At 320 pixels the maintainer/name can wrap without pushing the page sideways.

Flows exercised:

- Searching `toml` found four resources. Adding Data formats and text and maintainer carabistouflette produced the two expected TOML entries. Name A–Z and Cards produced the corresponding order and layout; sorting by Maintainer grouped results by owner. Contextual category counts updated with search and maintainer scope.
- Mobile category + `toml` + Macho0x + Name A–Z yielded one resource. Expanded filters showed three active filters and “Show 1”; activating it closed the filters and focused the results heading. Collapsed filters showed individually removable chips. Clear filters restored the broad collection.
- Saving a TOML entry updated its heart and count and survived reload. A query with no saved matches produced collection-specific copy and “Clear filters in saved”; recovery retained Saved and displayed the saved entry. Removing the last saved item moved focus to Saved and showed “Nothing saved yet”; “Browse all resources” recovered the catalog. A normal no-match query also recovered through its clear action.
- The native clipboard path displayed copy feedback. Reading the clipboard confirmed sharing from Saved omitted `saved=1`. The combined query/category/maintainer/sort/view URL loaded correctly. A deliberately simulated clipboard rejection exposed a selected, focused URL field; Close returned focus to Share. Browser Back restored the previous category/result count after a zero-match category change.
- Keyboard checks included first-Tab visible skip link and Enter to `#directory`, `/` to search, Escape clearing search, Control+K, Enter opening the official-resource disclosure, and Space saving an official resource. The skip link had a visible 3px accent outline. A 58-Tab mobile traversal encountered search, toolbar, filter, resource and evidence controls without substantive sticky-toolbar obstruction.
- Theme toggled to dark and persisted across reload; directory and guide text remained readable in observed light/dark views.
- A resource’s “Compare TOML options” opened `CHOICES.html#toml`. Mobile “Contents ↑” opened the outline and focused its summary. Outline links reached TOML and Evidence and review method; current-section emphasis updated. Desktop TOML’s heading landed below the scroll offset, with its table visible. Return to Directory restored the combined filters and layout.
- Source & review for carabistouflette/goose-toml displayed directory snapshot `926a904`, comparison baseline `1014af2`, the review date, and the explicit differing-snapshot explanation. Macho0x/goose-toml linked to a full immutable README commit URL. Source evidence and its JSON inventory loaded and explained that inspection is not independent validation.

## Ranked observed issues

All three are low severity. None prevented completing the tested developer tasks.

1. **Saved scope toggles off when selected again.** In the All/Saved collection switch, clicking Saved once set its pressed state to true; clicking the same active control again changed it to false and returned to All. The neighboring All control remains All when reselected. This can unexpectedly broaden a developer’s working collection, especially after saving several entries. Make both controls select their named scope consistently: Saved should set `saved:true`, with All providing the exit. Source: `site/app.js:197–199`; the Saved handler uses `!state.saved`.

2. **The desktop official-resource disclosure hides its purpose behind “Details”.** On the initial desktop page, Compiler/Docs/Stdlib/Packages/Samples links appear on the left and “Details +” on the far right. Opening that control reveals five complete resources, descriptions, save buttons, and source evidence. Its accessible name explains this, but the visible label does not tell sighted users that saving or reviewing those resources is available there. Use a visible label such as “Resource details & save” or “About these resources”. Preserve the compact collapsed presentation. Source: `site/app.js:159–175`; mobile already uses the clearer “Compiler, docs & examples”.

3. **Tablet guide comparisons trade too much density for stacking.** The TOML choice table at 1440 pixels permits three alternatives to be compared in a compact table. At 900 pixels, its still-600px-wide reading column turns every field into a vertical block, repeating Need/Option/Qualification for each row; the three choices occupy about 652px before the explanatory prose. This preserves readability and avoids overflow, but requires more scanning and scrolling to compare alternatives. Consider a more compact tablet row/card treatment or a content-width-dependent table breakpoint; retain the readable fully stacked treatment on narrow mobile. Source: `site/style.css:270–278`, which stacks all guide tables at a viewport width of 1000px.

## Supporting source and trust observations

`site/index.html` supplies labeled search and selects, skip links, grouped collection/layout controls, and a polite results status. `site/app.js` supplies contextual counts, stateful evidence, distinct saved-empty cases, and explicit focus recovery. `site/catalog.mjs` confirms token-based matching with topic aliases, deterministic sorting, and removal of saved scope and fragments from shared URLs. `site/theme.js` supplies theme persistence, mobile contents behavior, current-section indication, and filter-preserving directory links.

`docs/CHOICES.md` explains ownership/writing distinctions for TOML, client/server distinctions for similarly named HTTP projects, and limitations such as crypto timing and unverified benchmark claims. The rendered Source evidence guide distinguishes directory snapshots from comparison baselines and candidates from admitted resources. I verified presentation, link structure, and consistency with the inspected local sources, not the underlying upstream claims.

## Tooling and verification limits

Discovered preview tools, called preview_status first, then opened a dedicated background tab with `reuseExistingTab:false`: `tab_1r_d5b76abc-f7a4-4854-98e0-1f423e6ab780`. Used only that returned tab ID. Resizing requested 1440×1000 initially returned a stale 1280×800 viewport acknowledgment, while in-page evaluation confirmed 1440×1000. Two consecutive preview_snapshot calls then failed with the same error: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** These are preview-tool failures, not observed application failures.

Continued in an isolated headless `/usr/bin/chromium` browser with `/tmp/moss-ui/node_modules/playwright-core`, a new browser context, and the dedicated 18884 origin. Inspected actual PNG screenshots as well as rendered DOM and interactions. One evaluation-harness top-level-await error and one overbroad locator strictness error were corrected and retried; neither was an application error. Screenshots were temporary working artifacts outside the repository. Closed only my preview tab and fallback browser; shared servers remained running.

Coverage is representative, not exhaustive: no physical touch device, Safari/Firefox, OS-level screen reader, forced-colors mode, browser zoom audit, or automated accessibility certification. Principal control dimensions and focus were checked; every inline guide link was not individually audited. Clipboard denial was simulated, whereas successful copy was exercised natively. External upstream repositories were not re-reviewed, built, benchmarked, or security-audited. No application files were changed.
