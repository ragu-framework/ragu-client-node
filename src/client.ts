import {ComponentResponse, RaguComponent} from "./ragu-component";
import {FetchRequestAdapter} from "./adapters/fetch";

export type Request = {
  resolve: () => Promise<ComponentResponse>
  cancel: () => void
};

export type RequestAdapter = {
  request: (componentURL: string) => Request
};

export interface RaguClientConfig {
  timeout: number;
  requestAdapter: RequestAdapter;
}

const defaultConfig: RaguClientConfig = {
  timeout: 5000,
  requestAdapter: new FetchRequestAdapter()
}

export class RaguClient {
  private readonly config: RaguClientConfig

  constructor(config: Partial<RaguClientConfig> = {}) {
    this.config = {...defaultConfig, ...config};
  }

  async fetchComponent(url: string): Promise<RaguComponent> {
    const requestAdapter = this.config.requestAdapter.request(url);
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

    return new RaguComponent(await response, url);
  }
}
