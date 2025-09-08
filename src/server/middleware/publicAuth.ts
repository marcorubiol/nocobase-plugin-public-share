/**
 * Public authentication middleware for shared pages
 * Handles password verification and session management
 */

export class PublicAuthMiddleware {
  private authorizedSessions = new Set<string>();
  private attempts = new Map<string, { count: number; ts: number }>();
  private pagePasswords = new Map<string, string>();

  constructor() {
    // Initialize with demo data
    this.pagePasswords.set('demo', 'demo');
  }

  // Rate limiting for auth attempts
  checkRateLimit(ip: string, slug: string): boolean {
    const key = `${ip}:${slug}`;
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, ts: now });
      return true;
    }

    // Reset after 15 minutes
    if (now - attempt.ts > 15 * 60 * 1000) {
      this.attempts.set(key, { count: 1, ts: now });
      return true;
    }

    // Max 5 attempts per 15 minutes
    if (attempt.count >= 5) {
      return false;
    }

    attempt.count++;
    return true;
  }

  // Verify password for a slug
  verifyPassword(slug: string, password: string): boolean {
    const storedPassword = this.pagePasswords.get(slug);
    return storedPassword === password;
  }

  // Check if session is authorized for a slug
  isAuthorized(sessionId: string, slug: string): boolean {
    return this.authorizedSessions.has(`${slug}:${sessionId}`);
  }

  // Authorize a session for a slug
  authorize(sessionId: string, slug: string): void {
    this.authorizedSessions.add(`${slug}:${sessionId}`);
  }

  // Get page password (for testing)
  getPagePassword(slug: string): string | undefined {
    return this.pagePasswords.get(slug);
  }

  // Set page password (will be replaced with DB)
  setPagePassword(slug: string, password: string): void {
    this.pagePasswords.set(slug, password);
  }
}
