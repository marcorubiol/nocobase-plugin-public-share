declare module '@nocobase/server' {
  export class Plugin {
    public app: any;
    public db: any;
    public acl: any;
    public name: string;
  }
  export type InstallOptions = any;
}
