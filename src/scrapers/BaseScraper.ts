import fetch, { RequestInit } from 'node-fetch'
import { IScraperConfig, IScraperProxy } from '../typing/BaseScraper';
import { HttpsProxyAgent } from 'https-proxy-agent';
import UserAgent from "user-agents";
import sizes from '../data/sizes';
import { IShoeSize } from '../typing/Sizings'

export class BaseScraper {
    public cookie: string;
    public proxyList: IScraperProxy[];
    public timeout: number = 10000;
    public retry: number = 0;
    public retryDelay: number = 1000;
    public userAgent: string | undefined;
    public lastUrl: string = '';
    public countryCode: string = "US";
    public currencyCode: string = "USD";

    constructor(config: IScraperConfig) {
        this.cookie = '';
        if (config.proxyList) {
            this.proxyList = config.proxyList.map(proxy => this._parseProxy(proxy));
        } else {
            this.proxyList = [];
        };

        if (config.timeout) {
            this.timeout = config.timeout;
        }

        if (config.retry) {
            this.retry = config.retry;
        }

        if (config.retryDelay) {
            this.retryDelay = config.retryDelay;
        }

        if (config.userAgent) {
            this.userAgent = config.userAgent;
        }

        if (config.countryCode) {
            this.countryCode = config.countryCode;
        }

        if (config.currencyCode) {
            this.currencyCode = config.currencyCode;
        }
    };

    // Get proxy host, port username and password from format http://username:password@host:port
    private _parseProxy(proxy: string): IScraperProxy {
        proxy = proxy.replace(/^http:\/\//, '');
        const proxyParts = proxy.split('@');
        const proxyHost = proxyParts[1].split(':');
        const proxyUser = proxyParts[0].split(':');
        return {
            host: proxyHost[0],
            port: parseInt(proxyHost[1]),
            username: proxyUser[0],
            password: proxyUser[1]
        }
    };

    // Get proxy from proxy list and rotate proxy list
    private _getProxy(): IScraperProxy | undefined {
        const proxy = this.proxyList.shift();
        if (proxy) {
            this.proxyList.push(proxy);
        }
        return proxy;
    };

    // Stop code execution for ms milliseconds
    private _sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // Generate headers for request
    private _getHeaders(customHeaders?: string[][]): string[][] {
        const headers: string[][] = [
            ['user-agent', this.userAgent || new UserAgent().toString()],
            ['accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'],
            ['accept-language', 'en-US,en;q=0.9'],
            ['cache-control', 'max-age=0'],
            ['connection', 'keep-alive'],
            ['upgrade-insecure-requests', '1'],
            ['pragma', 'no-cache'],
            ['referer', this.lastUrl]
        ];

        if (this.cookie !== '') {
            headers.push(['Cookie', this.cookie]);
        };

        // Add custom headers or replace existing headers by his custom value
        if (customHeaders) {
            customHeaders.forEach(header => {
                const index = headers.findIndex(h => h[0] === header[0]);
                if (index !== -1) {
                    headers[index] = header;
                } else {
                    headers.push(header);
                }
            });
        }

        return headers
    }

    // Get cookie value with key
    getCookieValue(key: string): string {
        // split cookie string by ; or Path=/; or Path=/,
        const cookies = this.cookie.replaceAll('Path=/,', '').split(';');

        for (const cookie of cookies) {
            const cookieParts = cookie.split('=');
            if (cookieParts[0].trim() === key) {
                return cookieParts[1].trim();
            }
        }
        return undefined;
    };

    // Add cookie value with key
    addCookieValue(key: string, value: string) {
        if (this.cookie === '') {
            this.cookie = `${key}=${value}`;
        } else {
            this.cookie += `; ${key}=${value}`;
        }
    };

    // Convert shoes size
    convertSize(size: string, sizyType: string, ticker?: string): IShoeSize {
        if (!ticker) ticker = '';

        const sizeConversion = sizes.find(s => s.tickers.includes(ticker));

        if (!sizeConversion) {
            throw new Error(`No size conversion found for ticker: ${ticker}`);
        }

        // Check if size is clothing size
        const clothingSizes = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL' ];
        const clothingSize = clothingSizes.find(s => s === size);

        if (clothingSize) {
            return {
                sizeUS: size,
                sizeEU: size,
                sizeUK: size
            }
        };

        switch (sizyType.toLowerCase()) {
            case 'us': {
                const sizing = sizeConversion.sizes.find(s => s.sizeUS === size);
                return sizing ? sizing : { sizeUS: size, sizeEU: "unknown", sizeUK: "unknown" };
            }
            case 'eu': {
                const sizing = sizeConversion.sizes.find(s => s.sizeEU === size);
                return sizing ? sizing : { sizeUS: "unknown", sizeEU: size, sizeUK: "unknown" };
            }
            case 'uk': {
                const sizing = sizeConversion.sizes.find(s => s.sizeUK === size);
                return sizing ? sizing : { sizeUS: "unknown", sizeEU: "unknown", sizeUK: size };
            }
            default:
                throw new Error(`Unknown size type: ${sizyType}`);
        }
    }

    // Send Get request to url and return html
    async get(url: string, additionnalHeaders?: string[][], retryed?: number): Promise<string> {
        try {
            this.lastUrl = url;

            // Setup request options
            const headers = this._getHeaders(additionnalHeaders);

            const proxy = this._getProxy();
            const options: RequestInit = {
                method: 'GET',
                headers: headers,
                agent: proxy ? new HttpsProxyAgent({
                    host: proxy.host,
                    port: proxy.port,
                    auth: proxy.username ? proxy.username + ':' + proxy.password : undefined
                }) : undefined,
                follow: 0,
            };

            // Wait for response or timeout
            const timeout = setTimeout(() => {
                throw new Error('Timeout')
            }, this.timeout);

            const response = await fetch(url, options).then(res => {
                clearTimeout(timeout);

                if (res.status !== 200) {
                    throw new Error(`Response status: ${res.status} at url: ${url}`);
                }
                return res
            });

            // Fetch cookie and save it
            const cookie = response.headers.get('set-cookie');
            if (cookie) {
                this.cookie = cookie;
            };

            // Get html
            const html = await response.text();

            return html;
        } catch (error) {
            // Retry if retry is enabled
            if (retryed && retryed >= this.retry) {
                await this._sleep(this.retryDelay);
                this.get(url, additionnalHeaders, retryed + 1);
            }
            throw error;
        }
    };

    // Send Post request to url and return html
    async post(url: string, data: string, additionnalHeaders?: string[][], retryed?: number): Promise<string> {
        try {
            this.lastUrl = url;

            // Setup request options
            const headers = this._getHeaders(additionnalHeaders);
            const proxy = this._getProxy();

            const options: RequestInit = {
                method: 'POST',
                headers: headers,
                body: data,
                agent: proxy ? new HttpsProxyAgent({
                    host: proxy.host,
                    port: proxy.port,
                    auth: proxy.username ? proxy.username + ':' + proxy.password : undefined
                }) : undefined,
                follow: 0,
            };

            // Wait for response or timeout
            const timeout = setTimeout(() => {
                throw new Error('Timeout')
            }, this.timeout);

            const response = await fetch(url, options).then(res => {
                clearTimeout(timeout);
                if (res.status !== 200) {
                    throw new Error(`Status code: ${res.status} at url: ${url}`);
                }
                return res
            });

            // Fetch cookie and save it
            const cookie = response.headers.get('set-cookie');
            if (cookie) {
                this.cookie = cookie;
            };

            // Get html
            const html = await response.text();

            return html;
        } catch (error) {
            // Retry if retry is enabled
            if (retryed && retryed >= this.retry) {
                await this._sleep(this.retryDelay);
                this.post(url, data, additionnalHeaders, retryed + 1);
            }
            throw error;
        }
    };

    // reset cookie
    resetCookie() {
        this.cookie = '';
    };
}