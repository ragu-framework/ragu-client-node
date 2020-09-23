import {ComponentResponse, RaguComponent} from "./ragu-component";

export interface RaguClientConfig {
  timeout: number;
  requestAdapter: (componentURL: string) => {
    resolve: () => Promise<ComponentResponse>
    cancel: () => void
  };
}

const defaultConfig: RaguClientConfig = {
  timeout: 5000,
  requestAdapter: () => ({
    resolve: () => Promise.resolve<any>({}),
    cancel: () => {
    }
  })
}

export class RaguClient {
  private readonly config: RaguClientConfig

  constructor(config: Partial<RaguClientConfig> = {}) {
    this.config = {...defaultConfig, ...config};
  }

  async fetchComponent(url: string): Promise<RaguComponent> {
    const requestAdapter = this.config.requestAdapter(url);
    const response = requestAdapter.resolve();
    let timeout;

    const timeoutPromise = new Promise((_resolve, reject) => {
      timeout = setTimeout(() => {
        reject(new Error('Timeout'));
        requestAdapter.cancel();
      }, 5000);
    });

    await Promise.race([timeoutPromise, response]);

    clearTimeout(timeout);

    return new RaguComponent(await response);
  }
}
