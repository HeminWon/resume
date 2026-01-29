#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cleanup_worktree() {
  if [[ -n "${WORKTREE_DIR:-}" ]]; then
    git -C "${PROJECT_DIR}" worktree remove "${WORKTREE_DIR}" >/dev/null 2>&1 || true
  fi
}

WORKTREE_DIR="$("${PROJECT_DIR}/scripts/core/prepare-gh-pages.sh")"
trap cleanup_worktree EXIT

WORKTREE_DIR="${WORKTREE_DIR##*$'\n'}"
export WORKTREE_DIR

"${PROJECT_DIR}/scripts/core/publish-gh-pages.sh"
