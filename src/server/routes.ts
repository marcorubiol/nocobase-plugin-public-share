// Placeholder server routes. Replace with NocoBase server APIs during integration.

import { PasswordAuthRequest, PasswordAuthResponse } from "../shared/types";

// Very small in-memory store for the scaffold demo only.
const authorizedSessions = new Set<string>();

function hash(input: string): string {
  // NOT SECURE. Placeholder only. Replace with bcrypt in real implementation.
  // Keep it purely string-based to avoid Node Buffer types in the scaffold.
  let acc = 0;
  for (let i = 0; i < input.length; i++) {
    acc = (acc * 31 + input.charCodeAt(i)) >>> 0;
  }
  return `h_${acc.toString(16)}`;
}

export function createRoutes() {
  // Replace with NocoBase/Express router injection.
  return {
    // GET /p/:slug
    getPublic: (slug: string, sessionId?: string) => {
      const authorized = sessionId ? authorizedSessions.has(`${slug}:${sessionId}`) : false;
      return { slug, authorized };
    },

    // POST /p/:slug/auth
    authPassword: (slug: string, body: PasswordAuthRequest): PasswordAuthResponse & { sessionId?: string } => {
      // Demo logic only. Replace with page-level password hash verification from DB.
      const demoPassword = "demo";
      const ok = hash(body.password) === hash(demoPassword);
      if (!ok) return { ok: false, message: "Invalid password" };
      const sessionId = Math.random().toString(36).slice(2);
      authorizedSessions.add(`${slug}:${sessionId}`);
      return { ok: true, sessionId };
    },
  };
}
