# Awesome Goose UI assessment — Zinnia

Reviewed 2026-11-06. Application revision: **6c3ec72**, using the supplied frozen rendered build at **http://localhost:18894/**. This is an independent, subjective assessment against `docs/ui-reviews/CRITERIA.md`; no other review reports or git history were read. The application and build were not modified.

## Scores

| Criterion | Weight | Score / 10 | Basis |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | Restrained palette, strong hierarchy, comfortable text and visibly separated resource rows. Light and dark presentations are coherent. Intermediate-width reading tables are somewhat cramped. |
| Discovery and information architecture | 25% | 9.0 | Useful categories, maintainer and requirement facets, direct repository links, and comparison links distinguish identically named libraries. The compact official-resource group is less explicit for newcomers. |
| Interaction and feedback | 20% | 9.0 | Combined filters, reset, URL restoration, collection counts, saving, source disclosures and share feedback behaved consistently. Mobile filter context and result jumps retain useful orientation. |
| Responsive layout and accessibility | 25% | 9.0 | Tested narrow layouts reflow without document overflow. Controls have usable labels and generous targets; keyboard skip links, search shortcut, Escape and visible focus worked in isolated Chromium. Long queries remain inspectable through the filter context. |
| Content trust and consistency | 10% | 9.5 | Maintainers, licenses, review dates and immutable source snapshots are visible. Guides explain scope, unsupported capabilities, separate comparison baselines and the limits of inspection. |

**Exact weighted overall: 9.05 / 10 (90.5%).**

Calculation: `(9.0 × 0.20) + (9.0 × 0.25) + (9.0 × 0.20) + (9.0 × 0.25) + (9.5 × 0.10) = 9.05`.

## Observed issues

1. **Low — The introductory resources are more compressed than the rest of the directory.** On desktop the default list presents Compiler, Docs, Stdlib, Packages and Samples as a short link strip with a separate “Details & save” disclosure. At 390px the strip becomes a collapsed “5 official Goose resources” disclosure while ordinary libraries remain fully described. The “Start here” category is available, but a newcomer browsing the initial mobile view gets less explanation of the most useful first destinations than of the first CLI package. This adds a small discovery step. **Recommendation:** give the collapsed group a task-oriented label such as “Start here: compiler, docs and examples”, and retain a brief description or immediately visible documentation link. Preserve the compact layout rather than expanding five full cards by default.

2. **Low — Three-column choice tables become tight at intermediate widths.** At an actual 820px viewport, the Choice notes page retains its contents sidebar and a three-column table; the SQLite table's reading width is approximately 505px. Repository names and qualifications wrap repeatedly within roughly equal columns. Everything remained readable and in bounds, but comparing the two SQLite options takes more vertical scanning than the mobile stacked presentation. **Recommendation:** use the stacked comparison presentation at this width, or reduce the contents column and allocate more width to the Option/Qualification columns. Confirm with the longer HTTP and cryptography rows as well as SQLite.

No critical or high-severity blocker was observed in the sampled tasks. These are polish and discovery improvements, not failed core flows.

## Verification and observations

Actual CSS viewport sizes were measured with `window.innerWidth` and `window.innerHeight`, rather than inferred from resize requests or screenshot pixel dimensions:

| View | Measured viewport | Coverage |
| --- | --- | --- |
| Desktop | 1440 × 900 | Default directory, list/cards, search, filters, provenance, saved collection, share feedback, source evidence |
| Intermediate/tablet | 820 × 1180 | Dark directory, category selection, long rows, Choice notes SQLite anchor/table and contents navigation |
| Mobile | 390 × 844 | Category select, Options and Requirement notes, combined facets, zero results, Show results, current-filter disclosure |
| Narrow mobile | 320 × 568 | Long owner/repository search, wrapping, query context, Choice notes stacked SQLite comparison and reading navigation; keyboard checks in isolated Chromium |

Flows checked:

- Search `sqlite` → two alternatives with distinct system/bundled dependency descriptions; filter by `kaitk` → one result; switch to cards. Add Goose-core implementation → zero results; clear filters → restored catalog.
- Select Databases → three resources and matching active category. Category counts respond to other active filters. At mobile width combine Data & text, Linux note, native implementation and maintainer → explicit empty state; “Show 0” moves focus to the empty heading and closes Options.
- Inspect the current-filter disclosure with four active facets: full category, maintainer, implementation, platform and sort values are available despite compact toolbar text.
- Save kaitk/goose-sqlite, open Saved, reload its query URL and confirm persistence; unsave the last item → “Nothing saved yet” with device-local guidance and a browse action.
- Share from Saved → explicit copied-link feedback explaining that the device-local collection is excluded. Source inspection confirms the shared URL removes the `saved` parameter. Clipboard contents were not independently read.
- Open Source & review on carabistouflette/goose-sqlite → review date, pinned source snapshot and curation policy. Inspect Choice notes at `#sqlite`: option differences agree with the directory, and the guide explicitly separates documentation/source inspection from independent performance/security validation. Returning to the directory preserved the prior query.
- Source evidence search `sqlite` → two of 52 records, with matching directory pins; unmatched text → clear no-results guidance.
- Toggle theme → dark presentation survives navigation. Inspect semantic labels, heading structure, native select controls, save-button pressed state and status regions.
- Isolated Chromium keyboard checks: first Tab exposes “Skip to resources” with a 3px visible outline; Enter focuses the directory; `/` focuses search with a visible ring; Escape clears its query. A URL containing search, owner and cards view restores the expected one-result state.

The inspected directory states and narrow Choice notes page did not produce horizontal document overflow. Long owner names and repository names wrapped inside their containers. The mobile guide changes its decision table into readable option/use/note blocks and supplies persistent Directory/Contents navigation.

## Limits and tooling

The main review used a dedicated background preview tab opened with `reuseExistingTab:false`; only that returned tab was automated and it was closed after review. Some preview operations returned stale viewport metadata immediately after resizing, so measurements were taken in the page after navigation. One snapshot timed out and recovered on retry. Preview keyboard calls reported success but repeated `/` and Tab left `document.activeElement` as `BODY`; this was treated as an automation limitation, not an application defect. Keyboard and final saved-state verification therefore also used an isolated headless `/usr/bin/chromium` launched through the repository's `playwright-core`; its context and browser were closed. An attempted sort selection before opening the mobile Options disclosure timed out because the control was hidden; that was a test setup error, not a UI failure.

This was a sampled Chromium review, not a full accessibility audit. Screen-reader speech, actual mobile hardware/software keyboards, cross-browser behavior, clipboard contents, every upstream destination and the truth of upstream library claims were not independently verified. The frozen server was left running. Only this assessment file was written.
