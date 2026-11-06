# UI improvement rubric

Use the same rubric in every round. Evaluate the actual directory and guide flows,
not a screenshot alone. Score each criterion from 0 to 10; the overall score is the
weighted sum. Scores are subjective review judgments, not objective certification.
Do not increase a score because a target is requested. Report limitations honestly.

| Criterion | Weight | What to assess |
| --- | --- | --- |
| Visual clarity and typography | 20% | Readable text, hierarchy, contrast, spacing, restrained design, no decorative filler |
| Discovery and information architecture | 25% | Finding a library, categories, useful density, identifying alternatives and limitations |
| Interaction and feedback | 20% | Search/filter combinations, reset, URL sharing, favorites, theme, clear active state and feedback |
| Responsive layout and accessibility | 25% | Mobile/desktop, keyboard operation, touch targets, labels, focus, semantics, long content and overflow |
| Content trust and consistency | 10% | Clear attribution, source/review evidence, honest limits, guide consistency, direct language |

## Procedure

The baseline uses three independent reviewers against the same frozen revision.
Following the user’s instruction, later rounds use two fresh reviewers after the
baseline reviewers converged on the same findings.
Reviewers read source and inspect rendered desktop/mobile states when tools permit.
Test search, a category, owner filter, saved-only/empty results, keyboard focus and
at least one guide. State the viewport, revision, evidence and any verification gaps.
Give concrete issues by severity, five criterion scores, weighted overall score,
and an explicit pass/fail judgment. Do not alter application code or read other
reviewers' reports before writing your own. The owner reconciles findings and records
changes, then starts fresh reviews for the next revision.

Stop only when all reviewers in the completed round score at least 9/10 overall, each criterion is
at least 8/10, and no reviewer reports an unresolved major usability/accessibility
issue. A missing rendered review must be stated; source-only scores cannot certify
visual or responsive behavior. User satisfaction remains the final standard.

Reviewer briefs use CRITERIA.md only. They must not receive the improvement target,
previous scores, earlier reports, optimization context, or conversation history.
Discard reviews whose brief included that information. Fresh contexts are mandatory.
