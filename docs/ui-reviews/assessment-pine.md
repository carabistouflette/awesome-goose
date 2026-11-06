# Independent directory UI assessment — Pine

Reviewed revision: `1e4ad6e` (the supplied review revision), on 2026-11-06. Assessment is against `CRITERIA.md`; scores are subjective judgments. No other UI assessments or Git history were read. Application files were not changed.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Restrained colors, clear headings, readable descriptions, and useful separation between identity and description. List mode gives a strong desktop scanning rhythm. Small mobile screens spend considerable space on controls before resource content. |
| Discovery and information architecture | 25% | 8.0 | Clear language scope, meaningful categories, search examples, and concise descriptions make finding a library straightforward. SQLite alternatives explain system versus bundled dependencies immediately. Cards make the introductory references disproportionately prominent; category counts need clearer context during filtering. |
| Interaction and feedback | 20% | 9.0 | Combined filters, removable chips, reset, saved states, layout switches, theme, and sharing behaved coherently in the checked flows. Empty states distinguish an empty collection from a filtered collection. Sharing accurately explains the device-local saved collection. |
| Responsive layout and accessibility | 25% | 8.5 | Checked desktop and narrow layouts fit without horizontal page overflow. Controls are generally generous, labels and pressed states are present, and keyboard focus is visible. Mobile advanced filters substantially delay results. Screen-reader and real-touch behavior remain unverified. |
| Content trust and consistency | 10% | 9.0 | Repository owners, licenses, review dates, immutable source links, and clear limitations support trust. Choice notes explicitly distinguish source inspection from audits and reproduced benchmarks, and explain alternatives without unsupported speed rankings. |

**Weighted overall: 8.53 / 10.** Calculation: `8.5×0.20 + 8.0×0.25 + 9.0×0.20 + 8.5×0.25 + 9.0×0.10 = 8.525`.

## Evidence and checked flows

The review used only `http://localhost:18871/` and its local guide pages. Source inspection covered `site/index.html`, `site/style.css`, `site/app.js`, and `site/catalog.mjs`, alongside the rendered DOM and screenshots. The catalog displayed 56 resources across 14 categories.

Actual `window.innerWidth` / `innerHeight` were checked after resizing: **1440×900**, **390×844**, and **320×720**. The initial preview also rendered at **1280×800** before resizing settled. At the three principal sizes, page content widths were 1425, 375, and 305 CSS pixels respectively, with the remaining width occupied by the browser scrollbar; no horizontal page overflow was observed. Resizing changed viewport dimensions, not the user agent or touch emulation.

- **Desktop list and cards:** inspected the initial list, introductory references, category rail, descriptions, save controls, cards, and expanded source evidence. Filtering `sqlite` + `Databases` + `carabistouflette` returned exactly one entry and three removable filter chips. Removing the restrictions exposed two SQLite alternatives with distinct packaging descriptions. The Databases category continued to show its catalog total of 3.
- **Saved and empty:** saved SQLite, entered Saved, then searched `zzzznomatch`. The UI showed “Saved resources (0 of 1)” and “No saved resources match these filters.” Its reset preserved Saved and exposed the saved entry. Unsaving the final item showed “Nothing saved yet,” moved focus to the Saved navigation button, and offered a return to all resources.
- **Sharing:** the preview showed the successful-copy toast and the explicit warning that saved items are excluded. In isolated Chromium, unavailable clipboard access exposed a selected, focused URL field containing `http://localhost:18871/?q=sqlite&category=Databases&owner=carabistouflette&view=cards`, correctly omitting `saved=1`. Source inspection confirmed the same exclusion and removal of the hash. A recipient browser opening the copied URL was not tested.
- **Mobile:** checked 390-pixel cards, list mode, category selection, expanded maintainer filters, active chips, and the 320-pixel Cards/List toggle. Dark theme remained legible in the observed views; switching theme updated the button's accessible name. Closed advanced filters were the default after a fresh narrow-page load.
- **Keyboard:** isolated Chromium confirmed the first Tab reaches “Skip to resources” with a 3-pixel visible outline; `/` focuses search with a visible container ring; typing `sqlite` then Escape restores 56 results; the next Tab reaches the ethereum example with a visible outline. DOM inspection confirmed labeled selects, individual save labels, `aria-pressed` layout/save/navigation states, and live result status. This was a representative keyboard check, not an exhaustive traversal.
- **Guide:** read `CHOICES.html` at 320 pixels and inspected it at 1440 pixels. The mobile contents disclosure opened, SQLite navigation set `#sqlite` and placed the heading about 88 pixels below the viewport top. “Back to directory” restored the cards query. The desktop contents rail and prose remained readable. The guide explains SQLite packaging, HTTP client/server roles, licensing exclusions, and the limits of its evidence.

## Ranked observed issues

### 1. Expanded mobile filters separate controls from the results they affect

**Severity: medium.** At 320×720, opening Filters moves the results container from approximately y=494 to y=704, and the first library row from y=629 to y=839. Category, disclosure, maintainer, sort, reset, and active chips form a tall sequence. At 390 pixels with a category and maintainer selected, the description of the single match also fell below the visible initial screen. The results jump remains above the filter panel.

**Impact:** mobile users refining a search must scroll between decisions and their outcome; at the narrowest checked size, expanded filters leave no actual library visible.

**Recommendation:** place a result-count action at the bottom of the expanded panel that closes it and moves to the results, and tighten the panel's vertical spacing. Preserve the ability to combine filters before using that action.

### 2. Cards turns five introductory references into a long prelude to libraries

**Severity: medium.** The initial desktop list presents Start here as a compact reference row, and its mobile list disclosure starts closed. Switching to Cards instead renders all five introductory references as full resource cards. At 390×844 the first Documentation card occupies much of the remaining screen, with the Goose card only beginning at the bottom; the remaining references still precede library categories.

**Impact:** the layout preference materially increases the scrolling needed to reach libraries, especially on phones. It makes the first screen of the directory feel more like a language-reference list.

**Recommendation:** retain the compact Start here disclosure in both layouts, with an explicit route to full reference details, or place introductory references beside the directory rather than inside the layout-controlled results.

### 3. Category counts have an unstated meaning during filtering

**Severity: low.** The observed `sqlite` + Databases + maintainer query showed one result while the sidebar's Databases count stayed 3. On mobile, the selected option likewise read “Databases (3)” above a “Databases (1)” heading. Source inspection confirms these category counts are fixed catalog totals.

**Impact:** users cannot immediately tell whether choosing another category will produce matches, and the two adjacent counts can appear inconsistent.

**Recommendation:** identify them as total catalog counts, or compute available counts from the other active filters while preserving the category-selection behavior.

### 4. Narrow search truncates its explanation of searchable fields

**Severity: low.** The search field's visible placeholder is “Search names, descriptions, or maintainers…” on desktop. At 320 pixels its input is about 181 pixels wide and shows only the beginning; at 390 pixels the maintainer portion is still cut off. The accessible label is simply “Search resources.”

**Impact:** narrow-screen users have less evidence that searching by maintainer is supported unless they discover the separate advanced filter.

**Recommendation:** use a short placeholder such as “Search resources” and put the supported fields in concise visible help text, or expose the same information with an associated description.

## Verification limits and tool behavior

The prescribed preview sequence was used: `preview_status`, then `preview_open(reuseExistingTab:false, open:false, target:{kind:'environment-port',port:18871})`. All preview actions targeted the resulting private tab. The first desktop resize initially reported an unchanged 1280-pixel inner width; a repeated resize and subsequent evaluation confirmed 1440 pixels. Scores use the confirmed dimensions, not merely the requested preset.

Later, Share produced two same-step automation failures: **“Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. \"#share\" still matches an element after the timeout.”** and **“Preview automation click timed out after 4000ms. The click may have happened; check the page before retrying. \"#share\" still matches an element after the timeout.”** An unrelated list click also timed out. Some preview key actions did not reliably affect focus. These are verification-tool limits, not demonstrated application defects. A malformed selector and subsequent attempts against the still-open guide were discarded and corrected; they were not scored as failures.

After the repeated Share failure, an isolated installed `/usr/bin/chromium` instance with a temporary profile and a separate debugging port completed the keyboard, sharing-fallback, and viewport measurements. The preview tab was closed, and only the Chromium processes created for this assessment were terminated; shared servers were untouched. No Chromium fallback screenshots were needed because rendered desktop/mobile screenshots were available from the preview.

This review did not validate external repository claims, independently audit package security, visit every resource link, run a screen reader, test real touch input, test every guide/table, or establish WCAG conformance. The successful-copy path's actual OS clipboard payload was not reliably isolated by the preview, so the exact payload was verified through the fallback field and source rather than claimed from clipboard contents. No blocking defect was found in the checked flows.
