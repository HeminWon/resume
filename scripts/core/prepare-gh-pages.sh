#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPO_ROOT="$(git -C "${PROJECT_DIR}" rev-parse --show-toplevel)"

WORKTREE_DIR="$(mktemp -d)"

cd "${REPO_ROOT}"

if ! git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  echo "[prepare] gh-pages branch not found on origin" >&2
  exit 1
fi

git fetch origin gh-pages:gh-pages
git worktree add "${WORKTREE_DIR}" gh-pages

cd "${WORKTREE_DIR}"
touch .nojekyll

echo "${WORKTREE_DIR}"
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "worktree_dir=${WORKTREE_DIR}" >> "${GITHUB_OUTPUT}"
fi
