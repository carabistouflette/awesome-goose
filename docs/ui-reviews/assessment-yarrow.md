# Awesome Goose UI assessment — Yarrow

Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. Revision: **443b4d8**. Frozen build: **http://localhost:18871/**. Reading guide: **Choice notes**, including TOML, SQLite, the introduction, and its contents navigation. Scores are subjective judgments about this developer directory, informed by rendered observation, actual interactions, and the source references below.

The directory is readable, restrained, and unusually candid about package limitations. Search, combined filters, saved collections, and guide return navigation work well. Its main weakness is discovery: important starting resources are collapsed, while filtered result context receives less visual emphasis than the unfiltered collection total. No critical application failure was reproduced.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.0 | 1.600 | Strong title/search hierarchy, readable body text, quiet borders, and useful owner/package differentiation. Light and dark themes are coherent. Filtered-result context is visually under-emphasized, and the initial mobile screen devotes substantial space to controls and the collapsed reference group. |
| Discovery and information architecture | 25% | 7.5 | 1.875 | Fourteen descriptive categories, live category counts, maintainer filtering, and concise scope/limitation summaries support finding alternatives. TOML variants explain writer support and ownership differences immediately. Collapsed starting resources and generic comparison-link labels add avoidable interpretation. |
| Interaction and feedback | 20% | 8.5 | 1.700 | Combined filters, removal chips, empty-state recovery, layout switching, saving, URL restoration, clipboard feedback, and a copy fallback worked. Saved-state limitations are explicitly explained. The distinction between total collection count and current matches could be clearer. |
| Responsive layout and accessibility | 25% | 8.5 | 2.125 | Desktop columns become a readable mobile stack without page overflow at tested widths. Native controls have labels; sampled primary targets are 44 CSS pixels high. Keyboard skip, search shortcuts, disclosures, and saving worked. Guide contents and return controls remain usable on mobile. The guide lacks a persistent current-section indication; this was not a screen-reader or full WCAG audit. |
| Content trust and consistency | 10% | 9.0 | 0.900 | Maintainers, licenses, dated source snapshots, and curation links are available per entry. Guide caveats distinguish inspection from audits and benchmarks, and explain differing comparison baselines. Scope and limitation language is specific and consistent between the TOML entries and guide. External claims were not independently revalidated. |

**Exact weighted overall: 8.200 / 10 (82.00%).**

Calculation: `8.0×0.20 + 7.5×0.25 + 8.5×0.20 + 8.5×0.25 + 9.0×0.10 = 8.200`.

## Tested viewports and flows

Actual `window.innerWidth` / `innerHeight` were checked after resizing, not inferred from the resize response. Native preview initially opened at 1280×800; the substantive desktop review used **1440×900**, mobile used **390×844**. Isolated installed Chromium confirmed those layouts and added **320×740**. No horizontal page overflow was observed in the directory or Choice notes at the sampled widths; narrow mobile intentionally hides the desktop rail and uses a category select.

- **Browse and layout:** observed default list, desktop cards, mobile list/cards controls, all-category navigation, and keyboard expansion of Start here. Its five resources were Documentation, Goose, Packages, Samples, and Standard library.
- **Combined discovery:** searched `toml`, selected `Data formats and text` and maintainer `Macho0x`, and obtained exactly one matching resource. Checked active chips, live category counts, sort by name, reset, and mobile Filters disclosure. Mobile Show results closed the disclosure and focused the results heading.
- **Empty states:** an unmatched search in All produced “No resources match these filters”; clearing restored 56 resources. Saved with zero items explained the heart action. Saved with one item plus an unmatched search explained that one saved item existed, and “Clear filters in saved” preserved that collection.
- **Saved:** saved Macho0x/goose-toml, confirmed the heart's pressed state and feedback, confirmed persistence after reload, and removed the final saved item. Focus returned to the Saved control after the last removal. Saving also worked with Space from keyboard focus.
- **Sharing:** copied a combination with query, maintainer, and sort; read the actual clipboard URL in isolated Chromium. Copying from Saved omitted `saved=1`. Reopening a URL with query/category/maintainer/sort/cards restored one matching card. A deliberately rejected clipboard write exposed a selected read-only URL field; Close restored focus to Share. The deliberate rejection is a test condition, not an observed browser failure.
- **Keyboard:** first Tab revealed the skip link at the top with a visible 3px outline; Enter focused `directory`. `/` focused search; Escape cleared the query. Enter expanded Start here and a source disclosure. Save controls expose resource-specific names and pressed state. Result status has polite live-region semantics in source.
- **Theme:** toggled to dark in the mobile directory and back to light in the desktop guide; theme and accessible toggle label followed the change and persisted across navigation.
- **Guide:** opened `CHOICES.html#toml` from the filtered result; TOML landed approximately 64 CSS pixels below the viewport top. Mobile Contents opened the outline and focused its summary. SQLite navigation also landed below the approximately 49px sticky navigation. Desktop contents remained available beside the prose. Returning to the directory restored query, category, maintainer, and sort.
- **Evidence:** expanded Macho0x/goose-toml Source & review and observed review date 2026-11-06, immutable snapshot `589f168`, and the curation-policy link. Inspected the guide's explicit separation of directory snapshots and comparison baselines and the implementation that displays both when they differ.

## Ranked issues

### 1. Starting resources are hidden behind an ambiguous collapsed row

**Severity: Medium.** On fresh desktop and mobile loads, “Start here 5 +” is collapsed and visually resembles another group heading. The compiler, documentation, standard library, packages, and samples are absent from the initial list. The first expanded category is CLI & configuration. At 320×740, the first library begins around the lower third of the screen after the controls and the collapsed row.

**Impact:** developers new to Goose must discover a disclosure before finding the foundational resources. The generic label does not reveal what is hidden, and the empty-looking row consumes first-screen space without providing useful entry points.

**Recommendation:** label this “Language, docs & examples” and show a compact set of direct starting links by default, or add a visible preview such as “Compiler · Documentation · Standard library.” Preserve a compact presentation so this does not push libraries further down mobile screens.

**Evidence:** rendered default desktop/mobile; keyboard expansion; `site/app.js:158–166` explicitly defaults this disclosure to closed.

### 2. The visible collection total competes with the current result count

**Severity: Medium.** Searching `toml` yields four matches, yet the prominent collection control still reads “All 56.” The actual “Search results (4)” heading exists but is visually clipped to one pixel. The visible matching count is the small `4 ↓` at the far end of the search field. With a category selected, group counts help, but a filtered global result label remains absent.

**Impact:** a scanning user must infer that 56 describes the collection rather than the results below. The most useful feedback after a search receives less emphasis than an unchanged total, weakening the visual hierarchy.

**Recommendation:** display a compact “4 results” label beside the result controls or above the first group, and distinguish the scope label as “All resources” with its total visually secondary. Keep the accessible live status.

**Evidence:** actual `toml` search, four matching entries, visible All 56, one-pixel result-heading width; `site/style.css:305–307` and `site/app.js:114–127`.

### 3. Comparison destinations are labeled inconsistently

**Severity: Low.** Similar links appear as “Choice notes,” “Choosing a logger,” “TOML choices,” “Compression choices,” and “crypto choice note.” For example, the two TOML-related entries use generic Choice notes while Macho0x/goose-toml uses TOML choices, although the links lead to the corresponding topic in the same guide.

**Impact:** useful comparison guidance is harder to recognize consistently while scanning alternatives. Generic labels do not say which decision the guide will help resolve.

**Recommendation:** use a consistent topic-specific action such as “Compare TOML options,” “Compare logging options,” and “Compare HTTP options.” Keep Source & review distinct as the provenance action.

**Evidence:** rendered library rows, `site/app.js:83`, and the TOML section of `docs/CHOICES.md`.

### 4. The guide outline does not retain a current-section marker

**Severity: Low.** Contents links correctly navigate, but after opening TOML the outline contains no `aria-current` link and has no persistent selected-section indicator. The orange link appearance under the pointer is hover feedback. Scrolling through the long guide does not otherwise identify the current section in the outline.

**Impact:** desktop readers have to match headings against the outline manually; mobile readers reopening Contents lack a location cue.

**Recommendation:** mark the active section with a visible indicator and `aria-current="location"`, updating it on section navigation and representative scroll positions. Retain the working anchor offsets and focus behavior.

**Evidence:** rendered desktop/mobile guide navigation and DOM inspection; outline generation in `scripts/build-site.py:207–209` creates plain anchor links.

## Source support and verification limits

Source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, the guide generation in `scripts/build-site.py`, and relevant portions of `docs/CHOICES.md`. It supported rendered findings; it was not a code review. No other assessment, review history, or peer report was read. Application code was not changed.

Native preview resizing sometimes immediately returned a stale 1280×800 viewport; later evaluation confirmed the actual requested dimensions. Native interaction checks also became unreliable: the mobile filter step reported **“Preview automation client server-browser disconnected during select”**, followed by **“No preview automation host is available for click”**. Later, two attempts to click `#search` each reported **“Preview automation click timed out after 5000ms … '#search' still matches an element after the timeout.”** Keyboard actions in that condition returned success without changing focus. After these repeated failures, checks were repeated in a separate installed Chromium browser using a fresh isolated context. Keyboard search, skip navigation, the mobile Show results action, and filtering all worked there. Those preview failures are tooling limits and were not scored as application defects.

The fallback browser was closed after each completed run; only this review's native preview tab was closed. Shared servers and other tabs were left running. Chromium viewport checks are not physical-device or touch-keyboard tests. No screen reader, high-contrast mode, 200% zoom, exhaustive link crawl, storage-denied session, cross-device synchronization, or independent package/security/performance validation was performed. Clipboard denial was simulated as described above. No JavaScript page error was observed in the completed fallback interaction run. All recommendations above are bounded to the observed frozen revision.
