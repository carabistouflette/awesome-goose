# Directory UI assessment — Amber

Reviewed revision `9049751` on 2026-11-06 against `docs/ui-reviews/CRITERIA.md`. This assessment was independent; no other review reports were read. Scores are subjective judgments of the directory as a developer resource tool.

## Verdict and scores

The directory has a coherent, restrained visual system and unusually useful descriptions of package scope. The strongest content is difficult to read comfortably: secondary text is consistently small and low contrast, while a large introduction pushes the actual resources below the initial mobile viewport. The main improvement is to give resource information more visual priority.

| Criterion | Weight | Score / 10 | Rationale |
| --- | --- | --- | --- |
| Visual clarity and typography | 20% | 6.5 | Clear headings, consistent cards and grouping; small, pale text weakens practical readability. |
| Discovery and information architecture | 25% | 7.5 | Useful categories, maintainer distinction and tradeoff descriptions; excessive introductory space and weak access to long-guide sections. |
| Interaction and feedback | 20% | 7.5 | Search and combined filters worked, URLs reflected state, save feedback and persistence worked; active-filter visibility and guide continuity need improvement. |
| Responsive layout and accessibility | 25% | 6.5 | Single-column cards and wrapping work; labels, pressed states and skip focus exist; contrast, small controls and mobile navigation visibility reduce usability. |
| Content trust and consistency | 10% | 8.5 | Review dates, immutable source references, author attribution and candid limits; guide rendering and naming consistency need polish. |
| **Weighted overall** | **100%** | **7.15 / 10** | `6.5×.20 + 7.5×.25 + 7.5×.20 + 6.5×.25 + 8.5×.10` |

## Evidence and coverage

- Local rendered site: `http://localhost:8765/`, using only the independently opened review tab. Desktop CSS viewport was 1440×900; initial tab also rendered at 1280×800. Mobile CSS viewport was 390×844. Tool screenshot pixel sizes sometimes differed from CSS viewport sizes; measurements below use DOM geometry and CSS sizes.
- Initial directory: 56 resources, categories with counts, two-column desktop cards, one-column mobile cards. No document-level horizontal overflow was observed on the mobile directory or Choice notes guide; mobile category navigation scrolls horizontally inside its own container.
- Entering `sqlite` returned two alternatives: carabistouflette and kaitk. Their descriptions immediately distinguish system SQLite with recovery/platform requirements from bundled SQLite with transaction/savepoint blocks.
- Combining `sqlite`, Databases, maintainer `carabistouflette`, and Name A–Z produced one matching card and the URL `?q=sqlite&category=Databases&owner=carabistouflette&sort=name`. The result count and pressed category state matched.
- Opening that card’s Review notes revealed review date 2026-11-06, an immutable README source link at commit `d45a151`, and the choice guide link.
- Saving the SQLite card showed “Saved on this device.” and count 1. Navigating afresh to `?saved=1` rendered the saved card, confirming persistence across page navigation. A search for `zzzz-unfindable` produced a zero-result state in the DOM with broader-search/reset guidance. A completed visual screenshot of that empty state was unavailable because the snapshot timed out.
- The mobile saved view was directly rendered in dark mode. The Choice notes guide was directly rendered in light mode at 390×844, with wrapped links, readable paragraph measure and a directory return link. Its HTTP comparison and introductory evidence limits were inspected; remaining sections were inspected through rendered text/DOM and source. Tab focused the guide’s visible “Skip to content” link with an accent outline.
- Supporting source inspection: `site/index.html`, `site/style.css`, `site/app.js`, `site/catalog.mjs`, `scripts/build-site.py`, and `docs/CHOICES.md`.

## Findings

### 1. High — Small, muted text compromises the information developers need

**Observed:** Desktop card descriptions are 11px, maintainer names 9px, and footer/license metadata 8px. Mobile descriptions rise to 12px, while much filter and metadata text remains 9–10px. The rendered cards look noticeably faint relative to their titles. The light palette’s `#737a72` muted text has calculated contrast of approximately 4.38:1 on `#fffefa` cards, 4.08:1 on the `#f7f6f2` page, and 3.68:1 on `#eeeae0` panels. These fall below 4.5:1 for normal-sized text. This also affects muted guide paragraphs.

**Impact:** Scope, limitations and maintainer identity are the directory’s decision-making content. Readers must work harder or zoom to compare alternatives, particularly same-name repositories.

**Recommendation:** Darken the light-theme muted token to meet at least 4.5:1 on every text-bearing background. Increase descriptions to about 14px and supporting labels to at least 12px; retain compact spacing through layout rather than shrinking essential information. Recheck card, onboarding, filter and guide text together.

### 2. Medium — Introductory space delays access to resources

**Observed:** At 1440×900 the result groups begin around document y=821 and first cards around y=854, so only card headers initially appear. On the 390×844 layout, result groups begin around y=901 and the first card around y=934. The hero and full “Start with the language and standard library” panel remain present during a one-result SQLite search and in Saved for later.

**Impact:** Experienced developers and returning visitors scroll through repeated onboarding to inspect even a single filtered match. The visual density is low where the task is most urgent.

**Recommendation:** Compress hero margins, place search closer to the title, and collapse or omit the onboarding panel in search, category and saved views. Aim to show at least one complete useful card in the initial mobile viewport and a meaningful first row on desktop.

### 3. Medium — Mobile category state can be hidden outside its navigation viewport

**Observed:** After selecting Databases on desktop and resizing to 390×844, the category strip showed its first categories while the active Databases button remained at x≈735 inside the horizontal scroller. The active selection was therefore outside the visible strip. The strip is roughly 335px wide and contains fourteen categories. The source does not scroll the selected item into view or provide a compact visible selected-category control.

**Impact:** Users cannot immediately see or clear the active category from the category controls, especially after opening a shared filtered URL. Long category labels make discovering later categories laborious.

**Recommendation:** Scroll the selected category into view on initialization and state changes, and expose the active category alongside the filters with a clear removal control. Consider a labelled mobile category selector instead of relying entirely on a horizontal strip.

### 4. Medium — Several frequent controls are unnecessarily small

**Observed:** The save button measures 30×30 CSS pixels; Review notes is approximately 69×16; maintainer and sort selects are about 21px high; mobile Reset filters is about 49×24. Mobile search-example buttons are only about 16px high and sit close to adjacent punctuation/buttons. These sizes are confirmed by rendered geometry and stylesheet values.

**Impact:** Touch selection requires precision and small text compounds the difficulty. The saving and evidence controls are used repeatedly during comparison.

**Recommendation:** Give standalone save, reset, select and disclosure controls at least 40–44px comfortable touch height. Enlarge the full disclosure hit area and ensure closely spaced example buttons have sufficient target spacing. This is a usability recommendation, not a blanket claim that every listed control fails the same accessibility criterion.

### 5. Medium — The long guide lacks section navigation and loses list semantics

**Observed:** The mobile Choice notes document is about 6,756 CSS pixels high with ten topic sections, including SQLite near y=4,576, and no contents navigation. In the rendered accessibility tree, the Ethereum dependency sequence is a generic list rather than an ordered list. Continuation paragraphs appear as direct list children outside list items. `scripts/build-site.py` converts both numbered and dash bullets into `<ul>` and closes each `<li>` before its continuation paragraphs.

**Impact:** Reaching a specific comparison takes substantial scrolling. Assistive technology does not receive the intended numbered dependency sequence or correct item boundaries.

**Recommendation:** Add a compact linked contents list, stable section links and a return-to-contents affordance. Render numbered lists as `<ol>` and keep continuation paragraphs inside their owning `<li>` using a proper Markdown renderer or corrected parsing.

### 6. Low — Theme and guide naming are inconsistent across page types

**Observed:** The directory labels the destination “The field guide,” the card labels it “How and why we curate,” and the destination heading is “Choice notes.” Directory dark mode was rendered, while the guide uses the default light palette. Source confirms generated guide pages include the shared stylesheet but no theme initialization or toggle, so the directory’s stored theme is not applied there.

**Impact:** The same destination appears to have different purposes, and readers choosing dark mode encounter an abrupt palette change during research.

**Recommendation:** Choose one clear guide name and use it consistently in navigation and card links. Initialize theme before guide paint with the same preference logic as the directory, and retain a theme control on guide pages.

## Strengths worth retaining

The warm neutral palette, quiet borders, left navigation and clear card titles produce an orderly directory. Cards include useful licensing and maintainer attribution without badges or popularity metrics distracting from suitability. The SQLite alternatives demonstrate real comparative value. Review notes expose source provenance progressively, and the choice guide explicitly distinguishes documented claims from independent audits or reproduced benchmarks. Search labels, native selects, live result status, pressed button states and visible keyboard focus provide a sound base.

## Verification limits

This was a browser/source review, not a formal accessibility audit or independent validation of library claims. Preview automation disconnected once and several subsequent click/snapshot operations timed out. Search, combined filters, opening review evidence, successful saving and saved persistence are confirmed. Unsave, empty-state reset and clipboard copying were attempted but could not be reliably confirmed; they are not reported as application failures. A zero-result state was verified in the DOM, but its final screenshot failed. Full keyboard traversal, a screen reader, browser zoom, physical touch devices, system-theme transitions and all guide tables were not tested. The deployed public site was outside scope. Application code was not changed.
