# Independent rendered assessment — Quill

Reviewed revision `f330c08` on 2026-11-06 at the frozen build `http://localhost:18885/`. This assesses the directory as a tool for developers finding resources for aardappel’s Goose language. Criteria and weights come only from `docs/ui-reviews/CRITERIA.md`. Scores are subjective judgments informed by rendered observation, interaction, and application/source-content inspection. No other review reports or review history were consulted.

The directory is clear, useful, and unusually candid about package limitations. The compact desktop list makes owners, package names, licensing, and scope easy to compare. Mobile retains readable descriptions and practical controls without horizontal page overflow. I found no blocking application defect in the tested flows. The main opportunities concern how quickly readers can recover filter context and scan longer choice notes.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | --- | --- | --- |
| Visual clarity and typography | 20% | 9.0 | Strong hierarchy, restrained color, readable descriptions, consistent separators and link treatment. Both themes remained legible in inspected views. |
| Discovery and information architecture | 25% | 8.6 | Useful categories and live counts, effective topic/name search, owner disambiguation, and contextual links to alternatives. Official resources are less explicit in the initial mobile view, and most choice sections require paragraph reading. |
| Interaction and feedback | 20% | 9.0 | Combined filters, removable chips, reset, layouts, sorting, copied URLs, saved persistence, and empty recovery worked. Local-only saved behavior is explained. Mobile filter identities become less apparent after jumping to results. |
| Responsive layout and accessibility | 25% | 8.8 | Desktop, intermediate, and narrow layouts reflow well. Native controls, labels, pressed states, skip links, keyboard shortcuts, visible focus, and deliberate result focus were observed. Screen-reader and physical-touch behavior remain unverified. |
| Content trust and consistency | 10% | 9.2 | Specific limitations, dated immutable source links, separate comparison baselines, curation/affiliation disclosure, and explicit review limits provide a credible evidence trail. Some choice-guide development suggestions distract from selecting an existing resource. |

**Exact weighted overall: 8.87 / 10.**

Calculation: `(9.0 × 0.20) + (8.6 × 0.25) + (9.0 × 0.20) + (8.8 × 0.25) + (9.2 × 0.10) = 1.80 + 2.15 + 1.80 + 2.20 + 0.92 = 8.87`.

## Tested viewports and flows

Rendered screenshots and page measurements were inspected at these actual CSS viewport sizes:

| Viewport | Coverage |
| --- | --- |
| 1440 × 1000 | Desktop directory list/cards, filters and evidence; desktop Choice notes in dark theme. |
| 900 × 900 | Intermediate directory list and dark Choice notes, including the TOML decision table. |
| 360 × 800 | Initial mobile directory, expanded filters, focused result view, HTTP guide, contents navigation, TOML section, and theme. |
| 320 × 640 | Narrow directory, long maintainer/search text, expanded filter controls, result navigation, keyboard shortcut, and history restoration. |

`innerWidth`/`innerHeight` were checked after resizing. Document scroll width matched viewport width in the measured 900, 360, and 320 views; this does not establish the absence of overflow on every possible state.

Representative interactions completed:

- Searched `toml`, selected Data & text plus maintainer `carabistouflette`, sorted Name A–Z, and switched to Cards: the two TOML resources remained, while the configuration resource was excluded by category. Category counts reflected the other active filters.
- Searched `http`, selected `kaitk`, sorted by Maintainer, and used List: `goose-http` and `plod` remained with distinct scope descriptions. Name, Category, and Maintainer sorting were exercised during the review.
- Saved a TOML resource, opened Saved, searched for a nonexistent term, and used “Clear filters in saved”: the saved item reappeared without leaving Saved. Reload retained the collection. Removing its last item produced “Nothing saved yet” and moved focus to Saved; “Browse all resources” recovered the directory. Ordinary zero-result recovery also worked.
- Used Share, observed the copied confirmation, read the actual clipboard URL, and navigated to it. `?q=http&owner=kaitk&sort=owner` restored the two expected resources. Sharing from Saved explicitly explained that the device-local collection was not included.
- Opened Source & review for both HTTP implementations. Kaitk showed reviewed date and immutable snapshot `86fdeec`. Carabistouflette showed directory pin `0fa7d19`, a clear different-snapshot explanation, and comparison baseline `6dc7a98`.
- At 360 px, combined search/category/maintainer/sort inside Options, used “Show 2 ↓”, and verified focus landed on the result heading below the sticky toolbar. The filter panel closed and result descriptions remained readable.
- Followed “Compare HTTP options” into `CHOICES.html#http-and-web`, used mobile Contents to reach TOML, observed the correct current-section marker, and returned through Directory. Search and maintainer state were restored. The TOML table became readable stacked options on mobile and a three-column table at 900 px.
- Used keyboard Tab/Enter to reveal and activate Skip to resources; focus moved to `#directory`. `/` and Control+K focused search, and Escape cleared search while retaining focus. Keyboard focus had a visible outline; the guide table wrapper was keyboard reachable. These are sampled checks, not a complete accessibility audit.
- Switched theme in the guide and directory and verified the chosen theme after navigation/reload. Reviewed the rendered Source evidence page and its snapshot/baseline columns, plus its links to JSON inventory and curation policy.

## Ranked observed issues

### 1. Mobile result context requires reopening filters

**Severity: Low.** After applying three filters at 360 px, the result view showed “Matching resources (2)” and “Filters · 3”. The selected category and maintainer, and the Name A–Z ordering, were above the viewport or inside the closed controls. The result group stated A–Z, but the toolbar itself did not identify the selected values. This is recoverable through the working Filters button; it adds a verification step when revisiting or sharing a narrow result view.

**Recommendation:** Add a concise, wrapping context line to the collapsed result view, such as “Networking · kaitk · Name A–Z”, or expose the active values in an expandable summary beside the count. Preserve the present compact controls and accessible detailed label.

**Evidence:** Observed mobile combined-filter flow; `site/app.js` `updateFilterControls()` gives the visible collapsed control a numeric filter count, while selected values are in its accessible label. Mobile result/filter visibility is controlled in `site/style.css`.

### 2. Most guide choices need sustained paragraph reading

**Severity: Low.** At 360 px, the HTTP choice opens with a substantial paragraph covering client/server roles, event-loop features, optional blocking-client limitations, and Plod. Cryptography, SQLite, and compression similarly rely primarily on prose. TOML alone supplies a compact Need/Option/Qualification comparison that is substantially easier to scan across alternatives.

**Impact:** A developer can find a topic quickly through Contents, but comparing alternatives and their restrictions requires more reading than the directory’s concise entries suggest.

**Recommendation:** Use a short “Choose this when / qualification” comparison for HTTP, cryptography, and SQLite, followed by the existing explanation. Keep the mobile stacking used successfully for TOML.

**Evidence:** Rendered Choice notes at desktop, 900 px, and 360 px; `docs/CHOICES.md` contains the TOML decision table and prose-led sections elsewhere. Responsive table handling is in `site/style.css`.

### 3. Mobile official-resource disclosure understates its contents

**Severity: Low.** The initial 360 px page shows “Compiler, docs & examples” as a closed disclosure. Its contents also include standard-library and package-guide resources. Desktop presents all five named shortcuts immediately. A mobile reader seeking package setup has to infer that it belongs inside this disclosure.

**Recommendation:** Label it “5 official language resources” or explicitly include packages/stdlib in a short supporting line. Retain the existing descriptive accessible label and the prominent “Check built-ins first” link.

**Evidence:** Initial mobile render and desktop comparison; `site/app.js` builds all five references but uses the abbreviated mobile disclosure label.

### 4. Reader guidance includes development-planning detours

**Severity: Low.** Logging proposes a future sanitizer experiment; compression discusses a future archive backend; Ethereum links a development-gap plan. The guide clearly distinguishes these from existing features, so this is not a misleading capability claim. They nevertheless interrupt a reader trying to select a current package.

**Recommendation:** Move proposed development work into the development guide and leave a short optional link after each current-resource recommendation.

**Evidence:** Rendered Choice notes and matching sections in `docs/CHOICES.md`.

## Evidence quality and verification limits

Application inspection covered `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, `site/index.html`, and guide generation in `scripts/build-site.py`. Content inspection covered `docs/CHOICES.md` and `docs/CURATION.md`, supported by the rendered Source evidence page. Source code was used to explain observed behavior, not to substitute for rendered testing. The policy discloses that the curator authors some listed libraries; immutable directory snapshots and different comparison baselines are explicitly distinguished.

Preview tooling was discovered and `preview_status` called first. I opened a new background tab with `reuseExistingTab:false` and operated only its returned ID. The first resize response briefly reported the previous 1280 × 800 size; a subsequent page measurement confirmed 1440 × 1000. One category click returned: `Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying.` A subsequent category interaction succeeded.

Two save-button attempts returned tool errors: `Preview automation click received an invalid selector (12 characters). selector takes CSS; use locator for aria-ref=<ref>, role, or text targets.` and the corresponding `(35 characters)` error. I then closed my preview tab and continued in an isolated headless `/usr/bin/chromium` browser using `/tmp/moss-ui/node_modules/playwright-core`. The same saving workflow succeeded there. These errors are tooling failures, not evidence of broken application buttons. The fallback browser was closed at completion; shared servers were left running.

The assessment did not independently validate upstream package claims, execute libraries, audit security, benchmark performance, or check every external destination over the network. Clipboard success was tested; clipboard-denied fallback and unavailable-storage handling were inspected in source but not exercised. No physical touch device, screen reader, alternate browser engine, browser zoom test, or exhaustive focus-order/contrast audit was used. No application code was changed.
