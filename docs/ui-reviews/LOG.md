# UI review record

The user requested iterative independent UI assessment and improvement until every
reviewer in the final round assigns at least 9/10 overall. Ratings are subjective,
not a certification. The [neutral criteria](CRITERIA.md) keep weights fixed.

## Review independence

Each reviewer is an AI subagent in a fresh, isolated context.

Reviewer contexts contain only the current application, neutral criteria, local
browser setup, and report destination. They do not receive the optimization target,
previous ratings, previous reports, conversation history, or iteration framing.
The initial reviewer briefs included improvement context; those agents were stopped
and their work was discarded before the baseline below. No scores were used from
those attempts. Later user design feedback interrupted another unfinished pair;
that pair also supplies no accepted scores.

The baseline uses three independent reviewers. They converged on the same problems,
so the user authorized reducing later rounds to two fresh reviewers. Each completed
round freezes the app revision during assessment. Each reviewer uses its own browser
tab; subsequent setups separate local origins to avoid shared storage interference.
Reports preserve actual verification limits, including preview automation failures.

## Completed baseline

Application: `9049751`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Amber](assessment-amber.md) | 6.5 | 7.5 | 7.5 | 6.5 | 8.5 | 7.15 |
| [Birch](assessment-birch.md) | 7.0 | 7.5 | 8.0 | 6.5 | 8.5 | 7.35 |
| [Cedar](assessment-cedar.md) | 6.5 | 7.5 | 7.5 | 6.0 | 8.5 | 7.03 |

The shared issues were small low-contrast text, results below the first screen,
small touch targets, mobile category visibility, saved-view ambiguity, and guide
inconsistencies. The reports explain the evidence and limits independently.

## Implemented changes

Application: `2146042` (including `27fc909`).

- Larger text and 44px main controls; stronger light/dark contrast; system fonts.
- Smaller introduction, no decorative slogans, no filled navigation tiles, and no
  redundant getting-started panel. Plain text identifies the selected navigation.
- Visible mobile category selector and compact maintainer/sort disclosure; sticky
  desktop category navigation and an explicit results jump.
- Removable active filters; category filtering composes with Saved; counts show
  matching saves versus the collection total. Clear filters preserves Saved.
- Distinct empty collection and filtered-save messages; saved-link sharing explains
  that only public filters travel, and omits device-local saved mode from the URL.
- Escape clears search while retaining focus. Removing saves/filter chips restores
  focus to a predictable destination. Explicit filter changes have browser history.
- Topic-specific choice links, real source/review disclosures, guide contents,
  shared theme, and return links preserving directory filters.
- Correct ordered lists and continuation semantics; focusable overflow tables;
  regression tests for guide navigation, choice anchors and Markdown list structure.

Further accepted reviews and changes are recorded below as they complete.

## Second completed assessment

Application: `2146042`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Fern](assessment-fern.md) | 8.5 | 8.0 | 8.0 | 8.0 | 9.0 | 8.20 |
| [Granite](assessment-granite.md) | 8.0 | 8.0 | 8.2 | 7.8 | 9.0 | 8.08 |

This round did not meet the requested threshold. The remaining shared concerns were
card density on mobile, secondary link targets, owner attribution for same-name
projects, and mobile curation/category clarity. No major issue was established, but
both reviewers identified room for meaningful improvement. Their verification limits
are retained in their reports rather than counted as application failures.

## Changes following that assessment

Application: `5f387aa`.

- Compact list is the default; an explicit List/Cards control allows expanded cards.
  The selected layout is represented in the URL. Library categories appear before
  the introductory resource group in the all-resources browse order.
- Exact repository links visibly include owner/package identity and have full
  accessible names. Non-GitHub official documentation is attributed to aardappel.
- Resource titles and direct choice links have padded 44px hit areas. Compact rows
  reduce repeated card chrome and keep descriptions and evidence near each other.
- Mobile category options include resource totals. Very narrow navigation and
  filters use a deliberate stacked arrangement. Curation remains directly visible.
- Singular result/status wording is corrected. The unbounded empty-state SVG is
  removed rather than replaced with decorative artwork.
- External Markdown source links retain their original URLs; only local guide links
  are rewritten to generated HTML. A regression test first reproduced the external
  source-link defect and passes after the fix.

## Third completed assessment

Application: `5f387aa`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Harbor](assessment-harbor.md) | 8.5 | 8.0 | 8.0 | 8.5 | 9.0 | 8.33 |
| [Iris](assessment-iris.md) | 8.4 | 8.0 | 8.3 | 8.2 | 8.7 | 8.26 |

This round did not meet the requested threshold. Both reviewers identified the
inconsistent placement of foundational references, a clipboard-failure fallback
that could preserve `saved=1`, and remaining small-screen/guide navigation friction.
One also identified choice links whose destination did not cover the linked entry.

## Changes following that assessment

- Foundational resources now come first in both navigation and default results.
  Their default list presentation is plain reference links with a route to full
  details/saving, rather than a promo panel or five large cards.
- Clipboard failure exposes the same sanitized URL as successful copying, in a
  focused selectable field. Its Close control restores focus to Share. A real
  denied-clipboard check confirmed that `saved=1` was omitted from the fallback.
- Directory actions and the 320px header/browse switches occupy fewer initial rows.
  At very narrow widths, layout selection remains available inside Filters.
- Guide contents have explicit plus/minus disclosure indicators. Entry-specific
  choice links appear once and use contextual labels; resources without matching
  guidance retain their independent source/review disclosure.
- Automated checks cover share URL normalization, nonduplicated/contextual choice
  links, first-party attribution, local/remote guide links, list semantics and
  generated navigation. Normal text palette tokens exceed 4.5:1 on configured
  surfaces (minimum calculated 5.48:1 light, 6.17:1 dark); this is not a formal audit.

Publication: `5f387aa` was pushed during the iteration at the user's request. Its
catalog and Pages workflows succeeded. Further validated corrections are pushed
periodically rather than withheld until the final ratings.

## Fourth completed assessment

Application: `4d505db`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Juniper](assessment-juniper.md) | 8.8 | 8.1 | 8.2 | 8.4 | 9.0 | 8.42 |
| [Kestrel](assessment-kestrel.md) | 8.8 | 8.3 | 8.7 | 8.1 | 8.8 | 8.48 |

This round did not meet the target. The remaining findings concerned explicit
language/maturity context, layout switching at 320px, responsive guide contents,
and horizontal comparison tables concealing qualifications on small screens.

## Following corrections

- The introduction names and links aardappel's Goose programming language and gives
  a visible early-ecosystem compatibility link.
- A visible layout toggle remains alongside Share even at 320px; presentation is
  no longer hidden inside Filters.
- Mobile reference links collapse behind their Start here disclosure. Desktop
  references remain available directly, with per-layout user expansion preferences.
- Guide contents responds to breakpoint changes while remembering deliberate user
  expansion/collapse separately for mobile and desktop.
- Comparison tables retain native headers and explicit roles, and show stacked
  labelled cells on mobile. Reasons and limits are visible without horizontal
  exploration. A regression test covers column-label and qualification preservation.

## Independent FMHY assessments

The user requested ratings of FMHY as an additional site. Two fresh contexts were
given only `https://fmhy.net/`, the same five general directory criteria and weights,
and independent report destinations. Neither brief mentioned Awesome Goose, prior
scores, an improvement target, or a comparison request. These assessments are not
part of the Awesome Goose stopping criterion and do not justify changing its scores.

- [North](assessment-fmhy-north.md): raw weighted score **7.075**, reported as **7.1/10**.
- [Oak](assessment-fmhy-oak.md): weighted score **7.0/10**.

Both reviewed live desktop/mobile behavior and recorded verification limits. Their
findings and scores are preserved as separate observations, not a joint ranking.
The user subsequently authorized up to three reviewers when useful; the following
Awesome Goose round uses three fresh reviewers with distinct primary emphases.

## Fifth completed assessment

Application: `1e4ad6e`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Pine](assessment-pine.md) | 8.5 | 8.0 | 9.0 | 8.5 | 9.0 | 8.53 |
| [Quartz](assessment-quartz.md) | 8.5 | 8.4 | 8.9 | 8.4 | 8.8 | 8.56 |
| [Reed](assessment-reed.md) | 8.5 | 8.0 | 8.5 | 8.0 | 9.0 | 8.30 |

This round did not meet the threshold. The principal remaining friction was mobile
filter-to-results travel and navigation within long reading guides. Other findings
included introductory cards, ambiguous category counts, clipped search guidance,
unlinked recommendations, and one dangling sentence after choice-link extraction.

## Following corrections

- Expanded mobile filters include a current-count Show resources action. It closes
  the controls, focuses the result group's heading, and scrolls directly to results.
  A 320×568 check placed the first matching resource about 126px below the top.
- Start here remains a compact disclosure in both layouts. Full reference entries
  remain available through the explicit details action and selected category.
- Category counts now account for search, maintainer and saved filters, excluding
  only the current category selection. The sidebar identifies matching counts.
- Search has a short placeholder and a visible, programmatically associated fields
  hint. The clipped example/control row is replaced with the concise help/results row.
- Mobile guides have a compact persistent Directory/Contents bar. Every return link
  preserves filters, and the contents include third-level comparison topics.
- The recommendation table links directly to its recommended repositories or the
  inspected client source. Source evidence and existing qualifications are retained.
- The extracted crypto warning remains a complete sentence. Structured automated
  checks cover this, facet counts, guide navigation, and source-link preservation.
- Built CSS/JS/modules use content fingerprints so deployments do not mix new entry
  scripts with stale imported modules or styles. Generated asset hashes/imports are
  validated automatically. No external runtime dependency was added.

Structured platform/dependency facets remain a possible future enhancement; current
entries and choice notes state their specific evidence-backed requirements in prose.
They were not inferred or generalized into unsupported compatibility promises.

## Sixth completed assessment

Application: `d7186d9`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Stone](assessment-stone.md) | 8.5 | 8.0 | 9.0 | 8.3 | 9.0 | 8.475 |
| [Thyme](assessment-thyme.md) | 8.5 | 8.5 | 8.0 | 8.5 | 9.0 | 8.45 |
| [Willow](assessment-willow.md) | 8.5 | 8.5 | 8.0 | 8.5 | 8.0 | 8.35 |

This round did not meet the threshold. Stone initially reported the neighboring
workspace revision; a clearly labelled owner annotation preserves the correction
and the unchanged score. The served application stayed frozen throughout review.

## Following corrections

- All/Saved now share a persistent bar with layout and sharing controls. Switching
  collections preserves filters; category navigation moves to the new results.
  Saving a resource retains reading position.
- The mobile heading, helper row and category labels are shorter, with full category
  names retained in accessible labels. The live result count is a search-field
  action. The 320px layout has no document overflow in the checked default state.
- Start here exposes full cards in place when expanded, including saving and
  evidence. It is collapsed initially in both layouts.
- Expanded source disclosures persist across layout changes. Catalog and comparison
  source pins are explicitly distinguished and linked when they differ.
- Desktop guide contents includes a persistent contextual Directory return link;
  the header brand also preserves directory filters. Priority table cells have a
  minimum width, and directory metadata is at least 13px.
- Nineteen automated checks pass (11 Python, 8 Node). Manual checks covered filter
  retention, category focus/scroll position, evidence preservation, clipboard
  fallback, contextual guide returns and 320px directory/guide overflow.

## Seventh completed assessment

Application: `443b4d8`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Yarrow](assessment-yarrow.md) | 8.0 | 7.5 | 8.5 | 8.5 | 9.0 | 8.20 |
| [Zephyr](assessment-zephyr.md) | 8.5 | 8.0 | 8.0 | 8.2 | 9.2 | 8.27 |
| [Aspen](assessment-aspen.md) | 8.5 | 8.5 | 8.5 | 9.0 | 9.0 | 8.675 |

This round did not meet the threshold. All three independently identified hidden
matching totals and the collapsed language resources. The next round uses two fresh
reviewers under the user's instruction to reduce reviewer count when findings
converge; no reviewer or score is removed from this completed round.

## Following corrections

- Filtered and Saved result headings are visible in the persistent collection bar.
  All/Saved totals remain distinct from current matches.
- Compiler, Docs and Stdlib have direct, compact links above the first library group.
  More expands all five language resources in place, including evidence and saving.
- Name A–Z sorts by project name across maintainers, with owner as a tie-breaker.
  A regression check covers cross-owner ordering and adjacency of identical names.
- Skip to search bypasses the desktop category rail; the shortcut is visibly shown.
  Clear filters restores focus to the new results. Native summaries retain their
  ordinary Tab stop when programmatically focused.
- Both List and Cards show the selected state on narrow mobile. Category selects
  use compact labels, and active advanced filters have a small marker. Clear filters
  shares the chip row to avoid a separate mobile control row.
- Comparison links consistently say Compare [topic] options. Reading outlines mark
  the current section using visible emphasis and aria-current, including scroll.
- Twenty automated checks pass (11 Python, 9 Node). Rendered checks at 320px and
  desktop covered the matching toolbar, direct reference links, selected layouts,
  focus after reset, contextual guide return and the current-section marker.

## Eighth completed assessment

Application: `0e87077`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Beech](assessment-beech.md) | 9.0 | 8.5 | 9.0 | 8.5 | 9.0 | 8.75 |
| [Cypress](assessment-cypress.md) | 8.5 | 9.0 | 9.5 | 9.0 | 9.5 | 9.05 |

One reviewer exceeded the overall threshold; the round did not satisfy the stopping
condition because Beech remained below it. Neither found a blocking defect.

## Following corrections

- All five official resource links are visible: Compiler, Docs, Stdlib, Packages
  and Samples. Details exposes descriptions/evidence/save controls. Accessible
  labels preserve each visible control name, including abbreviations.
- Expanded mobile filters replace the removable chips with a compact active-filter
  count; closing restores the chips. A persistent Show action closes the panel and
  focuses results, complementing the button at the end of the settings.
- Results navigation measures the actual sticky controls when calculating its
  position, so changing toolbar height does not hide focused results.
- Attribution, choice/evidence links and helper text increased to 14px. Mobile
  header spacing deliberately keeps Choice notes on one line through narrow widths.
- The Ethereum development gap plan moved intact to a separate Development guide,
  linked from the short package-selection advice. TOML now begins with a responsive
  three-row decision table whose qualifications remain present on mobile.
- Twenty checks pass. Native preview DOM checks and isolated Chromium screenshots
  covered 320px default references, 375px expanded/closed filters, reset/show focus,
  header composition, TOML's three decision records and its development link. No
  JavaScript page errors occurred in the isolated checks. Native snapshot timeouts
  were tooling failures; owned browsers were closed.

Structured platform/native-dependency metadata remains an optional future enhancement.
Current descriptions retain their evidence-backed requirements and limitations; no
new compatibility or security promise was inferred to fill a field.

## Ninth completed assessment

Application: `63419cc`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Dogwood](assessment-dogwood.md) | 9.0 | 9.0 | 9.5 | 8.5 | 9.0 | 8.975 |
| [Hazel](assessment-hazel.md) | 9.0 | 9.0 | 9.5 | 9.0 | 9.0 | 9.10 |

The round did not meet the stopping condition. Dogwood's raw 8.975 is not rounded
up to 9 for this purpose. The principal issue was the 768px arrangement: the category
rail and split list columns left descriptions only about 206px wide. Hazel found
only two low-severity issues in its desktop/phone sample.

## Following corrections

- List entries stack identity and description at 761–1000px, retaining the category
  rail and desktop controls. At 768px, the checked description is now 498px wide,
  equal to its full row, without page overflow.
- The introductory directory link says Check built-ins first and opens the standard
  library. The experimental-ecosystem qualification remains in the footer and
  curation guidance. All five official shortcuts remain directly available.
- Choice notes opens with a compact dated scope statement and method/evidence links.
  Full qualifications and the baseline explanation remain in its linked methodology
  section. The first choice heading is around y=475 at 320×700, rather than below
  the first viewport.
- Source evidence is a rendered index of all 52 inventory records, grouped by
  maintainer with license metadata, dated directory pins and separate comparison
  pins. It includes discovery candidates without implying admission. JSON stays
  available and its link explicitly identifies the format. The index is generated
  from the inventory/comparison sources rather than maintained as a second list.
- Owner correction: the previous 14px metadata rule did not override the more
  specific legacy license selector. That selector is now corrected directly;
  computed license size was verified as 14px in Chromium.
- Twenty-one checks pass (12 Python, 9 Node), including complete snapshot coverage
  in the rendered evidence index. Rendered checks covered tablet row geometry,
  narrow guide/evidence layouts, source links and absence of JavaScript errors.

## Tenth completed assessment

Application: `9be8ae8`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Linden](assessment-linden.md) | 8.6 | 7.8 | 8.9 | 8.6 | 9.4 | 8.54 |
| [Maple](assessment-maple.md) | 8.8 | 8.6 | 9.2 | 8.4 | 9.2 | 8.77 |

This round did not meet the threshold. The reviews exposed an actual search
vocabulary gap and the same intermediate table-width problem in both guides and
the evidence index. Smaller findings concerned mobile density and editing filters
after jumping down into the results.

## Following corrections

- Search indexes comparison topics and small curated category synonyms. Common
  logging/compression/encoding word forms and UTF-8 punctuation variants normalize
  consistently, while distinct query words still combine with AND and explicit
  category/maintainer/saved filters. The compression query retrieves archive,
  compress and deflate; logging retrieves both choices.
- Mobile's persistent contextual action changes between Show N while filters are
  expanded and Filters with an active count afterward. Its accessible name includes
  the current scope. Editing opens the controls and focuses Category below the bar.
- The duplicate bottom Show button and hidden legacy layout control are removed.
  Introductory/control gaps are shorter without shrinking touch targets or body
  text. At 375px the checked first library begins around y=482.
- Desktop retains five direct official shortcuts. Mobile uses an explicitly named
  Compiler, docs & examples disclosure; the built-ins-first introduction link stays
  visible. This balances the prior requests for named starting resources and more
  initial inventory, rather than returning to an ambiguous More label.
- Labeled table records now apply through 1000px. At 820px the TOML region's client
  and scroll widths both measure 520px and all three fields remain visible.
- Twenty-three checks pass (12 Python, 11 Node). Added retrieval checks cover the
  reported compression/logging/UTF-8 examples and multiword filtering. Isolated
  rendered checks covered mobile density, sticky filter editing/show focus, tablet
  table geometry, and no JavaScript errors.

## Eleventh completed assessment

Application: `f1fa608`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Oakwood](assessment-oakwood.md) | 9.0 | 8.7 | 9.3 | 8.9 | 9.6 | 9.02 |
| [Poplar](assessment-poplar.md) | 9.0 | 8.7 | 8.8 | 9.0 | 9.4 | 8.925 |

This round did not meet the threshold because Poplar remained below 9. No high-
severity or blocking flow defect was reported. The main concrete inconsistency was
Saved toggling off when selected again; other refinements concerned reference-label
clarity, repeated mobile controls, incidental search substrings and table density.

## Following corrections

- Saved now selects saved:true consistently, mirroring All's named-scope behavior.
  Repeated activation preserves Saved and its filters. Desktop official references
  expose a Details & save control whose visible label communicates the hidden action.
- The inline advanced disclosure says Options, with an accessible maintainer/sort
  description, distinguishing it from the contextual sticky Filters action.
- Word-prefix matching excludes incidental native inside Alternative while retaining
  the documented topic/word-form retrieval and literal punctuation queries. Specific
  implementation names such as libcurl remain searchable. Structured dependency
  metadata remains a future curation task requiring source-backed classifications.
- Short Choice notes tables retain fitted columns at 761–1000px and use compact
  option-first records on phones. Explicit table/column relationships remain in the
  HTML; repeated visual field labels are retained in the longer evidence tables.
- At 900px the checked TOML table is about 248px high, with client/scroll widths both
  598px and all qualifications visible. At 375px its three compact records occupy
  about 382px. The 320px category text fits beside Options without page overflow.
- Twenty-four checks pass (12 Python, 12 Node). A regression covers native/Alternative
  word matching. Rendered checks covered repeated Saved activation, reference labels,
  tablet/phone comparisons, column headers, category width and no JavaScript errors.

## Twelfth completed assessment

Application: `f330c08`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Quill](assessment-quill.md) | 9.0 | 8.6 | 9.0 | 8.8 | 9.2 | 8.87 |
| [Rowan](assessment-rowan.md) | 9.0 | 8.0 | 9.0 | 9.0 | 9.5 | 8.80 |

This round did not meet the threshold. Rowan found a decompression vocabulary gap
and poor ordering of negative capability mentions. The smaller shared refinements
concerned mobile filter context, long queries, official-resource labeling and the
remaining prose-heavy selection/development sections.

## Following corrections

- Per-repository search aliases and explicit caution notes live beside the pinned
  source records. DEFLATE decompression finds the documented decoder. The encoder-only
  entry stays discoverable with a visible limitation-match cue; default grouped
  search puts caution matches after other matches. The original descriptions and
  qualifications remain intact. Explicit name/maintainer ordering remains available.
- Recorded cautions also identify selected writer, UTF-8 validation, partial decoder,
  TLS, JSON-model, cryptographic-random and platform limitations from the existing
  descriptions. Keywords for explicitly declared system/native dependencies improve
  retrieval without creating a broad compatibility promise. Metadata shape and
  source-pin propagation are checked.
- Collapsed mobile result context shows selected category, maintainer and order in
  its Edit action, or a query preview. Editing an active query selects its complete
  value in Search. Query chips stop at 24 visible characters, retaining full accessible
  labels and titles. An 80-character-query recovery remains visible at 320×800.
- Mobile language resources use the complete-count label 5 official Goose resources.
  HTTP, cryptography, logging, compression and SQLite now have concise decision
  tables before their detailed prose, using the same tablet/phone treatments as TOML.
  Logging/archive development proposals moved to Development with optional links.
- Twenty-seven checks pass (13 Python, 14 Node). Added checks cover decompression
  retrieval/order, visible-caution data, positive UTF-8 ordering and source provenance.
  Rendered checks covered the decoder-first results, caution cue, compact long-query
  recovery, full-query editing, six decision tables and no JavaScript errors.

## Thirteenth completed assessment

Application: `5af2fac`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Spruce](assessment-spruce.md) | 9.0 | 8.5 | 9.0 | 8.5 | 9.5 | 8.80 |
| [Tamarack](assessment-tamarack.md) | 9.0 | 8.5 | 9.0 | 8.5 | 9.5 | 8.80 |

This round did not meet the threshold. Core workflows passed; both reviews identified
remaining scope-context friction. Tamarack again requested a structured requirements
route, while Spruce identified intermediate density and repeated table-region names.

## Following corrections

- Recorded native/helper/SDK prerequisites, implementation-core notes and platform
  evidence/limits are structured beside their immutable source records. Cards show
  these fields consistently. Optional Requirement notes facets combine with query,
  category, maintainer and Saved, persist in URLs, and feed contextual counts.
- Unknown notes remain explicitly unclassified. Linux notes include both validation
  and restrictions; a documented Goose core does not promise native-free execution.
  The UI explains this documentation scope. Existing source caveats are retained.
- The mobile Edit summary includes the query even when category/owner/sort are set.
  Short values are nonbreaking tokens, including A–Z. Additional active notes are
  signaled when the summary needs a compact form, with full accessible descriptions.
- The selected category uses the shorter Network & web label; canonical values and
  full context remain intact. A single result now says 1 match.
- Intermediate list stacking ends at 880px, retaining comfortable stacked text near
  768px while restoring denser aligned rows around 900px. Rendered 900px descriptions
  measured about 338px wide, with no page overflow.
- Table regions derive their names from topic/maintainer headings, with distinct
  numbering for additional tables. GitHub's source-index document links to the
  published formatted index without adding redundant copy to the rendered page.
- Thirty checks pass (14 Python, 16 Node). New checks cover requirement intersections,
  unknown states, share parameters, source provenance and contextual table names.
  Rendered checks covered facet URL restoration, native/Linux notes, complete mobile
  scope tokens, 1 match, narrow facets, table-region names and no JavaScript errors.

## Fourteenth completed assessment

Application: `5a0c964`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Umber](assessment-umber.md) | 9.0 | 9.0 | 9.2 | 8.8 | 9.5 | 9.04 |
| [Verdant](assessment-verdant.md) | 8.5 | 9.0 | 9.0 | 8.5 | 9.5 | 8.825 |

The round did not meet the threshold. Both reviewers found only working core flows,
but noted intermediate identity wrapping and narrow advanced-form/context density.
Umber requested mobile decision-field labels; Verdant requested a shorter persistent
context and a narrower guide measure.

## Following corrections

- Mobile uses a compact query/count summary with a native expandable context panel.
  All selected values and sort are available without a page jump. The panel has
  Edit/Clear/Close actions, Escape focus restoration and outside-focus/pointer
  dismissal. The five-filter checked toolbar remains 102px high at 320px.
- Toolbar DOM order follows its visual control order. Editing selects the full
  query; clearing resets the active filters and focuses results. The panel scrolls
  independently for long values and keeps its actions available.
- At narrow widths, the inline Options trigger uses a labeled 44px ellipsis control
  to give Category more room. Requirement selectors use concise values and share a
  row, while the qualification copy remains explicit. The advanced form is shorter.
- At 881–1100px, the maintainer occupies its own line so complete repository names
  have the identity column's full width. Wider list alignment and narrow stacking
  are preserved.
- Mobile decision records show inline Use for and Note labels, retaining their
  compact shape and table semantics. Paragraph/list width has an explicit 72ch cap.
- Owner verification note: Verdant's reported 940px paragraph measure was not
  reproduced. Before this correction, computed paragraphs were already 74ch, about
  658px at 1440px. The existing paragraph constraint was tightened slightly and
  extended explicitly to lists; no 940px paragraph defect is claimed as reproduced.
- Thirty checks pass. Rendered checks covered complete context values, Escape/edit/
  clear focus, 320px facets, 900px identity layout, mobile labels, absence of overflow
  and no JavaScript page errors.

## Fifteenth completed assessment

Application: `f906810`.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Wren](assessment-wren.md) | 9.0 | 9.0 | 9.0 | 8.0 | 9.5 | 8.80 |
| [Xenon](assessment-xenon.md) | 8.8 | 8.8 | 9.0 | 8.4 | 9.2 | 8.780 |

The round did not meet the threshold. Both reviewers reproduced 320px overflow in
the current-filter summary and requested a visible Options label. Wren also found
known-repository lookup slow in the evidence index; Xenon noted repeated platform
qualifications. Completed discovery, saved, share, guide and evidence flows worked.

## Following corrections

- The results row has an explicit shrinking width budget. Its query preview gives
  space to the count and filter token without expanding the page. Reported queries,
  100-character words and emoji were verified at 320, 360 and 390px, with the full
  context both open and closed. No page-wide overflow clipping was added.
- Options retains its visible word at 320px in both active and inactive states.
  A concise Files & OS category label makes room while retaining canonical values.
- Structured platform facts are shorter while retaining their restrictions and
  immutable provenance; descriptions continue to explain their task relevance.
- Source evidence now offers owner/repository lookup, a result count, URL restoration,
  Clear with focus recovery and a search skip link/shortcut. Empty owner sections
  and their contents links are hidden while filtering. The explanatory methodology
  follows the index so lookup is available earlier on phones.
- Thirty Python/Node checks and four isolated Chromium regression checks pass.
  The new browser checks exercise narrow long-query reflow, context/edit/clear focus,
  evidence lookup and Saved idempotence. Pages CI runs them before artifact upload;
  the pinned dependency is development-only and the site build remains standard-library
  Python with no package-install requirement. These checks do not certify accessibility.

## Sixteenth completed assessment — stopping condition met

Application: `6c3ec72`. Two fresh independent contexts received the frozen site and
CRITERIA.md only, without the target, previous ratings/reports, conversation or
optimization framing. Two reviewers were retained because recent findings had
converged, as allowed by the user.

| Reviewer | Visual | Discovery | Interaction | Responsive / access | Trust | Weighted overall |
| --- | --- | --- | --- | --- | --- | --- |
| [Yew](assessment-yew.md) | 9.0 | 9.0 | 9.5 | 9.0 | 9.5 | 9.15 |
| [Zinnia](assessment-zinnia.md) | 9.0 | 9.0 | 9.0 | 9.0 | 9.5 | 9.05 |

Both exact weighted scores exceed 9/10, all criteria are at least 9/10, and neither
reviewer found an unresolved major usability/accessibility issue. This satisfies
the recorded stopping condition. Scores remain subjective, sampled Chromium
assessments, not accessibility certification or a revalidation of upstream libraries.

Remaining low-severity opportunities are explicitly retained: opening density on
short phones, consistent category labels across views, clearer newcomer labeling
for the official-resource disclosure, and more room in intermediate-width choice
tables. No application changes followed these reviews.

## Final validation and publication

- Public repository and Pages site are configured, with automatic publishing from
  main after checks. Application commit `6c3ec72` passed Catalog checks and
  [Pages build/deployment](https://github.com/carabistouflette/awesome-goose/actions/runs/42279958032),
  including all 14 Python, 16 Node and 4 Chromium regression tests.
- Owner verification of the published site used the shared preview browser. The
  public response and fingerprinted CSS/JS/module assets returned HTTP 200 and
  matched the frozen local build. At an actual 320px viewport, the reported long
  query/owner/sort state fit the document, and Options retained a visible 13px label.
  Public source lookup restored a repository query and showed its one matching
  record out of 52. No resource-loading failures were observed. The owned tab closed.
- The final archive commit itself adds these reports and this log only. A concurrent
  catalog-only commit, `c89efda`, added goose-glob after the frozen review: 57 resources,
  49 admitted repositories and 53 evidence records. It changes README/inventory only;
  the reviewed HTML/CSS/JavaScript implementation is unchanged. The reports retain
  their actual 56-resource review baseline. The enriched catalog passes the same
  34 checks, including rendered browser regressions. Browser and physical-device
  limitations remain in each report.
- FMHY assessments remain separately recorded in their original reports and are
  not used to normalize or justify these scores.
