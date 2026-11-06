# Aspen UI assessment

Revision: `443b4d8c474f88fe4f7463069ef9570788473ece` (`443b4d8`). Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`, independently, without reading other assessments or review history. The rendered target was the frozen build at `http://localhost:18873/`. Application code was not changed.

The directory is usable, restrained, and unusually candid about library limitations. Combined discovery controls, saved collections, empty states, and guide return navigation worked in representative checks. The remaining findings are lower-severity clarity and discoverability improvements. Scores are subjective judgments, not a certification.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | 1.700 | Clear hierarchy, readable descriptions, restrained green accents, and useful separation between identity and scope. Light and dark directory views remained readable. Some contextual result information is visually hidden. |
| Discovery and information architecture | 25% | 8.5 | 2.125 | Categories, maintainer filtering, text search, and links to alternatives work well together. Descriptions distinguish ownership, native dependencies, unsupported features, and intended use. The default collapsed introductory resources slightly weaken the first-time path. |
| Interaction and feedback | 20% | 8.5 | 1.700 | Counts, active chips, URL state, save feedback, reset behavior, and saved-empty recovery were coherent. Sharing accurately excludes the local collection. The mobile layout control could communicate its current state more clearly. |
| Responsive layout and accessibility | 25% | 9.0 | 2.250 | Representative desktop and narrow layouts had no page-level horizontal overflow. Native labels, named save buttons, pressed states, live result feedback, visible keyboard focus, skip navigation, and 44px primary controls provide a strong baseline. Long guide prose and anchors remained usable. |
| Content trust and consistency | 10% | 9.0 | 0.900 | Repository attribution, licenses, dated evidence, immutable source links, and explicit limits support comparison. The TOML directory description agreed with its guide. The guide explicitly distinguishes directory snapshots from comparison baselines and does not present inspection as an audit or a benchmark. |
| **Overall** | **100%** | **8.675** | **8.675 / 10** | **86.75 / 100** |

Exact calculation: `(8.5 × 0.20) + (8.5 × 0.25) + (8.5 × 0.20) + (9.0 × 0.25) + (9.0 × 0.10) = 8.675`.

## Tested viewports and flows

Actual `window.innerWidth` / `innerHeight` were verified, rather than trusting resize acknowledgments: **1440 × 900**, **375 × 812**, and **320 × 700** CSS pixels. The preview resize tool sometimes immediately reported an old viewport; subsequent page evaluation established the sizes above. Mobile checks used narrow browser viewports, not physical touch hardware or a mobile user agent.

- **Desktop browsing:** inspected the default list, category rail, collapsed Start here section, search, counts, resource descriptions, evidence controls, and footer. The two-column resource rows make descriptions and limitations easy to scan.
- **Search plus filters:** `toml` returned four resources. Adding maintainer `carabistouflette` and category `Data formats and text` returned two. Search text, category, owner, chips, result count, and URL agreed. Category navigation focused the result-group heading.
- **Saved collection:** saved `carabistouflette/goose-toml`, confirmed the heart/pressed state and Saved count, and viewed the one-item filtered collection. A nonmatching search showed “No saved resources match these filters,” retained the saved total, and offered “Clear filters in saved.” Clearing returned the saved resource. Removing it produced “Nothing saved yet,” moved focus to the Saved control, and offered “Browse all resources.” In isolated Chromium, saving `goose-argparse` and reloading `?saved=1` retained the resource.
- **Ordinary empty state:** a nonexistent query produced “No resources match these filters” with recovery guidance; the 320px layout did not overflow.
- **Sharing:** Share displayed “Filters link copied. Your device-local saved collection is not included.” Reading the clipboard confirmed `http://localhost:18873/?q=toml&category=Data+formats+and+text&owner=carabistouflette`, with `saved=1` removed. Loading a URL containing query, category, owner, name sort, and card view restored those controls and the expected one matching resource. Clipboard-denied fallback was inspected in source, not exercised in the browser.
- **Mobile filters and layout:** selected Data formats and text, opened Filters, selected Macho0x and Name A–Z, then used Show results. The three results were deflate, msgpack, and toml; the disclosure closed, its label showed “Filters · active,” and the URL reflected the choices. Toggled into cards at 320px and observed the dark layout with wrapped chips and resource identity. No page-level horizontal overflow was measured.
- **Theme:** toggled the directory to dark, confirmed the updated accessible theme label, and observed dark theme and card view after navigation/reload. System-theme changes and denied local storage were not tested.
- **Keyboard:** `/` focused search and Escape cleared it. In isolated Chromium, the first Tab exposed “Skip to resources” at a visible position with a 3px focus outline; Enter focused `#directory`. Selecting a mobile guide contents link and pressing Tab continued to the first link in the chosen section.
- **Reading guide:** followed the TOML resource link to `CHOICES.html#toml`, read its TOML comparison and surrounding sections at desktop and mobile sizes, used Contents ↑ and the Logging link, and returned via Directory. The TOML/Logging headings landed below navigation; the directory return restored category, maintainer, and sort. The guide provided a sticky desktop contents rail and mobile reading navigation without horizontal overflow.
- **Evidence:** expanded Macho0x/goose-toml Source & review and observed “Source reviewed 2026-11-06,” source snapshot `589f168`, and the curation-policy link. Its immutable README URL matched the catalog pin. The directory’s “TOML 1.0,” source-borrowing, and no-writer wording agreed with the guide. Inspected `site/app.js`, `site/catalog.mjs`, `site/index.html`, `site/style.css`, `site/theme.js`, `scripts/build-site.py`, `docs/CHOICES.md`, and the served catalog to support behavior and semantics. The catalog contains distinct directory/comparison commits for some resources; code explicitly displays both when they differ. That differing-baseline disclosure was source-verified rather than directly opened in this run.

## Ranked issues

### 1. Matching-result context is less visible than the collection totals

**Severity: Low.** In the two-result filtered state, the collection bar still prominently reads “All 56” and “Saved 0”; the contextual “Data formats and text (2)” heading is visually hidden. The accurate matching count exists in the search-field arrow, category-group count, and live region. This is internally consistent, but a sighted reader arriving at the sticky collection bar must reconcile catalog totals with the current subset.

**Impact:** Slower confirmation of what the visible collection represents, particularly after scrolling away from the search field or when several filters are combined.

**Recommendation:** Keep a compact visible “2 matching resources” label in or immediately below the collection bar. Preserve catalog totals, but distinguish their meaning from the current result total. Evidence: the tested `toml` + Data formats and text + carabistouflette state; `.results-title` is clipped in `site/style.css:305`.

### 2. The first-time learning path starts collapsed

**Severity: Low.** Start here appears as a collapsed heading with a plus on both the default desktop and mobile page; the five introductory resources are hidden while the next category’s libraries are already visible.

**Impact:** A newcomer can start scanning third-party libraries before noticing how to reach official documentation, samples, packages, or the standard library. The disclosure is operable and labeled, so this is a discoverability tradeoff, not a broken control.

**Recommendation:** Consider expanding Start here on the first visit, or add a short visible description such as “Official docs, samples, and standard library.” Preserve the user’s later collapse choice. Evidence: default rendered view; the `referencePreferences[mode] ?? false` default in `site/app.js`.

### 3. The mobile layout switch names the next action without showing the selected mode

**Severity: Low.** Mobile shows a single “Cards” control while the list is active, then “List” while cards are active. Desktop instead shows both modes with pressed-state feedback. The mobile accessible name explains “Switch to … layout,” but the visible label alone can be read as the current mode.

**Impact:** Mild uncertainty about the active layout and inconsistent state presentation between desktop and mobile.

**Recommendation:** Use a compact two-option pressed-state control where space permits, or show explicit current-mode text alongside an action such as “View: Cards · switch to list.” Evidence: 375px list view and 320px card view; `#toggle-view` behavior in `site/app.js` and `.mobile-view` styling in `site/style.css`.

## Verification limits and tooling

Preview tools were discovered, `preview_status` was called first, and a new background tab was opened specifically for this assessment on the dedicated origin. Only that tab was closed. Shared tabs and servers were not stopped.

The preview automation intermittently failed after navigation. In particular, opening the same TOML guide link twice returned this message on both attempts: `Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "#results a[href=\"CHOICES.html#toml\"]" still matches an element after the timeout.` Earlier `#toggle-view` and `#theme` clicks also timed out; later retries succeeded and rendered their changes. These are recorded as tooling limits, not application defects. After the two same-step failures, an isolated installed Chromium profile supplied the final keyboard checks, desktop guide observation, ordinary empty-state check, and saved persistence check. Only that isolated browser was terminated. An initial fallback automation attempt selected an extension target and was discarded; subsequent checks targeted the actual page. Authoring errors in two CDP expressions were corrected and their failed output was not treated as evidence.

This was a representative interaction assessment, not exhaustive accessibility, contrast, compatibility, security, performance, or external-link testing. No screen reader, physical touch device, Firefox/Safari, 200% browser zoom, denied-storage environment, clipboard-denied environment, or real upstream source execution was tested. External README links were inspected as evidence targets; upstream libraries and benchmark claims were not independently revalidated. Browser Back/Forward across every state combination, full multi-tab storage synchronization, and every guide were outside the observed sample.
