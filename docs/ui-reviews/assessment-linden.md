# Awesome Goose UI assessment — Linden

Reviewed independently on 2026-11-06 as a directory for developers finding resources for aardappel’s Goose. Revision: `9be8ae84a95a3dca436039f6a43209b9df682094` (`9be8ae8`), verified with `git -C /home/arobin/Work/Projects/awesome-goose rev-parse HEAD`. Rendered target: frozen build at `http://localhost:18881/`. Criteria and weights are from `CRITERIA.md`; no other assessments or review history were read. Scores are subjective judgments of the observed experience.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.6 | 1.72 | Restrained palette, clear repository identities, readable descriptions, unobtrusive licensing, and useful separation between entries. Desktop list rows make comparison efficient. Mobile presentation spends substantial height before the first library. |
| Discovery and information architecture | 25% | 7.8 | 1.95 | Categories, contextual counts, owner identity, built-in resources, and linked choice notes make a useful directory. Search misses ordinary topic vocabulary, including a complete false empty state for “compression.” |
| Interaction and feedback | 20% | 8.9 | 1.78 | Combined filters, sorting, both layouts, saved states, reset, share fallback, URL restoration, and theme worked. Active states and toasts are understandable. Filter details and controls disappear above the results during mobile browsing. |
| Responsive layout and accessibility | 25% | 8.6 | 2.15 | Readable desktop, intermediate, and narrow layouts; visible keyboard focus; labeled inputs; useful skip links and result jumps; 44px major controls. Guide tables become labeled vertical records on mobile. Intermediate source tables still require horizontal movement within their regions. |
| Content trust and consistency | 10% | 9.4 | 0.94 | Clear language scope, dates, limitations, exact source pins, explicit separate comparison baselines, and honest review limits. Choice notes explain differences in fit rather than making unsupported performance claims. |
| **Overall** | **100%** | **8.54 / 10** | **8.54** | **A strong working directory with a material search vocabulary gap and several smaller browsing refinements.** |

Calculation: `8.6 × .20 + 7.8 × .25 + 8.9 × .20 + 8.6 × .25 + 9.4 × .10 = 8.54` (85.4/100).

## Rendered coverage and method

Preview tools were discovered first, followed by `preview_status`. I opened my own background tab with `reuseExistingTab:false` and operated only its returned ID, `tab_1o_d5b76abc-f7a4-4854-98e0-1f423e6ab780`. The desktop resize was checked in-page: `innerWidth:1440`, `innerHeight:900`, despite the resize response initially retaining its previous viewport. Two successive snapshot calls both failed with the exact tool error: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** These were preview automation failures, not evidence of application failure. I closed that tab and used the requested fallback: installed `/usr/bin/chromium` with `/tmp/moss-ui/node_modules/playwright-core`, a dedicated temporary browser profile, and a dedicated debugging port.

Screenshots were actually viewed, not inferred from DOM text. The measured viewport coverage was:

| CSS viewport | Rendered checks |
| --- | --- |
| 1440 × 900 | Default list; combined TOML/category/maintainer filters; name sorting; cards; expanded source evidence; search false empty state; keyboard navigation; choice-note desktop TOC and TOML table in dark theme. |
| 900 × 1000 | Directory list with persistent category rail and stacked resource content; source-evidence guide and locally scrolling tables. |
| 375 × 812 | Default list and cards; expanded filters; networking + kaitk + maintainer sorting; apply/result jump; empty recovery; guide contents; TOML table reflow; source-evidence page. |
| 320 × 740 | Narrow default directory, header, search, collection/layout controls, category selector, official shortcuts, and first resource. |

`innerWidth`/`innerHeight` were evaluated after these resizes. At the intermediate and narrow sizes, document `scrollWidth` was 885, 360, and 305 respectively, with Chromium’s 15px scrollbar gutter; no page-level horizontal overflow was observed. Short desktop states sometimes had no scrollbar and a 1440px document width. Initial exploratory interactions also ran at Chromium’s reconnect-default viewport; viewport-specific findings above rely on explicitly resized and measured sessions.

## Flows checked

- **Discovery and combinations:** Search `toml`, choose Data & text, then Macho0x: one matching TOML reader, with all three active filter chips and correct URL parameters. Reopening the URL with name sorting and cards restored that same result. Category counts changed with the other filters. Name and maintainer sorting and list/cards selection visibly changed presentation.
- **Saved and recovery:** Saving changed the heart, count, pressed state, and toast; a saved item persisted after reload. A mismatching search in Saved showed a distinct explanatory empty state. Its reset cleared filters while retaining Saved. Removing the last saved item showed “Nothing saved yet,” moved focus to the Saved control, and provided Browse all resources. Ordinary zero-result search also provided working Clear filters recovery.
- **Sharing:** Normal copy reported success. A deliberately denied browser clipboard permission exercised the fallback: the readonly URL field appeared, received focus, and selected the complete filters URL. Close returned focus to Share. In Saved, messaging explicitly stated that the device-local collection was excluded; the fallback URL omitted `saved=1`. Permission denial was a controlled test condition, not an application fault.
- **Keyboard and feedback:** First Tab exposed Skip to resources with a visible 3px outline. `/` and Control+K focused search; Escape cleared its query. Tab from search reached the labeled matching-results link; Enter moved focus to the result-group heading; the next Tab reached a repository link with a visible outline. Mobile Show results closed advanced filters and positioned/focused the matching group below the sticky toolbar.
- **Theme and guides:** Theme switched with an updated accessible label, survived reload, and carried into the guides. A Compare HTTP options link opened `CHOICES.html#http-and-web`; desktop TOC navigation reached TOML and marked it current. On mobile, Contents opened the outline; keyboard Tab and Enter navigated its first section. Directory return restored the remembered query. TOML’s three-column comparison became labeled Need/Option/Qualification blocks without sideways page scrolling.
- **Evidence:** Expanded HTTP evidence showed review date 2026-11-06, directory snapshot `0fa7d19`, comparison baseline `6dc7a98`, and an explicit warning that the snapshots differ. Links contained full immutable README commit paths. The rendered Source evidence page clearly distinguished inspected candidates from recommendations and exposed review date, license, source pin, and separate baseline. These observations were checked against `site/app.js:86`, `scripts/build-site.py:145`, and the guide source; external repositories were not independently audited.

## Ranked observed issues

### 1. Ordinary topic searches hide relevant alternatives — Medium

**Observed:** With no other filters, `compression` returned **0**, although the directory contains goose-compress, goose-deflate, goose-archive, and a compression choice guide. `compress` returned only goose-compress. `logging` returned only carabistouflette/goose-log, while `log` returned both it and Macho0x/goose-logger. `utf8` returned 0; `utf-8` returned two entries.

**Impact:** A developer describing their need in normal vocabulary can conclude that the ecosystem has no relevant package, or see an incomplete alternative set. This directly weakens the directory’s central discovery task.

**Source evidence:** `site/catalog.mjs:2`–3 splits the query into words and requires literal substrings in label, owner, category, and description. Comparison topic labels are not indexed, and punctuation or word variants are not normalized.

**Recommendation:** Add small curated search keywords/topics to entries and index their comparison topics. Normalize common forms such as `utf8`/`UTF-8`; explicitly cover compression/encoding/decoding and logging/logger. Keep the useful AND behavior across distinct query words. Verify these examples as retrieval outcomes rather than assuming name substrings are sufficient.

### 2. Mobile sticky results toolbar loses filter context and access — Low

**Observed:** At 375px, selecting Networking & web, kaitk, and maintainer sorting, then pressing Show results, leaves a sticky bar showing All/Saved, layout, Share, and “Matching resources (4).” The category, owner, sort, chips, and reset are above the viewport. The first resource is correctly positioned below the bar, but the bar does not identify the active filters or provide an edit/reset shortcut.

**Impact:** During a longer result scan, users must scroll back to confirm or revise their scope. Counts alone do not explain why alternatives are absent. This is a usability refinement, not a failed filter interaction.

**Source evidence:** The sticky element is `.directory-top` (`site/style.css:307`); controls and `.active-filter-row` remain separate below/above it. `site/app.js:207` intentionally jumps past that area.

**Recommendation:** Add a compact “Filters · 2” action to the sticky bar when context is active. It should return focus to the filter controls and reveal a brief category/maintainer summary, with an accessible clear action.

### 3. Narrow initial browsing shows very few actual resources — Low

**Observed:** At 375 × 812, the first category heading starts around y=535 and the first library description around y=650. At 320 × 740, the owner wraps above the repository name and only one library is visible. The five official shortcuts occupy two lines before the directory entries. Cards increase the height further.

**Impact:** The hierarchy is understandable, but a developer scanning a 56-entry directory sees very little useful inventory before scrolling. This is more noticeable on a short phone than on desktop.

**Source evidence:** The screenshot reflects the stacked hero/search/toolbar/filter/reference sections in `site/index.html`; `.reference-shortcuts` wraps (`site/style.css:351`) and the narrow owner prefix becomes a block (`site/style.css:328`).

**Recommendation:** Compress the initial mobile reference area into a concise labeled disclosure or single-row resource launcher, while retaining the built-ins-first link. Preserve the current readable descriptions and touch targets; reduce introductory/control height before reducing resource typography.

### 4. Source tables need sideways movement at intermediate width — Low

**Observed:** At 900 × 1000 on Source evidence, the first table region had a 583px client width and 650px scroll width. The final baseline column was partially outside the visible region, with an actual horizontal scrollbar. At 375px, the same information reflowed cleanly into labeled blocks.

**Impact:** Comparing source and baseline evidence at tablet width requires horizontal movement even though the mobile presentation already supports a readable alternative. The page itself does not overflow, and the region is keyboard focusable.

**Source evidence:** `site/style.css:120` sets table `min-width:650px`; the vertical table conversion begins only at max-width 760px (`site/style.css:271`). Generated tables retain explicit roles, column headers, and a focusable region (`scripts/build-site.py:74`–79).

**Recommendation:** Apply the labeled-record presentation at an intermediate breakpoint based on the available guide-content width, or allow these four-column evidence tables to fit that width with suitable column wrapping. Preserve table relationships and keyboard access.

## Verification limits

This was a local Chromium inspection, including screenshots, real clicks/typing/selects/keyboard events, DOM measurements, and supporting source inspection. It was not a formal accessibility audit: no screen reader, real touch device, browser matrix, measured contrast suite, 200% browser zoom, or reduced-motion run was performed. CSS-sized mobile views are not device/user-agent emulation. External GitHub destinations, repository health, license correctness, security properties, performance claims, and every guide section were not independently validated. Clipboard-denial fallback was exercised; unavailable localStorage and cross-tab synchronization were only inspected in source, not fault-injected or interactively tested. Normal application interactions produced no blocking failure in the checked flows.

Screenshots remained temporary outside the repository; this report records the reproducible states and source locations. Only this assessment file was written in the repository. My own preview tab and isolated fallback browser were closed; shared servers were left running.
