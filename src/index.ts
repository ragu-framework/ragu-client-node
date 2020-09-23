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

export interface RaguClientConfig {
  timeout: number;
  requestAdapter: (componentURL: string) => Promise<ComponentResponse>;
}

const defaultConfig: RaguClientConfig = {
  timeout: 5000,
  requestAdapter: () => Promise.resolve<any>({})
}

class RaguComponent {
  constructor(readonly raw: ComponentResponse) {
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
}

export class RaguClient {
  private readonly config: RaguClientConfig

  constructor(config: Partial<RaguClientConfig> = {}) {
    this.config = {...defaultConfig, ...config};
  }

  async fetchComponent(url: string): Promise<RaguComponent> {
    return new RaguComponent(await this.config.requestAdapter(url));
  }
}
