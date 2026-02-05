const express = require('express');
const cors = require('cors');
const path = require('path');
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
const proofRoutes = require('./routes/proof.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5175",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/recruiter/proof', proofRoutes);

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

