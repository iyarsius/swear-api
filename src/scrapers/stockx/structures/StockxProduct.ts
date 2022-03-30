import { IPartialStockxProduct, IStockxProductMarket } from "../../../typing/Stockx";
import { BaseScraper } from "../../BaseScraper";
import payloads from "../payloads";
import { IScraperConfig } from "../../../typing/BaseScraper";
import sizes from "../../../data/sizes";

export class StockxProduct {
    private scraper: BaseScraper;
    public name: string;
    public category: string;
    public description: string;
    public url: string;
    public id: string;
    public seller: string;
    public colorway: string;
    public lastSale: number;
    public salesLast72Hours: number;
    public totalSales: number;
    public retail: number;
    public sku: string;
    public releaseDate: string;
    public ticker: string;
    public markets: IStockxProductMarket[] = [];

    constructor(data: IPartialStockxProduct, scraper: BaseScraper) {
        this.scraper = scraper;
        this.name = data.name;
        this.description = data.description;
        this.url = data.url;
        this.id = data.id;
        this.seller = data.seller;
        this.colorway = data.colorway;
        this.sku = data.sku;
    }

    // Generate image url from id
    imageURL(heigth?: number, width?: number): string {
        heigth = heigth ? heigth : 500;
        width = width ? width : 700;
        return `https://images.stockx.com/images/${this.id}.jpg?fit=fill&bg=FFFFFF&w=${width}&h=${heigth}&auto=format&trim=color&q=90&dpr=1`;
    };

    // fetch product details and markets
    async fetch(): Promise<StockxProduct> {
        const url = 'https://stockx.com/p/e';

        // get date in DD.MM.YYYY format
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dateString = `${day}.${month}.${year}`;
        const data = {
            operationName: "GetProduct",
            variables: {
                id: this.id,
                currencyCode: this.scraper.currencyCode,
                countryCode: this.scraper.countryCode,
            },
            query: payloads.GetProduct
        }

        // get product markets
        const response = await this.scraper.post(url, JSON.stringify(data), [
            ['apollographql-client-name', 'Iron'],
            ['apollographql-client-version', dateString],
            ["content-type", "application/json"]
        ]).then(res => JSON.parse(res).data.product);

        this.lastSale = response.market.salesInformation.lastSale;
        this.category = response.productCategory;
        this.salesLast72Hours = response.market.salesInformation.salesLast72Hours;
        this.totalSales = response.market.deadStock.sold;
        this.retail = parseInt(response.traits.find(t => t.name === "Retail Price")?.value);
        this.sku = response.traits.find(t => t.name === "Style")?.value;
        this.releaseDate = response.traits.find(t => t.name === "Release Date")?.value;
        this.description = response.description;

        // extract ticker from product name
        let startIndex = 0
        while (typeof(this.ticker) === 'undefined') {
            const ticker = this.name.slice(startIndex).match(/\(([^)]+)\)/);
            if (ticker) {
                // find ticker in sizes
                const tickerSize = sizes.find(s => s.tickers.includes(ticker[1]));
                if (tickerSize) {
                    this.ticker = ticker[1];
                }
                startIndex = this.name.indexOf(ticker[0]) + ticker[0].length;
            } else {
                this.ticker = '';
            }
        }

        // get product markets
        this.markets = response.variants.map(v => {
            // Delete ticker form baseSize
            const size = v.sizeChart.baseSize.replace(`${this.ticker}`, '');

            // get size conversions
            const sizing = this.scraper.convertSize(size, v.sizeChart.baseType.includes('us') ? "us" : "eu", this.ticker);

            return {
                sizing: sizing ? sizing : { sizeUS: "", sizeEU: "", sizeUK: "" },
                highestBid: v.market.bidAskData.highestBid,
                lowestAsk: v.market.bidAskData.lowestAsk,
                lastSale: v.market.salesInformation.lastSale,
                totalSales: v.market.deadStock.sold,
                salesLast72Hours: v.market.salesInformation.salesLast72Hours
            } as IStockxProductMarket;
        });

        return this;
    };

    // get related products
    async relatedProducts(): Promise<StockxProduct[]> {
        const url = 'https://stockx.com/p/e';

        // get date in DD.MM.YYYY format
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        const data = {
            operationName: "FetchRelatedProducts",
            variables: {
                currencyCode: this.scraper.currencyCode,
                countryCode: this.scraper.countryCode,
                type: 'RELATED',
                productId: this.id
            },
            query: payloads.FetchRelatedProducts
        };

        const response = await this.scraper.post(url, JSON.stringify(data), [
            ['apollographql-client-name', 'Iron'],
            ['apollographql-client-version', dateString],
            ["content-type", "application/json"]
        ]).then(res => JSON.parse(res).data.product.related.edges);

        // parse products from response
        const products = response.map(r => {
            const product = r.node;
            return {
                name: product.title,
                description: product.description,
                url: `https://stockx.com/${product.urlKey}`,
                id: product.id,
                seller: product.brand,
                colorway: product.traits.find(t => t.name === "Colorway")?.value,
                markets: []
            } as IPartialStockxProduct;
        });

        return products.map(p => new StockxProduct(p, this.scraper));
    };
}