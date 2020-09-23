import {ComponentResponse, RaguClient} from "./index";

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

  it('returns raw response from the server', async () => {
    const requestAdapter = jest.fn(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(requestAdapter).toBeCalledWith('https://ragu-cart-vuejs.herokuapp.com/components/cart', {timeout: 5000});
    expect(response.raw).toEqual(componentResponse);
  });

  it('get stylesheets returns a string with all link tags', async () => {
    const requestAdapter = jest.fn(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.stylesheets())
        .toEqual(`<link rel="stylesheet" href="https://cart.cdn.com/assets/style1.css"><link rel="stylesheet" href="https://cart.cdn.com/assets/style2.css">`);
  });

  it('gets the HTML', async () => {
    const requestAdapter = jest.fn(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.html())
        .toContain(`<div>Hello World</div>`);
  });

  it('adds the ssr script tag without the html', async () => {
    const expectedSSRJson: Partial<ComponentResponse> = {
      ...componentResponse
    };

    delete expectedSSRJson.html;

    const requestAdapter = jest.fn(() => Promise.resolve(componentResponse));

    const client = new RaguClient({requestAdapter});
    const response = await client.fetchComponent('https://ragu-cart-vuejs.herokuapp.com/components/cart');

    expect(response.html())
        .toContain(`<script data-ragu-ssr type="application/json">${JSON.stringify(expectedSSRJson)}</script>`);
  });
});
