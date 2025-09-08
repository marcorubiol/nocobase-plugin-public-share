/**
 * Public Share plugin (server) — aligned to NocoBase plugin pattern.
 * Note: Minimal stub; will be wired to real routes and ACL next.
 */

export default class PublicSharePlugin {
  // Follow NocoBase convention: plugin package-style name
  public name = "@nocobase/plugin-public-share";

  // NocoBase server will call load() on plugin initialization
  async load(_ctx?: any) {
    // Visible signal in server logs that the plugin has loaded
    // (You should see this in the NocoBase server output)
    // eslint-disable-next-line no-console
    console.log("[PublicShare] Server plugin loaded");

    // Try to register a minimal health route for visibility/testing.
    // We avoid importing NocoBase types; access router defensively.
    try {
      const app: any = (this as any).app || _ctx?.app || _ctx;
      const router: any = app?.router || app?.koaRouter || app?.koa?.router;
      if (router && typeof router.get === 'function') {
        router.get('/p/health', async (ctx: any) => {
          ctx.body = { ok: true, plugin: '@nocobase/plugin-public-share' };
        });
        // eslint-disable-next-line no-console
        console.log('[PublicShare] Registered GET /p/health');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[PublicShare] Failed to register /p/health route (non-fatal):', e);
    }

    // TODO (next step): register routes: GET /p/:slug, POST /p/:slug/auth
    // TODO: register PublicShare role and ACL read-only rules
    // TODO: add password auth and session cookie middleware
  }

  // Optional lifecycle hook
  async unload() {
    // Cleanup if needed when plugin is unloaded
  }
}
