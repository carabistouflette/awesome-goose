# Independent UI assessment — Hazel

Revision: `63419cc`, verified with `git -C /home/arobin/Work/Projects/awesome-goose rev-parse --short HEAD`. Reviewed the frozen build at `http://localhost:18880/` on 2026-11-06. Criteria and weights come only from `docs/ui-reviews/CRITERIA.md`; no other review reports or history were read. Ratings are subjective judgments based on the observations below.

**Overall: 9.10 / 10.** The directory works well as a developer discovery tool. Its restrained layout, explicit scope and limitations, contextual comparisons, and careful interaction feedback make the small ecosystem straightforward to explore. No high- or medium-severity application defect was observed in the tested flows.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Evidence and judgment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.80 | Clear heading hierarchy, readable descriptions, subdued maintainer/license metadata, underlined links, and useful whitespace. Both light and dark directory views remain legible. Mobile rows wrap long maintainer/project names cleanly. |
| Discovery and information architecture | 25% | 9.0 | 2.25 | Categories have live counts; descriptions distinguish similarly named libraries and expose material limitations. Search, maintainer, category, and sort work together. Comparison links provide a direct path from a resource to a decision guide. The narrow-screen guide introduction delays the actual choices. |
| Interaction and feedback | 20% | 9.5 | 1.90 | Active states, filter chips, result counts, persistent saves/theme, clear reset behavior, successful URL restoration, clipboard feedback and fallback all worked. Empty saved collections and filtered-out collections have different, useful explanations. |
| Responsive layout and accessibility | 25% | 9.0 | 2.25 | Tested desktop and two narrow widths without document overflow. Mobile filters offer a direct results action; guide tables reflow into labeled records. Keyboard focus is visible and deliberately managed after navigation/removal. DOM labels, pressed states, live status regions, and guide table headers support accessibility. Full assistive-technology validation remains outside this review. |
| Content trust and consistency | 10% | 9.0 | 0.90 | Language identity, research dates, immutable source links, licenses, limitations, and the distinction between documentation claims and independently reproduced results are explicit. Directory and guide descriptions agree in the sampled HTTP/TOML cases. The source inventory is useful evidence but presented as raw JSON without a format cue. |

Exact calculation: `(9.0 × 0.20) + (9.0 × 0.25) + (9.5 × 0.20) + (9.0 × 0.25) + (9.0 × 0.10) = 9.10`.

## Environment and direct checks

Rendered observations used an isolated, headless installed Chromium through `playwright-core`. Actual `window.innerWidth`/`innerHeight` were confirmed at **1440 × 900**, **375 × 812**, and **320 × 700**. Directory document width stayed within each tested viewport; Choice notes stayed within the tested desktop and narrow mobile widths. These are CSS viewport checks with a desktop Chromium user agent, not physical-device tests.

The requested preview route was attempted first: `preview_status`, then a new background tab with `reuseExistingTab:false`. Only the returned tab ID was operated. Resizing eventually confirmed an actual 1440 × 900 page viewport. Both subsequent screenshot attempts failed with the same tool message: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** The owned preview tab was closed before using an isolated Chromium browser. These were preview-tool failures, not scored as application defects. Shared tabs and servers were left running.

Representative interactions actually performed:

- **Discovery and combinations:** searched `http`; selected maintainer `kaitk`, Networking and web, and Name A–Z. The two resulting resources were `kaitk/goose-http` and `kaitk/plod`. Changing mobile category/maintainer also updated option counts immediately. `http client` correctly found the libcurl-backed client. `toml` in Name A–Z yielded config, the two TOML implementations, and TOML edit in the expected order. Maintainer sorting grouped the filtered networking results under `kaitk`.
- **Layouts and reset:** switched List/Cards and observed their active states and URL parameter. Cleared combined filters and observed default category sorting. On mobile, opening Filters exposed labeled maintainer/sort controls; “Show 4 resources” closed the panel, scrolled to results, and focused the result heading.
- **Saved and empty states:** viewed a fresh empty collection; saved `kaitk/goose-http`, filtered it, and confirmed persistence after reload. Removed it. Separately saved argparse, searched `http` within Saved, and observed “No saved resources match these filters,” the total saved count, and a suitable recovery action. Clearing filters retained Saved mode and restored argparse. Keyboard removal of the final item moved focus to the Saved control.
- **Sharing:** copied a combined search/category/maintainer/name-sort/card-layout URL and opened it in a fresh browser context. The same two results, query, maintainer, sort, and card state restored. Sharing from Saved excluded `saved=1`; the copied URL and feedback matched the stated device-local collection policy. Deliberately making clipboard writes reject exposed a focused, fully selected URL field and an explanatory message. Closing that fallback restored focus to Share. The forced clipboard rejection was a test condition, not an observed failure of normal copying.
- **Keyboard and theme:** tabbed through skip links, header controls, and category buttons; sampled controls had a visible 3 px focus outline. `/` focused search. Enter saved and removed a resource. Theme switched in both directory and guide; directory dark preference survived reload. Light and dark screenshots were inspected.
- **Guide navigation and evidence:** followed “Compare HTTP options” into `CHOICES.html#http-and-web`, used its TOML contents link, and checked that section headings were visible below the mobile navigation strip. “Contents ↑” opened/focused the mobile contents summary. Returning via “← Directory” preserved the originating TOML search and name sort. Inspected the desktop guide, mobile HTTP prose, and mobile TOML comparison. Opened the detailed comparisons page and source inventory. Expanded the directory's kaitk HTTP Source & review to inspect its date and full commit-pinned README target.

DOM inspection supplemented screenshots: search/filter controls have associated labels; save and category controls expose descriptive names/pressed states; result and sharing feedback use status regions. The mobile TOML table retains table/column-header semantics and is enclosed by a focusable labeled region. The served source inventory contains repository, full commit, pinned README, review date, and license fields. This checks presentation and provenance structure, not the truth of every upstream claim.

## Ranked observed issues

### 1. Lengthy guide qualification precedes the choices on narrow screens

**Severity: low.** On a fresh 320 × 700 visit to `CHOICES.html`, the title began at y=207, but the first HTTP heading began around y=905. Two introductory paragraphs each occupied roughly 296 px. Their qualifications are valuable, yet a developer entering through the header's Choice notes link must scroll beyond the first viewport before seeing a recommendation. Direct resource comparison anchors avoid this delay.

**Impact:** slower scanning for new mobile readers; substantial reading before the guide demonstrates its practical value.

**Recommendation:** retain a short visible review date/scope statement, then place the detailed snapshot/baseline explanation in a clearly labeled disclosure or compact methodology section linked from that statement. Keep the qualification accessible next to the evidence links.

### 2. “The source inventory” opens raw JSON without a format cue

**Severity: low.** Clicking that introductory guide link navigated to `sources.json`, an `application/json` document of about 15,724 characters. It contains strong provenance information, but exits the styled guide/navigation and presents a machine-oriented inventory. The link label does not tell readers to expect JSON.

**Impact:** a reader checking evidence, especially on mobile, must interpret a large raw inventory and use browser navigation to return. This weakens the otherwise approachable evidence trail without invalidating its contents.

**Recommendation:** label the existing link “Source inventory (JSON)” and provide a small human-readable evidence index with repository, review date, pinned source, and comparison-baseline links. Preserve JSON as the downloadable/machine-readable source.

## Verification limits

This was a sampled rendered UI review, not an exhaustive link audit or library/security assessment. External GitHub destinations were inspected as link targets rather than independently validated; upstream packages and performance/security claims were not run or reproduced. No screen reader, Safari/Firefox, physical touchscreen, virtual keyboard, browser zoom, high-contrast mode, reduced-motion setting, slow-network condition, or disabled-storage condition was tested. Accessibility observations concern visible keyboard behavior and inspected semantics, not a conformance certification. Only the requested assessment file was written in the repository; application code was not changed. The review's own Chromium browser was closed on completion.
