# /// script
# dependencies = [
#   "lxml>=5.0.0",
# ]
# requires-python = ">=3.10"
# ///

"""Apply a proposal redline merge plan to an existing DOCX."""

from __future__ import annotations

import argparse
import json
import sys
import zipfile
from pathlib import Path

from docx_redline_lib import (
    COMMENTS_CONTENT_TYPE,
    body_paragraphs,
    create_comments_root,
    create_rels_root,
    create_settings_root,
    ensure_comments_relationship,
    ensure_content_type_override,
    ensure_track_revisions,
    extract_comment_anchors,
    insert_after,
    make_inserted_paragraph,
    make_inserted_table,
    next_comment_id,
    normalize_rows,
    read_xml_part,
    replace_paragraph_text,
    serialize_xml,
    utc_now,
    add_comment,
    anchor_comment_to_paragraph,
    max_numeric_attr,
    write_docx_with_replacements,
)


def _load_part_or_none(zf: zipfile.ZipFile, part_name: str):
    if part_name not in set(zf.namelist()):
        return None
    return read_xml_part(zf, part_name)


def apply_merge_plan(
    input_docx: str | Path,
    plan_path: str | Path,
    output_docx: str | Path,
    *,
    skip_comment_replies: bool = False,
) -> dict:
    input_docx = Path(input_docx)
    output_docx = Path(output_docx)
    plan = json.loads(Path(plan_path).read_text(encoding="utf-8"))
    settings = plan.get("settings", {})
    author = settings.get("author", "AIS Proposal Team")
    initials = settings.get("initials", "AIS")
    date = settings.get("date") or utc_now()

    with zipfile.ZipFile(input_docx, "r") as zf:
        names = set(zf.namelist())
        had_comments_part = "word/comments.xml" in names
        document_root = read_xml_part(zf, "word/document.xml")
        settings_root = (
            read_xml_part(zf, "word/settings.xml")
            if "word/settings.xml" in names
            else create_settings_root()
        )
        comments_root = (
            read_xml_part(zf, "word/comments.xml")
            if had_comments_part
            else create_comments_root()
        )
        content_types_root = read_xml_part(zf, "[Content_Types].xml")
        rels_root = (
            read_xml_part(zf, "word/_rels/document.xml.rels")
            if "word/_rels/document.xml.rels" in names
            else create_rels_root()
        )

    if settings.get("enable_track_revisions", True):
        ensure_track_revisions(settings_root)

    paragraphs = body_paragraphs(document_root)
    revision_id = max(max_numeric_attr(document_root, "id") + 1, 1)
    operations_applied = 0

    for op in plan.get("operations", []):
        if op.get("enabled") is False:
            continue
        op_type = op.get("type")
        paragraph_index = op.get("paragraph_index")
        if not isinstance(paragraph_index, int):
            raise ValueError(f"Operation {op_type!r} is missing integer paragraph_index")
        if paragraph_index < 0 or paragraph_index >= len(paragraphs):
            raise ValueError(
                f"Operation {op_type!r} paragraph_index {paragraph_index} is out of range "
                f"(0-{len(paragraphs) - 1})"
            )
        target = paragraphs[paragraph_index]

        if op_type == "replace_paragraph_text":
            revision_id = replace_paragraph_text(
                target,
                str(op.get("text", "")),
                revision_id,
                author,
                date,
                style_id=op.get("style", ""),
            )
            operations_applied += 1
        elif op_type == "insert_paragraph_after":
            inserted = make_inserted_paragraph(
                str(op.get("text", "")),
                revision_id,
                author,
                date,
                base_paragraph=target,
                style_id=op.get("style", ""),
            )
            revision_id += 1
            insert_after(target, inserted)
            paragraphs = body_paragraphs(document_root)
            operations_applied += 1
        elif op_type == "insert_table_after":
            rows = normalize_rows(op.get("rows", []))
            table = make_inserted_table(
                rows,
                revision_id,
                author,
                date,
                style_id=op.get("style", "TableGrid"),
            )
            cell_count = sum(len(row) for row in rows)
            revision_id += max(cell_count, 1)
            insert_after(target, table)
            paragraphs = body_paragraphs(document_root)
            operations_applied += 1
        else:
            raise ValueError(f"Unsupported operation type: {op_type!r}")

    anchors = extract_comment_anchors(document_root)
    paragraphs = body_paragraphs(document_root)
    comment_id = next_comment_id(comments_root)
    response_comments_added = 0

    comment_replies = [] if skip_comment_replies else plan.get("comment_replies", [])
    for reply in comment_replies:
        reply_text = str(reply.get("reply", "")).strip()
        status = str(reply.get("status", "")).strip().lower()
        if not reply_text or status in {"skip", "skipped", "not_applicable"}:
            continue

        parent_comment_id = str(reply.get("comment_id", ""))
        anchor_index = reply.get("anchor_paragraph_index", -1)
        if not isinstance(anchor_index, int) or anchor_index < 0:
            anchor_index = anchors.get(parent_comment_id, {}).get(
                "anchor_paragraph_index", -1
            )
        if not isinstance(anchor_index, int) or anchor_index < 0 or anchor_index >= len(paragraphs):
            print(
                f"Warning: could not anchor response for comment {parent_comment_id}; skipping.",
                file=sys.stderr,
            )
            continue

        add_comment(comments_root, comment_id, author, initials, date, reply_text)
        anchor_comment_to_paragraph(paragraphs[anchor_index], comment_id)
        comment_id += 1
        response_comments_added += 1

    if response_comments_added:
        ensure_comments_relationship(rels_root)
        ensure_content_type_override(
            content_types_root,
            "/word/comments.xml",
            COMMENTS_CONTENT_TYPE,
        )

    replacements = {
        "word/document.xml": serialize_xml(document_root),
        "word/settings.xml": serialize_xml(settings_root),
        "[Content_Types].xml": serialize_xml(content_types_root),
        "word/_rels/document.xml.rels": serialize_xml(rels_root),
    }
    if response_comments_added or had_comments_part:
        replacements["word/comments.xml"] = serialize_xml(comments_root)

    write_docx_with_replacements(input_docx, output_docx, replacements)

    return {
        "output_docx": str(output_docx),
        "operations_applied": operations_applied,
        "response_comments_added": response_comments_added,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Apply targeted paragraph/table edits and response comments to an existing DOCX."
    )
    parser.add_argument("--input", required=True, help="Path to source pink DOCX.")
    parser.add_argument("--plan", required=True, help="Path to merge-plan JSON.")
    parser.add_argument("--output", required=True, help="Path for output redline DOCX.")
    parser.add_argument(
        "--skip-comment-replies",
        action="store_true",
        help="Apply document edits while preserving original comments but not adding reply comments.",
    )
    args = parser.parse_args()

    try:
        result = apply_merge_plan(
            args.input,
            args.plan,
            args.output,
            skip_comment_replies=args.skip_comment_replies,
        )
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
