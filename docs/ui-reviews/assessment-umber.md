# Awesome Goose UI assessment — Umber

Reviewed revision **5a0c964** on 2026-11-06 at the frozen origin `http://localhost:18889/`. This is an independent, subjective assessment using the criteria and weights in `CRITERIA.md`. No other assessment files or review history were consulted. Application code was not changed.

The directory is a strong developer resource: compact enough to compare libraries, explicit about the Goose language it covers, and unusually careful about limitations and source provenance. The exercised workflows completed successfully. The remaining findings are small usability refinements rather than blockers.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution |
| --- | ---: | ---: | ---: |
| Visual clarity and typography | 20% | 9.0 | 1.80 |
| Discovery and information architecture | 25% | 9.0 | 2.25 |
| Interaction and feedback | 20% | 9.2 | 1.84 |
| Responsive layout and accessibility | 25% | 8.8 | 2.20 |
| Content trust and consistency | 10% | 9.5 | 0.95 |
| **Overall** | **100%** | **9.04** | **9.04** |

Exact calculation: `9.0 × .20 + 9.0 × .25 + 9.2 × .20 + 8.8 × .25 + 9.5 × .10 = 9.04 / 10`.

### Basis for the scores

- **Visual clarity:** Restrained colors, readable body text, clear dividers, and distinct repository/maintainer typography make the default list easy to scan at 1440 px. The card layout gives descriptions more room without competing decorative elements. Both light and dark themes remained legible in the inspected states. Tablet repository wrapping and the mobile guide's unlabeled text hierarchy are minor weaknesses.
- **Discovery:** Four TOML search results exposed configuration, parsing, and editing alternatives; a maintainer intersection narrowed this to the expected single library. HTTP results made the client/server/framework distinction visible immediately. Category counts updated with filters. Searching `TOML writer` retained the reader-only alternative but explicitly marked it “Limitation match: Reader only; no writer is documented,” rather than presenting it as a writer. Official compiler/docs/stdlib/package/example shortcuts provide a sensible starting point.
- **Interaction:** Filter chips, live match counts, clear buttons, pressed layout states, device-local save feedback, URL restoration, and theme persistence all worked. Empty states distinguished an empty collection from a nonempty collection hidden by filters. The mobile Show/Edit control provided a useful shortcut between filtering and results.
- **Responsive/accessibility:** No page-level horizontal overflow was found at the explicitly verified main viewport sizes. Mobile results reflowed naturally, and guide decision tables became option blocks. Skip links, native selects, keyboard shortcuts, disclosure operation, visible focus, and focus after removing the last saved item behaved well. Native controls and labeled status regions support accessibility, but this was not an assistive-technology conformance audit.
- **Trust:** Dates, licenses, maintainer identities, immutable reviewed README links, and separate comparison baselines were inspectable. The TOML guide explained ownership and writer tradeoffs without unsupported speed rankings. The curation page disclosed the author's affiliation with listed libraries and distinguished upstream claims from independently performed validation.

## Ranked observed issues

No critical, high, or medium severity defect was observed in the exercised flows. These low severity issues are ranked by likely benefit to routine browsing.

### 1. Narrow-screen advanced filtering becomes a long form

**Severity: Low.** At **320 × 740**, opening Options and then Requirement notes placed Category, Maintainer, Sort, Implementation, Platform notes, and the qualification copy in a single vertical sequence. The screenshot at the initial scroll position reached only the beginning of Implementation; the remaining controls required more scrolling. At **375 × 812**, even the simpler expanded maintainer/sort state pushed the first result close to the bottom of the viewport.

**Impact:** Developers exploring combinations need substantial vertical travel between settings and evidence, especially when they do not yet know which facet matters. The sticky Show/Edit action helps recovery, so this is friction rather than a blocked flow.

**Recommendation:** Keep the current readable target sizes, but reduce repeated vertical space within the advanced area and consider separating sort/layout preferences from requirement facets. Keep the result-jump action visible while the lower facets are being edited.

**Evidence:** Rendered `/tmp/umber-320-options.png` and `/tmp/umber-mobile-options.png`; the native-note + Linux-note combination produced three results and Show successfully closed Options and focused the first group. `site/style.css:458` makes mobile requirement facets full-width, and `site/index.html:43` contains the nested disclosure structure.

### 2. Tablet list columns split familiar repository names

**Severity: Low.** At **900 × 1000**, the list retained a repository column beside the description. Names including `goose-argparse` and `goose-config` wrapped at their hyphens while their maintainer prefix occupied part of the first line. The same names fit comfortably in the desktop and mobile arrangements.

**Impact:** Scanning the distinguishing part of a repository name takes an extra line and makes related entries less visually comparable. Nothing overlapped or became inaccessible.

**Recommendation:** Extend the stacked list arrangement slightly above its current 880 px upper boundary, or place the maintainer on its own line in this intermediate range. Judge the breakpoint using available reading-column width.

**Evidence:** Rendered `/tmp/umber-tablet.png`; the default list grid is defined in `site/style.css:191`, while the stacked intermediate override applies only from 761 to 880 px later in that stylesheet.

### 3. Mobile decision blocks lose the table's explicit field labels

**Severity: Low.** In the **375 × 812** TOML guide, the desktop Need/Option/Qualification table became a repository link followed by two prose lines. Weight and color differentiated the lines, but there were no visible “Need” or “Qualification” labels. The content was readable and the option links remained generous targets.

**Impact:** A reader arriving at the TOML anchor must infer which line describes the intended use and which qualifies it. This adds a small interpretation step when quickly comparing several options.

**Recommendation:** Retain concise visible labels such as “Use for” and “Limit” in the mobile layout, or express the lines as short labeled facts while keeping the existing table semantics.

**Evidence:** Rendered `/tmp/umber-guide-mobile.png`; `site/style.css:427` hides the generated cell labels and the following rules reorder Option before Need. Desktop and tablet retained the explicit column headings.

## Viewports and exercised flows

Main screenshots were taken after resizing and evaluating the actual `innerWidth`/`innerHeight`, rather than trusting a requested viewport:

| View | Actual CSS viewport | Coverage |
| --- | --- | --- |
| Desktop | 1440 × 1000 | Default list, HTTP cards, source disclosures, guide tables and contents |
| Intermediate/tablet | 900 × 1000 | List wrapping, category/maintainer/platform intersection, guide tables, native keyboard controls |
| Narrow mobile | 375 × 812 | Default directory, expanded Options, result jumping, source disclosure, guide entry/contents/return |
| Extra narrow mobile | 320 × 740 | Default list, expanded nested filters, native/Linux-note results and toolbar wrapping |

The document scroll widths at these sizes were respectively 1425, 885, 360, and 305 px, consistent with a vertical scrollbar and no page-level horizontal overflow. Some earlier supplemental fallback interaction screenshots used Chromium's 780 × 437 reconnect default; the main screenshots above were subsequently captured with explicit viewport sizes.

Flows checked:

1. Search `toml` → four results; add Macho0x → one; add native-note filter → zero; Clear filters → all 56. Desktop category + kaitk + other-platform note → one networking result. Mobile native + Linux notes → three results.
2. Category/default order, Name A–Z order, maintainer grouping, and List/Cards switching. `TOML writer` displayed its reader-only limitation match.
3. Empty Saved → Browse all; save first visible resource → confirmation; Saved → one result; reload → retained; remove last saved resource → focus returned to Saved. A saved collection hidden by a nonsense search offered “Clear filters in saved” and retained the collection after recovery.
4. Share → success feedback and actual clipboard readback. A saved-state share omitted `saved=1` and explicitly said the collection was not included. Opening a URL with query/maintainer/sort/layout restored those controls and results.
5. Light/dark switching changed the accessible action label and persisted across reload.
6. Tab revealed “Skip to resources” with a visible three-pixel outline. Skip to search focused the input; `/` focused it; Escape cleared it. Native keyboard selection changed maintainer to kaitk and sort to Name A–Z; Space opened Requirement notes with visible focus. Removing the final saved result restored a useful focus target.
7. A resource's Compare TOML options link entered `CHOICES.html#toml`; mobile Contents opened the outline; its evidence link reached the evidence section; Contents returned to the outline. The visible mobile Directory link restored the prior query, maintainer, and sort. Desktop contents highlighted TOML as current.
8. Expanded Macho0x TOML evidence showed reviewed date and pinned README `589f168`. Carabistouflette TOML evidence explicitly distinguished directory snapshot `926a904` from comparison baseline `1014af2`. Followed Curation policy and Source evidence pages; inspected the rendered affiliation disclosure, admission rules, inventory links, and baseline explanations.

## Source support and verification limits

Local source inspection was limited to relevant application files: `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, and guide-generation code in `scripts/build-site.py`. It supported, rather than replaced, rendered observation. In particular, `site/catalog.mjs:64` strips the saved collection flag from share URLs; `site/app.js:100` builds resource-specific source disclosures; `site/index.html:53` provides a polite live result status; and `site/theme.js:48` restores the directory query on guide return.

The requested preview workflow was attempted first: `preview_status`, then a background `preview_open` with `reuseExistingTab:false`, using only its returned tab ID. The requested desktop size was verified as actual `innerWidth:1440`. Both screenshot attempts failed with exactly **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** This was a preview-tool failure, not evidence of an application defect. The owned preview tab was closed, and the remaining work used isolated `/usr/bin/chromium` **156.0.8078.79** with `/tmp/moss-ui/node_modules/playwright-core`, its own temporary profile and browser. That browser was closed after inspection; shared servers were left running.

Screenshots referenced above are transient inspection artifacts in `/tmp`, not committed deliverables. A few automation selectors initially targeted deliberately hidden official-resource controls or a hidden desktop guide-return link, and one evidence lookup targeted an entry without a separate baseline. Those selector errors were corrected and the visible intended flows retested; they are not application findings.

This review did not test real touch hardware, Safari/Firefox, screen-reader speech, browser zoom/reflow beyond the stated CSS widths, every repository/link, unavailable storage/clipboard conditions, or upstream package behavior. The successful source links were inspected as rendered immutable URLs; upstream code claims and external availability were not independently revalidated. No automated full accessibility or performance audit was run. Scores therefore express the quality observed in representative workflows, not a compatibility or security guarantee.
