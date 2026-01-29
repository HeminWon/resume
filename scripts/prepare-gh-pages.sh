#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(git -C "${PROJECT_DIR}" rev-parse --show-toplevel)"

cd "${REPO_ROOT}"

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch origin gh-pages:gh-pages
  git checkout gh-pages
else
  git checkout --orphan gh-pages
fi

git rm -rf . >/dev/null 2>&1 || true
git clean -fdx >/dev/null 2>&1 || true
touch .nojekyll
