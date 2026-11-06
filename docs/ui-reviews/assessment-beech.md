# Independent UI assessment — Beech

Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. Revision: **0e87077**, confirmed with `git -C /home/arobin/Work/Projects/awesome-goose rev-parse --short=7 HEAD`. Frozen site: `http://localhost:18877/`. These scores are subjective judgments of the rendered developer directory and its Choice notes guide.

**Overall: 8.75/10.** The directory is readable, unusually explicit about library limitations, and dependable across the representative interactions tested. I found no blocking site defect. The remaining improvements concern discovery, mobile density, and the guide's editorial scope.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Rationale |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.800 | Restrained colors, strong headings, readable descriptions, consistent rows/cards, and clear light/dark treatments. Supporting metadata is comparatively small. |
| Discovery and information architecture | 25% | 8.5 | 2.125 | Category counts, maintainer attribution, named alternatives and comparison links help developers select a package. Some starter resources are concealed behind a generic disclosure. |
| Interaction and feedback | 20% | 9.0 | 1.800 | Combined filters, URL state, sorting, saved-state persistence, reset, layout controls, theme, copy feedback and recovery states worked. |
| Responsive layout and accessibility | 25% | 8.5 | 2.125 | Narrow layouts reflow without page overflow; sampled controls retain 44 px targets, explicit accessible names and visible focus. An expanded mobile filter area consumes considerable vertical space. |
| Content trust and consistency | 10% | 9.0 | 0.900 | Reviewed dates, immutable source links, licensing, named maintainers and candid platform/security/feature limits support trust. The guide includes a lengthy development roadmap beyond selection advice. |
| **Total** | **100%** | | **8.750** | `9×0.20 + 8.5×0.25 + 9×0.20 + 8.5×0.25 + 9×0.10 = 8.75` |

## Tested views and flows

- **Desktop, actual `innerWidth` 1440 / `innerHeight` 900:** initial category-grouped list; sidebar discovery; card layout; light and dark themes; expanded Source & review; Choice notes reading layout. The guide's main text column measured approximately 658 px with 16 px body text.
- **Mobile, actual 375×812:** search; category selector; expanded Filters; maintainer and sort combinations; active chips; Show resources; saved and empty states; Choice notes, contents navigation and return to the directory. Directory and guide document widths were 360 px inside the 375 px viewport, leaving the scrollbar; neither exceeded the viewport.
- **Additional narrow check, actual 320×740:** initial directory and the guide at its TOML section. Document width was 305 px inside the 320 px viewport. Long repository names and prose wrapped successfully.
- **Combined discovery:** `toml` + Data formats and text + carabistouflette + Name A–Z returned goose-toml then goose-toml-edit. Active chips and a count of two matched the displayed results. `http` + Networking and web + kaitk + Maintainer returned goose-http and plod. Category was the initial sort; Name A–Z and Maintainer were exercised.
- **Sharing and state:** the filter query appeared in the URL and restored on direct navigation. A real Share click in isolated Chromium showed “Filters link copied.” Clipboard readback exactly matched `http://localhost:18877/?q=toml&category=Data+formats+and+text&owner=carabistouflette&sort=name`. Clipboard permission was granted for that isolated check. The Saved view explicitly says saved items stay on the device and are not included in shared collections.
- **Saved/recovery:** first-use “Nothing saved yet”; saving goose-toml; one matching saved result surviving navigation/reload; a nonexistent query producing “No saved resources match these filters”; Clear filters retaining the Saved collection; removing the final saved item in isolated Chromium, which restored focus to the Saved button and showed the empty collection message.
- **Keyboard:** physical Tab events revealed Skip to resources and Skip to search with a visible 3 px outline. Enter on Skip to search focused the input. `/` focused search. Accessible names distinguished repeated heart and Source & review controls. Sampled mobile buttons, selects and disclosure summaries measured 44 px high.
- **Guide:** followed the rendered Compare HTTP options link to `CHOICES.html#http-and-web`; read HTTP, cryptography, Ethereum, TOML and adjacent material; used Contents ↑ to open the section list, selected HTTP and web, and returned to the directory. The return restored `q=http`, category, maintainer and sort. The section heading landed below the sticky mobile navigation. The directory's dark theme persisted into the guide.

## Ranked improvements

1. **Low — Name the hidden starter resources.** The initial view presents Compiler, Docs and Stdlib followed by “More”; Packages and Samples and the fuller descriptions/save controls are behind that disclosure. A newcomer cannot tell which useful resources it hides. Replace “More” with a descriptive label such as “All 5 starter resources,” or expose Packages and Samples alongside the three shortcuts. This is a discoverability issue, not a broken disclosure.
2. **Low — Reduce the height of an expanded mobile filter state.** At 375×812, the title/search, collection controls, category, expanded maintainer/sort controls, Show resources and three active chips push most result content below the first screen. The working Show resources button mitigates this by collapsing Filters and scrolling to results. Consider consolidating chips into a compact active-filter summary while the panel is open, and making the existing result-jump affordance more prominent during filtering.
3. **Low — Keep the choice guide focused on choosing packages.** The Ethereum section shifts from package fit into a multi-step implementation plan covering primitives, ABI/RPC, signing and application adapters. Its length delays later package comparisons, especially on a narrow screen, and its author-specific scope is different from the surrounding selection notes. Move the roadmap to a separate development document and retain a short linked statement of the current gaps here.
4. **Low — Increase supporting-text comfort.** Maintainer/license metadata, search helper text and Source & review labels appear small relative to resource descriptions on desktop. They carry attribution and evidence that developers may need to compare. Slightly increase their type size or weight while retaining the clear hierarchy and compact row layout.

## Verification limits and tooling

I worked independently and read no other assessment, review history or peer report. I used the criteria file, rendered page/DOM evidence and a revision check; I did not audit application source or independently validate upstream library claims.

Preview tools were discovered, `preview_status` was called first, and I opened a background tab with `reuseExistingTab:false`. All subsequent preview actions explicitly targeted its returned ID, `tab_1g_d5b76abc-f7a4-4854-98e0-1f423e6ab780`. I closed that tab only. Shared servers were left running.

Preview automation was intermittently unreliable. The guide screenshot step failed twice consecutively with **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** A Share attempt also returned **“Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying.”** Some valid CSS/text link targets were rejected by the automation adapter; coordinate interaction subsequently navigated successfully. Immediate resize responses occasionally retained old viewport values; actual `innerWidth`/`innerHeight` were checked after settling. These are tooling limits and were not scored as site defects.

After the two consecutive screenshot failures, I used installed `/usr/bin/chromium` in a new temporary profile and an isolated headless CDP session for screenshots, keyboard, clipboard and final removal checks. I inspected its captured directory/guide images directly. Those browser processes were terminated and their profiles removed. This also resolved the ambiguous preview Share and unsave outcomes: both worked in isolated Chromium.

This is representative desktop Chromium testing with CSS viewport resizing, not a real-phone/touch, Safari, Firefox, screen-reader or full WCAG audit. I did not test every resource, every filter permutation, all external destinations, blocked-clipboard fallback, storage failure, zoom/reduced-motion behavior, or long-term persistence. Sampled semantics/focus and measured targets support the accessibility score but do not establish complete conformance.
