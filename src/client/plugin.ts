/**
 * Client plugin as a constructible function with static options and
 * prototype lifecycle methods, to align with NocoBase 1.8.23 loader
 * expectations (may call `new defaultExport()` and read `.options`).
 */
function PublicShareClientPlugin(this: any) {
  // no-op constructor
}

(PublicShareClientPlugin as any).options = {
  name: '@nocobase/plugin-public-share',
};

PublicShareClientPlugin.prototype.afterAdd = function afterAdd() {};
PublicShareClientPlugin.prototype.beforeLoad = async function beforeLoad() {};
PublicShareClientPlugin.prototype.load = async function load() {
  // eslint-disable-next-line no-console
  console.log('[PublicShare] Client plugin registered');
};
PublicShareClientPlugin.prototype.afterEnable = async function afterEnable() {};
PublicShareClientPlugin.prototype.afterDisable = async function afterDisable() {};
PublicShareClientPlugin.prototype.remove = async function remove() {};

export default PublicShareClientPlugin;
