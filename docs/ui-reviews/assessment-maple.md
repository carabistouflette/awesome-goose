# Awesome Goose UI assessment — Maple

Reviewed on 2026-11-06 as a developer directory for aardappel’s Goose programming language. Revision: `9be8ae84a95a3dca436039f6a43209b9df682094` (`9be8ae8`). Rendered target: frozen build at `http://localhost:18882/`, a dedicated fresh origin. Criteria and weights are from `CRITERIA.md`; no other review reports were read. Scores are subjective judgments grounded in the checks below.

The directory is useful and unusually explicit about differences between similarly named packages. The principal discovery, saving, sharing, and reading flows worked. The largest remaining friction is at intermediate widths: reading guides retain both a wide contents column and a desktop comparison table, concealing some of the qualifications that help developers choose correctly. Narrow mobile layouts are more successful at preserving complete content, although their controls consume substantial space before results.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Assessment |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.8 | 1.760 | Restrained light and dark palettes, clear headings, readable descriptions and metadata, consistent dividers and visible selected states. Spacious controls make narrow discovery slower. |
| Discovery and information architecture | 25% | 8.6 | 2.150 | Categories with contextual match counts, useful default list density on desktop, maintainer distinctions, built-in resources, and direct comparison links support real selection. Mobile controls and intermediate guide tables make comparison less immediate. |
| Interaction and feedback | 20% | 9.2 | 1.840 | Combined filters, active chips, counts, reset, sort/layout state, saved persistence, tailored empty recovery, clipboard feedback and restorable URLs worked. Saved sharing explicitly explains its device-local limit. |
| Responsive layout and accessibility | 25% | 8.4 | 2.100 | No page-level horizontal overflow in sampled views; mobile comparison rows retain labels. Native controls, named save/disclosure controls, visible keyboard focus and working skip/shortcut navigation are strengths. Intermediate guide tables require horizontal scrolling to read qualifications. |
| Content trust and consistency | 10% | 9.2 | 0.920 | Maintainers, licenses, dates, immutable README links, separate comparison baselines, and candid validation limits are presented. TOML directory summaries and guide advice agree about ownership, editing and writer support. Evidence presentation was checked; underlying library claims were not independently validated. |
| **Overall** | **100%** | **8.77** | **8.770** | **87.7 / 100** |

Exact calculation: `(8.8 × 0.20) + (8.6 × 0.25) + (9.2 × 0.20) + (8.4 × 0.25) + (9.2 × 0.10) = 8.770 / 10`.

## Observed issues, ranked

### 1. Intermediate guide tables hide qualifications beside a persistent contents column

**Severity: Medium.** At an actual `820 × 1180` viewport, `CHOICES.html#toml` retained the 240px guide navigation column. Its comparison container was 503px wide while its table had 650px of content. The right-hand Qualification column was partially clipped behind the container’s horizontal scroll; the first row visibly ended partway through its text. The page itself did not overflow, and a scrollbar provided recovery. This is a usability friction, not lost data or a broken table.

**Impact:** Developers cannot read the need, option and qualification together at this common tablet width. The hidden material includes precisely the limitations that distinguish packages. At `320 × 740`, the existing labeled stacked representation exposed all fields, so the intermediate experience is worse than the narrow one for this task.

**Recommendation:** Switch guide comparisons to labeled stacked rows at a wider breakpoint, or collapse the guide contents column when the remaining reading column cannot accommodate the table. Prefer a breakpoint based on available content width. Verify all three TOML fields together around 768–1000px.

**Source support:** `site/style.css:107` reserves the guide column; `site/style.css:119` makes the table scrollable and `site/style.css:120` sets its 650px minimum. The labeled stacked representation starts only at `site/style.css:271`. `scripts/build-site.py:79` correctly makes the table region keyboard-focusable, which mitigates keyboard access but does not eliminate the comparison friction.

### 2. Narrow directory controls delay inspection of actual resources

**Severity: Low.** At `390 × 844`, the unfiltered page’s first category heading appeared around y=535; the initial screen showed one complete resource and part of the next. With query `http`, category Networking & web, maintainer `kaitk` and the filter disclosure open, the first result heading appeared around y=709. Search, helper text, collection/layout/share controls, matching count, category, filter disclosure, maintainer/sort controls, a Show button and active-filter summary precede the resources. The compact Show control and the full Show-results button both work; selecting Show collapses the disclosure and moves to results.

**Impact:** Developers on short screens must scroll or explicitly jump before evaluating alternatives. This adds friction to iterative discovery even though match counts and the recovery controls are clear. The long control area becomes more consequential with longer active-filter labels.

**Recommendation:** Reduce vertical spacing between the search helper, toolbar and category control; consider showing sort only within the expanded filters and consolidating the two Show actions. Preserve the existing 44px touch targets, explicit labels and result-jump behavior. Keep official resource shortcuts available, with less space between them and the catalog.

**Source support:** The reference shortcuts have 44px minimum heights and wrap (`site/style.css:350`); active-filter rows wrap (`site/style.css:375`). The expanded mobile panel intentionally exposes both toolbar and full-width result actions (`site/style.css:385`, `site/app.js:216`). This is a density tradeoff, not an argument for smaller targets.

## Rendered views and flows checked

All dimensions below are measured `window.innerWidth × window.innerHeight`, not only requested resize settings.

| Viewport | Rendered inspection |
| --- | --- |
| 1440 × 1000 | Initial light directory/list; readable maintainer/name/description columns; Choice notes TOML section; Source evidence page; sharing restoration and keyboard guide navigation. |
| 820 × 1180 | Initial directory with retained sidebar and stacked list descriptions; Choice notes TOML table and horizontal scroll boundary. |
| 780 × 437 | Combined filters, name sort and card layout; source disclosure; saved and empty recovery; sharing. This actual intermediate size was explicitly measured after reconnecting to Chromium. |
| 390 × 844 | Initial directory, category and expanded filters, combined results, list/cards switching, source disclosure, light/dark appearance, search shortcut/Escape and keyboard skip navigation. |
| 320 × 740 | Filtered directory, long maintainer/name wrapping, guide TOML labeled rows, mobile contents navigation, SQLite section and directory return. |

Representative interaction evidence:

- **Discovery and combined filters:** Entering `toml`, choosing Data & text and maintainer `Macho0x`, sorting Name A–Z and selecting Cards produced exactly one resource, Macho0x/goose-toml. The URL included query, full category, maintainer, sort and view. Active chips identified all three filters. On mobile, `http` + Networking & web + `kaitk` produced two resources, goose-http and plod. Their descriptions distinguished an experimental server from its framework.
- **Sort/layout and history:** Name sorting produced the Resources A–Z group; maintainer sorting produced alphabetical maintainer groups. Cards and List had visible and programmatic selected states. Browser Back restored the preceding category sort.
- **Source disclosure:** Macho0x/goose-toml expanded to “Source reviewed 2026-11-06,” a pinned snapshot labeled `589f168`, and Curation policy. kaitk/goose-http showed snapshot `86fdeec`. Source evidence rendered owner groups, recorded licenses, review dates and separate baseline columns; inspected links contained full commit hashes. The page explicitly distinguishes inspected candidates from recommendations.
- **Saving and recovery:** Saved the filtered TOML resource, saw “Saved on this device,” reloaded and confirmed the selected heart persisted. In Saved, a deliberately unmatched search produced “No saved resources match these filters”; Clear filters in saved retained the collection. Removing its last resource produced “Nothing saved yet”; Browse all resources returned all 56. A separate unmatched All search produced the global empty state and recovered with Clear filters.
- **Sharing:** Share produced a successful clipboard toast. From Saved, feedback explicitly said the device-local collection was excluded. Reading the clipboard yielded `http://localhost:18882/?q=toml&owner=Macho0x&sort=name&view=cards`, without `saved`. Navigating to that copied URL restored the one matching resource, sort and card layout in All.
- **Keyboard/focus:** First Tab exposed Skip to resources with a visible 3px outline; Enter moved focus to the directory. `/` focused Search and Escape cleared its query. Guide TOML contents navigation worked with keyboard Enter; subsequent Tab reached the comparison region at the target section rather than restarting at the header. Native selects and disclosure controls were exercised through browser interaction. Save controls expose specific labels and pressed states in the rendered DOM.
- **Theme:** Switching to dark updated page colors and the accessible label to “Switch to light theme.” The choice persisted through navigation/reload; light was restored for guide inspection.
- **Guide reading/navigation:** A directory TOML comparison link opened `CHOICES.html#toml` at the correct section. The guide compared owned decoding/writing, formatting-preserving edits and borrowed TOML 1.0 reading; it states that no matched speed benchmark was run. The desktop contents highlighted TOML. At 320px, Contents ↑ opened the outline and focused its summary; selecting SQLite placed its heading below the sticky reading navigation. Directory return restored `?q=toml`. Long guide text and stacked table cells stayed within the page width.

## Source inspection and verification limits

Supporting implementation inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/theme.js`, `site/style.css`, `scripts/build-site.py`, and `docs/SOURCES.md`. URL parsing/restoration, share exclusion of saved state, evidence disclosure, input labels, live-status markup and keyboard handlers match the observed behavior. The review used the rendered build for findings rather than inferring behavior solely from those files. No application code was changed.

The requested preview workflow was attempted first: `preview_status`, then a new background tab using `reuseExistingTab:false`, with all actions restricted to its returned ID. A desktop resize was verified by evaluating `innerWidth` as 1440 even though the resize response initially reported the old viewport. Two successive screenshot snapshots failed with the exact tool error **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** These are preview-tool failures, not directory failures. That owned tab was closed, and visual/interaction work continued in an isolated `/usr/bin/chromium` browser controlled by `/tmp/moss-ui/node_modules/playwright-core` on its own debug port and temporary profile. Reconnecting resets Chromium’s viewport, so subsequent test scripts explicitly set and rechecked the viewport. One attempted selector targeted the hidden legacy `#toggle-view` and timed out; the visible List/Cards controls were then used successfully. This was a test-selector error, not an inaccessible visible action.

This is a representative desktop Chromium and CSS-responsive assessment, not certification of accessibility or all-browser support. No screen reader, real touch device, mobile virtual keyboard, forced-colors mode, zoom matrix or automated contrast audit was used. Clipboard success was exercised; clipboard-denial fallback and blocked-storage behavior were inspected in source but not reproduced. Pinned source link structure and evidence presentation were checked, but external links and every upstream claim were not independently audited. The reading guide sampled in depth was Choice notes, supplemented by Source evidence; other guides and every catalog entry were not exhaustively reviewed. Screenshots were inspected from temporary files outside the repository; only this report is saved. The isolated browser was closed and shared servers were left running.
