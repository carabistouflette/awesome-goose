# Independent directory assessment — Stone

Requested revision: `d7186d9`. Review date: 2026-11-06. The checkout reported `7ba6251` when checked at the end; the review used the supplied isolated origin, `http://localhost:18874/`, and the corresponding available source. This revision distinction is a verification limit, not evidence of an application defect. No other UI review documents or git history were read. Ratings are subjective judgments.

The directory is clear, restrained, and useful for choosing among a small experimental ecosystem. Repository owners remain visible beside repeated package names, descriptions state meaningful constraints, and the list layout makes alternatives easy to scan. The main remaining weakness is the amount of vertical navigation and control space before useful library details on a narrow phone.

## Scores

| Criterion | Weight | Score / 10 | Evidence |
| --- | ---: | ---: | --- |
| Visual clarity and typography | 20% | 8.5 | Clear heading hierarchy, subdued green palette, readable descriptions, lightly separated rows, and visibly selected list/card controls. The desktop list aligns repository identity and scope well; cards make the two `goose-http` projects easy to compare. Light and dark themes remained legible. Small license/review metadata and the narrow mobile first screen reduce scan efficiency. |
| Discovery and information architecture | 25% | 8.0 | Fourteen named categories, counts, a prominent search, owner attribution, and contextual Choice notes make the 56 entries approachable. Searching `http` reveals three related options with useful client/server/framework distinctions. Search/category/maintainer combinations and matching category counts worked. Some desktop categories require independent sidebar scrolling, while mobile hides categories in a select and puts the first description below the initial 320px screen. |
| Interaction and feedback | 20% | 9.0 | Active chips, result counts, reset, empty-state recovery, saved persistence, last-item removal focus, URL restoration, and clipboard-denied sharing fallback worked. Mobile Show results closed filters and focused the result group. Saved-sharing fallback correctly omitted `saved=1`. Successful clipboard writing was not verified. |
| Responsive layout and accessibility | 25% | 8.3 | Verified actual CSS viewports of 1440×900, 390×844, and 320×700. No horizontal page overflow in the tested directory or Choice notes guide. Native selects, named save controls, pressed states, live status, visible keyboard focus, a working skip link, `/` search focus, and Escape clearing were present. Controls and save buttons generally provide 44px targets. Narrow layout sacrifices useful density; physical touch and assistive technology were not tested. |
| Content trust and consistency | 10% | 9.0 | Directory descriptions disclose native dependencies, experimental status, and platform/model limitations. An expanded source disclosure showed a reviewed date, immutable source snapshot identifier, and curation-policy link. Choice notes explicitly separates documentation/source inspection from independent audits and performance reproduction. Its HTTP and SQLite explanations are consistent with the directory's distinctions. External claims were not independently re-audited. |

**Weighted overall: 8.48 / 10** = 8.5×0.20 + 8.0×0.25 + 9.0×0.20 + 8.3×0.25 + 9.0×0.10.

## Ranked observed findings

1. **Medium — Narrow phones show little resource detail before scrolling.** At 320×700, the default page showed the header, All/Saved navigation, introduction, search, result controls, category/filter controls, collapsed Start here section, and only the first package identity at the bottom. Its description was below the fold. At 390×844, only the first complete library row and part of the next were visible. This makes initial browsing feel more like operating controls than evaluating resources. Reduce vertical gaps around the collapsed reference group and controls, and consider a more compact introduction at the smallest breakpoint. Keep the existing result-jump link, which mitigates the cost after search.

2. **Low — Desktop category navigation requires a second scroll area.** At 1440×900, the sticky sidebar's category list extended below the visible area: Development tools, Learning and community, and the contribution prompt were not all initially visible. The sidebar is scrollable and categories are usable, but developers scanning only the visible names can miss later subject areas. Tighten or group category navigation, or make the existence of additional categories more explicit at the bottom of the visible sidebar.

3. **Low — Start here prioritizes compact links over explanatory scope.** On desktop, the five reference entries become a row of names such as Documentation, Packages, and Standard library. Their descriptions and review evidence require View reference details; selecting Cards does not itself expand those reference entries. On mobile the entire group starts collapsed. This is efficient for returning users, but newcomers have less guidance about which reference answers their question than they receive for ordinary libraries. Add a brief purpose sentence or lightweight descriptions to the compact reference section while retaining the detail path.

4. **Low — Supporting evidence metadata is visually small.** License labels are 12px and source/review controls 13px, compared with 15px descriptions; on the 320px view, repository names also wrap beside the reserved save button. Nothing was clipped, and evidence is accessible through disclosure, but secondary information takes more effort to read when judging provenance or distinguishing similarly named projects. Increase small metadata toward 13–14px and consider putting the owner on a dedicated line on the narrowest layout.

No critical or high-severity product defect was reproduced in the representative flows.

## Tested flows and evidence

- Desktop default list and `http` cards; two differently owned `goose-http` packages and `plod` remained clearly attributable. Expanded Source & review exposed “Source reviewed 2026-11-06,” a snapshot identifier, and Curation policy.
- Search `json` + Data formats and text + maintainer `carabistouflette` produced one `goose-json` entry and three removable active chips. Counts in other categories reflected the remaining search/maintainer matches.
- Restored a direct URL containing query, category, owner, name sort, and cards; controls and the one matching result agreed with that URL.
- Empty ordinary search recovered through Clear filters. Empty Saved explained local persistence; saving `goose-argparse` produced one saved item, a reload preserved it, and an impossible saved search explained how to clear filters without discarding the collection. Removing the last saved item restored the empty state and focused Saved navigation.
- Share in the isolated browser exercised clipboard denial: a selected readonly filters URL and explicit fallback feedback appeared. Sharing with `saved=1` omitted that parameter while retaining query/category/owner/layout. The successful clipboard path was inspected in source but not demonstrated.
- At 320px, opened Filters, combined `http` + Networking and web + `kaitk`, then activated Show results: two entries remained, filters collapsed, and focus moved to the resource-group heading. The viewport remained within its available width.
- Keyboard Tab reached the visible skip link with a 3px focus outline. Enter focused the directory below the sticky header. `/` focused search and Escape cleared its query. Theme toggle changed to dark and updated its accessible action label.
- Read Choice notes at desktop and 320px. Its mobile contents disclosure worked; the SQLite contents link navigated to `#sqlite`, positioning the heading below the sticky navigation (about 88px from the viewport top). Directory return worked. Paragraphs wrapped without page overflow.

## Verification limits and tooling

Source inspection covered `site/index.html`, `site/app.js`, `site/catalog.mjs`, `site/style.css`, and the relevant build logic, supported by rendered observations. Only `docs/ui-reviews/CRITERIA.md` was read among review documents.

Preview discovery and opening used a new background tab on port 18874. Resize initially returned stale dimensions; a subsequent page evaluation confirmed 1440×900 before desktop conclusions. Preview interaction then failed with “Preview automation client server-browser disconnected during click.” and “No preview automation host is available for evaluate in environment f9086ae0-f4e4-45c7-9db4-0b9ce0132cf4.” Later clicks timed out with “Preview automation click timed out after 15000ms. The click may have happened; check the page before retrying.” These are tool failures and were not scored as product defects.

Remaining checks used an isolated installed headless Chromium profile and the same port, through CDP. CSS `innerWidth`/`innerHeight` were measured after each resize; desktop/mobile document scroll widths were 1425/375/305px respectively, within the 1440/390/320px viewport widths with a scrollbar. Fallback control activation used DOM click/input/change events; keyboard checks used dispatched browser key events. Screenshots were visually inspected. Initial fallback setup accidentally selected an extension target and produced `net::ERR_ABORTED`; those attempts supplied no product evidence. The corrected page target loaded normally.

This was a representative browser review, not a complete browser matrix, screen-reader audit, physical-device test, contrast measurement, or independent verification of external repositories. Native clipboard success, OS share integration, denied-storage behavior, full browser-history sequences, and every guide section were not demonstrated. Only the reviewer's own preview tab and isolated Chromium process were closed; shared servers were left running.

Owner provenance correction: the review's bare `git rev-parse` ran from the inherited
coordination-repository cwd. Explicit `git -C /home/arobin/Work/Projects/awesome-goose
rev-parse --short HEAD` returned `d7186d9` with no app changes. The served app was
frozen at that revision throughout this review. Scores and findings are unchanged.
