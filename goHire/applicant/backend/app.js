const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');

// Load environment variables FIRST
require('dotenv').config();

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const applicantRoutes = require('./routes/applicant.routes');
const profileRoutes = require('./routes/profile.routes');
const paymentRoutes = require('./routes/payment.routes');
const filesRoutes = require('./routes/files.routes');
const uploadRoutes = require('./routes/upload.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();
const PORT = 3000; // Hardcoded port

// CORS configuration (Hardcoded frontend URLs)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration (Hardcoded)
app.use(session({
  secret: 'applicant-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/applicant_db',
    ttl: 14 * 24 * 60 * 60
  })
}));

// Store user in locals for middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Connect to database
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'applicant', port: PORT });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applicant', applicantRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Applicant] Server running on http://localhost:${PORT}`);
});
