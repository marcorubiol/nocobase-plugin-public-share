export default class PublicShareClientPlugin {
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
