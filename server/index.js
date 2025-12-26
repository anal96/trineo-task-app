import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration - restrict to Netlify frontend
const netlifyOrigins = [
  'https://trineoapp.netlify.app',
  /^https:\/\/[a-zA-Z0-9-]+\.netlify\.app$/ // allow any Netlify subdomain
];

// Merge with any additional origins from env (comma-separated)
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = [...netlifyOrigins, ...extraOrigins];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) =>
      typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
    );

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Preflight handler
app.options('*', cors(corsOptions));

console.log('CORS configured for Netlify frontend');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  if (NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Logging middleware
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trineo-tasks';

// Validate MongoDB URI format
const validateMongoURI = (uri) => {
  if (!uri) return false;
  
  // Check for common malformed patterns
  if (uri.includes('_mongodb._tcp') && !uri.includes('mongodb+srv://')) {
    return false;
  }
  
  // Valid formats
  const validPatterns = [
    /^mongodb\+srv:\/\//,  // MongoDB Atlas
    /^mongodb:\/\//,       // Standard MongoDB
  ];
  
  return validPatterns.some(pattern => pattern.test(uri));
};

if (!validateMongoURI(MONGODB_URI)) {
  console.error('❌ Invalid MongoDB connection string format!');
  console.error('   Current MONGODB_URI:', MONGODB_URI.substring(0, 50) + '...');
  console.error('');
  console.error('💡 Valid formats:');
  console.error('   - MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database');
  console.error('   - Local MongoDB: mongodb://localhost:27017/database');
  console.error('');
  console.error('📝 Check your .env file and ensure MONGODB_URI is correctly formatted.');
  
  if (NODE_ENV === 'production') {
    console.error('⚠️  Exiting due to invalid MongoDB URI in production');
    process.exit(1);
  } else {
    console.warn('⚠️  Using default local MongoDB connection');
    mongoose.connect('mongodb://localhost:27017/trineo-tasks', {
      serverSelectionTimeoutMS: 5000,
    }).then(() => {
      console.log('✅ Connected to local MongoDB (fallback)');
    }).catch(() => {
      console.warn('⚠️  Could not connect to MongoDB. Some features may not work.');
    });
  }
} else {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority',
  })
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      
      if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
        console.error('');
        console.error('💡 Authentication Error - Check:');
        console.error('   1. Username and password in connection string');
        console.error('   2. Password URL-encoding (special chars: @ = %40, : = %3A)');
        console.error('   3. Database user permissions in MongoDB Atlas');
        console.error('   4. IP whitelist in MongoDB Atlas Network Access');
      } else if (error.message.includes('EBADNAME') || error.message.includes('querySrv')) {
        console.error('');
        console.error('💡 Connection String Error - Check:');
        console.error('   1. Connection string format is correct');
        console.error('   2. Cluster hostname is valid');
        console.error('   3. For Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/dbname');
        console.error('   4. For local, use: mongodb://localhost:27017/dbname');
      } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
        console.error('');
        console.error('💡 Network Error - Check:');
        console.error('   1. Internet connection');
        console.error('   2. MongoDB Atlas cluster is running');
        console.error('   3. IP address is whitelisted');
        console.error('   4. Firewall settings');
      }
      
      console.error('');
      console.error('📚 See MONGODB_SETUP.md for detailed setup instructions');
      
      if (NODE_ENV === 'production') {
        console.error('⚠️  Exiting due to MongoDB connection failure in production');
        process.exit(1);
      } else {
        console.warn('⚠️  Continuing in development mode despite MongoDB error');
        console.warn('   App will run but database features will not work');
      }
    });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team', teamRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Trineo Tasks API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React app in production
if (NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Serve index.html for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
  
  res.status(statusCode).json({ 
    error: message,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${NODE_ENV}`);
  if (NODE_ENV === 'production') {
    console.log(`🌐 Serving static files from dist/`);
  }
});

