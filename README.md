# NocoBase Plugin: Public Share

Password-protected public sharing for custom pages (read-only, noindex by default).

## Features

- **Password Protection**: Secure access with custom passwords
- **Public Links**: Generate shareable URLs for custom pages
- **Read-Only Access**: Anonymous users get view-only permissions
- **SEO Control**: noindex by default to prevent search engine indexing
- **Rate Limiting**: Protection against brute force attacks
- **Session Management**: Persistent authentication via cookies

## Prerequisites

- NocoBase 1.8.23 or higher
- Node.js 18+ with Corepack enabled

## Installation & Setup

### 1. Enable Corepack (if not already enabled)
```bash
corepack enable
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Build the Plugin
```bash
yarn build
```

### 4. Deploy to NocoBase
Copy the plugin to your NocoBase plugins directory and enable it in the admin panel.

## Development

### Available Scripts

```bash
# Build production version
yarn build

# Build server only
yarn build:server

# Build client only  
yarn build:client

# Development mode with watch
yarn dev

# Run tests
yarn test

# Clean build artifacts
yarn clean
```

### Development Workflow

1. **Setup Development Environment**
   ```bash
   corepack enable
   yarn install
   ```

2. **Start Development Mode**
   ```bash
   yarn dev
   ```
   This will watch for changes and rebuild automatically.

3. **Test Your Changes**
   ```bash
   yarn build
   # Deploy to your NocoBase instance
   ```

## Usage

### For Page Owners
1. Open your custom page settings
2. Toggle "Share publicly" 
3. Set a password (optional but recommended)
4. Copy the generated public link
5. Share the link with intended users

### For Public Users
1. Visit the shared link
2. Enter the password if required
3. Access the page content (read-only)

## API Endpoints

- `POST /api/public/{slug}/auth` - Authenticate with password
- `GET /api/public/{slug}` - Access protected content
- `GET /api/public/health` - Plugin health check

## Security Features

- Rate limiting (5 attempts per 15 minutes)
- Secure password hashing (bcrypt)
- HttpOnly cookies for session management
- Read-only access for anonymous users
- Optional noindex for SEO control

## Configuration

The plugin extends the `pages` collection with these fields:
- `isPublic` (boolean) - Enable public sharing
- `publicSlug` (string) - Unique URL slug
- `passwordHash` (string) - Encrypted password
- `noindex` (boolean) - SEO indexing control

## Troubleshooting

### Build Issues
```bash
# Clean and rebuild
yarn clean
yarn build
```

### TypeScript Errors
Ensure you have the correct NocoBase peer dependencies installed.

### Plugin Not Loading
Check NocoBase logs for any error messages during plugin initialization.

## License

This plugin follows the same license as NocoBase.

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
