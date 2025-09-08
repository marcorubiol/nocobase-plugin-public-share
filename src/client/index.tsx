import { Plugin } from '@nocobase/client';

export class PublicShareClientPlugin extends Plugin {
  async load() {
    console.log('[PublicShare] Client plugin loaded successfully.');
  }
}

export default PublicShareClientPlugin;
