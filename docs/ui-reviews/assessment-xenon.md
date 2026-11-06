# Independent UI assessment — Xenon

Reviewed revision `f9068103bf4d760405f1077d5b72eedf1a8b95b4` (`f906810`) on 2026-11-06, using the frozen build at `http://localhost:18892/`. This assessment treats Awesome Goose as a developer resource directory. Scores are subjective judgments against `CRITERIA.md`; no other review reports or repository history were consulted, and application files were not changed.

The directory is useful, unusually candid about package limitations, and comfortable to scan. Search, owner/category filters, saved collections and contextual comparisons form a coherent workflow. The main observed defect is narrow-screen overflow in the current-filter summary. Two smaller presentation problems reduce clarity without preventing use.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.8 | 1.760 | Restrained colors, readable descriptions, clear section rules and strong title hierarchy. Repeated requirement text adds some unnecessary height. |
| Discovery and information architecture | 25% | 8.8 | 2.200 | Categories, maintainer identity, contextual counts and task-oriented choice notes make alternatives easy to distinguish. Built-in resources are prominent on desktop and disclosed compactly on mobile. |
| Interaction and feedback | 20% | 9.0 | 1.800 | Combined filters, removable chips, reset, URL state, clipboard feedback, saved persistence and recovery worked in the isolated browser. |
| Responsive layout and accessibility | 25% | 8.4 | 2.100 | Strong mobile reflow, labeled native controls, visible keyboard focus and useful skip links. A reproducible 320px filter-summary overflow and an ambiguous active Options control need attention. |
| Content trust and consistency | 10% | 9.2 | 0.920 | Dated immutable source links, separate comparison baselines, licensing, explicit uncertainty and clear review limits support informed choices. Actual upstream behavior was not independently validated in this UI review. |
| **Overall** | **100%** | **8.780** | **8.780** | **87.8 / 100** |

Exact calculation: `8.8 × 0.20 + 8.8 × 0.25 + 9.0 × 0.20 + 8.4 × 0.25 + 9.2 × 0.10 = 8.780`.

## Rendered coverage and interactions

CSS viewport sizes were measured with actual `innerWidth`/`innerHeight`, rather than inferred from requested tool settings:

| Viewport | Rendered checks |
| --- | --- |
| 1440 × 1000 desktop | Default list, filtered results, two-column cards, expanded source evidence, light and dark appearance, Choice notes with sidebar contents and decision tables. |
| 900 × 1000 intermediate/tablet | Directory with category rail and wrapping list descriptions; Choice notes retained compact three-column decision tables. Both had document width 900px. |
| 390 × 844 mobile | Default list, category selector, Options, combined filters, current-filter panel, empty/saved states, dark theme, Choice notes stacked decisions and sticky Directory/Contents navigation, Source evidence. Observed document width was 390px. |
| 320 × 740 narrow mobile | Default list, Options closed/open, keyboard search, realistic longer repository query with existing filters, empty recovery and long unbroken query. Default document width was 320px; the problematic combined state reached 341px, and a longer artificial query reached 354px. |

Checked flows:

- Search `http`, maintainer `kaitk`, and Name A–Z yielded `goose-http` and `plod`; switching to Cards preserved the state. Adding the Native / SDK requirement produced a clear no-results state. Its Clear filters action restored browsing.
- Mobile search `sqlite` + Databases + maintainer `kaitk` + maintainer sort yielded the bundled SQLite package. Show 1 closed Options and focused the result heading. The current-filter panel exposed the full values and allowed clearing them.
- Saved started empty and explained device-local storage. Saving argparse produced a toast and count of one, survived reload, and appeared in Saved. Searching SQLite within that collection explained that one saved resource existed but did not match; Clear filters in saved recovered it. Removing the final saved resource returned focus to Saved and showed the onboarding empty state.
- Share copied an actual filters URL. Reopening `?q=http&owner=kaitk&sort=name` reconstructed the results. Sharing a saved collection copied a URL without `saved=1` and explicitly explained that the local collection was excluded. Browser Back restored the previous owner selection.
- Keyboard Tab exposed “Skip to resources” with a visible 3px outline. The search skip link focused Search; `/` focused it from elsewhere and Escape cleared its query. Native selects and disclosures worked with the observed focus styling. Removing the final saved item retained a useful focus target.
- Theme toggling changed the rendered colors and accessible button label, persisted through reload, and carried into the guides.
- A directory “Compare SQLite options” link opened `CHOICES.html#sqlite`. Desktop contents navigation selected HTTP and web and indicated the current section. Mobile Contents opened the collapsed outline; the Evidence and review method link navigated to that section. Directory return preserved `q=sqlite&sort=name&view=cards`.
- Expanded Source & review showed a date, immutable README snapshot and curation-policy link. Examples observed included Kaitk HTTP snapshot `86fdeec` and Carabistouflette SQLite `d45a151`. The Source evidence page rendered repository/license/date records and separate comparison baselines. The guide explained that documentation/source inspection was not an independent benchmark or security audit.

## Ranked observed issues

### 1. Current-filter summary overflows at 320px

**Severity: Medium.** At 320 × 740, start with `?q=http&owner=kaitk&sort=name`, then replace the search with `carabistouflette/goose-http` while keeping Options closed. The results-title row extends from x=16 to approximately x=341, increasing document width to 341px. The right end of the query/filter summary and disclosure indicator are clipped in the initial view. A longer unbroken query increased width to 354px. Opening Options restores the width to 320px, and the same state fits at 390px.

**Impact:** Users changing a query while an old maintainer filter remains active encounter an empty state with a partly off-screen explanation/control. Horizontal page movement also weakens the otherwise careful narrow layout.

**Recommendation:** Constrain the results-title flex item to the available width (`min-width:0`, an explicit width or max-width, and a shrinking query region). Reserve room for the result count and disclosure indicator, allowing the summary to wrap or truncate internally. Verify a 320px query + maintainer + nondefault-sort state, including zero results.

**Source evidence:** `site/style.css:475–480` constrains `.scope-context` but the surrounding flex row can still grow; `site/app.js:271–274` constructs the query and filter-count summary. The issue was reproduced in isolated Chromium after rendering, not inferred solely from CSS.

### 2. Active Options becomes an unexplained dot at narrow widths

**Severity: Low.** At 320px, closed Options is represented by an ellipsis when inactive. With a maintainer or nondefault sort active, the same 44px control shows a small orange dot with no visible “Options” label or ellipsis. Opening it reveals the expected Options heading and controls.

**Impact:** A sighted touch user has little indication that this dot opens maintainer, sorting and requirement controls. Its accessible name remains descriptive, so this is a visual discoverability problem rather than a missing-name finding.

**Recommendation:** Preserve a recognizable filter/ellipsis icon in both active and inactive states; place the active dot separately as a badge. Retain the existing accessible name and 44px target.

**Source evidence:** `site/style.css:493–500` replaces the narrow label with generated ellipsis content, while the active-state `summary[data-active=true]::before` rule also uses that pseudo-element. `site/app.js:154–156` sets the active state and accessible description.

### 3. Requirement notes repeat information already in the summary

**Severity: Low.** Kaitk HTTP repeats its optional TLS/newer-protocol platform restriction in the description and immediately below as a Platform note. The two-column desktop card makes the repetition particularly apparent; similar repetition appears for some other packages with native/platform notes.

**Impact:** The repeated sentence adds scanning and scrolling cost without adding evidence or helping distinguish options. This is more noticeable on narrow screens where every note occupies several lines.

**Recommendation:** Keep the concise task/limitation description, then make the structured requirement fact shorter or more specific. Preserve the qualification and its source rather than dropping the limitation.

**Source evidence:** `site/app.js:85–94` renders the full description followed by requirement facts; the catalog supplies both pieces of text. This was observed in rendered HTTP list and card results.

## Verification limits and tool failures

The requested preview workflow was followed: `preview_status` first, then a new background tab with `reuseExistingTab:false`, with all subsequent actions restricted to the returned tab ID. Resize initially reported an old 1280 × 800 viewport; a later direct measurement confirmed 1440 × 1000 after the resize settled. That transient tool report was not counted as an application defect.

Preview automation later failed repeatedly. The same empty-recovery step returned this error twice:

> Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "#empty-reset" still matches an element after the timeout.

An earlier evidence-summary click returned the same timeout form for `".review-details summary"`. These were treated as tool failures. After the repeated failure at the empty-recovery step, testing moved to `/usr/bin/chromium` through `/tmp/moss-ui/node_modules/playwright-core`, using an isolated context and freshly initialized storage. Equivalent source-disclosure and saved/empty-recovery interactions succeeded there. No application penalty was assigned for preview timeouts.

This was a Chromium desktop-engine review at CSS viewport sizes, not a physical touch-device, Safari or Firefox review. Keyboard/focus and semantic source checks were performed, but no screen reader session, full contrast audit, browser zoom audit or comprehensive WCAG conformance test was performed. Clipboard success was checked with browser permission granted; the denied-clipboard fallback and unavailable-storage cases were not exercised. External source destinations were inspected as immutable links, not exhaustively opened or validated, and upstream package claims were not reproduced. Guide coverage focused on Choice notes and Source evidence, not every guide or source record.

Temporary screenshots were inspected outside the repository. The owned preview tab and isolated browser were closed; shared servers were left running.
