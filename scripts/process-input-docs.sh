#!/usr/bin/env bash
# process-input-docs.sh
# Converts source files in docs/input/ to markdown in docs/input/processed/.
# Processed files ARE committed. Source files stay local (gitignored).
#
# Prerequisites: pandoc (https://pandoc.org/installing.html)

set -euo pipefail

INPUT_DIR="$(git rev-parse --show-toplevel)/docs/input"
OUTPUT_DIR="${INPUT_DIR}/processed"
SUPPORTED_EXTENSIONS=("docx" "doc" "xlsx" "xls" "pdf" "pptx" "ppt" "txt")

if ! command -v pandoc &>/dev/null; then
  echo "❌  pandoc is required. Install from https://pandoc.org/installing.html"
  echo "    brew install pandoc   |   choco install pandoc   |   apt install pandoc"
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

converted=0
skipped=0
failed=0

for ext in "${SUPPORTED_EXTENSIONS[@]}"; do
  for src in "${INPUT_DIR}"/*.${ext}; do
    [[ -f "${src}" ]] || continue
    filename="$(basename "${src}" ".${ext}")"
    dest="${OUTPUT_DIR}/${filename}.md"

    echo "→  Converting: $(basename "${src}")"
    if pandoc "${src}" -t gfm -o "${dest}" 2>/dev/null; then
      echo "   ✅ ${filename}.md"
      ((converted++)) || true
    else
      echo "   ⚠️  Failed to convert ${filename}.${ext} — skipping"
      ((failed++)) || true
    fi
  done
done

echo ""
echo "────────────────────────────────────────"
echo "  Converted : ${converted}"
echo "  Failed    : ${failed}"
echo ""
echo "Processed files written to: docs/input/processed/"
echo "These files ARE tracked in git — commit them to share with your team."
echo ""
echo "⚠️  Processed files are working context, not authoritative sources."
echo "   Always refer to the original source for decisions."
