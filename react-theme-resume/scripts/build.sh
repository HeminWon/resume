#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

ARTIFACTS_DIR="${ROOT_DIR}/artifacts"
BUILD_DIR="${ROOT_DIR}/build"

if command -v yarn >/dev/null 2>&1; then
  RUN_BUILD=(yarn build)
else
  RUN_BUILD=(npm run build)
fi

echo "[build] 1/4 构建前端产物"
${RUN_BUILD[@]}

mkdir -p "${ARTIFACTS_DIR}"

echo "[build] 2/4 导出 PDF（中文）"
node scripts/export-pdf.cjs --lang zh

echo "[build] 3/4 导出 PDF（英文）"
node scripts/export-pdf.cjs --lang en

echo "[build] 4/4 整理发布目录"
mv -f "${ARTIFACTS_DIR}/resume-zh.pdf" "${BUILD_DIR}/resume-zh.pdf"
mv -f "${ARTIFACTS_DIR}/resume-en.pdf" "${BUILD_DIR}/resume-en.pdf"

echo "[build] 完成：${BUILD_DIR} + ${ARTIFACTS_DIR}"
