import { Application } from "express";
import { register } from "@reflet/express";
import { setApiPrefix } from "../../config/apiPrefix";

/**
 * Register all v1 API controllers with dynamic prefix
 */
export function registerV1Routes(app: Application, apiPrefix: string): void {
  // Set the API prefix before importing controllers
  setApiPrefix(apiPrefix);
  // Import controllers after setting prefix so decorators get correct value

  // Register controllers
  register(app, []);
}
