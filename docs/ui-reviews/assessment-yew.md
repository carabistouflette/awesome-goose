# Awesome Goose UI assessment — Yew

Assessed the frozen rendered application at `http://localhost:18893/`, supplied application revision `6c3ec72`, on 2026-11-06. This is an independent review using `CRITERIA.md`; no other assessments or repository history were read. Ratings are subjective judgments about the directory as a developer resource finder.

The directory is clear, useful, and unusually careful about explaining the limits of its recommendations. Search, combinations of filters, saved resources, and reading-guide navigation worked in the completed checks. I found no blocking or high-severity application defect. The remaining opportunities are primarily about first-screen density and keeping category terminology consistent.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution |
| --- | ---: | ---: | ---: |
| Visual clarity and typography | 20% | 9.0 | 1.800 |
| Discovery and information architecture | 25% | 9.0 | 2.250 |
| Interaction and feedback | 20% | 9.5 | 1.900 |
| Responsive layout and accessibility | 25% | 9.0 | 2.250 |
| Content trust and consistency | 10% | 9.5 | 0.950 |
| **Overall** | **100%** | **9.15 / 10** | **9.150** |

Exact calculation: `(9.0 × .20) + (9.0 × .25) + (9.5 × .20) + (9.0 × .25) + (9.5 × .10) = 9.15`.

- **Visual clarity:** restrained colors, strong resource titles, readable descriptions, and unobtrusive separators support scanning. Dark cards also retain clear text and control boundaries. Desktop lists put identity and description alongside one another; narrower layouts stack them sensibly.
- **Discovery:** live category counts, visible maintainers, dependency/platform notes, and comparison links make same-named alternatives distinguishable. The SQLite pair clearly communicates system versus bundled SQLite. The directory explicitly identifies the intended Goose language and points to built-ins first.
- **Interaction:** active filter chips, result counts, informative empty states, reset, URL restoration, and feedback after saving/sharing are coherent. Saved resources explain device-local persistence and the sharing limitation. Removing the last saved result leaves focus on the Saved collection control.
- **Responsive/accessibility:** observed layouts fit every measured width, including long guide content. Controls tested have clear labels, native select behavior, and accessible pressed states; keyboard shortcuts and the resources skip link work. Mobile guide comparison tables become readable option blocks with “Use for” and “Note” labels. Narrow-screen initial density remains the main weakness.
- **Trust:** entries expose a review date and immutable source snapshot; the guide states its evidence method and explicitly excludes independent benchmark/security-audit claims. The SQLite advice is consistent between directory and guide. Requirement filters explain that missing notes are unknown and a Goose core does not guarantee native-free execution.

## Observed issues

### 1. Narrow-screen setup occupies most of the opening viewport

**Severity: Low.** At an actual `320 × 720` viewport, the first visible repository title begins at approximately `y=482`; only one full resource is available before scrolling. The header, language identification, search/helper row, collection/layout/share row, category/options row, official-resource disclosure, and section heading all precede it. At `390 × 844`, approximately two short entries fit.

**Impact:** users browsing without an exact query get a limited initial sample of the catalog, particularly on short phones. The layout remains usable and has no horizontal overflow, but discovery takes more scrolling than the compact visual style initially suggests.

**Recommendation:** reclaim some vertical space in the initial mobile view—for example, reduce the spacing surrounding the official-resource disclosure and combine the search hint with another existing line. Preserve the 44px action targets and clear labels. Evaluate the result against the number of complete entries visible at `320 × 720`.

### 2. Category terminology changes across controls

**Severity: Low.** Desktop navigation uses “Files & processes,” while the mobile category selector uses “Files & OS”; active state text uses the fuller “Files, processes, and artifacts.” Other examples include “Scientific & numeric” versus “Science & maths,” and “Data & text” versus “Data formats and text.” These mappings were also confirmed in the application's category-label definitions.

**Impact:** the underlying filtering works, but users moving between desktop/mobile or reading an active filter must recognize multiple names for the same category. “Files & OS” also describes a somewhat different boundary from “Files & processes.”

**Recommendation:** use one concise label per category across sidebar, mobile select, result heading, and filter chip. Retain expanded terminology in accessible descriptions when it adds useful context.

## Coverage and evidence

Measured CSS viewports, using `window.innerWidth/innerHeight`, were `1440 × 900`, `1024 × 768`, `834 × 1112`, `390 × 844`, and `320 × 720`. The document scroll width equaled its client width in the sampled desktop, tablet, mobile, and narrow-mobile directory/guide states. Screenshots were visually inspected, including the intermediate list layout, mobile filters, narrow mobile opening view, dark cards, and SQLite guide section.

Completed flows:

1. Search `sqlite`, distinguish the two maintainers, combine the query with a maintainer, and restore that filtered URL through navigation/reload.
2. Produce no results using `sqlite` with `Macho0x`; verify clear explanatory copy and use the empty-state reset to restore all 56 resources.
3. Save SQLite, inspect Saved and its filtered-empty state, reload to verify persistence, remove the final saved result, and check empty collection guidance and focus placement.
4. Copy a filters link and observe “Filters link copied” status feedback. Clipboard contents and the denied-clipboard fallback were not independently verified.
5. Select Data & text, use `/` to focus search, type a query, and use Escape to clear the query while retaining category scope.
6. Switch to Cards and dark theme, then reload to verify their retained state.
7. On mobile, open Options and Requirement notes, combine HTTP search with native/SDK and name sorting, and use Show results. The result heading receives focus below the sticky toolbar.
8. Expand SQLite Source & review, inspect its review date and pinned README link, follow the SQLite choice guide, inspect desktop/tablet/mobile versions, and return to the directory. A separate HTTP guide-return check retained query, implementation filter, and sort. Browser Back returned to the guide.
9. Tab from a fresh directory page to Skip to resources, activate it, and verify focus moves into the directory.

Supporting source inspection was limited to relevant application search/filter/state and CSS implementation (`site/app.js`, `site/catalog.mjs`, `site/style.css`). No application or build changes were made.

## Verification limits and browser tooling

Preview status was checked first. I opened a dedicated background tab with `reuseExistingTab:false`, automated only that returned tab, and closed it. Preview search/save/share actions worked, but the comparison-link click failed twice at the same step with the exact error below on both attempts:

> Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying. "a[href='CHOICES.html#sqlite']" still matches an element after the timeout.

The preview also reported a snapshot timeout. Following the fallback instruction, subsequent checks used isolated headless `/usr/bin/chromium` through the repository's `playwright-core`. The comparison link and evidence disclosure worked there. These preview failures were treated as tooling limits, not application defects. Every owned fallback context/browser was closed, and the server was left running.

This was a Chromium visual/interaction review, not a screen-reader audit or cross-browser/device certification. Actual touch input, assistive-technology announcements, OS text scaling, all external links, upstream repository claims, every guide, and every catalog entry were not exhaustively tested. Source review evidence was inspected as presented, without independently revalidating the upstream libraries.
