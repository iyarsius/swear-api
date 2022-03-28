export interface IScraperConfig {
    userAgent?: string;
    proxyList?: string[];
    timeout?: number;
    retry?: number;
    retryDelay?: number;
    countryCode?: "US" | "FR" | "ES" | "CA" | "DE" | "GB" | "IT" | "JP";
    currencyCode?: "USD" | "EUR" | "GBP" | "JPY";
}

export interface IScraperProxy {
    host: string;
    port: number;
    username?: string;
    password?: string;
}