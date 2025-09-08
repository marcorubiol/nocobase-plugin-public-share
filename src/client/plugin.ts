/**
 * Client plugin stub following NocoBase pattern.
 * Will later register settings UI for custom pages (public share toggle, password, noindex, copy link).
 */

export default function ClientPlugin() {
  // NocoBase client will call this default export to register client-side extensions.
  // Keep minimal stub for now.
  // eslint-disable-next-line no-console
  console.log('[PublicShare] Client plugin registered');
  return null;
}
