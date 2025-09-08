/**
 * Public Share plugin (server) — aligned to NocoBase plugin pattern.
 * Note: Minimal stub; will be wired to real routes and ACL next.
 */

import { InstallOptions, Plugin } from '@nocobase/server';

export default class PublicSharePlugin extends Plugin {
  // Follow NocoBase convention: plugin package-style name
  public name = "@nocobase/plugin-public-share";

  // In-memory demo stores (replace with DB-backed in real implementation)
  private pagePasswords = new Map<string, string>(); // slug -> password (plain for demo)
  private authorizedSessions = new Set<string>(); // `${slug}:${sessionId}`
  private attempts = new Map<string, { count: number; ts: number }>(); // `${ip}:${slug}`

  // NocoBase server will call load() on plugin initialization
  async load() {
    // Visible signal in server logs that the plugin has loaded
    // (You should see this in the NocoBase server output)
    // eslint-disable-next-line no-console
    console.log("[PublicShare] Server plugin loaded");

    // Try to register a minimal health route for visibility/testing.
    // We avoid importing NocoBase types; access router defensively.
    try {
      const app: any = this.app as any;
      const router: any = app?.router || app?.koaRouter || app?.koa?.router;
      if (router && typeof router.get === 'function') {
        router.get('/p/health', async (ctx: any) => {
          ctx.body = { ok: true, plugin: '@nocobase/plugin-public-share' };
        });
        // eslint-disable-next-line no-console
        console.log('[PublicShare] Registered GET /p/health');
      }

      // Seed a demo password for a sample slug so you can test immediately
      // Visit: POST /p/demo/auth with { password: "demo" }, then GET /p/demo
      this.pagePasswords.set('demo', 'demo');

      if (router) {
        // GET /p/:slug — simple gate based on session cookie
        router.get('/p/:slug', async (ctx: any) => {
          const slug = ctx?.params?.slug as string;
          const sessionCookieName = this.cookieName(slug);
          const sessionId = ctx?.cookies?.get?.(sessionCookieName);
          const authorized = sessionId
            ? this.authorizedSessions.has(this.sessionKey(slug, sessionId))
            : false;

          if (!slug || !this.pagePasswords.has(slug)) {
            ctx.status = 404;
            ctx.body = { ok: false, error: 'Not found' };
            return;
          }

          if (!authorized) {
            ctx.status = 401;
            ctx.body = { ok: false, authorized: false, message: 'Password required' };
            return;
          }

          // Minimal success payload for now
          ctx.status = 200;
          ctx.body = { ok: true, authorized: true, slug };
        });

        // POST /p/:slug/auth — check password and set session cookie
        router.post('/p/:slug/auth', async (ctx: any) => {
          const slug = ctx?.params?.slug as string;
          if (!slug || !this.pagePasswords.has(slug)) {
            ctx.status = 404;
            ctx.body = { ok: false, error: 'Not found' };
            return;
          }

          // Simple rate limit: 10 attempts per 5 minutes per IP/slug
          const ip = (ctx?.ip || ctx?.request?.ip || 'unknown') as string;
          if (!this.checkRateLimit(ip, slug, 10, 5 * 60 * 1000)) {
            ctx.status = 429;
            ctx.body = { ok: false, error: 'Too many attempts, try later' };
            return;
          }

          const body = ctx?.request?.body || {};
          const password = (body?.password ?? '').toString();
          const expected = this.pagePasswords.get(slug) as string;
          const ok = password.length > 0 && password === expected;
          if (!ok) {
            ctx.status = 401;
            ctx.body = { ok: false, authorized: false, message: 'Invalid password' };
            return;
          }

          const sessionId = Math.random().toString(36).slice(2);
          this.authorizedSessions.add(this.sessionKey(slug, sessionId));
          const cookieName = this.cookieName(slug);
          // 30 minutes
          const maxAge = 30 * 60 * 1000;
          ctx?.cookies?.set?.(cookieName, sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge,
            // secure: true, // enable when behind HTTPS
            path: '/',
          });

          ctx.status = 200;
          ctx.body = { ok: true, authorized: true };
        });

        // eslint-disable-next-line no-console
        console.log('[PublicShare] Registered GET /p/:slug and POST /p/:slug/auth');
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

  private checkRateLimit(ip: string, slug: string, limit: number, windowMs: number) {
    const key = `${ip}:${slug}`;
    const now = Date.now();
    const rec = this.attempts.get(key);
    if (!rec || now - rec.ts > windowMs) {
      this.attempts.set(key, { count: 1, ts: now });
      return true;
    }
    if (rec.count >= limit) {
      return false;
    }
    rec.count += 1;
    return true;
  }
}
