const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(BASE_DIR, reqPath);

  const normalizedPath = path.resolve(filePath).toLowerCase();
  const normalizedBase = path.resolve(BASE_DIR).toLowerCase();

  // Security check to prevent directory traversal
  if (!normalizedPath.startsWith(normalizedBase)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n==================================================');
  console.log(' BRANDTRIX PREMIUM WEB EXPERIENCE RUNNING');
  console.log(' Local URL:   http://localhost:' + PORT);
  console.log(' Network URL: http://127.0.0.1:' + PORT);
  console.log(' Directory:   ' + BASE_DIR);
  console.log('==================================================\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port ' + PORT + ' is in use, trying port ' + (PORT + 1) + '...');
    server.listen(PORT + 1, '127.0.0.1');
  } else {
    console.error('Server error:', err);
  }
});

