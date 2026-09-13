/**
 * TransformNXT Production Server for Render
 * 
 * High-performance Node.js service providing:
 * 1. Static asset delivery with optimized caching & MIME types
 * 2. Backend REST API for Health telemetry sync, backup, & ICMR-NIN/ACSM reference datasets
 * 3. Render health-check probe integration (/api/health)
 * 4. Dual-mode runtime: Uses Express when dependencies are installed, 
 *    with zero-dependency native Node http fallback.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'backend', 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache & fallback store
let memoryStore = {
  lastUpdated: null,
  users: [],
  healthLogs: [],
  weeklyPlans: [],
  dailyTracking: []
};

// Load existing store if available
try {
  if (fs.existsSync(STORE_PATH)) {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    memoryStore = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[Storage] Notice: Initialized in-memory store:', e.message);
}

// Save store helper
function saveStore(data) {
  const payload = (data && data.data) ? data.data : (data || {});
  memoryStore = {
    ...memoryStore,
    ...payload,
    lastUpdated: new Date().toISOString()
  };
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('[Storage] Could not persist to disk (running read-only container):', err.message);
  }
  return memoryStore;
}

// MIME types lookup for static serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.map': 'application/json'
};

// Try launching Express
try {
  const express = require('express');
  const cors = require('cors');

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- REST API ENDPOINTS ---

  // Render Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'TransformNXT Backend Service',
      environment: process.env.NODE_ENV || 'production',
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  // Telemetry Sync & Backup
  app.get('/api/sync', (req, res) => {
    res.json({
      success: true,
      data: memoryStore
    });
  });

  app.post('/api/sync', (req, res) => {
    const payload = req.body || {};
    const updated = saveStore(payload);
    res.json({
      success: true,
      message: 'Telemetry successfully mirrored to Render backend storage',
      lastUpdated: updated.lastUpdated
    });
  });

  // Food Dataset
  app.get('/api/foods', (req, res) => {
    const foodFile = path.join(__dirname, 'js', 'data', 'indian-foods.js');
    if (fs.existsSync(foodFile)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      fs.createReadStream(foodFile).pipe(res);
    } else {
      res.status(404).json({ error: 'Food dataset not found' });
    }
  });

  // Exercise Dataset
  app.get('/api/exercises', (req, res) => {
    const exerciseFile = path.join(__dirname, 'js', 'data', 'exercise-library.js');
    if (fs.existsSync(exerciseFile)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      fs.createReadStream(exerciseFile).pipe(res);
    } else {
      res.status(404).json({ error: 'Exercise dataset not found' });
    }
  });

  // Serve static assets
  app.use(express.static(__dirname, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // SPA Fallback to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] TransformNXT server listening on port ${PORT}`);
  });

} catch (err) {
  // --- FALLBACK NATIVE HTTP SERVER (If express is not yet installed) ---
  console.log('[Native HTTP] Express not installed, starting native HTTP fallback server on port', PORT);

  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    // API: Health
    if (pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        status: 'online',
        mode: 'native-fallback',
        timestamp: new Date().toISOString()
      }));
    }

    // API: Sync GET
    if (pathname === '/api/sync' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, data: memoryStore }));
    }

    // API: Sync POST
    if (pathname === '/api/sync' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const updated = saveStore(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Telemetry mirrored to Render storage',
            lastUpdated: updated.lastUpdated
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
      });
      return;
    }

    // Static files
    let targetPath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      targetPath = path.join(targetPath, 'index.html');
    }

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(targetPath).pipe(res);
    } else {
      // Fallback to index.html for SPA
      const indexPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Native HTTP] TransformNXT server listening on port ${PORT}`);
  });
}
