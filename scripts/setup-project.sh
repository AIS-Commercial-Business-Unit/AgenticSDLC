#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

REPO_FOLDER=""
AI_RAW=""
INCLUDE_CI="true"

C_RESET=""
C_BOLD=""
C_DIM=""
C_GREEN=""
C_YELLOW=""
C_RED=""

# Enable color only for interactive terminals, and allow users to opt out via
# NO_COLOR (https://no-color.org/).
if [[ -t 1 && -z "${NO_COLOR:-}" ]] && command -v tput >/dev/null 2>&1; then
  if [[ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]]; then
    C_RESET="$(tput sgr0)"
    C_BOLD="$(tput bold)"
    C_DIM="$(tput dim)"
    C_GREEN="$(tput setaf 2)"
    C_YELLOW="$(tput setaf 3)"
    C_RED="$(tput setaf 1)"
  fi
fi

print_help() {
  cat <<'HELP'
Usage:
  setup-project.sh [options]

Options:
  --folder, -f <path>      Destination repository folder.
  --ai, -a <tools>         AI tools (comma-separated): claude,copilot,codex,cursor,all.
                           Can be provided multiple times.
  --no-ci                  Skip copying CI workflow and PR template.
  --help, -h               Show this help.

When --ai is omitted, the script scans the destination folder for existing AI
tool artifacts (.claude/, CLAUDE.md, .github/agents/, AGENTS.md, .agents/skills/,
.cursor/skills/, .cursorrules) and offers detected tools as the default selection.

Examples:
  setup-project.sh --folder ~/dev/acme-app --ai all
  setup-project.sh -f ~/dev/acme-app --ai claude,copilot --no-ci
  setup-project.sh
HELP
}

log() {
  echo "${C_GREEN}[setup-project]${C_RESET} ${C_DIM}$*${C_RESET}"
}

warn() {
  echo "${C_YELLOW}[setup-project][warn]${C_RESET} $*" >&2
}

die() {
  echo "${C_RED}${C_BOLD}[setup-project][error]${C_RESET} $*" >&2
  exit 1
}

lower() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

is_valid_tool() {
  local t
  t="$(lower "$1")"
  [[ "$t" == "claude" || "$t" == "copilot" || "$t" == "codex" || "$t" == "cursor" || "$t" == "all" ]]
}

contains_item() {
  local needle="$1"
  shift || true
  local item
  for item in "$@"; do
    if [[ "$item" == "$needle" ]]; then
      return 0
    fi
  done
  return 1
}

AI_TOOLS=()
DETECTED_TOOLS=()

# Detect existing AI tool usage in a target directory (brownfield detection).
# Populates DETECTED_TOOLS with any tools found.
detect_existing_tools() {
  local dir="$1"
  DETECTED_TOOLS=()

  [[ -d "$dir" ]] || return 0

  # Claude: .claude/ directory or CLAUDE.md
  if [[ -d "$dir/.claude" || -f "$dir/CLAUDE.md" ]]; then
    DETECTED_TOOLS+=("claude")
  fi

  # Copilot: .github/agents/, .github/copilot-instructions.md, or AGENTS.md
  if [[ -d "$dir/.github/agents" || -f "$dir/.github/copilot-instructions.md" || -f "$dir/AGENTS.md" ]]; then
    DETECTED_TOOLS+=("copilot")
  fi

  # Codex: .agents/skills/
  if [[ -d "$dir/.agents/skills" ]]; then
    DETECTED_TOOLS+=("codex")
  fi

  # Cursor: .cursor/skills/, .cursor/rules/, or .cursorrules
  if [[ -d "$dir/.cursor/skills" || -d "$dir/.cursor/rules" || -f "$dir/.cursorrules" ]]; then
    DETECTED_TOOLS+=("cursor")
  fi
}

parse_ai_selection() {
  local raw="$1"
  local normalized
  # Normalize case and remove whitespace so repeated --ai flags can be merged
  # safely even if users include spaces (e.g. "claude, copilot").
  normalized="$(echo "$raw" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"

  [[ -n "$normalized" ]] || return 1

  local parts=()
  IFS=',' read -r -a parts <<< "$normalized"

  local parsed=()
  local p
  for p in "${parts[@]}"; do
    [[ -n "$p" ]] || continue
    is_valid_tool "$p" || return 1
    if [[ ${#parsed[@]} -eq 0 ]] || ! contains_item "$p" "${parsed[@]}"; then
      parsed+=("$p")
    fi
  done

  [[ ${#parsed[@]} -gt 0 ]] || return 1

  # "all" is a shorthand for every tool and must be exclusive.
  if contains_item "all" "${parsed[@]}" && [[ ${#parsed[@]} -gt 1 ]]; then
    return 1
  fi

  AI_TOOLS=("${parsed[@]}")
  return 0
}

add_ai_raw() {
  local value="$1"
  if [[ -z "$AI_RAW" ]]; then
    AI_RAW="$value"
  else
    AI_RAW+=" ,$value"
  fi
}

# process arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --folder|-f)
      [[ $# -ge 2 ]] || die "Missing value for --folder"
      REPO_FOLDER="$2"
      shift 2
      ;;
    --ai|-a)
      [[ $# -ge 2 ]] || die "Missing value for --ai"
      add_ai_raw "$2"
      shift 2
      ;;
    --no-ci)
      INCLUDE_CI="false"
      shift
      ;;
    --help|-h)
      print_help
      exit 0
      ;;
    *)
      die "Unknown argument: $1"
      ;;
  esac
done

if [[ -z "$REPO_FOLDER" ]]; then
  read -r -p "Repo folder: " REPO_FOLDER
fi

[[ -n "$REPO_FOLDER" ]] || die "Repo folder is required"

if [[ -z "$AI_RAW" ]]; then
  # Brownfield detection: look for existing AI tool artifacts in target repo.
  detect_existing_tools "$REPO_FOLDER"
  detected_default=""
  if [[ ${#DETECTED_TOOLS[@]} -gt 0 ]]; then
    detected_default="$(IFS=','; echo "${DETECTED_TOOLS[*]}")"
    log "Detected existing AI tool usage: ${C_BOLD}${detected_default}${C_RESET}"
  fi

  while true; do
    if [[ -n "$detected_default" ]]; then
      read -r -p "AI tools (comma-separated: claude,copilot,codex,cursor or all) [${detected_default}]: " AI_RAW
      # Use detected default if user presses Enter without input.
      if [[ -z "$AI_RAW" ]]; then
        AI_RAW="$detected_default"
      fi
    else
      read -r -p "AI tools (comma-separated: claude,copilot,codex,cursor or all): " AI_RAW
    fi
    if parse_ai_selection "$AI_RAW"; then
      break
    fi
    warn "Invalid AI selection. Pick one or more tools, or all (exclusive)."
  done
else
  parse_ai_selection "$AI_RAW" || die "Invalid --ai selection. Use claude,copilot,codex,cursor or all (exclusive)."
fi

if [[ ! -d "$SOURCE_ROOT/.specify" ]]; then
  die "Source root does not look like AIS framework repo: $SOURCE_ROOT"
fi

mkdir -p "$REPO_FOLDER"

if [[ ! -w "$REPO_FOLDER" ]]; then
  die "Repo folder is not writable: $REPO_FOLDER"
fi

if [[ ! -d "$REPO_FOLDER/.git" ]]; then
  log "Initializing git repository"
  # Prefer main as the initial branch. Fall back for older Git versions that
  # do not support --initial-branch.
  if git -C "$REPO_FOLDER" init --initial-branch=main >/dev/null 2>&1; then
    :
  else
    git -C "$REPO_FOLDER" init >/dev/null
    current_head="$(git -C "$REPO_FOLDER" symbolic-ref --short HEAD 2>/dev/null || true)"
    if [[ "$current_head" == "master" ]]; then
      git -C "$REPO_FOLDER" symbolic-ref HEAD refs/heads/main >/dev/null 2>&1 || true
    fi
  fi
fi

if [[ ! -f "$REPO_FOLDER/README.md" ]]; then
  cat > "$REPO_FOLDER/README.md" <<'EOF'
# Project Repository

Bootstrapped with AIS project setup script.
EOF
fi

if [[ -f "$REPO_FOLDER/.gitignore" ]]; then
  GITIGNORE_RULES=(
    '.project-context/*'
    '!.project-context/.keep'
  )

  appended=false
  for rule in "${GITIGNORE_RULES[@]}"; do
    if ! grep -Fxq "$rule" "$REPO_FOLDER/.gitignore"; then
      if ! $appended; then
        printf '\n' >> "$REPO_FOLDER/.gitignore"
      fi
      printf '%s\n' "$rule" >> "$REPO_FOLDER/.gitignore"
      appended=true
    fi
  done

  if $appended; then
    log "Appended .project-context rules to existing .gitignore"
  fi
fi

copy_item() {
  local rel="$1"
  local src="$SOURCE_ROOT/$rel"
  local dst="$REPO_FOLDER/$rel"

  if [[ ! -e "$src" ]]; then
    warn "Missing source path, skipping: $rel"
    return 0
  fi

  if [[ -e "$dst" ]]; then
    # Never overwrite project-local files during bootstrap.
    warn "Destination exists, skipping: $rel"
    return 0
  fi

  mkdir -p "$(dirname "$dst")"
  # Use a portable copy mode: cp -a is GNU-only and not available on macOS.
  cp -PR "$src" "$dst"
  log "Copied: $rel"
}

ITEMS=()
add_item() {
  local rel="$1"
  if [[ ${#ITEMS[@]} -eq 0 ]] || ! contains_item "$rel" "${ITEMS[@]}"; then
    ITEMS+=("$rel")
  fi
}

add_item ".specify"
add_item "PLANS.md"
add_item "CONTRIBUTING.md"
add_item ".gitignore"
add_item ".markdownlint.jsonc"
add_item "Skills"

# These paths belong to each destination project. The AIS Spec source repo may
# contain its own specs/docs/README for framework development, but setup must
# never copy those artifacts into downstream project repos.
PROJECT_OWNED_SOURCE_PATHS=(
  ".project-context"
  "docs"
  "README.md"
  "specs"
)

# Tool-specific surfaces are opt-in so downstream automation only validates
# files for the selected AI tool(s).
ALL_TOOLS_SELECTED=false
if contains_item "all" "${AI_TOOLS[@]}"; then
  ALL_TOOLS_SELECTED=true
fi

if $ALL_TOOLS_SELECTED || contains_item "claude" "${AI_TOOLS[@]}"; then
  add_item ".claude/commands"
  add_item "CLAUDE.md"
fi

if $ALL_TOOLS_SELECTED || contains_item "copilot" "${AI_TOOLS[@]}"; then
  add_item ".github/agents"
  add_item "AGENTS.md"
fi

if $ALL_TOOLS_SELECTED || contains_item "codex" "${AI_TOOLS[@]}"; then
  add_item ".agents/skills"
  add_item "AGENTS.md"
fi

if $ALL_TOOLS_SELECTED || contains_item "cursor" "${AI_TOOLS[@]}"; then
  add_item ".cursor/skills"
fi

if [[ "$INCLUDE_CI" == "true" ]]; then
  add_item ".github/workflows/ci.yml"
  add_item ".github/pull_request_template.md"
fi

for project_owned_path in "${PROJECT_OWNED_SOURCE_PATHS[@]}"; do
  if contains_item "$project_owned_path" "${ITEMS[@]}"; then
    die "Internal setup error: attempted to copy project-owned path: $project_owned_path"
  fi
done

for item in "${ITEMS[@]}"; do
  copy_item "$item"
done

mkdir -p "$REPO_FOLDER/.project-context" "$REPO_FOLDER/specs"

cat <<EOF

Setup complete.

Next:
1. Add your raw inputs (SOWs, RFPs, transcripts, requirements) into:
   $REPO_FOLDER/.project-context
2. Run:
   /ais.setup.plan
   /ais.setup.architecture
   /ais.setup.constitution

Guide:
https://github.com/ais-internal/ais-spec/blob/main/docs/guides/project-setup.md
EOF
