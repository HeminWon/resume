#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(git -C "${PROJECT_DIR}" rev-parse --show-toplevel)"

BUILD_DIR="${PROJECT_DIR}/build"
PUBLISH_SOURCE="${PUBLISH_SOURCE:-${BUILD_DIR}}"
PUBLISH_YEAR="${PUBLISH_YEAR:-${YEAR:-}}"
SYNC_LATEST="${SYNC_LATEST:-${SYNC_LATEST_INPUT:-false}}"
WORKTREE_DIR="${WORKTREE_DIR:-${PUBLISH_WORKTREE:-}}"
TARGET_ROOT="${WORKTREE_DIR}"

normalize_bool() {
  case "${1,,}" in
    1|true|yes|y|on) echo "true";;
    *) echo "false";;
  esac
}

ensure_publish_inputs() {
  if [[ -z "${PUBLISH_YEAR}" ]]; then
    PUBLISH_YEAR="$(date -u +%Y)"
  fi

  SYNC_LATEST="$(normalize_bool "${SYNC_LATEST}")"

  if [[ ! -d "${PUBLISH_SOURCE}" ]] || [[ ! -f "${PUBLISH_SOURCE}/index.html" ]]; then
    echo "[publish] publish source missing: ${PUBLISH_SOURCE}" >&2
    exit 1
  fi

  if [[ -z "${TARGET_ROOT}" ]] || [[ ! -d "${TARGET_ROOT}" ]]; then
    echo "[publish] worktree directory missing; set WORKTREE_DIR" >&2
    exit 1
  fi
}

sync_publish_dirs() {
  echo "[publish] syncing build to publish directories"
  TARGET_DIR="${TARGET_ROOT}/${PUBLISH_YEAR}"
  mkdir -p "${TARGET_DIR}"
  rsync -a --delete "${PUBLISH_SOURCE}/" "${TARGET_DIR}/"
  touch "${TARGET_DIR}/.nojekyll"

  if [[ "${SYNC_LATEST}" == "true" ]]; then
    LATEST_DIR="${TARGET_ROOT}/latest"
    mkdir -p "${LATEST_DIR}"
    rsync -a --delete "${PUBLISH_SOURCE}/" "${LATEST_DIR}/"
    touch "${LATEST_DIR}/.nojekyll"
  fi
}

commit_and_push() {
  echo "[publish] staging publish files"
  cd "${TARGET_ROOT}"
  touch .nojekyll
  git add .nojekyll "${PUBLISH_YEAR}"
  if [[ "${SYNC_LATEST}" == "true" ]]; then
    git add latest
  fi
  if git diff --cached --quiet; then
    echo "[publish] no changes to publish"
    exit 0
  fi

  echo "[publish] committing changes"
  git commit -m "chore: publish gh-pages ${PUBLISH_YEAR}"
  echo "[publish] pushing gh-pages"
  git push origin gh-pages
  echo "[publish] gh-pages updated (${PUBLISH_YEAR}, latest=${SYNC_LATEST})"
}

ensure_publish_inputs
sync_publish_dirs
commit_and_push
