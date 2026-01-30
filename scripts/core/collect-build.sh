#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

ARTIFACTS_DIR="${ROOT_DIR}/artifacts"
BUILD_DIR="${ROOT_DIR}/build"

mkdir -p "${ARTIFACTS_DIR}" "${BUILD_DIR}"

shopt -s nullglob
for pdf in "${ARTIFACTS_DIR}"/resume-*.pdf; do
  mv -f "${pdf}" "${BUILD_DIR}/"
done
shopt -u nullglob
