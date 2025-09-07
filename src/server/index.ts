// Server entry. Wire this into NocoBase plugin registration later.

import { createRoutes } from "./routes";

export class PublicShareServerPlugin {
  name = "nocobase-plugin-public-share";

  async load() {
    // In real plugin, register routes: GET /p/:slug, POST /p/:slug/auth
    const routes = createRoutes();
    // attach to framework in actual integration
    return routes;
  }
}

export default PublicShareServerPlugin;
