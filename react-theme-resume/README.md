```sh
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
yarn add xxx
```

# 使用说明（Create React App）

本项目由 Create React App 初始化。  
参考文档：https://github.com/facebook/create-react-app

## 常用命令

在项目根目录执行：

### `yarn start`

以开发模式启动应用。  
浏览器访问：`http://localhost:3000`  
修改代码后页面会自动刷新，控制台会显示 lint 报错。

### `yarn test`

以交互模式启动测试。  
更多说明：https://facebook.github.io/create-react-app/docs/running-tests

### `yarn build`

生成生产构建，输出到 `build/`。  
构建会进行压缩与优化，文件名包含 hash。  
构建产物可直接部署。

### 产物验证（方式 B：本地静态服务）

使用 `serve` 启动本地静态服务验证 `build/`：

```sh
yarn build
npx serve -s build
```

终端会输出访问地址（通常是 `http://localhost:3000` 或 `http://localhost:5000`）。

更多部署说明：https://facebook.github.io/create-react-app/docs/deployment

### `yarn eject`

注意：这是单向操作，`eject` 后无法回退。

`eject` 会移除 CRA 的单一构建依赖，并把 webpack、Babel、ESLint 等配置复制到项目中。  
除 `eject` 之外的命令仍可使用，但会改为指向本地配置。

一般不需要 `eject`。仅当你确认需要深度定制构建体系时再使用。

## 了解更多

- CRA 文档：https://facebook.github.io/create-react-app/docs/getting-started
- React 文档：https://reactjs.org/
