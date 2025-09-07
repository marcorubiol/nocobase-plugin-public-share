# NocoBase Plugin: Public Share (Password Protected)

This plugin adds password-protected public sharing for custom pages in NocoBase.

Target: NocoBase 1.8.23 (Yarn workspaces)

Status: scaffolded skeleton (ready to drop into your repo). Server/client entry points are created so you can wire this into your NocoBase app.

## Features (planned)
- Toggle any custom page as public.
- Optional password protection for public pages.
- Public route: `/p/:slug`.
- No authentication required to view; password gate (if set) via session cookie.
- Read-only access via a minimal `PublicShare` role.
- `noindex` meta by default.

## Structure
- `src/server/index.ts` — plugin server side (routes and ACL wiring).
- `src/server/routes.ts` — express routes for public pages and auth.
- `src/client/index.tsx` — client entry to inject settings UI for pages.

## Install (zip + Yarn workspaces)
1) Zip this folder on your local machine:
   - macOS Finder: right-click the `nocobase-plugin-public-share` folder → Compress.
   - or CLI: `zip -r nocobase-plugin-public-share.zip nocobase-plugin-public-share`.

2) Upload and extract on your server into your repo, e.g.:
   - `plugins/nocobase-plugin-public-share/`

3) Ensure your root `package.json` includes this folder in workspaces:
```
{
  "workspaces": [
    "packages/*",
    "plugins/*"
  ]
}
```

4) From repo root, install and build:
```
yarn install
yarn workspace nocobase-plugin-public-share build
```

5) Register the plugin in your NocoBase app (depending on your setup this is auto-discovered or added in your plugin registry). Start your app and verify the plugin loads.

## Next steps to implement
- Persist page fields: `isPublic`, `publicSlug`, `passwordHash`, `noindex`.
- Wire `PublicShare` role with read-only permissions for required collections.
- Implement password flow and session cookie.
- Add UI in page settings: toggle public, set password, copy link, toggle noindex.

## Disclaimer
This is a starter scaffold. You will need a running NocoBase repo to link and test.
