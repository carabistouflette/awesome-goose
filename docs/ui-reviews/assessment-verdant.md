# Awesome Goose UI assessment — Verdant

Reviewed 2026-11-06 against revision `5a0c964120d5ddc6608bb62da60c6ef4bc540cb8`, using the frozen build at `http://localhost:18890/`. This is an independent assessment of the directory as a developer resource tool, using the criteria in `CRITERIA.md`. Scores are subjective judgments. No other assessment reports or review history were consulted; no application code was changed.

## Rating

The directory is useful and unusually explicit about evidence and limitations. Its compact desktop list makes alternatives easy to compare, and the mobile version keeps the core discovery and recovery flows intact. The remaining issues concern reading and filtering efficiency rather than failed tasks.

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | 1.700 | Restrained colors, readable descriptions, clear repository ownership, sensible separation and strong light/dark themes. Tablet title wrapping and long desktop guide lines reduce reading comfort. |
| Discovery and information architecture | 25% | 9.0 | 2.250 | Categories, contextual counts, topic search, requirement notes and comparison links support concrete library choices. Descriptions distinguish same-named libraries and expose material limitations. |
| Interaction and feedback | 20% | 9.0 | 1.800 | Combined filters, URL state, sorting, layouts, saved persistence, reset and clipboard fallback worked. Active states and recovery messages are explicit. Multi-filter mobile context is verbose. |
| Responsive layout and accessibility | 25% | 8.5 | 2.125 | No horizontal page overflow in the tested narrow states. Native controls, labels, visible focus, skip links and result focus work. The intermediate list layout and tall mobile sticky context could use refinement. |
| Content trust and consistency | 10% | 9.5 | 0.950 | Dated immutable source links, separate comparison baselines, licenses and clear inspection limits are surfaced consistently in entries and guides. Upstream technical claims were not independently revalidated in this UI review. |
| **Overall** | **100%** | **8.825** | **8.825** | **88.25 / 100** |

Exact calculation: `(8.5 × .20) + (9 × .25) + (9 × .20) + (8.5 × .25) + (9.5 × .10) = 8.825 / 10`.

## Rendered coverage and method

Preview tools were discovered first, followed by `preview_status`. I opened a background tab with `reuseExistingTab:false`, ID `tab_1x_d5b76abc-f7a4-4854-98e0-1f423e6ab780`, and used only that returned ID. A resize requested 1440 × 1000; evaluation confirmed actual `innerWidth=1440`, `innerHeight=1000`, despite the resize response initially reporting the old viewport. Two snapshot attempts then returned the same error:

> Preview snapshot failed: Preview automation snapshot timed out after 15000ms.

I switched to a dedicated headless `/usr/bin/chromium`, separate profile `/tmp/verdant-chromium`, controlled with `/tmp/moss-ui/node_modules/playwright-core`. This is a preview tooling failure, not an observed application defect.

Rendered screenshots were inspected at these actual CSS viewport sizes, verified by page evaluation after resizing:

- **1440 × 1000:** initial directory, list, filtered cards, expanded source evidence, dark theme and Choice notes guide.
- **900 × 900:** initial directory and TOML guide table/reading layout.
- **375 × 812:** initial directory, category selection, expanded and collapsed combined filters, cards, empty state with a 100-character query, keyboard focus, Logging and SQLite guide sections, contents navigation and Source evidence.
- **320 × 740:** initial directory, a six-part filter/sort context, and Source evidence rows.

Additional interaction screenshots at the fallback browser's default 780 × 437 were treated as supplemental observations, not as the required desktop/tablet/mobile evidence. At 900, 375 and 320 widths, document scroll width stayed within the layout viewport; the reserved Chromium scrollbar accounts for the 15 px difference in the recorded document widths.

## Flows checked

1. **Discovery and combinations:** `toml` found four resources, including configuration and the TOML alternatives; adding maintainer `Macho0x` left its single reader. `logging` found the two logging options. `sqlite` + Databases + carabistouflette + Native / SDK note + Linux note produced the expected single system-SQLite entry. Mobile category, maintainer, implementation, platform and sorting combinations also produced coherent zero-result states and counts.
2. **Sort/layout/history:** switched list/cards and Category/Name A–Z/Maintainer. Names sorted coherently, maintainer sort grouped the TOML results, and browser Back/Forward restored the selected sort and URL.
3. **Saved and empty recovery:** fresh Saved showed “Nothing saved yet” with an explanation and Browse all resources. Saved Macho0x/goose-toml, verified persistence through reload, searched to zero matching saved items, and recovered with “Clear filters in saved,” retaining the collection. Removing its final item moved focus to Saved and returned the correct empty state. Normal zero-result recovery and long-query wrapping also worked.
4. **Sharing:** the normal Share action copied successfully with feedback. Readback confirmed a shared link retained query, maintainer, implementation, platform, sort and cards layout while removing `saved=1`; opening it restored the matching resource and layout. A deliberately simulated clipboard rejection showed a focused, selected read-only URL and an explanatory message; Close restored focus to Share. This fallback check was fault injection, not a naturally occurring app error.
5. **Keyboard/focus:** Tab exposed the first skip link; Enter focused the directory. `/` and Ctrl+K focused search; Escape cleared the query without losing search focus. Result navigation focused the first group or empty heading. Unsave recovery preserved a useful focus target. Guide contents expansion focused its summary, and after a TOML anchor, Tab continued to the table region with a prominent visible outline. Search has a visible focus treatment; controls have accessible names and layout/scope buttons expose pressed state in source.
6. **Theme:** toggled dark/light, inspected rendered dark cards, and verified dark persisted across reload. Theme buttons update their destination-theme labels.
7. **Guide/evidence:** followed a directory logging comparison link into `CHOICES.html#logging`; inspected Logging, TOML and SQLite at desktop and mobile sizes. Contents ↑ opened the mobile outline; SQLite navigation placed its heading below the sticky reading bar. Directory return retained the prior query/layout. Expanded SQLite evidence showed the dated immutable README snapshot. Expanded goose-config evidence disclosed its differing directory (`af77c28`) and comparison (`d296c68`) pins. Rendered Source evidence showed licenses, snapshot dates, separate baselines and the distinction between inspected candidates and admitted entries.

## Ranked observed issues

### 1. Multi-filter mobile context becomes a tall persistent block

**Severity:** Medium usability/efficiency; no blocked task.

**Observed:** At 375 × 812 and 320 × 740, a combination of query/category/maintainer/requirement notes/sort wrapped the sticky Edit summary over several lines. The toolbar measured approximately **124.8 px** high. The closed state repeated some of the context in removable chips below it; on 320 px the selected category text was also clipped inside its native select. A zero-result state and its recovery button required further scrolling below this context.

**Impact:** Less vertical space remains for comparing results on the smallest devices, and a user must scan a long Edit sentence plus chips to understand the current state. Match count and the recovery path remain available.

**Recommendation:** Keep the persistent row to a short “Edit filters (5)” action and match count, with sort shown briefly if necessary. Show the full descriptions in the expanded panel and retain the removable chips outside the sticky row. Allow the narrow category control a full row when its selected label would otherwise be clipped.

**Source support:** `site/app.js:259–271` constructs the multi-part summary; `site/style.css:336–362` and `436–437` allow it to wrap within the sticky toolbar.

### 2. The intermediate list gives repository names too little horizontal room

**Severity:** Low.

**Observed:** At 900 × 900, list entries such as `carabistouflette / goose-argparse` and `goose-config` broke the package name after `goose-`. Ownership, license and description remained readable, but the narrow identity column made simple names occupy multiple lines. The left category rail remained about 220 px wide.

**Impact:** Scanning package identities is slower in this intermediate range, and the list loses some of its useful density despite having enough overall screen width for a clearer stacked arrangement.

**Recommendation:** Extend the existing stacked list treatment to a wider breakpoint, or reduce the category rail and rebalance the identity/description columns around 900 px. Preserve complete package names where practical.

**Source support:** `site/style.css:191–194` defines the three-column list; the stacked exception at `396–400` ends at 880 px.

### 3. Desktop guide paragraphs have an unnecessarily long reading measure

**Severity:** Low.

**Observed:** At 1440 × 1000, the Choice notes reading column and its paragraphs stretched across roughly 940 px. Logging and compression explanations formed long lines, whereas the 900 px and mobile versions were easier to track visually.

**Impact:** Sustained reading of qualification-heavy technical prose requires more eye travel. Tables benefit from the width, but explanatory paragraphs do not need the same measure.

**Recommendation:** Cap prose paragraphs and lists around 70–80 characters while allowing decision tables to use the full reading column.

**Source support:** `site/style.css:107–113` gives the guide a flexible reading column and padding without a separate paragraph-width cap.

## Source support and limits

Supporting implementation inspection was limited to relevant application files: `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, and guide generation in `scripts/build-site.py`. The rendered experience was the basis for the findings; source inspection explained behavior and checked labels/semantics. In particular, `catalog.mjs` intersects filter conditions and removes saved scope from shared links; `app.js` supplies explicit saved recovery and evidence disclosures; guide generation retains table/header roles and column labels as layouts change.

This was Chromium desktop automation with CSS viewport resizing, not physical-device or touch testing. I did not perform a screen-reader session, Safari/Firefox checks, a formal WCAG audit, browser zoom testing, a complete contrast audit, upstream link/network validation, package installation, security review, or performance benchmarks. I inspected representative guides and evidence, not every guide and every entry. One automation script attempted to open source evidence after intentionally creating zero results and timed out waiting for a nonexistent result; the script was corrected and the positive-result evidence flow passed. That was a test-script error, not an application defect.

The report intentionally separates known implementation/test limits from observed usability issues. No broken core discovery, save, share, reset or guide-navigation flow was observed in the tested cases. Only the owned preview tab and isolated browser were closed; shared servers were left running.
