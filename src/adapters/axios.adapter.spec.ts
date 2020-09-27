import {ComponentResponse} from "../ragu-component";
import nock from "nock";
import {AxiosRequestAdapter} from "./axios";
import {RequestAdapter} from "../client";

describe('axios adapter', () => {
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
    jest.useRealTimers();
  });

  it('axioses a request', async () => {
    nock('https://ragu-cart-vuejs.herokuapp.com')
        .get('/components/cart')
        .reply(200, componentResponse)

    const requestAdapter: RequestAdapter = new AxiosRequestAdapter();
    const request = requestAdapter.request('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    await expect(request.resolve()).resolves.toEqual(componentResponse);
  });

  it('cancel a request', async () => {
    nock('https://ragu-cart-vuejs.herokuapp.com')
        .get('/components/cart')
        .delayConnection(2000)
        .reply(200, componentResponse)

    const requestAdapter: RequestAdapter = new AxiosRequestAdapter();
    const request = requestAdapter.request('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    request.cancel();
    jest.advanceTimersByTime(2001);

    await expect(request.resolve()).rejects.toBeTruthy();
  });
})
