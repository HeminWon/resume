#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${ROOT_DIR}"

if ! command -v node >/dev/null 2>&1; then
  echo "[fonts] node not found, skip"
  exit 0
fi

PACKAGES="$(node scripts/core/resolve-theme-font-packages.cjs)"
if [[ -z "${PACKAGES}" ]]; then
  echo "[fonts] no packages declared"
  exit 0
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "[fonts] apt-get not available, skip: ${PACKAGES}"
  exit 0
fi

echo "[fonts] installing: ${PACKAGES}"
sudo apt-get update
sudo apt-get install -y ${PACKAGES}
