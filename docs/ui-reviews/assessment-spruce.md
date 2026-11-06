# Independent assessment — Spruce

Reviewed 2026-11-06. Repository revision: `5af2fac64107fb791e113feb70098bfaf1741ccd` (`5af2fac`). Frozen site: `http://localhost:18887/`. Criteria and weights are from `docs/ui-reviews/CRITERIA.md`. I did not read other assessments, review history, or peer reports. Ratings are subjective judgments of the rendered developer directory.

The directory is useful and unusually careful about helping developers distinguish similarly named packages. The compact desktop list, explicit maintainer identities, linked choice notes, limitation-aware search and immutable source evidence form a coherent discovery tool. Representative core workflows worked. The remaining issues observed here concern scanning efficiency, the mobile filter summary and small presentation/accessibility details, rather than broken core actions.

## Scores

| Criterion | Weight | Score / 10 | Judgment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | Restrained light/dark palettes, legible descriptions, clear resource identity and consistent dividers. Mobile toolbar text can wrap awkwardly. |
| Discovery and information architecture | 25% | 8.5 | Categories, maintainer filters, useful limitation descriptions and need-based comparisons make alternatives understandable. Tablet scanning is relatively slow, and mobile reading/filtering hides some context. |
| Interaction and feedback | 20% | 9.0 | Combined filtering, layouts, sorting, recovery, saving, URL state and both sharing paths worked with clear feedback. A mobile single-result heading has a grammatical inconsistency. |
| Responsive layout and accessibility | 25% | 8.5 | No document-level horizontal overflow in tested sizes; strong focus treatment, labeled controls and working keyboard paths. Reading-table regions share a generic accessible name, and the mobile sticky summary could be clearer. |
| Content trust and consistency | 10% | 9.5 | Clear language scope, review dates, immutable README pins, separate comparison baselines and explicit limits on validation. Catalog and choice-note distinctions were consistent in inspected examples. |

Exact weighted score: `9.0×0.20 + 8.5×0.25 + 9.0×0.20 + 8.5×0.25 + 9.5×0.10 = 8.800 / 10` (88.0%).

## Rendered coverage and interactions

Actual CSS viewport dimensions were read from `innerWidth`/`innerHeight`, rather than inferred from requested resize settings:

| Viewport | Direct visual coverage |
| --- | --- |
| 1440 × 1000 | Initial desktop directory; filtered cards; list; expanded source evidence; Choice notes at TOML; Source evidence index. |
| 900 × 900 | Intermediate directory list and Choice notes TOML table, including dark theme. |
| 375 × 812 | Initial mobile directory; expanded filters; results after Show; expanded evidence; empty recovery; light/dark themes; Choice notes at HTTP; Contents and SQLite navigation. |
| 320 × 700 | Narrow directory with long maintainer identity wrapping in dark theme. |

Observed document scroll widths were 1425, 885, 360 and 305 respectively, within their viewport widths; the 15 px difference is Chromium's scrollbar. No horizontal document overflow was observed. A preliminary preview-tool evaluation also confirmed 1440 × 1000 before fallback. One intermediate fallback capture inherited Chromium's default size after reconnecting and was excluded from the named viewport coverage; subsequent calls explicitly set and verified viewport size.

Flows checked through browser interaction:

- Search `sqlite`, then Databases + maintainer `kaitk`, produced exactly one `kaitk/goose-sqlite` result. Filter chips and query parameters reflected the intersection. Removing the maintainer with browser Back restored two database matches.
- Category, Name A–Z and Maintainer sorts were exercised; maintainer sorting grouped the four `toml` matches under carabistouflette and Macho0x. List/Cards switches updated pressed state and rendering.
- `decode` displayed limitation matches for an encoder-only package and unimplemented decoders. `json map` found the JSON package while explicitly showing that maps are outside its documented model. These results avoid presenting unsupported features as supported capabilities.
- Saved `kaitk/goose-sqlite`, reloaded and found it in Saved. A search with no saved matches offered “Clear filters in saved,” which preserved the saved collection. Unsaving its last item produced “Nothing saved yet,” moved focus to Saved, and offered a working “Browse all resources” recovery. A separate regular no-results search recovered with Clear filters.
- Share wrote a real clipboard URL and showed feedback. The copied `?q=toml&sort=owner` URL restored the same four matches and sort after navigation. Sharing while Saved explained that the device-local collection is excluded. With Chromium clipboard-write permission explicitly denied, the app exposed a focused, fully selected readonly URL, explained the fallback, and returned focus to Share when closed.
- `/` and Control+K focused search. Escape cleared the query while retaining search focus. Tab exposed the first skip link with a visible 3 px outline; Enter focused the directory. From search, Tab → result-count link → Enter focused the result group below the toolbar; subsequent Tabs reached resource link, comparison link, source disclosure, evidence links and Save in a sensible sequence. Enter opened evidence; Space saved a resource. Result headings and empty-state headings received programmatic focus on jumps.
- Mobile Options exposed maintainer/sort controls. Show closed the options and placed the focused results heading below the sticky toolbar: heading top about 117 px, toolbar bottom about 105 px. Editing reopened controls. Theme changed its accessible button label and persisted after reload.
- Followed a resource's TOML comparison link to `CHOICES.html#toml`; inspected its decision table and ownership/writer limitations. On mobile, HTTP choices became readable stacked entries. Contents opened the outline and focused its summary; SQLite navigation exposed its heading below the reading bar. Directory return restored the prior query/category/maintainer/sort.
- Expanded config/HTTP evidence showed review date, directory pin and a different comparison baseline with an explicit explanation. The Source evidence index showed exact README pins, license metadata and review dates, and warned that inspection is not a recommendation. Its in-page outline destinations existed.

## Ranked observed issues

1. **Low severity — Tablet list consumes considerable vertical space per resource.** At 900 × 900, the initial directory showed about two library rows below the official-resource strip; identity/license, description and evidence occupy successive lines with substantial spacing. This is readable, but slows a developer scanning a 56-resource directory or comparing adjacent alternatives. The intermediate breakpoint retains a roughly 220 px sidebar while stacking the resource overview (`site/style.css:396–400`). **Recommendation:** tighten only the intermediate list layout: combine compact metadata with the identity line where space permits and reduce row gaps/padding, while keeping the description and 44 px controls readable. Keep cards as the spacious alternative.

2. **Low severity — The mobile sticky edit summary can split a short sort label and omit the search query.** With `http` + Networking & web + `kaitk` + Name A–Z at 375 px, the sticky action rendered “Edit: Networking & web · kaitk · A–” with “Z” alone on the next line. The action showed category/maintainer/sort but not `http`; after scrolling, search and chips were above the viewport. Results still matched correctly, but a developer cannot see the complete active search context while reading results, and the split sort label adds visual noise. `updateFilterControls()` builds the preview from scope first, and `.toolbar-apply` permits arbitrary word breaks (`site/app.js`, `site/style.css:437`). **Recommendation:** keep each short token such as A–Z together and give the toolbar a deliberate two-line summary with the query represented; retain the full accessible label and Edit action.

3. **Low severity — Reading-table region names do not identify their topic.** DOM inspection found each generated table wrapper labeled only “Comparison table,” including the twelve maintainer tables in Source evidence. The nearby headings and table headers provide context during sequential reading, but region navigation cannot distinguish TOML from SQLite, or one maintainer's evidence table from another. This is a semantic observation, not a verified screen-reader failure. The shared label is emitted in `scripts/build-site.py:79`. **Recommendation:** label each region from its preceding section heading (for example “TOML options” or “carabistouflette source evidence”) and provide a matching caption or `aria-labelledby` relationship.

4. **Low severity — A single mobile match is labeled “1 matches.”** The 375 px HTTP + carabistouflette state visibly used that heading, while its live status correctly said “1 resource found.” It does not prevent discovery, but weakens consistency in the most prominent filtered-state label. `site/app.js:123` selects the plural word without a singular branch. **Recommendation:** use “1 match” / “1 resource” and pluralize larger counts consistently.

No critical or high-severity defect was observed in these flows.

## Source support and verification limits

Source inspection supported, rather than replaced, rendered checks: `site/index.html` supplied labels and skip targets; `site/app.js` supplied filtering/URL/focus/saved/share behavior and source disclosure construction; `site/catalog.mjs` supplied limitation matching and removal of Saved from shared URLs; `site/theme.js` supplied theme and guide-return/contents behavior; `site/style.css` supplied tested breakpoints/focus/table layouts; `scripts/build-site.py` supplied guide table semantics. No application code was changed.

Preview tools were discovered and `preview_status` was called first. I opened my own background tab with `reuseExistingTab:false` and used only its returned ID. Preview open/evaluate/resize worked, but two consecutive image snapshots returned exactly: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** This was a browser-tool failure, not evidence of an application defect. Per the requested fallback, I closed only that owned tab and used `/usr/bin/chromium` with `/tmp/moss-ui/node_modules/playwright-core`, a separate profile and a dedicated debugging port. The isolated browser was closed after review; shared servers were left running.

This was a Chromium review, not cross-browser or real-device testing. Narrow widths used desktop Chromium viewport emulation, without a real mobile browser, touch device or onscreen keyboard. Keyboard and DOM semantics were checked, but no screen reader, complete WCAG audit, color-contrast measurement, reduced-motion audit or browser zoom matrix was run. Source links and pinned URL structure were inspected locally; upstream repositories, license files, package correctness, security properties, performance claims and every external link were not independently revalidated. Screenshots were inspected from temporary `/tmp/spruce-*.png` files; they are local working evidence rather than committed report assets.
