# Independent UI assessment — Quartz

Revision: `1e4ad6e`. Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md` only. This is a subjective assessment of the directory as a developer resource finder. No other review reports or Git history were consulted, and application files were not changed.

## Scores

| Criterion | Weight | Score / 10 | Rationale |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Strong heading hierarchy, readable summaries, restrained colors and generous control spacing. The compact list makes comparison easier than cards. Narrow-screen controls consume considerable space. |
| Discovery and information architecture | 25% | 8.4 | Categories, result counts, maintainers, examples and choice notes support finding alternatives. Summaries distinguish genuinely different packages with the same name. Platform and native-dependency constraints remain primarily prose to scan. |
| Interaction and feedback | 20% | 8.9 | Composed filters, URL initialization, removable filter chips, saved-item feedback, distinct empty states and context-preserving guide return worked. Sharing explicitly explains the device-local collection boundary. Browser-history and clipboard-fallback behavior were not fully verified. |
| Responsive layout and accessibility | 25% | 8.4 | Tested widths fit without document overflow; controls generally offer 44-pixel targets, labels and visible keyboard focus. Search shortcuts and saved-item focus recovery worked. Long mobile guide navigation is less convenient, and this was not a screen-reader audit. |
| Content trust and consistency | 10% | 8.8 | Review dates, immutable source links, licenses and explicit limitations support trust. SQLite guide advice matches directory summaries. One generated summary ends with a dangling phrase. |
| **Weighted overall** | **100%** | **8.56** | `8.5×0.20 + 8.4×0.25 + 8.9×0.20 + 8.4×0.25 + 8.8×0.10` |

The directory is effective at its main task. No high-severity application defect was established in the checked flows. The most useful improvements concern narrow-screen density, comparison affordances and small content defects.

## Evidence and checked flows

Used the isolated origin `http://localhost:18872/` and only the newly opened tab `tab_14_d5b76abc-f7a4-4854-98e0-1f423e6ab780`. It was closed after inspection; shared servers were left running.

Rendered screenshots and DOM readings covered **1440×900**, **390×844** and **320×568 CSS pixels**. Each resize was followed by a snapshot and a read of `innerWidth`/`innerHeight`: resize responses sometimes initially reported 1280×800, so those initial responses were not treated as confirmation. Screenshots could have larger raster dimensions than the CSS viewport. At 390 pixels the document client/scroll widths were both 375; at 320 they were both 305, with the remainder occupied by the scrollbar. Desktop checks also found matching client/scroll widths. These checks establish absence of document overflow in the sampled states, not every possible state.

- **Default directory and layouts:** observed the light desktop list, dark desktop cards, mobile cards and mobile list. Desktop list splits package identity from its description and evidence, making short alternatives easy to compare. Start-here references are compact links in the default list and full entries in cards. At 320 pixels the layout control becomes one labeled toggle; activating Cards changed the URL and layout.
- **Composed discovery:** typing `sqlite`, selecting Databases and maintainer `kaitk` produced one result, `kaitk/goose-sqlite`, and three explicit active-filter chips. The URL represented all three constraints. Directly reopening `/?q=sqlite&category=Databases&owner=kaitk&view=cards` restored the same result, chips and layout. Selecting Name A–Z updated the sort state, but a single matching result cannot establish multi-entry ordering.
- **Saved behavior:** saved the SQLite entry and observed local-storage persistence data, the saved count, pressed heart and device-local feedback. Saved view reported `1 of 1`. A deliberately unmatched query produced “No saved resources match these filters,” explained that one item remained saved, and offered “Clear filters in saved.” That action retained saved mode, restored the item and focused the results heading. Unsaving the final item produced “Nothing saved yet” and focused the Saved navigation button. Browse all resources exited saved mode. Ordinary unmatched search also produced the appropriate clear-filter empty state.
- **Sharing:** activating Share in saved mode showed “Filters link copied. Your device-local saved collection is not included.” The success feedback was observed; the system clipboard payload was not independently read. `shareUrl()` in `site/catalog.mjs` removes `saved` and the fragment while retaining other URL parameters. The fallback input and recovery code were inspected, but clipboard denial was not exercised.
- **Keyboard and focus:** `/` focused search; Escape cleared its query while retaining category/maintainer constraints. Tab from search moved to the ethereum example with a visible accent outline. Source includes a skip link, labeled native selects, `aria-pressed` states, a polite result status and visible-focus styles. Full sequential traversal and successful skip-link activation were not established because later preview actions were unreliable.
- **Evidence and reading guide:** expanded the PostgreSQL Source & review disclosure and observed the review date plus immutable README URL at commit `c89f8b4…`. Opened the SQLite choice-note link on mobile: it reached `CHOICES.html#sqlite`, with no document overflow. The text consistently contrasts system SQLite with bundled SQLite and transaction/savepoint blocks, and adds dependency/update and finalization tradeoffs. Its introduction clearly states the evidence and excludes independent security/performance validation. Back to directory restored Databases and `kaitk`. Changing theme in the guide carried through to the returned directory. Mobile contents were collapsed by default.

Source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/theme.js`, `site/style.css`, the HTML-building code and relevant README/choice-note text. Source findings are distinguished from rendered observations below.

## Ranked findings

### 1. Mobile filtering pushes results well below the controls

**Severity: Medium — efficiency.** At 390×844 the initial cards results begin around CSS y=496. Opening Filters adds a full-width disclosure row and the maintainer/sort row; clear controls and active chips add further vertical space. In the observed composed-filter list, the first package was near the bottom of the viewport. At 320×568, the closed composed-filter screen was already occupied by navigation, introduction, search, layout, category and filter chips before any package appeared.

**Impact:** repeated filter refinement requires scrolling between controls and the results, particularly on short phones. This is a density issue rather than overflow or an unusable control.

**Recommendation:** retain the useful labels and touch-target heights, but compress the introductory/control spacing after a filter becomes active, or provide a persistent compact result-count jump near the filter panel. Recheck the open-filter state on a 320×568 viewport.

### 2. Important compatibility constraints cannot be compared directly

**Severity: Low — discovery.** The filter UI offers category and maintainer; sorting offers category, name and maintainer. Platform/native requirements are embedded in individual summaries: system versus bundled SQLite, libcurl, Linux validation and native C++ requirements are examples in the rendered catalog. Search can find wording, but there is no consistent facet or comparison field for these constraints.

**Impact:** a developer selecting libraries for a platform or dependency policy must read prose across several categories; similarly named alternatives are easy to miss without opening the choice notes.

**Recommendation:** introduce a small, evidence-backed set of compatibility badges or structured comparison fields, initially for native dependencies and validated platforms. Keep unknown support explicit; add facets only where the underlying evidence is sufficiently consistent.

### 3. Generated crypto summary contains an unfinished sentence

**Severity: Low — content quality.** The rendered Macho0x/goose-crypto description ends “not constant-time; see the” before the separate crypto choice-note link. The README has a complete inline link, while `scripts/build-site.py` extracts matching choice links from descriptions into the resource-links area without removing the surrounding lead-in.

**Impact:** the warning remains understandable, but the fragment weakens polish and makes the relationship between the warning and supporting note less direct.

**Recommendation:** store an independent complete summary, or rewrite the extraction so the remaining sentence is grammatically complete. Check other extracted choice-note descriptions for similar residual text.

### 4. Mobile guide navigation disappears during long reading

**Severity: Low — navigation convenience.** Opening the SQLite anchor lands deep in the long choice-notes page. The mobile screenshot shows the section and surrounding prose without contents or return controls. Source confirms that the guide header is not sticky and mobile contents use static positioning; Back to directory is at the top, while the bottom offers only an edit link.

**Impact:** changing topic or returning to the filtered directory from deep in the guide requires scrolling back to its header. The preserved filter URL is useful once that link is reached.

**Recommendation:** add a compact return-to-directory link near section endings or a restrained mobile navigation affordance that exposes contents and return without obscuring text.

## Verification limits

This was a sampled browser/source review, not an exhaustive accessibility, external-link, package-correctness or cross-browser audit. No real mobile device, screen reader, forced-colors mode, high zoom, reduced-motion preference, blocked-storage environment or denied-clipboard environment was tested. Saved storage was inspected during the visit, but a separate fresh browser session was not used to prove long-term persistence. The mobile guide was rendered and exercised; later desktop-guide verification did not complete reliably. Other guides and their responsive comparison tables were not rendered.

The preview produced selector errors for two non-unique descendant targets; more specific selectors subsequently worked. Later desktop checks produced these failures: “Preview automation click timed out after 15000ms” for the SQLite guide link; “Preview snapshot failed: Preview automation snapshot timed out after 15000ms”; and a subsequent guide-DOM read reported “Cannot read properties of null (reading 'open')”. A later return-link attempt also timed out because no matching guide return element was present. The attempted Alt+Left history action left the URL unchanged; this does not establish a browser-history application defect. A late skip-link focus read exceeded the tool's 64000-byte result limit, and Enter did not establish a successful skip. These results are excluded from pass claims. Installed Chromium was detected but a fallback browser session was not started; earlier reliable rendered checks were sufficient for the assessment. No prolonged retries were made.
