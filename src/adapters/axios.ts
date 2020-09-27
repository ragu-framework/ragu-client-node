import {RequestAdapter, Request} from "../client";
import {ComponentResponse} from "../ragu-component";
import axios, {AxiosResponse, CancelTokenSource} from 'axios';

class AxiosRequest implements Request {
  private readonly response: Promise<AxiosResponse<ComponentResponse>>;
  private cancelToken: CancelTokenSource;

  constructor(private readonly componentURL: string) {
    this.cancelToken = axios.CancelToken.source();
    this.response = axios.get(this.componentURL, { cancelToken: this.cancelToken.token });
  }

  cancel(): void {
    this.cancelToken.cancel();
  }

  async resolve(): Promise<ComponentResponse> {
    const response = await this.response;
    return response.data;
  }
}

export class AxiosRequestAdapter implements RequestAdapter {
  request(componentURL: string): any {
    return new AxiosRequest(componentURL);
  }
}
