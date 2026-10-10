# Development

## 环境与包管理

- Node 版本：由根目录 `.nvmrc` 固定（CI 读取同一文件）
- 默认包管理器：Yarn 1.22.22（由 `package.json` 的 `packageManager` 声明）
- 依赖版本：由 `yarn.lock` 锁定

## 本地开发

```sh
nvm install
nvm use
corepack enable
yarn install
yarn start
```

以上命令假设本机已安装 nvm。使用 fnm 时可执行 `fnm install` 和 `fnm use`，同样读取 `.nvmrc`。
更新 Node 版本时修改 `.nvmrc`，并验证构建与 PDF 导出。

## 本地静态预览

用于直接访问 `build/` 产物：

```sh
yarn serve:static
```

`yarn serve:static` 会运行 `scripts/service.cjs`（Express + morgan）：

- 默认端口为 `8088`（可通过 `PORT=xxxx yarn serve:static` 覆盖）
- 仅服务 `build/` 目录
- 输出 `morgan combined` 请求日志
- 不包含 SPA fallback 路由（例如 `/foo` 不存在时会 404）

如需零配置预览，也可以使用：

```sh
npx serve -s build
```

差异对比：

- `yarn serve:static`：可控、可扩展，适合模拟真实部署
- `npx serve -s build`：即用即走，适合快速检查

## 本地发布到 gh-pages（可选）

仓库内置了本地发布脚本，可在本地完成 build 并发布到 `gh-pages` 分支：

```sh
PUBLISH_PATH=preview SYNC_LATEST=false ./scripts/publish-preview.sh
```

相关脚本：

- `scripts/publish-preview.sh`：执行 build、准备 worktree、发布到指定目录
- `scripts/publish-gh-pages-worktree.sh`：封装 worktree 生命周期，调用核心发布脚本
- `scripts/core/publish-gh-pages.sh`：核心发布逻辑（校验、同步、commit、push）

## 数据准备

简历源数据位于 `data/*.yaml`，目标文件位于 `public/resume-zh.json` 与 `public/resume-en.json`。

```sh
yarn prepare:resume-data
```

## 常用命令

```sh
yarn start
yarn build
yarn export:pdf --lang zh
yarn export:pdf --lang en
yarn export:pdf:build --lang zh
yarn prepare:resume-data
yarn serve:static
PUBLISH_PATH=preview SYNC_LATEST=false ./scripts/publish-preview.sh
```
