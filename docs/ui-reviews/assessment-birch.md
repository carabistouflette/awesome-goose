# Directory UI assessment — Birch

Reviewed 2026-11-06 against `docs/ui-reviews/CRITERIA.md`, app revision **9049751**. This is an independent, subjective assessment of the local developer-resource directory at `http://localhost:8765/`, not the public deployment. No other review reports were read and no application code was changed.

The directory is useful and credible: categories describe real developer jobs, descriptions distinguish scope and limitations, and source snapshots support the recommendations. Combined filtering, URL restoration and saving worked in the exercised paths. The main weaknesses are low information density before results, small text and controls, and weaker access to comparison guidance on mobile.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | --- | --- | --- |
| Visual clarity and typography | 20% | 7.0 | Restrained colors, clear group headings and consistent cards; much of the supporting text and control text is unnecessarily small. |
| Discovery and information architecture | 25% | 7.5 | Strong task categories, useful descriptions and maintainer distinction; results start late, mobile categories require considerable horizontal travel, and comparisons are separated from the decision point. |
| Interaction and feedback | 20% | 8.0 | Combined filters, reset, URL reload, saving, count changes and toasts work. Saved-mode filter retention and share semantics need clearer explanations. |
| Responsive layout and accessibility | 25% | 6.5 | Single-column cards wrap well without page overflow, with labeled inputs, pressed states and focus styles. Small targets, hidden guide navigation and offscreen results reduce usability. Full keyboard and assistive-technology validation remains incomplete. |
| Content trust and consistency | 10% | 8.5 | Review dates, immutable sources, attribution and candid limitations are unusually strong. Guide naming and theme behavior are less consistent with the directory. |

**Weighted overall: 7.35 / 10** = (7.0 × .20) + (7.5 × .25) + (8.0 × .20) + (6.5 × .25) + (8.5 × .10).

## Evidence and flows checked

- Desktop: **1440 × 900 CSS pixels**. Inspected the rendered initial light layout, a dark filtered/empty state, and DOM geometry. The initial two-column card layout is orderly, but the first card starts near the bottom of the screen.
- Mobile: **390 × 844 CSS pixels**, resized browser rather than a physical phone. Viewed the initial dark layout and database cards with an expanded review disclosure. The content area measured 375 pixels after the browser scrollbar; document scroll width also measured 375, so no page-level horizontal overflow appeared. The category strip intentionally overflowed: approximately 1,803 pixels of content in a 335-pixel container.
- Opened Saved for later with zero saved items: saw `Saved for later (0)`, the generic empty message and Show all resources recovery. Recovery reset the view.
- Combined `sqlite` + Databases + maintainer `carabistouflette` + Name A–Z. Exactly one result appeared, with all four values encoded in `?q=sqlite&category=Databases&owner=carabistouflette&sort=name`. Reloading that URL restored the controls and result.
- Saved that SQLite entry: heart pressed state, count `1` and “Saved on this device.” appeared. Reload preserved the save. Entered Saved mode, which retained the query, owner and sort but cleared category. Unsaving removed the last card, returned focus to Saved for later and displayed removal feedback. The entry added for this check was removed.
- Copy view link reported “View link copied.” The URL contained the exercised filters. This confirms the successful code path and visible feedback, not an independently read clipboard or a recipient-device test.
- Searched `zzzz-does-not-exist`: saw zero results, a clear empty panel and Show all resources. Reset restored the directory.
- Expanded the first database card’s Review notes. It revealed the review date, an immutable README snapshot ending in commit `d45a151`, and the choice-guide link. The card descriptions distinguish system SQLite from bundled SQLite, and explicitly flag PostgreSQL TLS/decoder limitations.
- Inspected rendered `CHOICES.html` on mobile through DOM/computed layout, and its SQLite section on desktop. The guide has a readable 14-pixel mobile paragraph size, ten topic sections, a clear review disclaimer and concrete comparison text. Desktop prose is constrained to 1,000 pixels. Neither tested guide width produced page overflow.
- Toggled directory theme and checked its label and persisted setting. With `goose-theme=dark`, navigating to the guide produced a light background and no theme attribute, confirming the loss of theme continuity.
- Source inspected: `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `scripts/build-site.py`, `docs/CHOICES.md` and `docs/CURATION.md`. The latter discloses the curator’s affiliation with listed libraries and explains admission/evidence standards.

## Ranked issues

### 1. Results arrive too late for a directory

**Severity: Medium.** On mobile the first card began around **y=934**, below the 844-pixel viewport, after navigation, hero, search and the introductory panel. Selecting Databases updated the heading and cards without bringing results into view. Desktop also spends most of the first screen above cards. This slows repeat lookup and makes a successful filter change difficult to see from the top.

**Recommendation:** shorten the hero, make the newcomer panel collapsible or less prominent after initial use, and place the result count directly beside search. For explicit category selection on mobile, offer a predictable jump to results while preserving keyboard focus; avoid scrolling on every typed character.

### 2. Important controls have very small targets and text

**Severity: Medium.** Mobile measurements showed 30 × 30-pixel save buttons, approximately 21-pixel-high native selects, a 16-pixel-high Review notes summary and 24-pixel-high share/reset buttons. Filter text is 9–10 pixels. Desktop card descriptions are only 11 pixels, with owner names at 9 pixels. These controls and identifiers matter when comparing similar package names and are harder to read or tap accurately.

**Recommendation:** use at least 14-pixel descriptions/supporting text where practical, and increase interactive hit areas toward 44 pixels without requiring oversized icons. Give review summaries generous padding and make owner names more legible beside package names.

### 3. Mobile hides the direct route to the comparison guide

**Severity: Medium.** At 390 pixels the header’s “The field guide” link and hero’s “How we curate” link are hidden. Category choices occupy a long horizontal strip; later groups such as databases and development tools are initially offscreen. Detailed tradeoff guidance remains reachable through a card disclosure, but its location is easy to miss.

**Recommendation:** retain a compact Guide link or a labeled mobile navigation menu, and provide a compact category selector or expandable category list. Preserve horizontal browsing only if later categories and the active choice remain easy to reveal.

### 4. Saved mode inherits filters without enough explanation

**Severity: Medium.** From the combined SQLite view, Saved for later kept search and maintainer constraints, cleared category and changed the heading to Saved for later. The saved count is the total number saved, while results can be only the matching subset. Source confirms that clicking any category exits Saved mode. A user can therefore mistake filtered-out bookmarks for missing saves, and cannot naturally refine saved items by category through the category navigation.

**Recommendation:** display removable active-filter chips near the heading and text such as “1 of 4 saved resources.” Let category filtering compose with Saved mode, or explicitly announce that changing category returns to all resources. Provide a dedicated clear-filters action that preserves Saved mode.

### 5. Sharing a saved view does not explain its device-local meaning

**Severity: Medium.** Save feedback correctly says “on this device,” but Copy view link remains available in Saved mode. Source shows that the URL carries `saved=1` while the saved IDs live only in local storage. Another device can reproduce filters but cannot recover the sender’s selected resources from that URL.

**Recommendation:** when sharing Saved mode, either encode an explicit list of resource IDs in a shareable URL or clearly label the action as copying filters and explain that saved items stay on this device. Keep the ordinary filtered-view sharing flow, which worked well.

### 6. Empty saved lists use search-oriented recovery

**Severity: Low.** A truly empty saved collection says “No resources found” and suggests broader searches or clearing filters. The same message also covers saved items hidden by retained filters. It does not explain the heart control or distinguish these situations.

**Recommendation:** use “Nothing saved yet” plus a short instruction to use a card’s heart when the saved collection is empty. When saves exist but filters hide them, say so and offer to clear filters while keeping Saved mode.

### 7. Guide navigation loses context and theme

**Severity: Low.** The header calls the destination “The field guide,” the page heading calls it “Choice notes,” and card disclosures call the link “How and why we curate.” All lead to the same long page without an in-page contents list or topic-specific link. The SQLite comparison requires finding its section manually. The guide also ignores the directory’s persisted dark theme and has no theme switch.

**Recommendation:** use one clear guide name, link database cards to `CHOICES.html#sqlite`, provide a compact contents list, and share the directory’s theme initialization across guides. Keep admission policy links directed to the distinct curation-policy page.

## Verification limits

Preview automation repeatedly timed out on native clicks, and the connection briefly reported no host. Functional checks therefore used DOM clicks and dispatched input/change events in my own tab, followed by rendered DOM and state inspection. These validate handlers and resulting UI state, but do not establish real pointer targeting or touch behavior. I did not treat those automation failures as application bugs.

Desktop and mobile directory screenshots were successfully viewed. Preview capture dimensions occasionally differed from the requested CSS viewport or were scaled; viewport claims above use `innerWidth`/`innerHeight` and measured layout, not image pixel dimensions. The guide screenshot request timed out, so its visual assessment relies on rendered DOM/computed styles and source rather than a successful guide image capture.

Keyboard support was inspected in source and the accessibility tree: labeled search/selects, native buttons/details, `aria-pressed`, live result status, a skip link, visible focus styles and shortcuts are present. Focus return after deleting the final saved result was directly observed. Full Tab traversal, screen readers, zoom, contrast measurement, storage-denied mode, clipboard failure, real phones, other browser engines, guide table keyboard scrolling and external destination availability were not validated. No external repository claims were independently re-audited. The shared browser profile limits conclusions about cross-tab state isolation; only my assigned tab was controlled.
