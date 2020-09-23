import {RaguClient} from "./index";
import {ComponentResponse} from "./ragu-component";

describe('Ragu Client Node', () => {
  const componentResponse: ComponentResponse = {
    "html": "<div>Hello World</div>",
    "props": {},
    "dependencies": [{
      "nodeRequire": "vue",
      "globalVariable": "Vue",
      "dependency": "https://cdn.jsdelivr.net/npm/vue/dist/vue.js"
    }],
    styles: [
      "https://cart.cdn.com/assets/style1.css",
      "https://cart.cdn.com/assets/style2.css"
    ],
    "client": "https://ragu-cart-vuejs.herokuapp.com/component-assets/client.80036088891453c259db.js",
    "resolverFunction": "cartcart"
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  class TestAdapter {
    url?: string;
    resolveStub: jest.Mock;
    cancelStub: jest.Mock;

    constructor() {
      this.resolveStub = jest.fn();
      this.cancelStub = jest.fn();
    }

    doRequest(url: string) {
      this.url = url;

      return {
        resolve: this.resolveStub,
        cancel: this.cancelStub
      }
    }

    asResolver() {
      return this.doRequest.bind(this);
    }
  }

  it('returns raw response from the server', async () => {
    const testAdapter = new TestAdapter();
    testAdapter.resolveStub.mockImplementation(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter: testAdapter.asResolver()});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(testAdapter.url).toEqual('https://ragu-cart-vuejs.herokuapp.com/components/cart');
    expect(response.raw).toEqual(componentResponse);
  });

  it('get stylesheets returns a string with all link tags', async () => {
    const testAdapter = new TestAdapter();
    testAdapter.resolveStub.mockImplementation(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter: testAdapter.asResolver()});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.stylesheets())
        .toEqual(`<link rel="stylesheet" href="https://cart.cdn.com/assets/style1.css"><link rel="stylesheet" href="https://cart.cdn.com/assets/style2.css">`);
  });

  it('gets the HTML', async () => {
    const testAdapter = new TestAdapter();
    testAdapter.resolveStub.mockImplementation(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter: testAdapter.asResolver()});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.html())
        .toContain(`<div>Hello World</div>`);
  });

  it('adds the ssr script tag without the html', async () => {
    const expectedSSRJson: Partial<ComponentResponse> = {
      ...componentResponse
    };

    delete expectedSSRJson.html;

    const testAdapter = new TestAdapter();
    testAdapter.resolveStub.mockImplementation(() => Promise.resolve(componentResponse));
    const client = new RaguClient({requestAdapter: testAdapter.asResolver()});

    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.html())
        .toContain(`<script data-ragu-ssr type="application/json">${JSON.stringify(expectedSSRJson)}</script>`);
  });

  it('cancels a request after the default timeout', async () => {
    const testAdapter = new TestAdapter();
    testAdapter.resolveStub.mockImplementation(() => new Promise(() => {}));

    const client = new RaguClient({requestAdapter: testAdapter.asResolver()});

    const expectation = expect(client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart'))
        .rejects.toEqual(new Error('Timeout'));

    jest.advanceTimersByTime(5000);

    await expectation;
    expect(testAdapter.cancelStub).toBeCalled();
  });
});
