require('dotenv').config();
const config = require('./src/config/config');

console.log('=== PORT DEBUG ===');
console.log('process.env.PORT:', process.env.PORT);
console.log('config.PORT:', config.PORT);
console.log('typeof config.PORT:', typeof config.PORT);
console.log('Environment vars:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', process.env.MONGO_URI);

// Verificar si el archivo .env se está leyendo correctamente
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
console.log('\n.env file exists:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  console.log('.env content:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}
