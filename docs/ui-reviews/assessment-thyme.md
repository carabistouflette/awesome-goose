**Independent UI assessment — thyme**

Reviewed revision `d7186d9` on 2026-11-06 using only `docs/ui-reviews/CRITERIA.md` as the rubric. No other assessments or Git history were read. Ratings are subjective judgments of the directory as a developer discovery tool.

The directory is usable and explicit about package scope and evidence. Composed filtering, saved collections, empty-state recovery and filters-only sharing worked. The main weaknesses are unexpected loss of filters when changing scope and the missing desktop return control during long guide reading.

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Restrained palette, readable descriptions and clear title/description/evidence hierarchy. Lists support comparison; cards remain readable in both themes. License/count text is noticeably small. |
| Discovery and information architecture | 25% | 8.5 | Categories, maintainer filtering, contextual match counts and choice notes distinguish alternatives effectively. Reference shortcuts have a different interaction model from other entries. |
| Interaction and feedback | 20% | 8.0 | Combined filters, chips, result counts, URL restoration, local saving, persistence and manual sharing fallback work. Scope switching can discard a composed query. |
| Responsive layout and accessibility | 25% | 8.5 | No page-level horizontal overflow in tested layouts. Mobile comparison records retain visible column labels. Skip link, shortcuts, focus rings and save-removal focus recovery worked. Desktop guide return navigation leaves the reading viewport. |
| Content trust and consistency | 10% | 9.0 | Language identity, review dates, immutable sources, curation policy and concrete limitations are visible. Guides distinguish source inspection from audits, compilation or benchmarks. Upstream claims were not independently validated. |

**Weighted overall: 8.45 / 10** (`8.5×0.20 + 8.5×0.25 + 8.0×0.20 + 8.5×0.25 + 9.0×0.10`).

**Evidence and coverage**

Rendered checks used isolated origin `http://localhost:18875/`. The preview initially reported and the page confirmed **1280×800**. An isolated installed Chromium subsequently confirmed CSS viewports **1280×800**, **390×844** and **320×740** with `innerWidth/innerHeight`. Chromium's scrollbar occupied 15 CSS pixels on long pages; document widths were 1265, 375 and 305 respectively, without horizontal page overflow. These were CSS viewport checks, not physical-phone testing.

- Desktop list/cards, light/dark themes, default directory, filtered results, saved results and empty states were rendered and visually inspected. Both mobile widths were checked in list/cards, including the narrow-screen single-button layout switch.
- `json` + Data formats category + maintainer `carabistouflette` + name sorting produced one result, `goose-json`, with removable chips and URL parameters. Removing a chip focused the results heading. Back/Forward restored a composed TOML query and its results after chip removal. Reload preserved saved scope and cards.
- Saving JSON updated pressed state/count and displayed “Saved on this device.” It persisted after reload. A nonmatching saved query displayed “No saved resources match these filters”; clearing filters retained saved scope and restored the item. Removing the last saved item displayed “Nothing saved yet” and focused Saved for later. Browser keyboard Space activated save/unsave.
- Sharing from a composed saved view exercised the clipboard-unavailable path. The selected manual-copy field retained query/category/maintainer/sort/layout, omitted `saved`, and explained the exclusion. Successful clipboard writing was not verified.
- Tab exposed the skip link with a visible 3px outline; Enter moved focus to the directory. `/` focused search; Escape cleared its query while retaining focus. Source/review was keyboard-focusable; Space opened its evidence disclosure.
- At 390, HTTP search + Networking category + maintainer filtering worked. “Show 1 resource” closed advanced filters and focused the result-group heading. At 320, ordinary no-match and empty saved states remained readable.
- `CHOICES.html#toml` and `COMPARISONS.html` were inspected. Desktop comparison tables fit the content area; mobile tables became labelled vertical records without page overflow. Mobile Contents opened its disclosure and focused its summary. TOML deep-link headings cleared sticky mobile navigation. The explicit desktop return restored `?q=toml&owner=carabistouflette&view=cards`; guide theme matched the directory.

**Actionable findings, ranked by severity**

1. **Medium — All resources unexpectedly clears discovery context.** With TOML search, category, maintainer, name sorting and cards active, entering Saved preserved filters. Clicking All resources then changed the URL to `?view=cards` and restored all 56 resources, discarding search/category/maintainer/sorting. Clicking Saved again instead toggles only saved scope. Two apparent ways of leaving Saved behave differently, forcing users to reconstruct a query. Recommend making All resources change only saved scope and keeping Clear filters for reset, or clearly labelling its reset behavior. Evidence: rendered URL/result transition; `site/app.js:167`, `site/app.js:179`, `site/app.js:182`.

2. **Medium — desktop guide deep links lose the visible way back.** Opening TOML choice notes at 1280×800 lands mid-guide. The sticky contents sidebar remains visible, but the header containing directory return is above the viewport; in one inspected reading position its top was −1996px. The footer offers only editing. Users must scroll to the top or use browser history despite explicit return correctly preserving filters when reached. Mobile already supplies persistent Directory navigation. Recommend adding the state-preserving return to the desktop sticky contents sidebar or a compact persistent guide bar. Evidence: rendered `CHOICES.html#toml`; generated layout at `scripts/build-site.py:203` and `scripts/build-site.py:205`.

3. **Low — guide branding resets the query.** In a guide reached from filtered cards, Back to directory pointed to the remembered query while the prominent brand pointed to bare `/`. Using the brand as a return loses filters and layout. Recommend applying the remembered return URL to the guide brand or clearly presenting it as a reset/home action. Evidence: rendered href comparison; `site/theme.js` updates only `[data-directory-return]`; the brand at `scripts/build-site.py:205` lacks that attribute.

4. **Low — references require a separate route to saving/evidence.** The five Start here entries render as shortcuts in the unfiltered directory. Hearts, descriptions and source/review controls appear only after View reference details changes category, while other entries expose these directly. This adds a discovery step when saving documentation or inspecting listing evidence. Recommend exposing consistent saving/evidence controls in the expanded reference group while retaining compact shortcuts. Evidence: desktop expanded/mobile collapsed Start here; `site/app.js:155`–`site/app.js:160`.

**Verification limits and cleanup**

The preview disconnected during saving: “Preview automation client server-browser disconnected during click.” A retry returned: “No preview automation host is available for click in environment f9086ae0-f4e4-45c7-9db4-0b9ce0132cf4.” Remaining checks used isolated `/usr/bin/chromium`, its own profile and debugging port, not peers' tabs/profiles. Most fallback pointer interactions used DOM clicks/change events; keyboard checks used Chromium input events. One overbroad selector accidentally navigated to a GitHub source URL; external-page content was not used as evidence and testing returned to the isolated origin.

No screen reader, physical touch device, zoom, alternative browser engine, cross-tab synchronization, storage-denied persistence or successful clipboard-write path was verified. Upstream package claims were not independently audited. The owned preview tab and isolated Chromium were closed; servers were left running. Only this assessment file was written in the repository; application code was unchanged.
