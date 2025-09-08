/**
 * Client plugin class: constructible + static options for NocoBase 1.8.23.
 * Keep imports out to avoid build-time resolution issues; the runtime will only
 * need a constructible object with lifecycle hooks.
 */
export default class PublicShareClientPlugin {
  static options = {
    name: '@nocobase/plugin-public-share',
  };

  afterAdd() {}
  async beforeLoad() {}
  async load() {
    // eslint-disable-next-line no-console
    console.log('[PublicShare] Client plugin registered');
  }
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
