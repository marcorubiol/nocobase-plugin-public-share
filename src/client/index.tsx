const PublicShareClientPlugin = {
  options: {
    name: '@nocobase/plugin-public-share',
  },
  afterAdd() {},
  async beforeLoad() {},
  async load() {
    // eslint-disable-next-line no-console
    console.log('[PublicShare] Client plugin registered');
  },
  async afterEnable() {},
  async afterDisable() {},
  async remove() {},
};

export default PublicShareClientPlugin;
