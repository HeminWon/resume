# React Theme Resume

多主题、中英文简历项目（React + TypeScript），支持 Web 展示与 PDF 导出。

## 特性

- 多主题架构（当前包含 `classic`、`vuepress`）
- 中英文内容切换
- YAML 数据源到 JSON 的构建链路
- 支持本地与 CI 发布到 `gh-pages`
- 支持 PDF 导出（按语言/主题）

## 技术栈

- React 18 + TypeScript
- i18next
- Puppeteer（PDF 导出）
- GitHub Actions（发布）

## 快速开始

Node 版本由 `.nvmrc` 固定，CI 使用同一配置。默认使用 Yarn 1.22.22，依赖由 `yarn.lock` 锁定。

使用 nvm 时，先安装并切换 Node，再启用 Corepack：

```sh
nvm install
nvm use
corepack enable
yarn install
yarn start
```

## 常用命令

```sh
yarn start
yarn build
yarn prepare:resume-data
yarn export:pdf --lang zh
yarn export:pdf --lang en
yarn serve:static
PUBLISH_PATH=preview SYNC_LATEST=false ./scripts/publish-preview.sh
```

## 文档导航

- 开发与日常调试：[development.md](development.md)
- 本地验证（发布前完整准备与验收）：[local-validation.md](local-validation.md)
- 发布验证（GitHub Actions / gh-pages）：[deployment-validation.md](deployment-validation.md)

## License

本项目采用 `MIT` 许可，详见 [LICENSE](../LICENSE)。
