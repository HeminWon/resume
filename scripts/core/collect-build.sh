#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

ARTIFACTS_DIR="${ROOT_DIR}/artifacts"
BUILD_DIR="${ROOT_DIR}/build"

mkdir -p "${ARTIFACTS_DIR}" "${BUILD_DIR}"

if [[ -f "${ARTIFACTS_DIR}/resume-zh.pdf" ]]; then
  mv -f "${ARTIFACTS_DIR}/resume-zh.pdf" "${BUILD_DIR}/resume-zh.pdf"
fi

if [[ -f "${ARTIFACTS_DIR}/resume-en.pdf" ]]; then
  mv -f "${ARTIFACTS_DIR}/resume-en.pdf" "${BUILD_DIR}/resume-en.pdf"
fi
