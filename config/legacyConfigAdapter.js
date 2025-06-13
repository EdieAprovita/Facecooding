/**
 * Legacy config adapter - Para compatibilidad con rutas antiguas
 * Este archivo será eliminado cuando migremos todas las rutas
 */
const config = require('../src/config/config');

// Emular la interfaz del paquete 'config' antiguo
const legacyConfig = {
  get: (key) => {
    const mappings = {
      'jwtSecret': config.JWT_SECRET,
      'mongoURI': config.MONGO_URI,
      'githubToken': config.GITHUB_TOKEN
    };
    
    return mappings[key] || null;
  },
  
  has: (key) => {
    const mappings = {
      'jwtSecret': config.JWT_SECRET,
      'mongoURI': config.MONGO_URI,
      'githubToken': config.GITHUB_TOKEN
    };
    
    return mappings[key] !== undefined;
  }
};

module.exports = legacyConfig;
