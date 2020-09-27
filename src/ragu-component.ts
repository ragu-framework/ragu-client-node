export interface ComponentResponse {
  html: string,
  props: Record<string, string>,
  dependencies: {
    nodeRequire: string,
    globalVariable: string,
    dependency: string
  }[],
  styles?: string[],
  client: string,
  resolverFunction: string
}

export class RaguComponent {
  constructor(readonly raw: ComponentResponse, readonly componentURL: string) {
  }

  stylesheets(): string {
    let stylesheets = "";

    for (let stylesheetHref of (this.raw.styles || [])) {
      stylesheets += `<link rel="stylesheet" href="${stylesheetHref}">`;
    }

    return stylesheets;
  }

  html() {
    return `<script data-ragu-ssr type="application/json">${(this.ssrData())}</script>${this.raw.html}`;
  }

  private ssrData() {
    const ssrData: Partial<ComponentResponse> = {...this.raw};
    delete ssrData.html;
    return JSON.stringify(ssrData);
  }

  toRaguDOM(): string {
    return `<ragu-component src="${this.componentURL}">${this.html()}</ragu-component>`;
  }
}
