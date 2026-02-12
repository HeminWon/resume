# Deployment Validation

发布验证用于确认 GitHub Actions 到 `gh-pages` 的发布链路可用。

## 工作流位置

- Workflow 文件：`.github/workflows/gh-pages.yml`
- Workflow 名称：`Publish gh-pages`

## 触发方式

- `workflow_dispatch`（手动触发）

## 输入参数

- `path`：发布目录，默认 `preview`
- `sync_latest`：是否同步到 `latest/`
- `with_footer`：是否包含 PDF 页脚

## 运行环境

- `ubuntu-latest`
- Node 20
- Yarn（`corepack enable`）

## CI 构建链路

工作流通过 `scripts/build.sh` 执行完整构建，包含：

1. YAML 转 JSON（`scripts/core/prepare-data.sh`）
2. 前端构建
3. 主题字体准备
4. 多主题/多语言 PDF 导出（`classic`、`vuepress` × `zh`、`en`）
5. 发布目录整理

`gh-pages` 推送由后续步骤完成：

- `scripts/core/prepare-gh-pages.sh`
- `scripts/core/publish-gh-pages.sh`

## 发布后检查项

- 目标目录（如 `preview/`）页面可访问
- `latest/` 同步策略符合预期（如启用 `sync_latest`）
- 页面资源与 PDF 链接可正常打开
- 本次发布提交已写入 `gh-pages` 分支
