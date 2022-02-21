import type { Plugin } from 'vite';
import type { http1WebOptions } from 'http2-proxy';
const devcert = require('devcert');

const http2Proxy = require('http2-proxy');



type OptionsTypes = {
    proxy?: { [key: string]: http1WebOptions } | undefined,
    certificateDomain?: string | string[] | undefined
}

export default (options?: OptionsTypes): Plugin => {
    return {
        name: 'vite-plugin-http2',
        config: async () => {
            let ssl;
            // 生成证书必须包含 localhost 所以做一下处理

            try {
                ssl = await devcert.certificateFor(options?.certificateDomain || ['localhost']);
            } catch (err) {
                console.error('vite-plugin-http2', err);
            }
            if (ssl) {
                return {
                    server: {
                        https: {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            key: ssl.key,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            cert: ssl.cert,
                        }
                    }
                };
            }
            return {};
        },
        configureServer: async (server) => {
            if (options?.proxy) {
                server.middlewares.use((req, res, next) => {
                    // 如果有一个配置命中请求，进行转发处理
                    for (const [regexp, proxyOptions] of Object.entries(options.proxy)) {
                        const re = new RegExp(regexp);
                        if (req.url && re.test(req.url)) {
                            http2Proxy.web(
                                req,
                                res,
                                proxyOptions,
                                err => err && next(err)
                            );
                            return;
                        }
                    }
                    // 当没有命中代理的时候，直接丢到下一个中间件
                    next();
                });
            }
        },
    };
};
