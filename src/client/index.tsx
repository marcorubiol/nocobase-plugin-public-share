// Define a very small client plugin inline to avoid module system issues.
function ClientPlugin() {
  // eslint-disable-next-line no-console
  console.log('[PublicShare] Client plugin registered');
  return null;
}

// Expose as global so NocoBase can discover default export in browser without module loader
(function (g: any) {
  g['@nocobase/plugin-public-share'] = { default: ClientPlugin };
})(globalThis as any);
