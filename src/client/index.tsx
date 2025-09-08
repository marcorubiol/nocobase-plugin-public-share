import ClientPlugin from './plugin';

// Expose as global so NocoBase can discover default export in browser without module loader
// window['@nocobase/plugin-public-share'] = { default: ClientPlugin }
(function (g: any) {
  g['@nocobase/plugin-public-share'] = { default: ClientPlugin };
})(globalThis as any);
