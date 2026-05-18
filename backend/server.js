const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Security
app.use(helmet());

// Logging
app.use(morgan('dev'));

// CORS (production-safe: allow your Render frontend + local dev)
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'https://your-frontend-url.onrender.com';
const localhostOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowed = [frontendOrigin, ...localhostOrigins];
      if (allowed.includes(origin)) return callback(null, true);

      return callback(null, false);
    },
    credentials: true
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/docs', require('./routes/apiDocs').getDocs);

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);

// Optional: seed sample employees
app.get('/api/seed', require('./middleware/seedMiddleware'), (req, res) => {
  res.json({ ok: true });
});

// Error handling (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

function validateRequiredEnvs() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  for (const k of required) {
    if (!process.env[k] || String(process.env[k]).trim() === '') {
      console.error(`[startup] Missing required env var: ${k}`);
    }
  }
}

async function startServer() {
  validateRequiredEnvs();

  try {
    await connectDB();
    console.log('[db] MongoDB connected');
  } catch (err) {
    // Render can start before Atlas connections are allowed.
    // Do not crash; log clearly.
    console.error('[db] MongoDB connection failed:', err && err.message ? err.message : err);
  }

  // Prevent unhandled listen errors from crashing in noisy loops
  const server = app.listen(PORT, () => {
    console.log(`[startup] Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('[startup] Express listen error:', err && err.message ? err.message : err);
  });
}

startServer();

