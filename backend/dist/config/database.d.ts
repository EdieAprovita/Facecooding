import mongoose from "mongoose";
declare class Database {
    private static instance;
    private isConnected;
    private constructor();
    static getInstance(): Database;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnectionStatus(): boolean;
    getConnection(): typeof mongoose.connection;
}
declare const database: Database;
export default database;
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map