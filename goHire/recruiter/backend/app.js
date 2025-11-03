const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
const cron = require('node-cron');
require('dotenv').config();

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const deleteExpiredJobs = require('./routes/jobCleanup');
const deleteExpiredInternship = require('./routes/intCleanup');

// Routes
const authRoutes = require('./routes/auth.routes');
const recruiterRoutes = require('./routes/recruiter.routes');
const applicationsRoutes = require('./routes/applications.routes');
const internapplicantsRoutes = require('./routes/internapplicants.routes');
const logoRoutes = require('./routes/logo.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5175",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'recruiter-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/recruiter_db',
    ttl: 14 * 24 * 60 * 60
  })
}));

// Store user in locals for middleware
app.use(async (req, res, next) => {
  if (req.session.user) {
    const User = require('./models/User');
    try {
      res.locals.user = await User.findById(req.session.user._id);
    } catch (error) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Connect to databases
connectDB();

// Connect to applicant database if URI is provided (async, don't await to not block server start)
if (process.env.MONGO_URI_APPLICANT) {
  const { connectApplicantDB } = require('./config/applicantDb');
  (async () => {
    await connectApplicantDB();
  })();
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'recruiter', port: PORT });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/internapplicants', internapplicantsRoutes);
app.use('/recruiter/logo', logoRoutes);

// Cron jobs for cleanup
cron.schedule('0 0 * * *', () => {
  console.log('Running expired jobs cleanup...');
  deleteExpiredJobs();
});

cron.schedule('0 0 * * *', () => {
  console.log('Running expired internships cleanup...');
  deleteExpiredInternship();
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Recruiter] Server running on http://localhost:${PORT}`);
});

