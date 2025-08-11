'use strict';

const http = require('http');
const fs = require('fs/promises');
const path = require('path');

function createServer() {
  const fileServer = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

    if (normalizedURL.pathname.includes('//')) {
      res.statusCode = 404;

      return res.end('Bad filepath!');
    }

    if (!normalizedURL.pathname.startsWith('/file')) {
      return res.end(
        'Hint: to download a file from public dir, use /file/ prefix',
      );
    }

    const filePath =
      normalizedURL.pathname.replace('/file', '') || 'index.html';

    const finalPath = path.join(__dirname, '../public', filePath);
    const publicDir = path.join(__dirname, '../public');

    if (!finalPath.startsWith(publicDir)) {
      res.statusCode = 400;

      res.end("Don't bullshit me, Carl!");

      return;
    }

    fs.readFile(finalPath, 'utf8')
      .then((data) => {
        res.statusCode = 200;

        res.end(data);
      })
      .catch((err) => {
        res.statusCode = 404;

        res.end(err.message);
      });
  });

  return fileServer;
}

module.exports = {
  createServer,
};
