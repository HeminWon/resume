#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "[preview] build resume"
./scripts/build.sh

PUBLISH_PATH="${PUBLISH_PATH:-preview}"
SYNC_LATEST="${SYNC_LATEST:-false}"
PUBLISH_SOURCE="${PUBLISH_SOURCE:-${ROOT_DIR}/build}"

echo "[preview] publish to ${PUBLISH_PATH} with managed gh-pages worktree"
PUBLISH_PATH="${PUBLISH_PATH}" \
SYNC_LATEST="${SYNC_LATEST}" \
PUBLISH_SOURCE="${PUBLISH_SOURCE}" \
./scripts/publish-gh-pages-worktree.sh
