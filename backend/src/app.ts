import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import config from "@/config/config";
import database from "@/config/database";
import { errorHandler, notFound } from "@/middleware/errorHandler";

// Import routes
import authRoutes from "@/routes/auth";

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.PORT;

    // Initialize everything
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.connectDatabase();
  }

  private initializeMiddleware(): void {
    // Trust proxy
    if (config.NODE_ENV === "production") {
      this.app.set("trust proxy", 1);
    }

    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
        crossOriginEmbedderPolicy: false,
      })
    );

    // Data sanitization against NoSQL query injection
    this.app.use(mongoSanitize());

    // Compression middleware
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT.windowMs,
      max: config.RATE_LIMIT.max,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
        retryAfter: Math.ceil(config.RATE_LIMIT.windowMs / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // CORS configuration
    this.app.use(
      cors({
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
      })
    );

    // Logging
    if (config.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }

    // Body parsing middleware
    this.app.use(
      express.json({
        limit: "10mb",
        type: ["application/json", "text/plain"],
      })
    );
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "10mb",
      })
    );
  }

  private getCorsOrigins(): string[] {
    if (config.NODE_ENV === "production") {
      // Add your production frontend URLs here
      return [
        "https://your-frontend-domain.com",
        "https://www.your-frontend-domain.com",
      ];
    }

    // Development origins
    return [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:5001",
    ];
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req: Request, res: Response) => {
      const healthCheck = {
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        version: process.env.npm_package_version || "1.0.0",
        uptime: process.uptime(),
        database: database.getConnectionStatus() ? "connected" : "disconnected",
      };

      res.status(200).json(healthCheck);
    });

    // API routes
    this.app.use("/api/auth", authRoutes);

    // API info endpoint
    this.app.get("/api", (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "Facecooding API v1.0",
        version: "1.0.0",
        endpoints: {
          auth: "/api/auth",
          health: "/health",
        },
        documentation: "/api/docs", // TODO: Add documentation
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use(notFound);

    // Global error handler
    this.app.use(errorHandler);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await database.connect();
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      if (config.NODE_ENV === "production") {
        process.exit(1);
      }
    }
  }

  public listen(): any {
    return this.app.listen(this.port, () => {
      console.log(`
🚀 Server is running!
📍 Environment: ${config.NODE_ENV}
🌍 Port: ${this.port}
💻 Local: http://localhost:${this.port}
🏥 Health: http://localhost:${this.port}/health
📡 API: http://localhost:${this.port}/api
      `);
    });
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await database.disconnect();
  }
}

export default App;
