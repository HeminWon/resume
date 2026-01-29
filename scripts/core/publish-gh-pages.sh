#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPO_ROOT="$(git -C "${PROJECT_DIR}" rev-parse --show-toplevel)"

BUILD_DIR="${PROJECT_DIR}/build"
PUBLISH_SOURCE="${PUBLISH_SOURCE:-${BUILD_DIR}}"
PUBLISH_YEAR="${PUBLISH_YEAR:-${YEAR:-}}"
SYNC_LATEST="${SYNC_LATEST:-${SYNC_LATEST_INPUT:-false}}"
WORKTREE_DIR="${WORKTREE_DIR:-${PUBLISH_WORKTREE:-}}"
TARGET_ROOT="${WORKTREE_DIR}"
SOURCE_SHA=""
PAGES_URL=""
PUBLISH_ID=""

normalize_bool() {
  case "${1,,}" in
    1|true|yes|y|on) echo "true";;
    *) echo "false";;
  esac
}

get_publish_id() {
  # Unique and human-friendly id for each publish.
  date -u +"%Y%m%d-%H%M%S"
}

get_source_sha() {
  git -C "${PROJECT_DIR}" rev-parse --short HEAD 2>/dev/null || echo "unknown"
}

get_pages_url() {
  local remote_url owner repo
  remote_url="$(git -C "${PROJECT_DIR}" remote get-url origin 2>/dev/null || true)"
  case "${remote_url}" in
    git@github.com:*/*.git)
      owner="$(echo "${remote_url}" | sed -E 's#git@github.com:([^/]+)/.*#\\1#')"
      repo="$(echo "${remote_url}" | sed -E 's#git@github.com:[^/]+/([^/]+)\\.git#\\1#')"
      ;;
    https://github.com/*/*.git)
      owner="$(echo "${remote_url}" | sed -E 's#https://github.com/([^/]+)/.*#\\1#')"
      repo="$(echo "${remote_url}" | sed -E 's#https://github.com/[^/]+/([^/]+)\\.git#\\1#')"
      ;;
    *)
      return 0
      ;;
  esac

  if [[ -n "${owner}" && -n "${repo}" ]]; then
    echo "https://${owner}.github.io/${repo}"
  fi
}

write_step_summary() {
  if [[ -z "${GITHUB_STEP_SUMMARY:-}" ]]; then
    return 0
  fi

  {
    echo "## ✅ 发布成功"
    echo ""
    echo "- 年份: ${PUBLISH_YEAR}"
    echo "- 发布 ID: ${PUBLISH_ID}"
    echo "- 源代码: ${SOURCE_SHA}"
    if [[ -n "${PAGES_URL}" ]]; then
      echo "- 站点: ${PAGES_URL}/${PUBLISH_YEAR}/"
      if [[ "${SYNC_LATEST}" == "true" ]]; then
        echo "- 最新版: ${PAGES_URL}/latest/"
      fi
    fi
  } >> "${GITHUB_STEP_SUMMARY}"
}

print_local_summary() {
  echo ""
  echo "===================="
  echo "Publish Summary"
  echo "--------------------"
  echo "Year: ${PUBLISH_YEAR}"
  echo "Publish ID: ${PUBLISH_ID}"
  echo "Source SHA: ${SOURCE_SHA}"
  if [[ -n "${PAGES_URL}" ]]; then
    echo "Site: ${PAGES_URL}/${PUBLISH_YEAR}/"
    if [[ "${SYNC_LATEST}" == "true" ]]; then
      echo "Latest: ${PAGES_URL}/latest/"
    fi
  fi
  echo "===================="
  echo ""
}

ensure_publish_inputs() {
  echo "[publish] project dir: ${PROJECT_DIR}"
  echo "[publish] repo root: ${REPO_ROOT}"
  echo "[publish] build dir: ${BUILD_DIR}"
  echo "[publish] publish source: ${PUBLISH_SOURCE}"

  if [[ -z "${PUBLISH_YEAR}" ]]; then
    PUBLISH_YEAR="$(date -u +%Y)"
  fi

  SYNC_LATEST="$(normalize_bool "${SYNC_LATEST}")"
  SOURCE_SHA="$(get_source_sha)"
  PAGES_URL="$(get_pages_url)"
  PUBLISH_ID="$(get_publish_id)"

  echo "[publish] publish year: ${PUBLISH_YEAR}"
  echo "[publish] sync latest: ${SYNC_LATEST}"
  echo "[publish] worktree dir: ${TARGET_ROOT}"
  echo "[publish] source sha: ${SOURCE_SHA}"
  if [[ -n "${PAGES_URL}" ]]; then
    echo "[publish] pages url: ${PAGES_URL}"
  fi
  echo "[publish] publish id: ${PUBLISH_ID}"

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
  echo "[publish] target year dir: ${TARGET_DIR}"
  mkdir -p "${TARGET_DIR}"
  rsync -a --delete "${PUBLISH_SOURCE}/" "${TARGET_DIR}/"
  touch "${TARGET_DIR}/.nojekyll"

  if [[ "${SYNC_LATEST}" == "true" ]]; then
    LATEST_DIR="${TARGET_ROOT}/latest"
    echo "[publish] target latest dir: ${LATEST_DIR}"
    mkdir -p "${LATEST_DIR}"
    rsync -a --delete "${PUBLISH_SOURCE}/" "${LATEST_DIR}/"
    touch "${LATEST_DIR}/.nojekyll"
  fi
}

commit_and_push() {
  echo "[publish] staging publish files"
  cd "${TARGET_ROOT}"
  git status -sb
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
  git commit -m "📦 chore(gh-pages): publish ${PUBLISH_YEAR} (${PUBLISH_ID})" \
             -m "source: ${SOURCE_SHA}"
  echo "[publish] pushing gh-pages"
  git push origin gh-pages
  echo "[publish] gh-pages updated (${PUBLISH_YEAR}, latest=${SYNC_LATEST})"
}

ensure_publish_inputs
sync_publish_dirs
commit_and_push
write_step_summary
print_local_summary
