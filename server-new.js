const App = require('./src/app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the application
const app = new App();
app.listen();
