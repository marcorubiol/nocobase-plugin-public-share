/**
 * A self-contained client plugin class that is compatible with NocoBase's client loader.
 * It is constructible (can be called with `new`) and has the static `options` property
 * and lifecycle methods that the PluginManager expects.
 * It does not extend any base class to avoid build-time module resolution errors.
 */
export default class PublicShareClientPlugin {
  static options = {
    name: '@nocobase/plugin-public-share',
  };

  app: any;

  constructor(app: any) {
    this.app = app;
  }

  afterAdd() {}

  async beforeLoad() {}

  async load() {
    // eslint-disable-next-line no-console
    console.log('[PublicShare] Client plugin loaded successfully.');
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}
