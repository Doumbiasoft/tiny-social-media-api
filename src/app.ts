import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { registerRoutes } from "./routes";
import { errorHandler } from "./middlewares/globalErrorHandler.middleware";
import { setupDynamicOpenAPI } from "./utils/openAPIDocsGenerator";
import "reflect-metadata";
import path from "path";

const app = express();

app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));

app.set("views", "./src/views");
app.set("view engine", "ejs");

/** Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(morgan("dev"));

/** Routes */
registerRoutes(app, "/api");

/** Initialize OpenAPI Documentation with @reflet */
async function setupApp() {
  // Setup OpenAPI endpoints with fully dynamic controller discovery
  await setupDynamicOpenAPI(app, {
    specPath: "/api-docs",
    docsPath: "/docs", // Scalar UI (modern, clean)
    swaggerPath: "/swagger", // Swagger UI (traditional, feature-rich)
    enableSwagger: true, // Enable Swagger UI
    enableScalar: true, // Enable Scalar UI
  });

  // Global error handler (⚡ must be last)
  app.use(errorHandler);
  return app;
}

// Initialize the app
setupApp().catch(console.error);

export default app;
