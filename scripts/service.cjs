const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const PORT = Number(process.env.PORT || 8088);
const BUILD_DIR = path.resolve(__dirname, '..', 'build');

if (!Number.isInteger(PORT) || PORT <= 0) {
  throw new Error(`[serve:static] invalid PORT: ${process.env.PORT}`);
}

if (!fs.existsSync(BUILD_DIR)) {
  throw new Error(`[serve:static] build directory not found: ${BUILD_DIR}`);
}

const app = express();

app.use(morgan('combined'));
app.use(express.static(BUILD_DIR));

const server = app.listen(PORT, () => {
  const address = server.address();
  const host = address && typeof address === 'object' && address.address === '::' ? 'localhost' : address.address;
  console.log(`[${new Date().toISOString()}] Server is running at http://${host}:${PORT}`);
});

server.on('error', (error) => {
  console.error(`[serve:static] server error: ${error.message}`);
  process.exit(1);
});
