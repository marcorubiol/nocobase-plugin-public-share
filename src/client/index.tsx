import { Plugin } from '@nocobase/client';

export class PublicShareClient extends Plugin {
  async afterAdd() {
    console.log('[PublicShare] Client afterAdd called');
  }

  async beforeLoad() {
    console.log('[PublicShare] Client beforeLoad called');
  }

  async load() {
    console.log('[PublicShare] Client plugin loaded successfully!');
    // Aquí se puede agregar lógica de inicialización del cliente
  }

  async afterEnable() {
    console.log('[PublicShare] Client afterEnable called');
  }

  async afterDisable() {
    console.log('[PublicShare] Client afterDisable called');
  }

  async remove() {
    console.log('[PublicShare] Client remove called');
  }
}

export default PublicShareClient;
