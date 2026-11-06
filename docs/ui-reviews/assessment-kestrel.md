# Directory UI assessment — Kestrel

Reviewed 2026-11-06 at revision `4d505dbb50feb85a6ed517388e8ef72286dea5d4`. This is an independent, subjective assessment against `CRITERIA.md`; no other UI reviews or git history were consulted. Application files were not changed.

The directory is readable and useful, with particularly good owner disambiguation, specific limitations, source links, saved-state explanations, and mobile controls. No blocking layout or content contradiction was observed. The main opportunities concern mobile comparison reading and making the site's scope and less visible controls easier to discover.

## Scores

| Criterion | Weight | Score / 10 | Assessment |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.8 | Restrained colors, readable body copy, strong headings, and clear list/card distinction. Both themes remained readable in the sampled views. Narrow headings and guide prose wrap without page overflow. |
| Discovery and information architecture | 25% | 8.3 | Categories, counts, owner names, examples, and choice-note links support practical selection. Start-here references are compact. The home introduction gives less scope context than the documentation, and narrow-screen layout switching is harder to discover. |
| Interaction and feedback | 20% | 8.7 | Combined filters, active chips, counts, URL state, saved feedback, and distinct empty states work coherently. Clearing a saved search preserves the saved collection. Share explicitly explains that saved items are device-local. Some automation actions could not be verified through pointer activation. |
| Responsive layout and accessibility | 25% | 8.1 | Tested desktop and mobile layouts fit the viewport. Native labeled selects, pressed states, status messages, substantial control targets, and visible keyboard focus are strengths. Long comparison tables require substantial horizontal exploration with weak visible guidance. |
| Content trust and consistency | 10% | 8.8 | Review dates, immutable source snapshots, licensing metadata, affiliation disclosure, and qualified claims provide unusually useful evidence. Sampled HTTP, SQLite, crypto, and compression guidance agrees with catalog descriptions. Scope/maturity context is less explicit on the homepage. |

Weighted overall: **8.48 / 10** (`8.8×.20 + 8.3×.25 + 8.7×.20 + 8.1×.25 + 8.8×.10`). These scores are judgments, not a conformance certification.

## Evidence and coverage

Used a separately opened preview tab on `http://localhost:8766/`, after discovering preview status. Only that tab was controlled. Actual `window.innerWidth` and `innerHeight` were verified after resize settled; the resize tool sometimes initially reported the previous viewport.

| CSS viewport | Rendered checks |
| --- | --- |
| 1280 × 800 | Default list, cards in dark theme, empty search, focus styling, Choice notes desktop typography and comparison-guide structure |
| 390 × 844 | Initial list, combined search/category/maintainer filters, card with expanded evidence, saved sharing feedback, Choice notes reading |
| 320 × 740 | Saved and filtered states, native Layout select, long headings/controls, Choice notes SQLite anchor, comparison table horizontal scrolling |

Document widths measured 1265 or 1280 at desktop, 375 at 390, and 305 at 320, depending on scrollbar rendering; no tested page-wide horizontal overflow was observed. Screenshots sometimes used a 1.5 device-pixel ratio; their PNG dimensions are not the CSS viewport dimensions.

Representative captures, created by the preview tool; portable copies retained with this report:

- [Desktop default list](evidence/browser-screenshot-localhost-mw52rsvp-ab3d42dd.png)
- [390-pixel default list](evidence/browser-screenshot-localhost-mw52s3td-191eebd1.png)
- [Desktop dark cards and keyboard focus](evidence/browser-screenshot-localhost-mw52w4i1-531d8bfb.png)
- [390-pixel Choice notes](evidence/browser-screenshot-localhost-mw52x96t-3f87487e.png)
- [320-pixel comparison table](evidence/browser-screenshot-localhost-mw52wlge-ad97277a.png)

Observed interaction results:

- `q=sqlite`, category `Databases`, maintainer `kaitk` produced exactly one result, `kaitk/goose-sqlite`, with three removable filter chips and matching URL/count/status. Switching to Cards retained those filters. Expanded evidence showed review date `2026-11-06`, source snapshot `2c315b4`, and curation link.
- A nonexistent query in Saved produced “No saved resources match these filters” and reported the saved total. “Clear filters in saved” retained Saved mode, restored the result, and focused `results-heading`.
- Removing the final saved item produced “Nothing saved yet,” updated stored IDs to `[]`, announced removal, and moved focus to `saved-resources`. Its browse action returned all 56 resources. Saving Documentation updated its accessible label to “Unsave Documentation,” its pressed state, stored ID, and toast. Some of these handlers were exercised with DOM `click()` after preview pointer automation timed out; this verifies state logic rather than physical hit testing for those actions.
- A nonexistent query outside Saved produced the ordinary search-empty message and a Clear filters action. Theme switching updated the theme and the button's destination-theme label.
- Share in Saved displayed “Filters link copied. Your device-local saved collection is not included.” Source inspection of `shareUrl()` confirms removal of `saved` and the fragment while retaining the other query parameters. Actual clipboard contents and a paste into another browser were not verified.
- `/` focused Search. A keyboard Tab reached List with `:focus-visible` and the accent outline visible in the capture. The comparison region has `tabindex="0"`, a region label, a visible focus outline, and ArrowRight changed its horizontal scroll offset. The skip link was visibly focused; successful activation was not established by preview automation.
- Choice notes loaded the SQLite fragment, distinguished system versus bundled SQLite consistently with the entries, and retained directory query state in its return link. Mobile On this page was initially collapsed when navigating at mobile width. Guide prose wrapped without page overflow.

Source support: `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, `site/theme.js`, `scripts/build-site.py`, `README.md`, `docs/CHOICES.md`, and `docs/CURATION.md`. Source inspection also confirmed matching HTTP client/server roles, crypto timing qualifications, and compression encode/decode distinctions across catalog and guide content.

## Ranked observed findings

1. **Medium — mobile comparison tables conceal the qualifications column without a clear visible scroll cue.** At 320 pixels, the first comparison region was about 271 pixels wide around a 650-pixel table and about 1254 pixels tall. The visible top portion showed the need and only part of the recommendation; the reason/qualification column lay offscreen. Its horizontal scrollbar is below a long table, and there was no nearby visible instruction to scroll sideways. Impact: readers can miss the qualifications that make the recommendations trustworthy. Keyboard scrolling works and the region is labeled, so this is a discoverability problem rather than an inaccessible table. Recommendation: add a visible “Scroll sideways for reasons and limits” hint whenever overflow exists, or offer stacked mobile comparison rows with their qualifications adjacent. Evidence: comparison-table capture; `site/style.css:119`, `scripts/build-site.py:74`.

2. **Low — the homepage gives less identity and maturity context than the supporting content.** The rendered hero says only “Libraries and tools for Goose.” The README identifies aardappel's programming language and explains ecosystem youth, compiler revisions, native dependencies, and pinning; Curation and Comparisons also disambiguate scope. Impact: a first-time visitor must infer which Goose this is or follow another page, and may miss the general compatibility caveat while browsing concise entries. Recommendation: identify “aardappel's Goose programming language” in the hero and provide a short compatibility/pinning note linked to the fuller policy. Keep the existing specific entry limitations. Evidence: desktop/mobile initial captures; `site/index.html:32`, `README.md:15`, `docs/CURATION.md`.

3. **Low — changing layout becomes less discoverable at 320 pixels.** At 390 pixels, List and Cards are visible beside the result heading. At 320, those buttons disappear and a Layout select is available only inside the initially collapsed Filters panel. The summary does not indicate that it also contains presentation controls. Impact: someone arriving with `view=cards` can reasonably look beside the heading for the switch they saw at a wider size. Recommendation: keep a compact visible layout switch at this width, or label the disclosure “Filters & layout.” Evidence: measured hidden button rectangles and visible native Layout field after opening Filters; `site/style.css:250`, `site/index.html:45`.

4. **Low — guide contents do not adapt when crossing the mobile breakpoint.** Loading Choice notes at 320 pixels collapsed On this page; widening that same page to 1280 left a mostly empty sidebar with contents still closed. Conversely, a comparison guide loaded at desktop retained its expanded contents after narrowing. Impact: orientation changes or window resizing can leave desktop navigation hidden or put a long mobile contents list ahead of the article. Recommendation: apply breakpoint changes to the default contents state while respecting an explicit user toggle. Evidence: desktop Choice notes capture after widening; `site/theme.js:19–20` initializes this state only at DOMContentLoaded.

## Verification limits

This was a CSS-viewport review in the installed preview browser, not real-device testing. No screen reader, touch hardware, zoom/text enlargement, reduced-motion behavior, storage-denied mode, clipboard-denied fallback, complete external-link crawl, or independent validation of upstream library claims was performed. Inline guide links are ordinary prose links; their smaller boxes were not treated as an automatic accessibility failure. Visual contrast was assessed by observation, not a complete computed contrast audit.

All requested screenshot captures succeeded; no Chromium fallback was needed. Several pointer actions returned `Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying.` Their state was checked before continuing, and selected handlers were verified with DOM activation as noted above. Keyboard skip-link activation remained unverified, so no application defect is inferred from that tool behavior. Initial local saved data existed on the assigned origin; its saved IDs were restored and the review's theme override was cleared after checking. Only this review's tab was closed; no browser processes or shared servers were started or terminated.

Artifact note: the owner normalized screenshot links to retained repository copies; scores and findings are unchanged.
