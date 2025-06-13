require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  
  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/facecooding',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // GitHub
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  
  // Rate Limiting
  RATE_LIMIT: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};
