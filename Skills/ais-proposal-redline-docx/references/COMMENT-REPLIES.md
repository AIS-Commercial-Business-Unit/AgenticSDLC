# Comment Replies

Response comments should be brief, specific, and evidence-gated. The reviewer
should be able to see what changed without reading the entire section again.

## Good Reply Pattern

Use one sentence when possible:

```text
Added an opening integration paragraph that links the AI/ML platform, DataLance support layer, governance, and proof points into one solution story.
```

For comments that require validation:

```text
Flagged for confirmation because the metric or customer claim needs source evidence before red draft.
```

For comments that result in no edit:

```text
No text change made; retained current language because the RFQ Q&A did not alter this requirement.
```

## Avoid

- `Addressed.`
- `Done.`
- `Resolved in red.`
- Replies that repeat the reviewer comment without stating the correction.
- Unsupported claims, customer names, or metrics.

## Status Values

Recommended `comment_replies[].status` values:

- `addressed`
- `needs_confirmation`
- `no_change`
- `skip`

The Word reply wrapper adds response comments for non-empty replies unless the
status is `skip`, `skipped`, or `not_applicable`.

For final deliverables, use
`scripts/apply_merge_plan_with_word_replies.py` so responses are created with
Word's native `Comment.Replies.Add()` API. Do not rely on OOXML-only generated
comments when reviewer comments require true reply threads in the Word comment
pane.
