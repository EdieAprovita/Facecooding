import App from "./app";
import config from "@/config/config";

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("❌ Uncaught Exception:", err.name, err.message);
  console.error("Stack:", err.stack);
  console.log("🔄 Shutting down due to uncaught exception...");
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("❌ Unhandled Rejection:", err.name, err.message);
  console.error("Stack:", err.stack);
  console.log("🔄 Shutting down due to unhandled rejection...");
  process.exit(1);
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Process terminated");
    process.exit(0);
  });
});

// Start the application
const app = new App();
const server = app.listen();

// Handle server close
const gracefulShutdown = async () => {
  try {
    await app.close();
    console.log("✅ Server closed gracefully");
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

export default app;
