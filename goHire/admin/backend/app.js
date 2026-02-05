const express = require("express");
const session = require("express-session");
const cors = require("cors");
const fs = require('fs');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const soap = require('soap')
require("dotenv").config();

const connectDB = require("./config/db");
const connectRecruiterDB = require("./config/recruiterDB");
const connectApplicantDB = require("./config/applicantDB");

// Routes
const authRoutes = require("./routes/auth.routes");
const applicantsRoutes = require("./routes/applicants.routes");
const recruitersRoutes = require("./routes/recruiters.routes");
const companiesRoutes = require("./routes/companies.routes");
const jobsRoutes = require("./routes/jobs.routes");
const internshipsRoutes = require("./routes/internships.routes");
const adminRoutes = require("./routes/admin.routes");
const premiumService = require('./services/soap.service');
const app = express();
const PORT = process.env.PORT || 9000;

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:3000"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'SOAPAction'  
  ],
  exposedHeaders: ['Content-Type']
}));



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "admin-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI_ADMIN || "mongodb://localhost:27017/admin_db",
      ttl: 14 * 24 * 60 * 60 // 14 days
    })
  })
);

// Connect to databases
connectDB();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "admin", port: PORT });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/applicants", applicantsRoutes);
app.use("/api/recruiters", recruitersRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/internships", internshipsRoutes);
app.use("/api/admin", adminRoutes);

// Error handler middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.use(express.raw({ type: () => true, limit: '5mb' }));
const wsdl = fs.readFileSync('./soap/wsdl/premiumUser.wsdl', 'utf8');
soap.listen(app, '/wsdl', premiumService, wsdl).on('request', (xml) => {
  console.log("SOAP REQUEST:\n", xml);
});


app.listen(PORT, () => {
  console.log(`[Admin] Server running on http://localhost:${PORT}`);
});

