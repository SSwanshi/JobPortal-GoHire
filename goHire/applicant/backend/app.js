const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { createHandler } = require('graphql-http/lib/use/express');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// GraphQL
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./graphql/context');

// Routes
const authRoutes = require('./routes/auth.routes');
const applicantRoutes = require('./routes/applicant.routes');
const profileRoutes = require('./routes/profile.routes');
const paymentRoutes = require('./routes/payment.routes');
const filesRoutes = require('./routes/files.routes');
const uploadRoutes = require('./routes/upload.routes');
const searchRoutes = require('./routes/search.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Create GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// CORS configuration for React client
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
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

// Connect to database
connectDB();

// GraphQL endpoint with authentication context
app.all(
  '/graphql',
  createHandler({
    schema,
    context: (req) => {
      const user = getUserFromToken(req.raw);
      return { user };
    },
  })
);

console.log('🚀 GraphQL server ready at http://localhost:' + PORT + '/graphql');

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

app.get('/', (req, res)=>{
  res.send('Applicant service is running');
})

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Applicant] Server running on http://localhost:${PORT}`);
});

