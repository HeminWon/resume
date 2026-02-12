#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

if [[ "$#" -lt 1 ]]; then
  echo "[pkg] usage: scripts/core/run-package-script.sh <script> [args...]" >&2
  exit 1
fi

cd "${ROOT_DIR}"

if [[ -f "${ROOT_DIR}/yarn.lock" ]]; then
  if command -v corepack >/dev/null 2>&1; then
    exec corepack yarn "$@"
  fi
  if command -v yarn >/dev/null 2>&1; then
    exec yarn "$@"
  fi
  echo "[pkg] yarn.lock detected but yarn/corepack not found." >&2
  echo "[pkg] install Yarn or run 'corepack enable' first." >&2
  exit 1
fi

if command -v npm >/dev/null 2>&1; then
  script="$1"
  shift
  exec npm run "${script}" -- "$@"
fi

echo "[pkg] no supported package manager found (yarn/corepack/npm)." >&2
exit 1
