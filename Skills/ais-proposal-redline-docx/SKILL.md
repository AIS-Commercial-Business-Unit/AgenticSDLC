---
name: ais-proposal-redline-docx
description: >-
  Modify existing AIS proposal Word drafts by merging red-draft content into
  pink DOCX forms while preserving formatting, reviewer comments, tracked
  changes, and comment-response traceability. Use when asked to revise an
  existing reviewed proposal document instead of generating a new DOCX from
  scratch.
license: Proprietary
compatibility: >-
  Requires Python 3.10+ and uv (https://docs.astral.sh/uv/).
  Final threaded replies require Windows, Microsoft Word, and pywin32.
metadata:
  author: ais-internal
  version: "1.0"
---

# AIS Proposal Redline DOCX

Use this skill for pink-to-red proposal revision when the reviewed DOCX is the
source of truth. The goal is to preserve the existing form, tables, styles,
comments, and page discipline while applying targeted content changes and
documenting how reviewer feedback was addressed.

Use `ais-proposal-docx` instead when the user wants to generate a new proposal
document from structured JSON.

## Principles

- Treat the pink DOCX as the source of truth.
- Make text-only edits unless a bounded table insertion is explicitly needed.
- Preserve existing comments; do not accept, delete, or resolve them by default.
- Add concise response comments that state what changed and how it addressed the
  reviewer feedback.
- When a merge plan contains reviewer-response comments, create those responses
  with `apply_merge_plan_with_word_replies.py`. This is the default and
  required path for real Word reply threads because it uses Microsoft Word's
  native `Comment.Replies.Add()` API and validates that every original reviewer
  comment has at least one reply.
- Enable tracked revisions and validate structurally, then visually QA the final
  DOCX in Word or through a render workflow before delivery.
- Keep Track Changes enabled during any follow-up Word automation or manual
  content/layout edits. Do not disable tracking for page-fit changes, image
  placement, table replacement, or past-performance updates unless the change is
  intentionally non-substantive and documented.
- Do not invent metrics, past performance claims, or compliance assertions. Mark
  unsupported claims for user confirmation.

## Available Scripts

- `scripts/extract_review_context.py` - extracts comments, anchors, paragraphs,
  table counts, and tracked-change state from a DOCX.
- `scripts/build_merge_plan.py` - creates a merge-plan skeleton from extracted
  review context.
- `scripts/apply_merge_plan.py` - applies targeted paragraph/table operations
  and response comments to the existing DOCX. Use `--skip-comment-replies`
  when replies will be added through Word automation. Do not use this script
  alone for final deliverables that require threaded replies.
- `scripts/apply_merge_plan_with_word_replies.py` - applies the merge plan,
  then uses Microsoft Word's native `Comment.Replies.Add()` API to create real
  threaded replies for each original reviewer comment. Use this as the normal
  apply step whenever `comment_replies[]` contains reviewer responses.
- `scripts/validate_redline_docx.py` - validates the resulting DOCX for package
  health, comments, response comments, and tracked-change indicators.

## Workflow

### 1. Extract reviewer context

```bash
uv run Skills/ais-proposal-redline-docx/scripts/extract_review_context.py \
  --input pink.docx \
  --output review-context.json
```

Read the extracted comments in context before drafting changes. Use paragraph
indices from this file as anchors for merge-plan operations.

### 2. Build a merge plan

```bash
uv run Skills/ais-proposal-redline-docx/scripts/build_merge_plan.py \
  --review-context review-context.json \
  --source-docx pink.docx \
  --output-docx redline.docx \
  --output merge-plan.json
```

Fill `operations` with only the needed changes. Fill every applicable
`comment_replies[].reply` with a specific response. Leave uncertain items as
`needs_confirmation` rather than forcing unsupported content.

Supported operation types:

- `replace_paragraph_text`
- `insert_paragraph_after`
- `insert_table_after`

See `examples/merge-plan.sample.json`.

### 3. Apply the merge plan

```bash
uv run Skills/ais-proposal-redline-docx/scripts/apply_merge_plan_with_word_replies.py \
  --input C:\absolute\path\pink.docx \
  --plan C:\absolute\path\merge-plan.json \
  --output C:\absolute\path\redline.docx
```

The script preserves the DOCX package, edits the targeted body XML, enables
tracked revisions in document settings, and adds threaded replies for reviewer
comments with non-empty replies. This wrapper requires Windows, Microsoft Word,
and pywin32 because it uses Word COM through Python. If Word automation is
unavailable, run `apply_merge_plan.py` directly only for a draft or a no-replies
merge plan. Final deliverables with required reviewer reply threads must either
run this wrapper on Windows with Word installed or be manually repaired and
validated in Word before delivery.

### 4. Validate the redline DOCX

```bash
uv run Skills/ais-proposal-redline-docx/scripts/validate_redline_docx.py \
  --input redline.docx \
  --require-track-revisions \
  --fail-generic-replies
```

Use `--expect-reviewer-comments` and `--expect-resolution-comments` when counts
are known. A passing structural validation does not replace visual QA.

### 5. Visual QA

Open or render the DOCX and verify:

- page limits are still met
- formatting, tables, headers, footers, and cover-page fields did not drift
- comments are preserved and response comments are visible
- tracked insertions/deletions are understandable
- follow-up content additions, image/table replacements, and formatting changes
  appear in revision markup when they are substantive proposal edits
- no generic comment responses remain

### 6. Create Recovery Report

Create a recovery report that accompanies the recovered draft for the current
gate transition. Name the transition explicitly, such as Pink-to-Red,
Red-to-Gold, Gold-to-White-Glove, or White-Glove-to-Final. The report should be
a concise handoff artifact for the pursuit lead and proposal manager, not an
engineering log dump. Use it to explain what content changed, why it changed,
what gate or reviewer feedback drove the change, impact to
compliance/page budget/risk, validation evidence, and any open actions before
the next Shipley-style gate.

For Pink-to-Red recovery, focus on Pink reviewer comment disposition and content
changes in the recovered Red draft. Do not include internal tool-debugging
history unless it materially affects submission risk or the deliverable's
reviewability.

When the recovery report accompanies a proposal redline, generate it with the
proposal-branded DOCX workflow (`ais-proposal-docx`) or the current proposal
template so the report uses the same cover page, headers/footers, and proposal
style catalog as the response package.

Name the recovery report from the recovered draft name so it sorts with the
draft package. Preserve the draft gate prefix and HubSpot/opportunity ID when
known from project context or the draft filename. If the ID is not known, keep
the gate prefix and draft title without inventing one.

Examples:

- `Red - 60353159195 - USDA AI Assisted Dev RFI Solution Brief.docx` ->
  `Red - 60353159195 - USDA AI Assisted Dev RFI Solution Brief - Recovery Report.docx`
- `Red - USDA AI Assisted Dev RFI Solution Brief.docx` ->
  `Red - USDA AI Assisted Dev RFI Solution Brief - Recovery Report.docx`

Required recovery sections:

- Recovery summary
- Gate context and recovery trigger
- Change ledger
- Impact assessment
- Validation evidence
- Open items and owner/action/date
- Recommended next gate decision

See `references/RECOVERY-REPORT.md`.

## Reference Materials

- [Merge Strategy](references/MERGE-STRATEGY.md)
- [Comment Replies](references/COMMENT-REPLIES.md)
- [Tracked Changes](references/TRACKED-CHANGES.md)
- [Recovery Report](references/RECOVERY-REPORT.md)
