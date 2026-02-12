# Local Validation

本地验证用于覆盖发布前的完整准备与验收流程。

## 验证流程（Yarn）

1. 构建前端产物

```sh
yarn build
```

2. 生成 PDF（按语言选择）

```sh
yarn export:pdf --lang zh
```

3. 将 PDF 放入发布目录（保持路径为 `/resume.pdf`）

```sh
cp artifacts/resume-zh-classic.pdf build/resume.pdf
```

4. 启动本地静态服务验证

```sh
yarn serve:static
```

## 验收检查项

- `build/` 存在且可正常访问首页
- `build/resume.pdf` 存在且可直接下载/打开
- 中英文内容与主题渲染正常
- 控制台无明显运行时错误

## 相关脚本

- `yarn build`
- `yarn export:pdf --lang zh|en`
- `yarn export:pdf:build --lang zh|en`
- `yarn serve:static`
