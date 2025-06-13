const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/database');
const config = require('./config/config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');

class App {
  constructor() {
    this.app = express();
    this.port = config.PORT;
    
    // Initialize database
    this.connectDatabase();
    
    // Initialize middleware
    this.initializeMiddleware();
    
    // Initialize routes
    this.initializeRoutes();
    
    // Initialize error handling
    this.initializeErrorHandling();
  }

  async connectDatabase() {
    await connectDB();
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT.windowMs,
      max: config.RATE_LIMIT.max,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.RATE_LIMIT.windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // CORS
    this.app.use(cors({
      origin: config.NODE_ENV === 'production' 
        ? ['https://yourfrontend.com'] // Add your production frontend URL
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Logging
    if (config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy (for production deployment)
    if (config.NODE_ENV === 'production') {
      this.app.set('trust proxy', 1);
    }
  }

  initializeRoutes() {
    // Health check route
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    

    // Serve static files in production
    if (config.NODE_ENV === 'production') {
      this.app.use(express.static('client/build'));
      
      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
      });
    }
  }

  initializeErrorHandling() {
    // 404 handler
    this.app.use(notFound);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`
🚀 Server is running!
📍 Environment: ${config.NODE_ENV}
🌍 Port: ${this.port}
💻 Local: http://localhost:${this.port}
🏥 Health: http://localhost:${this.port}/health
      `);
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = App;
