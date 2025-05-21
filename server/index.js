//swarupplay2/server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import got from 'got';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 7001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS with specific origin
app.use(cors({
  origin: ['http://localhost:8001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../dist')));

// Create PostgreSQL pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.ENCRYPTION_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password);
    
    const query = 'SELECT id, name, email FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email, hashedPassword]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const token = jwt.sign(user, process.env.ENCRYPTION_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    
    // Check if user already exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    
    const result = await pool.query(insertQuery, [name, email, hashedPassword]);
    const user = result.rows[0];
    
    const token = jwt.sign(user, process.env.ENCRYPTION_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// API to get video metadata
app.get('/api/video/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const metadataQuery = `
      SELECT
        v.*,
        f.storage_path,
        f.size,
        f.name AS file_name,
        f.type AS mime_type,
        f.created_at,
        v.thumbnail
      FROM video_metadata v
      RIGHT JOIN files f
        ON v.file_id = f.id
      WHERE f.id = $1 AND f.type LIKE 'video/%'
    `;
    
    const result = await pool.query(metadataQuery, [fileId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video file not found' });
    }
    
    const meta = result.rows[0];
    meta.streamUrl = `http://localhost:${PORT}/api/stream/${fileId}`;
    
    if (meta.thumbnail_path) {
      meta.thumbnail = `http://localhost:3001/api/files/${fileId}/thumbnail`;
    }
    
    res.json(meta);
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API to stream video file
app.get('/api/stream/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const driveUrl = `http://localhost:3001/api/files/${fileId}/download`;
    const driveHeaders = {
      Authorization: `Bearer ${process.env.DRIVE_JWT_RS256}`,
    };
    
    if (req.headers.range) {
      driveHeaders.Range = req.headers.range;
    }

    const upstream = got.stream(driveUrl, { headers: driveHeaders });
    upstream.on('response', upstreamRes => {
      res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
    });
    upstream.on('error', err => {
      console.error('❗️ Upstream proxy error:', err);
      res.status(502).json({
        error: 'Upstream streaming error',
        details: err.message
      });
    });
    return upstream.pipe(res);
  } catch (error) {
    console.error('Error streaming file:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`SwarupPlay server running on port ${PORT}`);
});