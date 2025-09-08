declare module '@nocobase/client' {
  export class Plugin {
    app: any;
    name: string;
    afterAdd(): void;
    beforeLoad(): Promise<void> | void;
    load(): Promise<void> | void;
    afterEnable(): Promise<void> | void;
    afterDisable(): Promise<void> | void;
    remove(): Promise<void> | void;
  }
}
