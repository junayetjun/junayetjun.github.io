const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=UTF-8'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  // Normalize and sanitize URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevent directory traversal attacks
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // If file not found, serve 404
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Not Found</title>
          <style>
            body { background: #0a0d14; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            h1 { font-size: 3rem; color: #38bdf8; margin-bottom: 0.5rem; }
            p { color: #94a3b8; margin-bottom: 1.5rem; }
            a { color: #38bdf8; text-decoration: none; border: 1px solid #38bdf8; padding: 10px 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div>
            <h1>404</h1>
            <p>The requested file <code>${pathname}</code> was not found.</p>
            <a href="/">Back to Portfolio</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // If it's a directory, try index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Stream file
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    stream.pipe(res);
    stream.on('error', (streamErr) => {
      console.error(`Error streaming ${filePath}:`, streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  const localIp = getLocalIp();
  console.log('\n======================================================');
  console.log('🚀  JUNAYET DEVELOPER PORTFOLIO SERVER RUNNING');
  console.log('======================================================');
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${localIp}:${PORT}`);
  console.log('======================================================\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping server...');
  server.close(() => {
    process.exit(0);
  });
});
