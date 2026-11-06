# Awesome Goose UI assessment — Cypress

Reviewed revision **0e87077** on 2026-11-06 at the frozen build `http://localhost:18878/`. This is an independent, subjective assessment using `CRITERIA.md`; no other review reports or application history were consulted. No application code was changed.

**Overall: 9.05 / 10.** The directory is useful, readable and unusually explicit about package limitations. The tested discovery, save, reset and guide flows worked. I found no blocking site defect in the tested paths. The improvements below concern scanability and presentation.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | 1.700 | Clear hierarchy, restrained color, generous separation and readable descriptions. Secondary comparison/review links are relatively small, and the 375 px header wraps awkwardly. |
| Discovery and information architecture | 25% | 9.0 | 2.250 | Category counts, maintainer attribution, search and useful default list density make packages easy to locate. Duplicate package names remain distinguishable. Comparison links explain alternatives well. Platform/native-dependency requirements still require reading individual descriptions. |
| Interaction and feedback | 20% | 9.5 | 1.900 | Combined filters, active chips, reset, sorting, URL restoration, copied-link feedback, persistent saves and distinct empty states behaved coherently. Local-only saves and sharing exclusions are explained. |
| Responsive layout and accessibility | 25% | 9.0 | 2.250 | Desktop sidebar and mobile category/filter controls fit their viewports. Tested skip links, keyboard controls, focus outlines, native selects and guide navigation worked. Important controls measured 44 px high. This was a representative accessibility check, not a full assistive-technology audit. |
| Content trust and consistency | 10% | 9.5 | 0.950 | Source review dates, immutable snapshot links, separate comparison baselines and candid scope limits support trust. The TOML guide matches the directory's ownership/writing distinctions and explicitly avoids unsupported speed claims. |
| **Total** | **100%** | | **9.050** | |

Exact calculation: `8.5 × 0.20 + 9.0 × 0.25 + 9.5 × 0.20 + 9.0 × 0.25 + 9.5 × 0.10 = 9.05`.

## Tested environment and flows

- Desktop: actual `innerWidth × innerHeight` **1440 × 900**, in preview and isolated Chromium.
- Narrow layouts: actual **375 × 812** and **320 × 568**, confirmed in Chromium after resizing. These were CSS viewport checks with a desktop browser engine, not real handset tests.
- Initial discovery: all 56 resources, sidebar counts, compact language links, list and card layouts, attribution and descriptive limitations.
- Desktop combination: search `http` + category Networking and web + maintainer `kaitk` returned `goose-http` and `plod`. Name sorting and cards updated URL parameters and visible state. Reloading the combined URL restored those controls/results.
- Mobile combination: search `toml` + Data formats and text + `carabistouflette` + Name A–Z produced two results. Category, maintainer and sorting were selected through native controls with keyboard arrows. The mobile Filters panel exposes a result-count action and closes when applying.
- Sorting: default category grouping, Name A–Z and Maintainer grouping; the latter grouped the TOML results under carabistouflette and Macho0x.
- Saved: fresh empty collection; save argparse; Saved view; reload persistence; search excluding that saved item; clear filters while retaining Saved mode; unsave the last item. “Nothing saved yet” and “No saved resources match these filters” have different explanations and recovery actions.
- Ordinary no-results search: `zzzz-no-match`; clear filters restored the full list.
- Sharing: visible “Filters link copied.” feedback. In isolated Chromium, clipboard contents matched the current query/category/maintainer/sort/cards URL. Sharing from Saved omitted `saved=1`, consistent with the explanatory copy. Reading that URL back restored filter state.
- Keyboard: first Tab revealed “Skip to resources” with a 3 px outline; second skip link focused search on Enter; `/` focused search; native filter selections worked; source disclosure responded to Enter; a save button responded to Space. This was representative coverage rather than an exhaustive traversal of all 56 resources.
- Theme: dark toggle changed colors and accessible action label; dark selection persisted across reload; returned to light afterward.
- Evidence disclosure: expanded TOML Source & review showed review date, source snapshot `926a904`, a different comparison baseline `1014af2`, and an explicit explanation of that difference.
- Reading guide: followed Compare TOML options to `CHOICES.html#toml`, read the guide framing and TOML section on desktop and mobile, and checked mobile Contents navigation to SQLite. Contents opened the outline and focused its summary; the SQLite heading landed below the sticky navigation. Directory links carried the previous directory parameters.

The sampled directory, card and guide states did not introduce horizontal page overflow at 320 or 375 px. At 375 px, the document content width was 360 px because this browser reserved a vertical scrollbar.

## Ranked improvements

### 1. Make platform and dependency constraints easier to scan

**Severity: low; discovery enhancement.**

Observed: the available filters are category and maintainer, plus text search. Requirements such as Linux validation, system SQLite, libcurl, native C++ support and SDK/hardware prerequisites are embedded in prose across entries. The text is useful and candid, but there is no consistent field for comparing those constraints across results.

Impact: a developer choosing for a deployment environment must read each description, and cannot reliably use one search term to collect equivalent constraints described with different wording.

Recommendation: add a compact, consistent platform/native-dependency field where evidence supports it. Start with visible metadata; add a filter only if its values can be maintained reliably. Preserve the descriptive caveats rather than replacing them with broad compatibility badges.

### 2. Increase secondary reading text slightly

**Severity: low; visual/accessibility improvement.**

Observed: rendered comparison links and Source & review summaries are **13 px**, beside **15 px** descriptions on mobile. In the TOML result, the link that explains which similarly named package to choose is visibly quieter and smaller than the main description. Expanded evidence links use the same small size.

Impact: evidence and choice guidance require more visual effort, particularly on narrow screens, even though the disclosure control itself has adequate height.

Recommendation: use at least 14 px for comparison/review text and preserve its contrast and generous activation area. Check the resulting row height in both layouts.

### 3. Give the 375 px header a deliberate wrapping rule

**Severity: low; cosmetic.**

Observed: at **375 × 812**, “Choice notes” wraps onto two lines beside the brand while the theme button remains on the right. At 320 px the compact header changes again and that link fits on one line. The 375 px state looks less intentional than either adjacent layout.

Impact: slight loss of navigation polish and scanability; no overlap or loss of access was observed.

Recommendation: keep this short label on one line and adjust the brand/navigation breakpoint or spacing so the intermediate width is composed deliberately. Verify 320, 360, 375 and 390 px.

### 4. Add a compact decision summary to comparison sections

**Severity: low; guide enhancement.**

Observed: TOML explains owned versus source-borrowing data, writer availability, formatting preservation and version support in two paragraphs. It is readable and technically candid, but a reader comparing three choices must extract those dimensions from the prose.

Impact: repeat consultation is slower than the directory's concise scan pattern.

Recommendation: precede those paragraphs with a short “Need → option” list or responsive comparison table for owned editing, formatting-preserving edits and source-borrowing reading. Keep the prose for lifetime and evidence caveats.

## Tooling and verification limits

Preview tools were discovered first; `preview_status` preceded opening my own background tab with `reuseExistingTab:false`. I used only returned tab `tab_1h_d5b76abc-f7a4-4854-98e0-1f423e6ab780` for preview actions. The preview snapshot image was normalized to 1280 × 800 while evaluated viewport dimensions were 1440 × 900; viewport judgments use the evaluated dimensions and subsequent native Chromium screenshots.

Saving became unreliable through preview automation. Errors included:

> Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "button[aria-label='Save kaitk/goose-http']" still matches an element after the timeout.

Two attempts at the same argparse save step also failed:

> Preview automation click timed out after 3000ms.

> Preview automation click timed out after 3000ms. The click may have happened and removed its target or navigated; check the page before retrying. No element matches "button[aria-label='Save carabistouflette/goose-argparse']" after the timeout; take a fresh snapshot and use its locator.

An intervening evaluation reported:

> No preview automation host is available for evaluate in environment f9086ae0-f4e4-45c7-9db4-0b9ce0132cf4. The server-owned browser may be starting or reconnecting.

After status retry and repeated save-step failures, I used installed `/usr/bin/chromium` in a separate temporary profile with its own debugging port. Chromium checks used actual pointer/key input plus rendered DOM measurements. Saving and persistence worked there; the preview failures are **tooling limits, not reported site bugs**.

The shared preview clipboard could be overwritten by concurrent browser activity, so it was not used as evidence of an incorrect site URL. Isolated Chromium initially denied clipboard reading (`NotAllowedError: Failed to execute 'readText' on 'Clipboard': Read permission denied.`). After granting clipboard permission to this local origin in that isolated browser, the copied URLs were verified directly.

I did not verify external repositories, package behavior, security claims, all links, real mobile touch/virtual-keyboard behavior, screen readers, forced colors, reduced motion, browser zoom, every theme/state combination, or cross-browser behavior. Source trust is assessed from the site's rendered attribution and disclosure, not independent revalidation of upstream facts. Screenshots and helper tooling stayed temporary; the only repository file written is this report. My own preview tab and fallback browser were closed; shared servers were left running.
