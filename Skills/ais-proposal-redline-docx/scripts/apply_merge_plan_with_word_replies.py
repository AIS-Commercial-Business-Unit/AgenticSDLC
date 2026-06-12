# /// script
# dependencies = [
#   "lxml>=5.0.0",
#   "pywin32>=306; platform_system == 'Windows'",
# ]
# requires-python = ">=3.10"
# ///

"""Apply a merge plan, then add true Word reply threads with Word COM."""

from __future__ import annotations

import argparse
import json
import os
import platform
import sys
import tempfile
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

from apply_merge_plan import apply_merge_plan

WORD_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
SKIP_STATUSES = {"skip", "skipped", "not_applicable"}


def word_attr(name: str) -> str:
    return f"{{{WORD_NS}}}{name}"


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def require_existing_path(path: str | Path, name: str) -> Path:
    resolved = Path(path).expanduser().resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"{name} does not exist: {resolved}")
    return resolved


def require_word_com():
    if platform.system() != "Windows":
        raise RuntimeError(
            "Word-native reply threading requires Windows with Microsoft Word installed."
        )
    try:
        import win32com.client  # type: ignore[import-not-found]
    except ImportError as exc:
        raise RuntimeError(
            "Word-native reply threading requires pywin32. Install it or run this "
            "script with uv so the declared script dependency can be installed."
        ) from exc
    return win32com.client


def read_xml_from_docx(docx_path: Path, part_name: str) -> ET.Element | None:
    with zipfile.ZipFile(docx_path, "r") as zf:
        try:
            data = zf.read(part_name)
        except KeyError:
            return None
    return ET.fromstring(data)


def reviewer_comment_ids(docx_path: Path, response_author: str) -> list[str]:
    comments_root = read_xml_from_docx(docx_path, "word/comments.xml")
    if comments_root is None:
        return []

    reviewer_ids: list[str] = []
    reviewer_id_set: set[str] = set()
    for index, comment in enumerate(
        comments_root.findall(f"{{{WORD_NS}}}comment"),
        start=1,
    ):
        comment_id = comment.get(word_attr("id"), "")
        author = comment.get(word_attr("author"), "")
        if author == response_author:
            continue
        if not comment_id.strip():
            raise ValueError(
                f"Encountered a reviewer comment without a comments.xml ID at index {index}."
            )
        if comment_id in reviewer_id_set:
            raise ValueError(f"Duplicate reviewer comment ID in comments.xml: {comment_id}.")
        reviewer_ids.append(comment_id)
        reviewer_id_set.add(comment_id)

    document_root = read_xml_from_docx(docx_path, "word/document.xml")
    if document_root is None:
        return reviewer_ids

    ordered: list[str] = []
    seen: set[str] = set()
    for node in document_root.iter():
        if local_name(node.tag) not in {"commentRangeStart", "commentReference"}:
            continue
        comment_id = node.get(word_attr("id"), "")
        if comment_id in reviewer_id_set and comment_id not in seen:
            ordered.append(comment_id)
            seen.add(comment_id)

    for comment_id in reviewer_ids:
        if comment_id not in seen:
            ordered.append(comment_id)

    return ordered


def actionable_replies(plan: dict[str, Any]) -> list[dict[str, Any]]:
    replies: list[dict[str, Any]] = []
    for reply in plan.get("comment_replies", []):
        reply_text = str(reply.get("reply", "")).strip()
        status = str(reply.get("status", "")).strip().lower()
        if reply_text and status not in SKIP_STATUSES:
            replies.append(reply)
    return replies


def replies_by_comment_id(replies: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    by_id: dict[str, dict[str, Any]] = {}
    for reply in replies:
        comment_id = str(reply.get("comment_id", "")).strip()
        if not comment_id:
            raise ValueError("A merge-plan reply is missing comment_id.")
        if comment_id in by_id:
            raise ValueError(f"Merge plan contains duplicate replies for comment_id {comment_id}.")
        by_id[comment_id] = reply
    return by_id


def validate_reply_coverage(
    original_comment_ids: list[str],
    replies_by_id: dict[str, dict[str, Any]],
) -> None:
    original_id_set = set(original_comment_ids)
    missing_reply_ids = [
        comment_id for comment_id in original_comment_ids if comment_id not in replies_by_id
    ]
    if missing_reply_ids:
        raise ValueError(
            "Merge plan is missing replies for reviewer comment IDs: "
            + ", ".join(missing_reply_ids)
        )

    unknown_reply_ids = [
        comment_id for comment_id in replies_by_id if comment_id not in original_id_set
    ]
    if unknown_reply_ids:
        raise ValueError(
            "Merge plan references comment IDs not found in the document: "
            + ", ".join(unknown_reply_ids)
        )


def add_word_reply_threads(
    base_docx: Path,
    output_docx: Path,
    original_comment_ids: list[str],
    replies_by_id: dict[str, dict[str, Any]],
    *,
    author: str,
    initials: str,
) -> dict[str, Any]:
    win32_client = require_word_com()
    word = None
    doc = None
    old_user_name = None
    old_initials = None

    if output_docx.exists():
        output_docx.unlink()

    try:
        word = win32_client.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = 0

        old_user_name = word.UserName
        old_initials = word.UserInitials
        word.UserName = author
        word.UserInitials = initials

        doc = word.Documents.Open(str(base_docx), False, False)
        original_comments = []
        for index in range(1, doc.Comments.Count + 1):
            comment = doc.Comments.Item(index)
            if comment.Author != author:
                original_comments.append(comment)

        if len(original_comments) != len(original_comment_ids):
            raise RuntimeError(
                f"Word reviewer comment count ({len(original_comments)}) does not "
                f"match comments.xml reviewer comment count ({len(original_comment_ids)})."
            )

        original_comments_by_id = dict(zip(original_comment_ids, original_comments))

        for comment_id in original_comment_ids:
            parent = original_comments_by_id[comment_id]
            before_count = parent.Replies.Count
            reply_text = str(replies_by_id[comment_id].get("reply", "")).strip()
            reply = parent.Replies.Add(parent.Range, reply_text)
            reply.Author = author
            reply.Initial = initials

            if parent.Replies.Count < before_count + 1:
                raise RuntimeError(
                    f"Word did not attach reply to reviewer comment ID {comment_id}."
                )

        doc.SaveAs2(str(output_docx), 16)
        doc.Close(False)
        doc = None

        validation_doc = word.Documents.Open(str(output_docx), False, True)
        try:
            missing_indexes: list[str] = []
            validated_originals = []
            for index in range(1, validation_doc.Comments.Count + 1):
                comment = validation_doc.Comments.Item(index)
                if comment.Author != author:
                    validated_originals.append(comment)

            for index, comment in enumerate(validated_originals, start=1):
                if comment.Replies.Count < 1:
                    missing_indexes.append(str(index))

            if missing_indexes:
                raise RuntimeError(
                    "Missing threaded replies for reviewer comment indexes: "
                    + ", ".join(missing_indexes)
                )
        finally:
            validation_doc.Close(False)

        word.UserName = old_user_name
        word.UserInitials = old_initials
        word.Quit()
        word = None

        return {
            "output_docx": str(output_docx),
            "reviewer_comments": len(original_comment_ids),
            "threaded_replies_added": len(replies_by_id),
            "validation": (
                "Word COM validation passed: every original reviewer comment "
                "has a reply thread."
            ),
        }
    finally:
        if doc is not None:
            doc.Close(False)
        if word is not None:
            if old_user_name is not None:
                word.UserName = old_user_name
            if old_initials is not None:
                word.UserInitials = old_initials
            word.Quit()


def apply_merge_plan_with_word_replies(
    input_docx: str | Path,
    plan_path: str | Path,
    output_docx: str | Path,
) -> dict[str, Any]:
    input_path = require_existing_path(input_docx, "Input DOCX")
    plan_file = require_existing_path(plan_path, "Merge plan")
    output_path = Path(output_docx).expanduser().resolve()
    if not output_path.parent.exists():
        raise FileNotFoundError(f"Output directory does not exist: {output_path.parent}")

    plan = json.loads(plan_file.read_text(encoding="utf-8"))
    settings = plan.get("settings", {})
    author = str(settings.get("author") or "AIS Specify")
    initials = str(settings.get("initials") or "AIS")
    replies = actionable_replies(plan)
    if not replies:
        raise ValueError("Merge plan has no non-empty comment replies.")

    replies_by_id = replies_by_comment_id(replies)
    fd, base_docx_name = tempfile.mkstemp(prefix="ais-redline-base-", suffix=".docx")
    os.close(fd)
    base_docx = Path(base_docx_name)
    try:
        apply_result = apply_merge_plan(
            input_path,
            plan_file,
            base_docx,
            skip_comment_replies=True,
        )
        original_comment_ids = reviewer_comment_ids(base_docx, author)
        if len(original_comment_ids) != len(replies):
            raise ValueError(
                f"Original reviewer comment count ({len(original_comment_ids)}) "
                f"does not match reply count ({len(replies)})."
            )
        validate_reply_coverage(original_comment_ids, replies_by_id)
        word_result = add_word_reply_threads(
            base_docx,
            output_path,
            original_comment_ids,
            replies_by_id,
            author=author,
            initials=initials,
        )
        return {**apply_result, **word_result}
    finally:
        try:
            os.remove(base_docx)
        except FileNotFoundError:
            pass


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Apply targeted redline edits, then create true Word reply threads "
            "for reviewer comments."
        )
    )
    parser.add_argument("--input", required=True, help="Path to source pink DOCX.")
    parser.add_argument("--plan", required=True, help="Path to merge-plan JSON.")
    parser.add_argument("--output", required=True, help="Path for output redline DOCX.")
    args = parser.parse_args()

    try:
        result = apply_merge_plan_with_word_replies(args.input, args.plan, args.output)
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
