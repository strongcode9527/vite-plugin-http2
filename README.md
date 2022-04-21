![vite-http2.jpg](http://tva1.sinaimg.cn/large/005KcNyUly1gzhr1ei0b4j30gj04hjrg.jpg)

[](https://)

> npm i vite-plugin-http2


vite-plugin-http2 is a vite plugin to solve [the option "proxy" and "http2" conflict.](https://github.com/vitejs/vite/issues/484)

this plugin can solve the following difficulties:

- The HTTPS certificate will be automatically generated for you and the configuration will be automatically modified
- use http2-proxy to implement agent function

```javascript
// vite.config.js

import http2 from 'vite-plugin-http2';

export default {
    plugins: [
        http2 ({
            // if you just use localhost, This configuration can be ignored
            certificateDomain: ['my-test.xxx.com'],
            proxy: {
                '^/api': {
                    hostname: 'localhost',
                    port: 7001,
                    async onReq(req, options) {
                        options.path = `/prefix/${options.path}`;
                    }
                }
            },
            // if devcert create certificate fail，you can pass your ssl option
            ssl: {
                key: '',
                cert: '',
            }
        }),
    ]
};

```


| key               | desc                                                                                        | default       |
| ------------------|---------------------------------------------------------------------------------------------| --------------- |
| proxy             | proxy [http2-proxy options](https://github.com/nxtedition/node-http2-proxy#options)         | -             |
| certificateDomain | [HTTPS certificate domain name](https://github.com/davewasmer/devcert#multiple-domains-san) | ['localhost'] |
| ssl               | if devcert create certificate fail，you can pass your ssl option                             | -              | 
