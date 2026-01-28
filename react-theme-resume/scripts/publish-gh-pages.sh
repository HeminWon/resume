#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

BUILD_DIR="${ROOT_DIR}/build"
PUBLISH_YEAR="${PUBLISH_YEAR:-${YEAR:-}}"
SYNC_LATEST="${SYNC_LATEST:-${SYNC_LATEST_INPUT:-false}}"

if [[ -z "${PUBLISH_YEAR}" ]]; then
  PUBLISH_YEAR="$(date -u +%Y)"
fi

normalize_bool() {
  case "${1,,}" in
    1|true|yes|y|on) echo "true";;
    *) echo "false";;
  esac
}

SYNC_LATEST="$(normalize_bool "${SYNC_LATEST}")"

if [[ ! -d "${BUILD_DIR}" ]]; then
  echo "[publish] build directory not found: ${BUILD_DIR}" >&2
  exit 1
fi

if [[ ! -f "${BUILD_DIR}/index.html" ]]; then
  echo "[publish] build output missing index.html" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

rsync -a "${BUILD_DIR}/" "${TMP_DIR}/"

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch origin gh-pages:gh-pages
  git checkout gh-pages
else
  git checkout --orphan gh-pages
  git rm -rf . >/dev/null 2>&1 || true
fi

touch .nojekyll

TARGET_DIR="${ROOT_DIR}/${PUBLISH_YEAR}"
mkdir -p "${TARGET_DIR}"
rsync -a --delete "${TMP_DIR}/" "${TARGET_DIR}/"
touch "${TARGET_DIR}/.nojekyll"

if [[ "${SYNC_LATEST}" == "true" ]]; then
  LATEST_DIR="${ROOT_DIR}/latest"
  mkdir -p "${LATEST_DIR}"
  rsync -a --delete "${TMP_DIR}/" "${LATEST_DIR}/"
  touch "${LATEST_DIR}/.nojekyll"
fi

git add -A
if git diff --cached --quiet; then
  echo "[publish] no changes to publish"
  exit 0
fi

git commit -m "chore: publish gh-pages ${PUBLISH_YEAR}"

git push origin gh-pages

echo "[publish] gh-pages updated (${PUBLISH_YEAR}, latest=${SYNC_LATEST})"
