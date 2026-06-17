if (!global.CustomEvent) {
  (global as any).CustomEvent = class CustomEvent {
    constructor(event: string, params: any = {}) {
      this.type = event;
      this.detail = params.detail || {};
    }
    type: string;
    detail: any;
  };
}
