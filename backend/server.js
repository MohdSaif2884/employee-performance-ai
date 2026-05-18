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

// CORS
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));

// Routes
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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error:', err);
    process.exit(1);
  });

