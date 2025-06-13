import mongoose from "mongoose";
import config from "./config";
import { DatabaseConfig } from "@/types";

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("📦 Database already connected");
      return;
    }

    try {
      const dbConfig: DatabaseConfig = {
        uri: config.MONGODB_URI,
        options: {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
        },
      };

      await mongoose.connect(dbConfig.uri, dbConfig.options);

      this.isConnected = true;

      console.log(`📦 MongoDB connected: ${mongoose.connection.host}`);

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("📦 MongoDB disconnected");
        this.isConnected = false;
      });

      mongoose.connection.on("reconnected", () => {
        console.log("📦 MongoDB reconnected");
        this.isConnected = true;
      });
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("📦 MongoDB disconnected");
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }
}

// Export singleton instance
const database = Database.getInstance();
export default database;

// Legacy export for backward compatibility
export const connectDB = async (): Promise<void> => {
  await database.connect();
};
