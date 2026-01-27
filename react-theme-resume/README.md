## 包管理器选择

当前仓库包含 `yarn.lock`，默认且推荐使用 Yarn（可复现、团队一致性更好）。npm 仅作为兼容备选，不保证文档同步更新。

## 本地启动（Yarn）

```sh
yarn install
yarn start
```

静态服务预览（用于直接访问 build 产物）：

```sh
yarn serve:static
```

简历数据文件位于 `public/resume-zh.json` 与 `public/resume-en.json`。

## 本地验证 PDF 发布流程（Yarn）

用于模拟「build + 生成 PDF + 静态预览」的完整链路（与部署一致）。

1) 构建产物
```sh
yarn build
```

2) 生成 PDF（选择语言）
```sh
yarn export:pdf --lang zh
```

3) 放入 build（保持路径为 /resume.pdf）
```sh
cp artifacts/resume-zh.pdf build/resume.pdf
```

4) 本地静态预览
```sh
yarn serve:static
```

## npm（可选）

仅在无法使用 Yarn 时使用：

```sh
npm install
npm start
```


## 常用脚本（Yarn）

```sh
yarn start
yarn build
yarn export:pdf -- --lang zh
yarn export:pdf --lang en
yarn export:pdf:build --lang zh
yarn serve:static
```
