# Independent UI assessment — Juniper

Revision: `4d505dbb50feb85a6ed517388e8ef72286dea5d4` (`4d505db`). Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. Scores are subjective judgments about the observed developer-resource directory.

## Method and verification limits

Inspected `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, and `site/theme.js`, then observed rendered directory and Choice notes pages. No other UI review documents or git history were read. No application changes were made.

Opened an independent preview tab using the required environment-port target on port 8765, then used `http://127.0.0.2:8765` as an isolated storage origin. Tested CSS viewports were **1440 × 1000**, **390 × 844**, and **320 × 740**. Confirmed `window.innerWidth` and `window.innerHeight` after each resize settled; the resize tool initially reported stale dimensions, so its immediate response was not treated as proof of viewport size. Screenshots were visually inspected at all three sizes. Preview screenshots succeeded; no Chromium fallback or separate browser process was needed.

Search typing and maintainer selection worked through browser automation. Several pointer-click commands timed out with: `Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying.` Subsequent page reads showed those actions had not changed the state. Category, layout, save, reset, theme and disclosure behavior were therefore checked through DOM activation in the owned page. This verifies application state transitions and rendered feedback, but does **not** establish reliable physical pointer/touch operation. A desktop attempt to operate the mobile-only category select also timed out; the visible desktop category buttons were used afterward. That hidden-control timeout is not an application finding.

Actual keyboard `/`, Escape and Tab were exercised. `/` focused search, Escape cleared its query while preserving category state, and Tab advanced from search to the first example button. Visible focus outlines were observed on the saved control and results heading. Skip-link and focus styling were inspected in source, but a complete keyboard traversal or screen-reader session was not performed.

Share was activated, but the native clipboard promise did not produce a settled success or fallback state during the observed preview session. Clipboard contents and real fallback behavior remain **unverified**. Source inspection confirms filter-link generation removes `saved` and the hash and provides a selected-input fallback on rejection. No external repository availability, source claims, performance claims, security properties, or full accessibility conformance were independently validated.

## Scores

| Criterion | Weight | Score / 10 | Basis |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | **8.8** | Calm palette, strong heading hierarchy, useful owner/name distinction, readable descriptions, and compact desktop rows. Small metadata remains secondary without becoming illegible in the inspected views. |
| Discovery and information architecture | 25% | **8.1** | Categories, counts, search examples and explicit alternatives work well. The language identity and the narrow-phone path to layout settings could be clearer; mobile chrome and references delay package descriptions. |
| Interaction and feedback | 20% | **8.2** | Combined filters, removable chips, layout state, saved counts, contextual empty states and focus recovery behaved coherently under the verification method above. Native sharing remains unverified. |
| Responsive layout and accessibility | 25% | **8.4** | No page-wide horizontal overflow in inspected directory states at 390 or 320 px or in the 390 px guide. Native labelled controls, pressed states and visible focus are strong. Narrow layouts add navigation overhead, and guide contents do not reopen when widened. |
| Content trust and consistency | 10% | **9.0** | Owner attribution, licenses, source/review disclosures and dated guidance are consistent. Choice notes clearly distinguish documentation/source inspection from audits or reproduced benchmarks and explain practical SQLite tradeoffs. |

Weighted overall: `8.8×0.20 + 8.1×0.25 + 8.2×0.20 + 8.4×0.25 + 9.0×0.10 = 8.415`, or **8.42 / 10**.

## Observed behavior

- The default desktop list showed 56 resources grouped by category. Compact Start here references give way to rows that align identity, description and save control. This is useful reading density without a wall of identical bordered cards.
- Searching `sqlite` produced two entries with the same repository name but distinct owner prefixes and descriptions: system SQLite with explicit recovery/platform requirements versus bundled SQLite with transaction/savepoint blocks. Selecting maintainer `carabistouflette` reduced the result to one. Adding Databases retained the search and maintainer filters; the URL encoded all three and removable chips made the combination visible.
- Cards changed the rendered layout and set `view=cards`. Saving the SQLite entry updated the heart, count and device-local feedback. Saved mode showed `1 of 1` and explained collection locality. An impossible query produced “No saved resources match these filters,” retained the total saved count, and offered “Clear filters in saved.” That action restored the saved collection and focused the results heading. Removing its last item produced “Nothing saved yet” and moved focus to Saved for later. The ordinary empty search separately offered a clear-filter recovery.
- At 390 px, category selection was visible and advanced fields collapsed under Filters. Expanding them exposed labelled native maintainer and sort selects. List, Cards and Share remained visible; measured layout buttons had at least 44 px width. At 320 px, List/Cards disappeared and Layout moved inside Filters, consistent with the CSS breakpoint. Both widths avoided page-wide horizontal overflow in the inspected states.
- Theme changed to dark and updated its accessible label to “Switch to light theme.” The dark Choice notes page remained readable and retained the theme. Its SQLite anchor described packaging, error-handling and early-return/finalization tradeoffs. The guide return link preserved `?category=Databases`. Mobile contents started collapsed. Widening that already-loaded guide to desktop left contents collapsed.

## Ranked issues

### 1. Identify the language in the first screen

**Severity: medium.** The hero says “Libraries and tools for Goose,” while the brand and Start here links do not explicitly identify Goose as a programming language. Choice notes later explain that Block/AAIF's Goose agent and other projects named Goose are outside scope. A developer arriving from a general search has to open a reference or read a guide to disambiguate the name.

**Impact:** Avoidable uncertainty before choosing a library, especially for first-time visitors.

**Recommendation:** Use “Libraries and tools for the Goose programming language” in the hero and link “Goose” to the upstream language reference. Retain the current short visual hierarchy.

### 2. Make layout selection discoverable on narrow phones

**Severity: low.** At 390 px, List and Cards appear beside the result heading. At 320 px, those controls disappear and Layout is available only inside a generically labelled Filters disclosure. The disclosure does not communicate that a presentation preference is inside it.

**Impact:** A user who knows the wider layout may believe cards are unavailable, and a new user has little reason to open Filters to change presentation.

**Recommendation:** Preserve a compact layout control at 320 px, or label the disclosure “Filters & layout” and expose the current view in its closed state. Keep the existing 44 px target sizes.

### 3. Reduce the mobile distance to useful package descriptions

**Severity: low.** The 390 px default first screen stacks header, browse tabs, hero, search, examples, result actions, category controls and multi-line Start here references before the first package description near the bottom of the viewport. On a narrow filtered page, Clear filters and the category chip occupy separate rows. Expanding advanced filters moves the useful result content farther down again.

**Impact:** Mobile users spend much of their initial screen on navigation and repeated state rather than evaluating libraries. The desktop density advantage is reduced.

**Recommendation:** Consolidate the mobile Start here links behind a clearly named references disclosure, and consider placing reset beside the active-chip row when space permits. Preserve the prominent search, category and result count. Verify changes against both 320 and 390 px widths.

### 4. Restore guide contents visibility when widening the page

**Severity: low.** Choice notes loaded at 390 px collapsed its contents as intended. After widening the same page to 1440 px, the 240 px sidebar displayed only “On this page” and a plus sign. `theme.js` applies the mobile collapse only at initial load and does not synchronize guide disclosure behavior on viewport changes.

**Impact:** Rotating or resizing from a narrow layout leaves a largely empty desktop navigation column and hides the section links until another action.

**Recommendation:** On crossing into the desktop breakpoint, open guide contents, ideally distinguishing automatic mobile collapse from a user's deliberate collapse choice.

No severe application blocker was demonstrated by the tested flows. Pointer and clipboard automation limitations above should be resolved in a manual browser check before treating this as complete interaction or accessibility validation.
