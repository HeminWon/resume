重构 resume 项目

## 目标与范围
将项目重构为分层清晰、可维护的结构，支持中/英双语切换与稳定的 PDF 导出，并为后续数据源切换与功能扩展打好基础。

### 本阶段范围
- 前端架构分层与组件拆分
- 数据层与缓存策略
- 中/英双语切换（UI 文案 + 简历内容）
- 打印样式导出 PDF（分页稳定优先）
- 移动端与桌面端的双布局策略

### 非目标（暂不做）
- 自动化测试与 CI 集成
- 新的 UI 主题设计与大规模视觉改版
- 额外的简历模块展示（languages/awards/publications/references/interests 暂不渲染）

## 现状
- 技术栈为 Create React App + TypeScript，入口渲染 `src/App.tsx`，主要逻辑集中在单文件 `src/Resume.tsx`
- 数据来源为 `public/resume.json`，在 `Resume.tsx` 内直接 `fetch` 获取并渲染，无数据层/模型层/转换层
- 页面组件未分层：Header/Education/Work/Project/Skill/Evaluation 均在同一文件中
- i18n 依赖已安装但未初始化，`src/locales` 资源未被引用
- PDF 相关依赖已安装，但与现有 DOM 渲染方式不一致
- CSS 为全局样式，缺少主题变量与模块化样式组织
- `service.js` 为独立静态服务脚本，位置与用途不明确

## 关键决策
- **双语数据源**：使用两份本地 JSON（`public/resume-zh.json` / `public/resume-en.json`），后续可切换为 HTTPS 资源
- **日期规则**：非 ISO 日期代表“未结束”；UI 决定显示“至今/Present”或隐藏结束日期
- **PDF 导出**：采用 `@media print` + `window.print()`，以分页稳定为首要目标
- **布局策略**：屏幕版自适应 + 导出版固定 A4
- **样式方案**：CSS Modules + CSS Variables
- **缓存**：内存缓存 + localStorage，保证语言切换流畅

## 需求细化
### 数据层与缓存
- 提供统一的数据获取入口（本地 JSON / 远端 JSON）
- 缓存策略：
  - 内存缓存 `Map<lang, ResumeData>`
  - localStorage 持久化（可带 version 字段）
  - 读取优先级：内存 > localStorage > fetch
- 失败时返回错误状态，支持重试

### i18n
- 初始化 i18next，注册 `src/locales/zh` 与 `src/locales/en`
- UI 文案与 section 标题走翻译资源
- 语言切换与持久化（localStorage），并与数据源切换联动

### 布局与响应式
- 屏幕端：宽度自适应、移动端竖屏可读
- 打印端：固定 A4 宽度与边距，隐藏无关 UI
- 标题、条目使用 `break-inside: avoid` 防止分页断裂

### PDF 导出（打印样式）
- 导出触发 `window.print()`
- `@media print` 下设置 `@page` 尺寸与边距
- 仅导出简历主体区域

### 目录结构建议
- `src/data/`：数据请求与数据源管理
- `src/models/`：简历数据模型与类型定义
- `src/transformers/`：数据适配与默认值
- `src/components/`：基础组件与通用展示组件
- `src/pages/Resume/`：页面级组件与布局样式
- `src/i18n/`：i18n 初始化与资源管理
- `src/styles/`：全局变量与基础样式

### 静态服务脚本
- 将 `service.js` 迁移到 `scripts/`，保持静态服务功能不变
- 提供本地启动方式说明（CLI 或 `package.json` 脚本）

## 验收标准
- 支持中/英切换，切换后简历内容同步变化
- 数据加载具备缓存与错误处理
- PDF 导出分页稳定且不截断核心内容
- 屏幕端与打印端均可正常阅读
