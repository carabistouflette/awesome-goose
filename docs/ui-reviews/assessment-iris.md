# Independent UI assessment — Iris

Revision: `5f387aa`. Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. These scores are subjective judgments of the directory as a developer discovery tool. No application files were changed, no git history or other assessments were read, and no subagents were used.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.4 | Restrained colors, clear heading levels, readable descriptions and useful owner/name distinction. Both themes remain legible. Small-screen navigation consumes substantial vertical space. |
| Discovery and information architecture | 25% | 8.0 | Categories, maintainer filtering and combined search work well; duplicate library names retain owner context and descriptions explain meaningful differences. Foundational resources are unnecessarily buried in the default results. |
| Interaction and feedback | 20% | 8.3 | URL state, active chips, live counts, saved feedback, distinct empty states and layout/theme controls are strong. Sharing has a misleading fallback when copying fails. |
| Responsive layout and accessibility | 25% | 8.2 | Tested layouts reflow without page overflow, primary controls have generous targets, and labels, pressed states, landmarks and focus styling are present. Mobile density and the guide's ambiguous contents disclosure reduce usability. |
| Content trust and consistency | 10% | 8.7 | Review dates, immutable source references, licenses and direct limitations make the catalog unusually useful. The guide clearly distinguishes documented claims from independent validation. Some entry-specific guide links overpromise relevance. |

**Weighted overall: 8.26 / 10** (`8.4×0.20 + 8.0×0.25 + 8.3×0.20 + 8.2×0.25 + 8.7×0.10`).

## Evidence and coverage

All browser work used the isolated `http://localhost:8766` origin. The owned preview tab was closed afterward. Viewports were 1280×800 for the initial desktop list, 1280×900 for desktop cards/dark theme and interaction fallback, and 390×844 and 320×844 for mobile. Widths were confirmed with `innerWidth`; preview resize responses sometimes reported stale dimensions, so those responses were not treated as proof of the final size.

- The default desktop list displayed 56 resources with separate owner/name, license, description, review disclosure and save control. The visible 15px descriptions and 18px titles are easy to scan. The two-column identity/description treatment uses desktop width well.
- Typing `sqlite`, choosing maintainer `kaitk`, and selecting `Databases` produced exactly one result, `kaitk/goose-sqlite`, three removable chips, the URL `?q=sqlite&category=Databases&owner=kaitk`, and status text “1 resource found in Databases.” `/` focused search with a visible focus-within border; Escape cleared only the query and preserved category/maintainer, producing two results.
- Saving SQLite produced a filled heart, a saved count of one, a device-local stored ID and “Saved on this device.” Opening saved mode produced “Saved resources (1 of 1)” and the explicit device-local collection explanation. Unsave in saved mode showed “Nothing saved yet” and moved focus to the saved navigation button. Loading `?saved=1&q=nomatch` with one saved item showed the distinct “No saved resources match these filters” message and “0 of 1,” rather than implying the collection had disappeared.
- Cards mode changed the actual layout and `aria-pressed` state. A mobile cards URL rendered two SQLite entries at confirmed width 320 with no page overflow. The desktop dark cards view retained readable descriptions and distinct selected/save states. Changing theme updated the button label to “Switch to light theme”; the same dark theme carried into the guide.
- Copy filters in saved mode returned “Filters link copied. Your device-local saved collection is not included.” Source inspection confirms the successful path removes `saved` and the fragment while retaining filters/layout. The actual clipboard payload was not read back.
- The Choice notes guide rendered at 320px with long repository names wrapping inside the page. Its SQLite text agrees with the two catalog summaries: system SQLite versus bundled SQLite and transaction/savepoint blocks. The source inventory, review date and explicit limits on security/performance validation support trust without overstating evidence. Direct `#sqlite` navigation positioned the heading about 88px below the viewport top. The Back to directory URL preserved `q=sqlite`, `category=Databases` and `view=cards`. Mobile contents began collapsed and opened on activation.
- A real Tab event in the isolated Chromium fallback focused “Skip to resources” with a computed 3px accent outline. Source inspection additionally found explicit labels for search/selects, named layout/navigation groups, save button names/pressed states, polite result announcements, native details/select elements and explicit focus-visible rules. Primary save/layout/filter/theme controls are generally at least 44px high.

Source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/theme.js`, `site/style.css`, `scripts/build-site.py` and the Choice notes content. Rendered pages supplied the catalog content and generated guide evidence.

## Ranked findings

### 1. Bring foundational resources into the initial browsing path

**Severity: medium.** The default rendered results start with command-line libraries and place “Start here” after the other 51 entries. Yet Start here is the first category in the desktop sidebar and mobile category selector. `site/app.js:5` explicitly moves that group to the end. It contains Documentation, compiler, Packages, Samples and Standard library; the latter even says to check it first.

**Impact:** A newcomer can browse many third-party packages before finding the language's built-in options or import instructions. The navigation ordering and result ordering communicate different priorities, particularly on mobile where the category navigation is hidden inside a select.

**Recommendation:** Put Start here first in the default category order, or provide a concise, immediately visible getting-started group above the library results. Keep navigation and result order consistent.

### 2. Reduce the amount of interface before the first mobile resource

**Severity: medium.** At 390×844 the first default resource begins around y=574. At 320×844 it begins around y=775, leaving only its title/save area on the first screen. The 320px header wraps to two rows, All resources and Saved occupy separate rows, and category plus More filters also stack. These are observed layout measurements from an isolated fresh browser, not inferred from CSS.

**Impact:** The interface is readable and has no horizontal overflow, but a small-screen user scrolls almost a screen before seeing a resource description. Discovery feels slower than the compact desktop list.

**Recommendation:** Keep the primary browse switch in one compact row at 320px, tighten the mobile header and hero spacing, and consolidate the filter controls into fewer initial rows. Preserve the existing touch target sizes and Results jump link.

### 3. Make the clipboard-failure fallback share the same normalized URL

**Severity: medium; source-confirmed conditional issue.** The success branch of `site/app.js:162–165` removes `saved` before copying. The catch branch instead tells users to copy the address-bar URL. In saved mode the observed address retains `saved=1`, for example `?q=sqlite&category=Databases&saved=1`.

**Impact:** A recipient with no matching local collection can see an empty saved view despite expecting the advertised filters link. This contradicts the otherwise clear explanation that shared links contain filters rather than the collection.

**Recommendation:** On clipboard failure, expose the already normalized URL in a selectable field or link with a manual-copy instruction. Avoid directing users to a different URL than the success path uses. Clipboard failure itself was not forced during this review.

### 4. Make Choice notes links specific to covered resources

**Severity: low.** The rendered Networking and web entries for `goose-url`, `goose-acme` and `goose-tls` each offer “Choice notes.” The build mapping sends the entire category to `CHOICES.html#http-and-web`, but that section discusses HTTP clients, servers and Plod without explaining these three resources or their stated URI, ACME and TLS limits.

**Impact:** The catalog promises additional decision help precisely where a developer is comparing constraints, then lands on nearby but incomplete guidance.

**Recommendation:** Add relevant paragraphs/anchors for these resources, or only attach Choice notes links to entries actually discussed. Keep the source/review disclosure available independently.

### 5. Signal that mobile guide contents can expand

**Severity: low.** At 320px the collapsed guide navigation renders “On this page” as an ordinary bold text row between horizontal rules. The native marker is absent because the summary uses flex display, and no replacement chevron or plus indicator appears. Activation does expand it correctly.

**Impact:** Sighted touch users can miss the navigation and scroll a long guide unnecessarily. Native disclosure semantics remain available, so this is a visual affordance issue rather than a demonstrated semantic failure.

**Recommendation:** Add an explicit expanded/collapsed indicator to the summary and retain a visible focus state and the current 44px target.

## Verification limits

Preview automation was intermittent: errors included “Preview automation client server-browser disconnected during snapshot,” “Preview automation snapshot timed out after 15000ms,” and “No preview automation host is available for evaluate.” Some click attempts also timed out without changing the observed state. Those failures were treated as tooling limits, not application defects. After bounded preview attempts, isolated headless Chromium screenshots and real mouse/keyboard input at the same local origin supplied mobile, cards, theme, save/unsave, sharing-feedback and initial Tab-focus evidence. Temporary browser profiles were separate from the shared preview profile and their processes were terminated.

This was not a complete screen-reader audit, full keyboard traversal, contrast certification, touch-device test, browser compatibility test or library correctness review. Storage denial, clipboard rejection, back/forward history, every sort option, all guide pages and all external links were not exhaustively exercised. Clear/reset handlers and their scope were inspected in source; unreliable preview reset clicks were not counted as successful end-to-end verification. No conclusions about untested upstream implementation quality are implied.
