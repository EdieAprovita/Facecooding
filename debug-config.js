#!/usr/bin/env node
/**
 * Debug script to check configuration and ports
 */

require('dotenv').config();
const config = require('./src/config/config');

console.log('🔍 Configuration Debug:');
console.log('='.repeat(50));
console.log(`NODE_ENV: ${config.NODE_ENV}`);
console.log(`PORT: ${config.PORT}`);
console.log(`MONGO_URI: ${config.MONGO_URI}`);
console.log(`JWT_SECRET: ${config.JWT_SECRET ? '***HIDDEN***' : 'NOT SET'}`);
console.log('='.repeat(50));

// Check which ports are in use
const net = require('net');

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => {
        resolve({ port, available: true });
      });
    });
    server.on('error', () => {
      resolve({ port, available: false });
    });
  });
};

async function checkPorts() {
  const ports = [3000, 5000, 5001];
  console.log('\n🌐 Port Availability:');
  console.log('='.repeat(50));
  
  for (const port of ports) {
    const result = await checkPort(port);
    const status = result.available ? '✅ Available' : '❌ In Use';
    console.log(`Port ${port}: ${status}`);
  }
  console.log('='.repeat(50));
}

checkPorts();
