/**
 * Public Share plugin (server) — aligned to NocoBase plugin pattern.
 * Note: Minimal stub; will be wired to real routes and ACL next.
 */

import { InstallOptions, Plugin } from '@nocobase/server';

export default class PublicSharePlugin extends Plugin {
  // Database models will be available via this.db after load()
  private authorizedSessions = new Set<string>(); // `${slug}:${sessionId}`
  private attempts = new Map<string, { count: number; ts: number }>(); // `${ip}:${slug}`
  private pagePasswords = new Map<string, string>(); // slug -> password (temporary)

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
        // Seed demo password for testing
        this.pagePasswords.set('demo', 'demo');

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

          // Auth and protected slug
          const mAuth = path.match(/^\/api\/public\/([^/]+)\/auth$/);
          const mSlug = path.match(/^\/api\/public\/([^/]+)$/);

          if (ctx.method === 'POST' && mAuth) {
            const slug = mAuth[1];
            if (!this.pagePasswords.has(slug)) {
              ctx.status = 404;
              ctx.body = { ok: false, error: 'Not found' };
              return;
            }

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
            const maxAge = 30 * 60 * 1000; // 30 minutes
            ctx?.cookies?.set?.(cookieName, sessionId, {
              httpOnly: true,
              sameSite: 'lax',
              maxAge,
              // secure: true, // enable when behind HTTPS
              path: '/',
            });
            ctx.status = 200;
            ctx.body = { ok: true, authorized: true };
            return;
          }

          if (ctx.method === 'GET' && mSlug) {
            const slug = mSlug[1];
            if (!this.pagePasswords.has(slug)) {
              ctx.status = 404;
              ctx.body = { ok: false, error: 'Not found' };
              return;
            }
            const sessionCookieName = this.cookieName(slug);
            const sessionId = ctx?.cookies?.get?.(sessionCookieName);
            const authorized = sessionId
              ? this.authorizedSessions.has(this.sessionKey(slug, sessionId))
              : false;
            if (!authorized) {
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
