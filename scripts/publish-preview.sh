#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "[preview] build resume"
./scripts/build.sh

echo "[preview] prepare gh-pages worktree"
WORKTREE_DIR="$(./scripts/core/prepare-gh-pages.sh | tail -n 1)"

PUBLISH_PATH="${PUBLISH_PATH:-preview}"
SYNC_LATEST="${SYNC_LATEST:-false}"
PUBLISH_SOURCE="${PUBLISH_SOURCE:-${ROOT_DIR}/build}"

echo "[preview] publish to ${PUBLISH_PATH}"
PUBLISH_PATH="${PUBLISH_PATH}" \
SYNC_LATEST="${SYNC_LATEST}" \
PUBLISH_SOURCE="${PUBLISH_SOURCE}" \
WORKTREE_DIR="${WORKTREE_DIR}" \
./scripts/core/publish-gh-pages.sh
