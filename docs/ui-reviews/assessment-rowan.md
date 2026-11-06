# Awesome Goose UI assessment — Rowan

Reviewed revision `f330c08842979ffd2ec835976f4453953a45bfb6` (`f330c08`) on 2026-11-06, using the frozen build at `http://localhost:18886/`. This is an independent, subjective assessment of the directory as a developer resource, against `CRITERIA.md`. I read no other review reports or review history and made no application changes.

## Scores

| Criterion | Weight | Score / 10 | Weighted contribution | Reason |
| --- | ---: | ---: | ---: | --- |
| Visual clarity and typography | 20% | 9.0 | 1.800 | Restrained color, clear resource identity, readable descriptions, consistent dividers and controls. Both light and dark views remain easy to scan. |
| Discovery and information architecture | 25% | 8.0 | 2.000 | Useful category rail, live counts, owner identity, concise limitations, and comparison links. Common task vocabulary still produces false negatives, while negative capability mentions can dominate a capability query. |
| Interaction and feedback | 20% | 9.0 | 1.800 | Combined filters, active chips, layouts, sorting, saved states, URL restoration, theme persistence, and share feedback worked in the tested flows. |
| Responsive layout and accessibility | 25% | 9.0 | 2.250 | No document overflow at the tested widths; strong keyboard focus, skip links, labeled controls, native disclosures, and good guide adaptations. Long filter chips add avoidable vertical bulk on narrow screens. |
| Content trust and consistency | 10% | 9.5 | 0.950 | Clear language identity, maintainer attribution, licenses, dates, immutable evidence links, explicit baseline differences, and honest validation limits. The guide and directory tell a consistent story in the sampled subjects. |
| **Overall** | **100%** | **8.800** | **8.800** | **88.00 / 100** |

Exact calculation: `9.0 × 0.20 + 8.0 × 0.25 + 9.0 × 0.20 + 9.0 × 0.25 + 9.5 × 0.10 = 8.800 / 10`.

## Observed strengths

The page identifies aardappel's programming language immediately and points readers toward built-ins before dependencies. At desktop width, the default list aligns package identity, scope, evidence, and save controls well. Different maintainers' identically named HTTP and TOML projects remain distinguishable. The card view offers a useful alternative without dropping descriptions or evidence.

The active state is unusually clear: category counts respond to other filters, collection totals remain separate from the matching count, chips expose the selected conditions, and the mobile Options control signals an active advanced filter. Saving gives device-local feedback; the Saved view explains its persistence and sharing limits. Removing the final saved item moved focus back to Saved and displayed a useful recovery action.

Choice notes are a useful reading guide rather than a list of unqualified endorsements. The TOML section separates owning/writing data, preserving formatting, and borrowing input. Its decision table remains a table at 900 pixels and becomes readable option-first blocks at 390 pixels. The guide has a persistent mobile Directory/Contents bar, an expandable outline, a marked current section, and a return link that restored directory filters. Detailed comparisons and Source evidence explain the difference between listing, inspection, recommendation, and independent validation.

## Ranked observed issues

### 1. Common decompression vocabulary finds no decoder

**Severity: Medium.** In the unfiltered directory, both `decompression` and `decompress` returned zero results. `gzip` returned two entries, including Macho0x/goose-deflate, whose description explicitly provides DEFLATE decoding and gzip/zlib wrappers. A developer expressing the task in ordinary terms can wrongly conclude that no relevant resource is listed. The empty state offers clearing filters but no related query suggestion.

**Recommendation:** Add capability/topic aliases for decompression and decoding to the relevant entries, with useful empty-state suggestions such as “Try gzip or DEFLATE.” Prefer entry-specific capability metadata so an encoder-only project does not automatically become a decompression recommendation.

**Evidence:** Rendered searches at 1440 × 1000, with other filters cleared. `site/catalog.mjs:17` normalizes compression, encoding, and decoding variants but not decompression; `site/catalog.mjs:42` searches descriptions and category topics. The relevant descriptions are in `README.md:69` and `README.md:70`.

### 2. Capability searches do not distinguish support from a documented absence

**Severity: Low.** Searching `decoder` or `decode` returned four entries. The first was kaitk/goose-compress, whose description says “no decoder”; another was goose-postgres, whose description says several decoders remain unimplemented. The prose is honest, so this is a relevance issue rather than misleading copy. However, the task requires reading several explicitly unsuitable matches before finding a useful decoder, and the interface offers no capability-specific ranking or match explanation.

**Recommendation:** Preserve limitation text in search, but rank positive capability matches above negative-only matches. A small “why this matches” cue or structured supported/unsupported capability terms would help users interpret these results without hiding important limitations.

**Evidence:** Rendered result ordering for both queries. `site/catalog.mjs:42` puts the entire description in one search string, while `site/catalog.mjs:60` sorts by category/name/owner rather than relevance. `README.md:69` and `README.md:95` contain the observed negative capability statements.

### 3. Long query chips push narrow-screen recovery below the initial view

**Severity: Low.** At 320 × 800, an 80-character unbroken query combined with category and maintainer filters wrapped into a large search chip. The category and maintainer chips stacked beneath it, leaving the no-results recovery button below the initial viewport. There was no horizontal overflow and Clear filters remained available; the problem is extra reading and scrolling, not a blocked flow. Short realistic filters were considerably better behaved.

**Recommendation:** Limit the visible query chip to a short preview or two lines while preserving its complete accessible name and an explicit way to inspect the full query. Keep the clear/remove action adjacent and easy to identify.

**Evidence:** Rendered 320-pixel empty state. `site/app.js:97` copies the full query into its chip; `site/style.css:68` permits unrestricted wrapping with `overflow-wrap:anywhere`.

## Viewports and flows checked

All sizes below are actual CSS viewport sizes, verified from `innerWidth`/`innerHeight` after resizing. Directory document `scrollWidth` equaled the viewport width at 900, 390, and 320 pixels. Choice notes also fit at 1440, 900, and 390; the sampled detailed comparison fit at 390.

| Viewport | Rendered checks |
| --- | --- |
| 1440 × 1000 desktop | Default list, two-column cards, combined HTTP filters, expanded evidence, light and dark themes, empty and saved states, keyboard navigation, desktop Choice notes table, Source evidence index. |
| 900 × 1000 intermediate/tablet | Category rail, stacked list content, layout/sort controls, Choice notes table and outline. |
| 390 × 844 narrow mobile | Default directory, native category selector, open/closed Options, combined TOML filters, Show-results action, source disclosure, Choice notes navigation and option blocks, detailed comparison and its labeled stacked rows. |
| 320 × 800 narrow mobile | Combined filters, long owner/name wrapping, list and card presentation, long-query empty state and overflow checks. |

The interaction sequence included:

- Search `http`: three results. Add Networking and web plus maintainer `kaitk`: two results. Sort Name A–Z and switch Cards: goose-http followed by plod. Expanded evidence remained readable.
- Copy filters link: visible success feedback; after granting clipboard-read permission to the isolated test browser, the clipboard contained the expected query/category/owner/sort/view URL. Loading that URL restored the two-result view.
- Save a resource, open Saved, reload, and confirm one persisted item. Apply a nonmatching query, recover the saved collection, unsave the final item, and recover All 56 resources from the distinct empty-saved state.
- Share from Saved: feedback explicitly excluded the device-local collection, and the copied URL omitted `saved=1`. Browser Back removed a newly added maintainer filter and restored the prior matching count.
- Sort by maintainer: groups changed to maintainer names. Clear filters reset the sort. List/Cards active states updated.
- Keyboard: first two Tab stops exposed visible skip links; Skip to search focused the input; typing filtered immediately; Escape cleared the query; Tab reached the results-count link; Enter focused the official-resources disclosure below the sticky toolbar. The `/` shortcut focused search. Visible focus used a 3-pixel contrasting outline in the observed checks.
- Theme toggle: changed palette and accessible button label, then survived reload.
- Mobile `toml` + Data & text + `Macho0x`: one result; Options showed three active filters; Show closed advanced options and focused the result group. The comparison link reached `CHOICES.html#toml`.
- Guide Contents expanded its outline and focused its summary; section navigation reached Evidence and review method; Directory restored the TOML query, category, and maintainer.
- Source evidence: expanded Macho0x TOML's dated README pin. Expanded carabistouflette HTTP's directory pin `0fa7d19` and separate comparison pin `6dc7a98`, including the explicit mismatch explanation. Followed local Choice notes → Source evidence and Detailed comparisons; inspected their rendered text and link destinations.

## Source support and verification limits

Supporting source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, `scripts/build-site.py`, `README.md`, `docs/CHOICES.md`, and `docs/SOURCES.md`. For example, `site/app.js:86` implements the native evidence disclosures and per-resource names; `site/app.js:91` exposes differing comparison baselines. `docs/CHOICES.md:3` disclaims independent benchmarks/security auditing, and `docs/CHOICES.md:155` explains the two review baselines. The observed rendering agreed with those mechanisms.

I first discovered the preview tools, called preview_status, and opened my own background tab with `reuseExistingTab:false` (tab `tab_1t_d5b76abc-f7a4-4854-98e0-1f423e6ab780`). No other tab was operated. Preview resize reported the old 1280 × 800 viewport alongside a 1440 × 1000 setting, but evaluation verified the page's actual `innerWidth=1440` and `innerHeight=1000`.

Two snapshot attempts at that step failed with the same quoted error: **“Preview snapshot failed: Preview automation snapshot timed out after 15000ms.”** These were preview-tool failures, not application defects. I then used an isolated headless `/usr/bin/chromium` session through `/tmp/moss-ui/node_modules/playwright-core` for rendered screenshots, viewport evaluation, and actual browser input. The initial clipboard read raised **“NotAllowedError: Failed to execute 'readText' on 'Clipboard': Read permission denied.”** Granting clipboard-read permission allowed verification of the already-copied URL; the application had shown copy success. This was a test-browser permission limit, not an app failure.

This is not a full accessibility audit: no screen reader, real touch device, browser matrix, zoom/reflow matrix, automated contrast audit, or reduced-motion audit was performed. Keyboard behavior was sampled, not exhaustively traversed through all 56 resources. Clipboard-success behavior was tested; the permission-denied/manual-copy fallback and unavailable-storage paths were inspected in source but not exercised. Remote repository destinations were inspected as immutable link targets; upstream code correctness, remote availability, license interpretation, and performance/security claims were not independently revalidated. Source evidence's own stated limits remain applicable.

No high-severity or flow-blocking application defect was observed in the tested paths. The browser and preview tab used for this assessment were closed after review; shared servers were left running.
