# /// script
# dependencies = []
# requires-python = ">=3.10"
# ///

"""Build a merge-plan skeleton from extracted proposal review context."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def build_merge_plan(
    review_context: dict,
    source_docx: str = "",
    output_docx: str = "",
    author: str = "AIS Proposal Team",
    initials: str = "AIS",
) -> dict:
    comments = review_context.get("comments", [])
    source = source_docx or review_context.get("source_docx", "")

    return {
        "source_docx": source,
        "output_docx": output_docx,
        "settings": {
            "author": author,
            "initials": initials,
            "enable_track_revisions": True,
            "preserve_comments": True,
        },
        "operations": [],
        "comment_replies": [
            {
                "comment_id": str(comment.get("id", "")),
                "anchor_paragraph_index": comment.get("anchor_paragraph_index", -1),
                "anchor_text": comment.get("anchor_text", ""),
                "reviewer_comment": comment.get("text", ""),
                "status": "needs_response",
                "reply": "",
            }
            for comment in comments
        ],
        "validation": {
            "expect_reviewer_comments": len(comments),
            "expect_resolution_comments": 0,
            "fail_generic_replies": True,
        },
        "operation_examples": [
            {
                "type": "replace_paragraph_text",
                "paragraph_index": 12,
                "style": "_Body",
                "text": "Replacement paragraph text.",
            },
            {
                "type": "insert_paragraph_after",
                "paragraph_index": 12,
                "style": "_Body",
                "text": "Inserted paragraph text.",
            },
            {
                "type": "insert_table_after",
                "paragraph_index": 12,
                "style": "TableGrid",
                "rows": [["Column 1", "Column 2"], ["Value 1", "Value 2"]],
            },
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Create a human-reviewable redline merge-plan JSON skeleton."
    )
    parser.add_argument(
        "--review-context",
        required=True,
        help="Path to JSON produced by extract_review_context.py.",
    )
    parser.add_argument(
        "--source-docx",
        default="",
        help="Optional source DOCX path to place in the merge plan.",
    )
    parser.add_argument(
        "--output-docx",
        default="",
        help="Optional output DOCX path to place in the merge plan.",
    )
    parser.add_argument(
        "--author",
        default="AIS Proposal Team",
        help="Author used for tracked revisions and response comments.",
    )
    parser.add_argument(
        "--initials",
        default="AIS",
        help="Initials used for response comments.",
    )
    parser.add_argument(
        "--output",
        help="Path to write the merge plan. If omitted, writes to stdout.",
    )
    args = parser.parse_args()

    try:
        context = json.loads(Path(args.review_context).read_text(encoding="utf-8"))
        plan = build_merge_plan(
            context,
            source_docx=args.source_docx,
            output_docx=args.output_docx,
            author=args.author,
            initials=args.initials,
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    output = json.dumps(plan, indent=2, ensure_ascii=False)
    if args.output:
        Path(args.output).write_text(output + "\n", encoding="utf-8")
        print(f"Wrote merge plan skeleton to {args.output}", file=sys.stderr)
    else:
        print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
