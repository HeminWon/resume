# Repository Guidelines

## 项目结构与模块组织
- `src/`：前端源码（React + TypeScript），入口为 `src/index.tsx` 与 `src/App.tsx`。
- `src/themes/`：主题包，每个主题一个目录（如 `src/themes/classic/`、`src/themes/vuepress/`）。
- `src/pages/Resume/sections/`：简历各区块组件（Work、Project、Education 等）。
- `src/locales/`：多语言文案（`zh/translation.json`、`en/translation.json`）。
- `public/`：静态资源与构建产物引用数据（`resume-zh.json`、`resume-en.json`）。
- `data/`：源数据 YAML（可由脚本转换到 `public/`）。
- `scripts/`：构建、发布、PDF 导出等脚本。

## 构建、测试与开发命令
- `yarn start`：本地开发服务器（react-scripts）。
- `yarn build`：生产构建输出到 `build/`。
- `yarn test`：运行 Jest + React Testing Library。
- `yarn prepare:resume-data`：从 `data/*.yaml` 生成 `public/resume-*.json`。
- `yarn export:pdf`：导出 PDF（依赖 puppeteer）。
- `yarn serve:static`：启动静态服务预览构建结果。

## 代码风格与命名约定
- TypeScript + React Function Components；缩进 2 空格。
- 组件使用 `PascalCase`，文件名与组件名一致。
- CSS Modules：使用 `*.module.css`，类名使用 `camelCase`。
- 主题新增请在 `src/themes/<themeId>/` 下建立布局与样式，并在 `src/themes/index.ts` 注册。

## 测试指南
- 测试框架：Jest（由 `react-scripts test` 管理）。
- 建议命名：`*.test.tsx`，放在 `src/` 对应模块附近。
- UI 变更建议补充关键交互测试与快照（如适用）。

## Commit 与 Pull Request 规范
- 提交信息遵循 `gitmoji + type(scope): subject`，例如：`✨ feat(theme): add minimal layout`。
- PR 描述需包含变更摘要与影响范围；涉及 UI 修改请附截图。
- 若涉及数据或脚本变更，请说明对应的运行命令与验证方式。

## 架构与多主题扩展建议
- 长期目标：多主题 + 中英文切换 + 良好架构（可维护、可扩展、低耦合）。
- 当前整合：主题在 `src/themes/` 统一注册与加载，语言由 `src/i18n/` 管理，数据层在 `src/data/` 与 `public/` 分离。
- 布局差异大的主题应使用独立布局组件，而非在单一组件内堆积条件分支。
- 扩展原则：新增主题只新增目录并注册，不修改已有主题；新增语言只扩展 `src/locales/` 与 `public/resume-*.json`。
