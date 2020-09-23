import {RequestAdapter, Request} from "../client";
import {ComponentResponse} from "../ragu-component";

class FetchRequest implements Request {
  private readonly response: Promise<Response>;
  private abortController: AbortController;

  constructor(private readonly componentURL: string) {
    this.abortController = new AbortController();
    const abortSignal = this.abortController.signal;

    this.response = fetch(this.componentURL, {signal: abortSignal});
  }

  cancel(): void {
    this.abortController.abort();
  }

  async resolve(): Promise<ComponentResponse> {
    const response = await this.response;
    return await response.json();
  }

}

export class FetchRequestAdapter implements RequestAdapter {
  request(componentURL: string): any {
    return new FetchRequest(componentURL);
  }
}
