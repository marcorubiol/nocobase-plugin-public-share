function PublicShareClientPlugin(this: any, app: any) {
  this.app = app;
}

// Add static options for NocoBase PluginManager
(PublicShareClientPlugin as any).options = {
  name: '@nocobase/plugin-public-share',
};

PublicShareClientPlugin.prototype.afterAdd = function () {};

PublicShareClientPlugin.prototype.beforeLoad = async function () {};

PublicShareClientPlugin.prototype.load = async function () {
  console.log('[PublicShare] Client plugin loaded successfully.');
};

PublicShareClientPlugin.prototype.afterEnable = async function () {};

PublicShareClientPlugin.prototype.afterDisable = async function () {};

PublicShareClientPlugin.prototype.remove = async function () {};

export default PublicShareClientPlugin;

// Add options to the exports object too
export const options = {
  name: '@nocobase/plugin-public-share',
};
