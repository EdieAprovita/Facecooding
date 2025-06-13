import { Application } from "express";
declare class App {
    app: Application;
    private port;
    constructor();
    private initializeMiddleware;
    private getCorsOrigins;
    private initializeRoutes;
    private initializeErrorHandling;
    private connectDatabase;
    listen(): any;
    getApp(): Application;
    close(): Promise<void>;
}
export default App;
//# sourceMappingURL=app.d.ts.map