"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (this.isConnected) {
            console.log("📦 Database already connected");
            return;
        }
        try {
            const dbConfig = {
                uri: config_1.default.MONGODB_URI,
                options: {
                    maxPoolSize: 10,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                    bufferMaxEntries: 0,
                },
            };
            await mongoose_1.default.connect(dbConfig.uri, dbConfig.options);
            this.isConnected = true;
            console.log(`📦 MongoDB connected: ${mongoose_1.default.connection.host}`);
            mongoose_1.default.connection.on("error", (err) => {
                console.error("❌ MongoDB connection error:", err);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on("disconnected", () => {
                console.log("📦 MongoDB disconnected");
                this.isConnected = false;
            });
            mongoose_1.default.connection.on("reconnected", () => {
                console.log("📦 MongoDB reconnected");
                this.isConnected = true;
            });
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            this.isConnected = false;
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log("📦 MongoDB disconnected");
        }
        catch (error) {
            console.error("❌ Error disconnecting from database:", error);
            throw error;
        }
    }
    getConnectionStatus() {
        return this.isConnected;
    }
    getConnection() {
        return mongoose_1.default.connection;
    }
}
const database = Database.getInstance();
exports.default = database;
const connectDB = async () => {
    await database.connect();
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map