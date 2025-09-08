/**
 * Public Share plugin (server) — aligned to NocoBase plugin pattern.
 * Note: Minimal stub; will be wired to real routes and ACL next.
 */

import { InstallOptions, Plugin } from '@nocobase/server';
import { PublicAuthMiddleware } from './middleware/publicAuth';
import { publicShareACL } from './acl';

export default class PublicSharePlugin extends Plugin {
  private authMiddleware = new PublicAuthMiddleware();

  // NocoBase server will call load() on plugin initialization
  async load() {
    // Visible signal in server logs that the plugin has loaded
    // (You should see this in the NocoBase server output)
    // eslint-disable-next-line no-console
    console.log("[PublicShare] Server plugin loaded");

    // Skip collections for now - will implement DB persistence next

    // Attach a middleware directly to the Koa stack so we don't depend on
    // any specific router instance or mounting point.
    try {
      const app: any = this.app as any;
      const use = app?.use?.bind(app);
      if (typeof use === 'function') {
        // Setup ACL for public sharing
        this.app.acl.define(publicShareACL);

        use(async (ctx: any, next: any) => {
          const path: string = ctx?.path || '';
          if (!path.startsWith('/api/public/')) return next();

          // eslint-disable-next-line no-console
          console.log('[PublicShare] Middleware hit:', ctx.method, path);

          // Health
          if (ctx.method === 'GET' && path === '/api/public/health') {
            ctx.body = { ok: true, plugin: '@nocobase/plugin-public-share' };
            return;
          }

          // Auth endpoint
          if (ctx.method === 'POST' && path.match(/^\/api\/public\/([^\/]+)\/auth$/)) {
            const slug = path.split('/')[3];
            const body = ctx.request.body || {};
            const password = body.password;
            const ip = ctx.ip || 'unknown';

            if (!this.authMiddleware.checkRateLimit(ip, slug)) {
              ctx.status = 429;
              ctx.body = { error: 'Too many attempts. Try again later.' };
              return;
            }

            if (!this.authMiddleware.getPagePassword(slug)) {
              ctx.status = 404;
              ctx.body = { error: 'Page not found' };
              return;
            }

            if (this.authMiddleware.verifyPassword(slug, password)) {
              const sessionId = ctx.session?.id || 'anonymous';
              this.authMiddleware.authorize(sessionId, slug);
              
              // Set a cookie for this slug
              ctx.cookies.set(`ps_${slug}`, 'authorized', {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
              });

              ctx.status = 200;
              ctx.body = { success: true, message: 'Authorized' };
            } else {
              ctx.status = 401;
              ctx.body = { ok: false, authorized: false, message: 'Password required' };
              return;
            }
            ctx.status = 200;
            ctx.body = { ok: true, authorized: true, slug };
            return;
          }

          // Fallback to next for anything else under /api/public/
          return next();
        });

        // eslint-disable-next-line no-console
        console.log('[PublicShare] Middleware registered for /api/public/*');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[PublicShare] Failed to register routes (non-fatal):', e);
    }

    // TODO (next step): register PublicShare role and ACL read-only rules
  }

  // Lifecycle stubs expected by PluginManager
  afterAdd() {}
  async beforeLoad() {}
  async install(_options?: InstallOptions) {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}

  // Optional lifecycle hook
  async unload() {
    // Cleanup if needed when plugin is unloaded
  }

  private cookieName(slug: string) {
    return `ps_${slug}`;
  }

  private sessionKey(slug: string, sessionId: string) {
    return `${slug}:${sessionId}`;
  }

}
