/**
 * Public Share plugin (server) — aligned to NocoBase plugin pattern.
 * Note: Minimal stub; will be wired to real routes and ACL next.
 */

export default class PublicSharePlugin {
  // Follow NocoBase convention: plugin package-style name
  public name = "@nocobase/plugin-public-share";

  // NocoBase server will call load() on plugin initialization
  async load() {
    // TODO: register routes: GET /p/:slug, POST /p/:slug/auth
    // TODO: register PublicShare role and ACL read-only rules
    // TODO: add password auth and session cookie middleware
  }

  // Optional lifecycle hook
  async unload() {
    // Cleanup if needed when plugin is unloaded
  }
}
