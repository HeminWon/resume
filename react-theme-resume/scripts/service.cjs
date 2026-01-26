const express = require('express');
const morgan = require('morgan'); // 引入 morgan 中间件
const path = require('path');

const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'build')));

// 使用 morgan 记录请求日志
app.use(morgan('combined')); // 'combined' 记录详细的请求日志

// 启动服务器
const server = app.listen(8088, () => {
    let host = server.address().address;
    const port = server.address().port;
    
    // 如果是 IPv6 地址，使用 localhost 替换
    if (host === '::') {
        host = 'localhost';
    }

    console.log(`[${new Date().toISOString()}] Server is running at http://${host}:${port}`);
});