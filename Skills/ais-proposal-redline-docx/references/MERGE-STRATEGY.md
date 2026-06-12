# Merge Strategy

Use this workflow when reviewers expect edits in the existing pink DOCX rather
than a regenerated red draft.

## Operating Model

1. Start from the pink DOCX.
2. Extract reviewer comments and paragraph anchors.
3. Draft the revised content outside the document.
4. Convert the approved edits into a small merge plan.
5. Apply only those targeted operations.
6. Validate comments, tracked revisions, and package structure.
7. Open or render the result for visual QA.

The merge plan is intentionally explicit. It prevents broad rewrites from
changing cover pages, form tables, headers, footers, or page discipline.

## Supported Operations

Use `replace_paragraph_text` for a direct paragraph replacement when the target
paragraph is simple body text.

Use `insert_paragraph_after` when replacing the paragraph would risk disturbing
nearby comments, table structures, or reviewer anchors.

Use `insert_table_after` only for bounded tables that are explicitly part of the
red-draft change. Keep rows and cells small; verify formatting visually.

## What to Avoid

- Do not use paragraph operations on complex image, field, footnote, or content
  control paragraphs without visual QA.
- Do not target by text search alone; use extracted paragraph indices and inspect
  surrounding text.
- Do not use broad section regeneration for a form that must preserve formatting.
- Do not accept or remove reviewer comments unless the user explicitly asks.

## Page Limits

The scripts do not calculate page count. After applying a merge plan, render or
open the DOCX and verify that the edited sections still meet page limits.
