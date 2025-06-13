"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const config_1 = __importDefault(require("@/config/config"));
const database_1 = __importDefault(require("@/config/database"));
const errorHandler_1 = require("@/middleware/errorHandler");
const auth_1 = __importDefault(require("@/routes/auth"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.default.PORT;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.connectDatabase();
    }
    initializeMiddleware() {
        if (config_1.default.NODE_ENV === "production") {
            this.app.set("trust proxy", 1);
        }
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            crossOriginEmbedderPolicy: false,
        }));
        this.app.use((0, express_mongo_sanitize_1.default)());
        this.app.use((0, compression_1.default)());
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: config_1.default.RATE_LIMIT.windowMs,
            max: config_1.default.RATE_LIMIT.max,
            message: {
                success: false,
                message: "Too many requests from this IP, please try again later.",
                retryAfter: Math.ceil(config_1.default.RATE_LIMIT.windowMs / 1000),
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use("/api/", limiter);
        this.app.use((0, cors_1.default)({
            origin: this.getCorsOrigins(),
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "Accept",
                "Origin",
            ],
        }));
        if (config_1.default.NODE_ENV === "development") {
            this.app.use((0, morgan_1.default)("dev"));
        }
        else {
            this.app.use((0, morgan_1.default)("combined"));
        }
        this.app.use(express_1.default.json({
            limit: "10mb",
            type: ["application/json", "text/plain"],
        }));
        this.app.use(express_1.default.urlencoded({
            extended: true,
            limit: "10mb",
        }));
    }
    getCorsOrigins() {
        if (config_1.default.NODE_ENV === "production") {
            return [
                "https://your-frontend-domain.com",
                "https://www.your-frontend-domain.com",
            ];
        }
        return [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:5001",
        ];
    }
    initializeRoutes() {
        this.app.get("/health", (req, res) => {
            const healthCheck = {
                success: true,
                message: "Server is running",
                timestamp: new Date().toISOString(),
                environment: config_1.default.NODE_ENV,
                version: process.env.npm_package_version || "1.0.0",
                uptime: process.uptime(),
                database: database_1.default.getConnectionStatus() ? "connected" : "disconnected",
            };
            res.status(200).json(healthCheck);
        });
        this.app.use("/api/auth", auth_1.default);
        this.app.get("/api", (req, res) => {
            res.status(200).json({
                success: true,
                message: "Facecooding API v1.0",
                version: "1.0.0",
                endpoints: {
                    auth: "/api/auth",
                    health: "/health",
                },
                documentation: "/api/docs",
            });
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.notFound);
        this.app.use(errorHandler_1.errorHandler);
    }
    async connectDatabase() {
        try {
            await database_1.default.connect();
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            if (config_1.default.NODE_ENV === "production") {
                process.exit(1);
            }
        }
    }
    listen() {
        return this.app.listen(this.port, () => {
            console.log(`
🚀 Server is running!
📍 Environment: ${config_1.default.NODE_ENV}
🌍 Port: ${this.port}
💻 Local: http://localhost:${this.port}
🏥 Health: http://localhost:${this.port}/health
📡 API: http://localhost:${this.port}/api
      `);
        });
    }
    getApp() {
        return this.app;
    }
    async close() {
        await database_1.default.disconnect();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map