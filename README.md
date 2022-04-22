[README for english](https://github.com/strongcode9527/vite-plugin-http2/blob/master/README-en.md)

![vite-http2.jpg](http://tva1.sinaimg.cn/large/005KcNyUly1gzhr1ei0b4j30gj04hjrg.jpg)

> npm i vite-plugin-http2


vite-plugin-http2 是一个 vite 插件，是为了解决 [vite 无法同时开启 proxy 代理以及 http2的问题](https://github.com/vitejs/vite/issues/484)

这个插件可以解决一下难题

- 使用 devcert 库自动生成 https 证书，并且自动配置在系统内部（第一次进入开发环境，需要输入密码将证书放入系统指定目录）
- 使用 http2-proxy 进行代理转发。

```javascript
// vite.config.js

import http2 from 'vite-plugin-http2';

export default {
    plugins: [
        http2 ({
            // 如果你的开发环境只是用 localhost 开发，这个配置项可以忽略
            certificateDomain: ['my-test.xxx.com'],
            proxy: {
                // 创建正则表达式的字符串，这里识别需要代理的接口
                '^/api': {
                    hostname: 'localhost',
                    port: 7001,
                    async onReq(req, options) {
                        // 如果路径需要修改，可以在这里修改添加
                        options.path = `/prefix/${options.path}`;
                    }
                }
            },
            // 如果 https 证书创建失败，可以自己创建，并在这里传入
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

使用过程中 https 证书创建失败，或出现诡异问题，可使用此命令清除证书创建的缓存。

重启开发环境后，便可重新创建 https 证书。

```
// mac

rm -rf ~/Library/"Application Support"/devcert/

```