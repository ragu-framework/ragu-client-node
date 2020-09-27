# Ragu Client Node

![Ragu](https://github.com/ragu-framework/ragu-client-node/workflows/Ragu/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ragu-framework/ragu-client-node/badge.svg?branch=main)](https://coveralls.io/github/ragu-framework/ragu-client-node?branch=main)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![npm version](https://badge.fury.io/js/ragu-client-node.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## A client for Ragu Server

You may need to fetch you micro-frontends at the server-side. 
This client is make for it!

## Installation

```shell script
$ npm install ragu-client-node
```

## Usage

```javascript
import RaguClient from 'ragu-client-node';

const client = new RaguClient();
const component = await client.fetchComponent('https://a-squad-ragu-server.organization.com/components/hello-world');

component.stylesheets(); // <style src="https://a-squad-ragu-server.organization.com/assets/hello-world.css"> 

component.html(); // html-content-from-server

component.toRaguDOM(); // <ragu-component src="https://a-squad-ragu-server.organization.com/components/hello-world">...html-content-from-server</ragu-component>
```

### Fetch API

To be isomorphic friendly and dependency-free, Ragu Client Node uses fetch API.
As node does not implement fetch API you will need a polyfill, such as 
[cross-fetch](https://github.com/lquixada/cross-fetch) and [abort-controller](https://github.com/mysticatea/abort-controller). 

```shell script
$ npm install cross-fetch abort-controller
```

Registering polyfill:

```javascript
require('cross-fetch/polyfill');
require('abort-controller/polyfill');
```  

### Ragu Node Client + Axios

If you already use axios as HTTP client you could use the ragu axios client.

```javascript
import {RaguClient} from "ragu-node-client";
import {AxiosRequestAdapter} from "ragu-node-client/adapters/axios";

const client = new RaguClient({
  requestAdapter: new AxiosRequestAdapter()
});
```

### Timout

You can specify a request timeout. The default is `5000ms`.
When a timeout occurs the `fetchComponent` promise will be reject with a `new Error('Timeout')` error.

```javascript
const client = new RaguClient({
  timeout: 1000
});
```
