# FMHY independent UI assessment — Oak

Reviewed live https://fmhy.net/ on 6 November 2026. Overall **7.0/10** (unrounded weighted score 6.975).

| Criterion | Weight | Score / 10 | Rationale |
|---|---:|---:|---|
| Visual clarity / typography | 20% | 7.0 | Clear headings, generous homepage cards and comfortable article text; pale link color undermines otherwise strong readability. |
| Discovery / information architecture | 25% | 7.5 | Strong category entry points, persistent desktop sidebar, detailed local outline and useful search filters; huge lists and changing category names impose scanning effort. |
| Interaction / feedback | 20% | 7.5 | Search has result counts, highlighted terms, category counts, keyboard hints and a useful no-result recovery; detailed results become visually busy on phones. |
| Responsive layout / accessibility | 25% | 6.0 | Most content reflows, main controls have useful names and keyboard focus is visible; low contrast, unnamed switches, small inline links and narrow-screen overflow need attention. |
| Content trust / consistency | 10% | 7.0 | Open contribution/edit path, revision link, warnings and resource constraints build confidence; per-resource review date, rationale and evidence are not consistently visible. |

Formula: 7×.20 + 7.5×.25 + 7.5×.20 + 6×.25 + 7×.10 = 6.975.

## Scope and verification

Used preview tool discovery, then preview_status and a new background tab with reuseExistingTab:false. Operated only the returned tab_10_d5b76abc-f7a4-4854-98e0-1f423e6ab780. Closed it when finished. No installed-browser fallback and no browser processes started. No repository inspection or edits.

Observed rendered homepage, /reading category, /reading#public-domain navigation and /beginners-guide article. Used 1440×900 desktop, 390×844 and 320×740 CSS viewports; actual window.innerWidth/innerHeight were checked with page evaluation. The first homepage observation was also 1280×800. Immediate resize responses sometimes returned a stale 1280×800 value; later page measurements confirmed the requested CSS sizes. Screenshot bitmap dimensions were sometimes scaled or stale, so they were not used as viewport proof.

Representative actions: opened mobile search; searched “ebooks” (29 matches, 16 initially shown); inspected category chips, snippets and pagination controls; searched an invented absent term and observed “No results” plus “Try fuzzy search?”; searched “Project Gutenberg” on desktop (three matches), then ArrowDown/Enter changed the URL to /reading#public-domain; opened mobile “On this page” and selected Public Domain; sampled desktop Tab focus through Skip to content, FMHY and Search. The mobile outline placed focus on the target heading. Successful URL changes are verified; exact scroll placement following tool actions/resizing was inconsistent and is not scored as a site defect.

This is a representative UI review, not a complete accessibility audit or destination/safety/content accuracy audit. No real mobile browser, touch keyboard, assistive technology, zoom/reduced-motion matrix, all-theme contrast sweep or external resource verification. Initial diagnostics included 503/ERR_ABORTED asset-prefetch entries while pages still rendered. Those diagnostics are not treated as user-facing navigation bugs. No prolonged retries or inferred failures from empty automation responses.

## Observed strengths

- Homepage has an immediate purpose statement, monthly update link, beginner route and 13 understandable category cards with descriptions. Four-column desktop grid becomes one column at 390px. Search remains available in the mobile header with an accessible Search name; header Search and navigation targets were approximately 48px wide.
- /reading provides an active category in the left sidebar and a right-hand outline on desktop. On mobile, Menu and On this page expose those navigation functions separately. The outline is indented by section and includes Return to top. This is valuable for a document containing 41 h2/h3 headings and 838 list items.
- Reading list items use approximately 16px type/24px line height; guide paragraphs use 16px/28px. Dark body text, section spacing and article info callouts support sustained reading. Mobile content wrapped without large text collisions in observed 390px pages.
- Search shows counts, highlighted matches and category chips. At 390px its full-screen layout avoids a small floating dialog. At 320px the empty-result screen remains readable and offers a next action. Search field has a Search label, aria-autocomplete and controls linkage; controls have names such as Close search, Exact Search Active and URL Search Off.
- Desktop keyboard Tab reached Skip to content, logo and Search with gold focus outlines (:focus-visible true). Main headings have explicit permalink names. This is positive evidence, though the full focus order and modal trap were not audited.
- Resources sometimes disclose Account Required, Requires Invite, platform, download/online reading and warning/note controls. The guide explains limitations and unwanted download buttons. Edit this page, contributing/feedback paths and a linked commit revision provide a public maintenance trail.

## Ranked actionable findings

1. **High — darken light-theme links and key blue text.** On /reading, links including Open Slum use rgb(93,153,218) on the body background rgb(248,250,252). Calculated relative-luminance contrast is **2.85:1**. Normal 16px resource links need stronger contrast; even large blue headings are below 3:1 with this pair. The same pale treatment appears in search links and guide links. Choose a darker link token and verify normal, hover, visited and focus states. Keep an underline or other non-color cue; observed computed link decoration was underline in the sampled state.

2. **High — programmatically name the two sidebar filter switches.** The accessibility tree exposes generic switches beside visible “Toggle Starred” and “Toggle Indexes” text. DOM inspection found empty button role=switch elements with aria-checked but no aria-label, aria-labelledby, id or contained label; immediate parent is an ordinary div. Associate each switch with its visible text and enlarge the 40×22px switch hit area. This helps screen-reader identification and touch accuracy.

3. **Medium — reduce scanning and nested scrolling in detailed search on mobile.** “ebooks” results at 390px include long section excerpts, a horizontally scrolling category row, a scrolling results panel and per-card match pagination overlays. The first card alone includes Books / Comics / Manga → Ebooks, list entries and a 1/5 control. The result count and category chips are useful, but a compact title + matched line default with optional expansion would make results easier to compare and reduce interaction burden. Keep Detailed view as an explicit expansion choice.

4. **Medium — bring discovery/content higher on phones.** On the 390px homepage, the first category starts around y=651 and Reading around y=1741; the oversized decorative play icon and four hero actions consume most of the initial viewport. On the 320px category, a feedback panel consumes roughly y=297–452 before Ebooks. At 390px in the guide, feedback likewise precedes the first substantive section. Shrink the mobile hero and move feedback to the end or a compact utility control. Add a compact category jump list so users can reach later categories without traversing tall cards.

5. **Medium — fix the narrowest document layout overflow.** On /reading at actual innerWidth320, documentElement.clientWidth was305 while scrollWidth was320; a horizontal scrollbar was visible. Layout/VPContent/local navigation measured 320px wide, exceeding the width available beside the vertical scrollbar. At desktop and observed 390px guide/home, scrollWidth equaled clientWidth. Replace the relevant fixed/minimum viewport width with container-relative sizing and verify 320px with classic scrollbars. The observed overflow is small rather than destructive, but avoid requiring horizontal movement in a text directory.

6. **Medium — make dense resource metadata easier to interpret and tap.** /reading's opening entries contain many slash-separated destinations and numbered mirror links (“2, 3, …9”). Some inline destinations have little descriptive text or touch separation. A short metadata line with explicit Mirror/Platform/Requires account labels, plus an optional details disclosure, would improve comparison. Preserve the compact list option for expert visitors. Category naming should also align across home and inner navigation: “Reading” becomes “Books / Comics / Manga”, “Streaming” becomes “Movies / TV / Anime”, and “Listening” becomes “Music / Podcasts / Radio”.

7. **Medium — expose maintenance evidence at the point of recommendation.** A commit hash and monthly update route are helpful, but sampled resource rows do not consistently show when checked, why starred, or how a warning was established. Place a concise selection/verification policy near the legend, surface last-reviewed information where practical, and distinguish community recommendation from independently verified status. Bare-name entries in Public Domain provide less decision support than descriptive entries elsewhere. This is an evidence/consistency gap in the observed UI, not a claim that linked resources are unreliable.
