"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.name, err.message);
    console.error("Stack:", err.stack);
    console.log("🔄 Shutting down due to uncaught exception...");
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err.name, err.message);
    console.error("Stack:", err.stack);
    console.log("🔄 Shutting down due to unhandled rejection...");
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received, shutting down gracefully");
    server.close(() => {
        console.log("✅ Process terminated");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    console.log("👋 SIGINT received, shutting down gracefully");
    server.close(() => {
        console.log("✅ Process terminated");
        process.exit(0);
    });
});
const app = new app_1.default();
const server = app.listen();
const gracefulShutdown = async () => {
    try {
        await app.close();
        console.log("✅ Server closed gracefully");
    }
    catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
};
exports.default = app;
//# sourceMappingURL=server.js.map