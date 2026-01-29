#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "[build] 1/5 更新简历数据（YAML -> JSON）"
scripts/prepare-data.sh

echo "[build] 2/5 构建前端产物"
scripts/build-app.sh

echo "[build] 3/5 导出 PDF（中文）"
scripts/export-pdf.sh --lang zh

echo "[build] 4/5 导出 PDF（英文）"
scripts/export-pdf.sh --lang en

echo "[build] 5/5 整理发布目录"
scripts/collect-build.sh

echo "[build] 完成"
