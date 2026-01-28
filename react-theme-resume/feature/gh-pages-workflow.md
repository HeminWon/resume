GitHub Actions 发布 gh-pages 规划

## 目标
- 新增一个可手动触发的 workflow
- 使用 yarn 完成构建
- 构建产物发布到 gh-pages 分支
- 按触发年份创建目录（例如 2026/）
- 可选同步到 latest 目录
- 同步前清空对应目录，避免增量覆盖

## 触发与参数设计
- 触发方式：workflow_dispatch
- 输入参数：
  - year：可选，默认使用触发时间年份
  - sync_latest：boolean，默认 false

## 构建与产物
- 包管理器：yarn
- 构建前数据准备：
  - 将 `data/resume-zh.yaml` 转换为 JSON
  - 将 `data/resume-en.yaml` 转换为 JSON
  - 替换 `public/resume-zh.json` 与 `public/resume-en.json`
  - 需考虑 YAML 转 JSON 工具的安装与使用方式（例如 CLI 工具或 node 脚本）
- 构建命令：yarn build（如需调整再确认）
- 产物目录：dist/（需和现状确认）

## 发布流程（gh-pages 分支）
- 拉取并切换到 gh-pages 分支
- 清空目标目录：
  - gh-pages/<year>/
  - 若 sync_latest=true，清空 gh-pages/latest/
- 复制构建产物到目标目录
- 配置 git 用户信息后提交并推送

## 关键实现点
- 年份解析优先使用输入参数，否则从事件时间提取年份
- 清空目录建议使用删除目录后重建，确保干净
- 目录不存在时需要创建
- 支持幂等执行（同一年份多次触发结果一致）

## 待确认
- 产物目录是否为 dist/
- 是否需要将 latest 作为最新年份的镜像目录
- 是否使用现有脚本或需要新增发布脚本（当前阶段不编写脚本）
