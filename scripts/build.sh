#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "[build] 1/4 更新简历数据（YAML -> JSON）"
scripts/core/prepare-data.sh

echo "[build] 2/4 构建前端产物"
scripts/core/build-app.sh

echo "[build] 3/5 安装 PDF 字体（如需）"
scripts/core/install-theme-fonts.sh

echo "[build] 4/5 导出 PDF（多主题）"
themes=(classic vuepress)
langs=(zh en)
footer_args=()
pdf_footer="${PDF_FOOTER:-true}"
pdf_footer_lower="$(printf '%s' "${pdf_footer}" | tr '[:upper:]' '[:lower:]')"
case "${pdf_footer_lower}" in
  0|false|no|n|off)
    footer_args=(--no-footer)
    ;;
esac
for theme in "${themes[@]}"; do
  for lang in "${langs[@]}"; do
    echo "[build] 导出 PDF（${theme} / ${lang}）"
    scripts/core/export-pdf.sh --lang "${lang}" --theme "${theme}" "${footer_args[@]}"
  done
done

echo "[build] 5/5 整理发布目录"
scripts/core/collect-build.sh

echo "[build] 完成"
