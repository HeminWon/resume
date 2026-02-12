#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPO_ROOT="$(git -C "${PROJECT_DIR}" rev-parse --show-toplevel)"

WORKTREE_DIR=""
LOG_PREFIX="[prepare]"

cd "${REPO_ROOT}"

if ! git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  echo "${LOG_PREFIX} gh-pages branch not found on origin" >&2
  exit 1
fi

existing_worktree="$(git worktree list --porcelain | awk '
  $1 == "worktree" { wt=$2 }
  $1 == "branch" && $2 == "refs/heads/gh-pages" { print wt }
')" || true

echo "${LOG_PREFIX} syncing local gh-pages with origin" >&2
if [[ -z "${existing_worktree}" ]]; then
  git fetch origin +gh-pages:gh-pages
else
  echo "${LOG_PREFIX} gh-pages already checked out at ${existing_worktree}; sync by fast-forward" >&2
  if [[ -n "$(git -C "${existing_worktree}" status --porcelain)" ]]; then
    echo "${LOG_PREFIX} existing gh-pages worktree is dirty: ${existing_worktree}" >&2
    echo "${LOG_PREFIX} clean the worktree before publishing." >&2
    exit 1
  fi
  git -C "${existing_worktree}" fetch origin gh-pages
  git -C "${existing_worktree}" merge --ff-only origin/gh-pages
fi

if [[ -n "${existing_worktree}" ]]; then
  WORKTREE_DIR="${existing_worktree}"
else
  WORKTREE_DIR="$(mktemp -d)"
  git worktree add "${WORKTREE_DIR}" gh-pages 1>&2
fi

cd "${WORKTREE_DIR}"
touch .nojekyll

echo "${WORKTREE_DIR}"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "worktree_dir=${WORKTREE_DIR}" >> "${GITHUB_OUTPUT}"
fi
