# Directory assessment — Granite

Reviewed revision `2146042` on 2026-11-06 against `CRITERIA.md`. Scores are subjective judgments from the bounded checks below.

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.0 | Restrained colors, readable body text, clear heading hierarchy, and distinct card actions. Narrow navigation wraps awkwardly and card chrome consumes substantial vertical space. |
| Discovery and information architecture | 25% | 8.0 | Categories, maintainer filtering, example searches, and owner attribution make alternatives easy to distinguish. SQLite descriptions explain the system-versus-bundled dependency tradeoff immediately. Mobile hides the prominent curation entry point. |
| Interaction and feedback | 20% | 8.2 | Search/category/maintainer composition, URL state, removable chips, and nuanced saved empty states worked. Save feedback and focus recovery were particularly clear. Clipboard and theme interaction remain incompletely verified. |
| Responsive layout and accessibility | 25% | 7.8 | Tested mobile layouts contained content without document overflow; native selects, labeled controls, 44-pixel primary actions, live status, and keyboard focus styles are good foundations. Small inline card links and tall narrow-screen filter composition remain concerns. |
| Content trust and consistency | 10% | 9.0 | Dated evidence, immutable snapshot construction, author-affiliation disclosure, explicit comparison limits, and concrete dependency caveats establish a strong basis for trust. Some attribution and guide-link presentation could be clearer. |

**Weighted overall: 8.08 / 10** (`8.0×0.20 + 8.0×0.25 + 8.2×0.20 + 7.8×0.25 + 9.0×0.10`).

## Observed findings, ranked by severity

1. **Medium — Card choice links have small touch targets.** At the 320-pixel viewport, the SQLite card's “Choice notes →” link measured approximately 85×19 CSS pixels, while its save and review controls were 44 pixels tall. This makes an important decision-support action harder to tap, especially with reduced dexterity. Give the card-footer link a padded target at least 44 pixels tall while preserving adequate separation from adjacent actions. Evidence: rendered accessibility geometry and `.card-foot` styling in `site/style.css`.

2. **Low — Mobile curation discovery is weakened.** The mobile layout hides `.hero-meta`, including “How we curate.” On desktop this appears beside the resource total; mobile readers instead need to find policy links through a resource's expanded review details. This makes the admission policy and maintainer affiliation less visible before trusting a recommendation. Preserve a compact, visible curation link near the mobile introduction or footer. Evidence: 390-pixel rendered directory and the mobile `.hero-meta { display:none; }` rule.

3. **Low — Narrow navigation and expanded filters delay useful results.** At 320×740, “Choice notes,” “All resources,” and “Saved for later” wrap onto multiple lines. With SQLite, Databases, and kaitk active and “More filters” expanded, the first card begins around document y=823, below the initial viewport. Nothing overflowed, and collapsing filters remains possible, but the combined controls and chips demand considerable scrolling. Use a deliberate narrow navigation arrangement and consider an explicit collapse-after-selection option or a compact active-filter summary. Keep the existing result-jump affordance. Evidence: 320-pixel screenshot and layout geometry.

4. **Low — Some first-party resources appear to have a generic maintainer.** “Documentation” displays “Community” even though its destination is `aardappel.github.io/goose`. Adjacent compiler resources display `aardappel`. The generic label can obscure which documentation is first party. Store explicit publisher/maintainer metadata for non-GitHub resources instead of deriving every owner from a GitHub URL. Evidence: rendered Start here card and owner derivation in `scripts/build-site.py`.

5. **Low — Filter feedback has avoidable grammatical roughness.** A single match displays “1 results ↓” and the live status says “1 resources found.” The meaning remains clear, but polished singular forms would improve consistency, particularly in spoken feedback. Format resource/result nouns according to the count. Evidence: rendered combined-filter state and `site/app.js`.

No high-severity issue was established in these checks.

## Evidence and checks

- Inspected `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, `scripts/build-site.py`, `docs/CHOICES.md`, and `docs/CURATION.md`. No other assessment or git history was read.
- Browser checks used only the reviewer's own tab, first at port 8765 and then at the identical frozen app on port 8766 to isolate local storage. Requested CSS viewports were 1280×800, 390×844, and 320×740; `innerWidth`/`innerHeight` confirmed each size despite stale resize receipts. Classic scrollbar space reduced the document content width by approximately 15 pixels.
- Successful mobile screenshots covered the unfiltered directory at 390 pixels and composed SQLite/Databases/kaitk filters at 320 pixels. Both layouts stayed inside the viewport. At 1280 pixels, DOM/computed layout confirmed two card columns and no document overflow; desktop image capture did not succeed.
- Search for `sqlite` returned both owner-distinguished alternatives. Combining Databases and kaitk returned one result and serialized all three filters in the URL. The active chips matched those filters.
- Saved the kaitk SQLite entry, observed the on-device toast and persisted ID, entered Saved, searched for a nonmatch, and used “Clear filters in saved.” That action retained Saved and focused the results heading. Removing the final saved card showed “Nothing saved yet” and focused the Saved navigation control. “Browse all resources” returned to the full directory.
- The `/` shortcut focused search and produced a visible computed focus ring. Tab moved to the first example-search button, whose computed outline was the accent color. Source inspection also confirmed accessible save names/pressed state, labeled native selects, live result status, focus styles, and skip links.
- Opened `CHOICES.html#sqlite` at 320 pixels. The anchor landed approximately 88 pixels below the viewport top; the contents disclosure was collapsed; no document overflow was measured. The Back to directory link retained `?q=sqlite`. The guide source clearly distinguishes system and bundled SQLite, disclaims independent security/performance validation, and links supporting evidence. Curation source discloses the maintainer's authorship and explains consistent inclusion criteria.

## Verification limits

Preview automation was intermittent: several snapshots timed out, a theme-button click timed out without a theme change, and a card-link click was rejected by the automation selector interface. These are tool outcomes, not established application defects. Theme behavior was assessed from source and current labels, not a completed interactive toggle. Clipboard output, reload persistence, history traversal, and an actual click back from the guide were not verified. The guide's mobile geometry was inspected, but its screenshot timed out. No screen reader session, real touch device, browser zoom, automated contrast audit, network-failure test, or upstream source/link validation was performed. The review tab was closed after checking.
