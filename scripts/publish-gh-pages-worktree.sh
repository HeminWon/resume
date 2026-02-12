#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WORKTREE_CREATED="false"
EXISTING_WORKTREE="$(git -C "${PROJECT_DIR}" worktree list --porcelain | awk '
  $1 == "worktree" { wt=$2 }
  $1 == "branch" && $2 == "refs/heads/gh-pages" { print wt; exit }
')"

cleanup_worktree() {
  if [[ "${WORKTREE_CREATED}" == "true" && -n "${WORKTREE_DIR:-}" ]]; then
    git -C "${PROJECT_DIR}" worktree remove "${WORKTREE_DIR}" >/dev/null 2>&1 || true
  fi
}

WORKTREE_DIR="$("${PROJECT_DIR}/scripts/core/prepare-gh-pages.sh" | tail -n 1)"
trap cleanup_worktree EXIT

if [[ -z "${WORKTREE_DIR}" ]]; then
  echo "[publish-worktree] failed to resolve WORKTREE_DIR" >&2
  exit 1
fi
if [[ -z "${EXISTING_WORKTREE}" || "${EXISTING_WORKTREE}" != "${WORKTREE_DIR}" ]]; then
  WORKTREE_CREATED="true"
fi
export WORKTREE_DIR

"${PROJECT_DIR}/scripts/core/publish-gh-pages.sh"
