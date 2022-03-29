import { BaseScraper } from "../BaseScraper";
import { IScraperConfig } from "../../typing/BaseScraper";
import { StockxProduct } from "./structures/StockxProduct";

export class Stockx {
    private scraper: BaseScraper;

    constructor(config: IScraperConfig) {
        this.scraper = new BaseScraper(config);
    };

    // Get stockx product from SKU or keywords
    async searchProducts(input: string, productsToRetrieve: number = 1): Promise<StockxProduct[]> {
        // remove all non-alphanumeric characters except spaces
        input = input.replace(/[^a-zA-Z0-9 ]/g, '');

        const url = `https://stockx.com/api/browse?_search=${input.replaceAll(' ', "%20")}&page=1&resultsPerPage=${productsToRetrieve}&dataType=product&facetsToRetrieve[]=browseVerticals&propsToRetrieve[][]=brand&propsToRetrieve[][]=colorway&propsToRetrieve[][]=media.thumbUrl&propsToRetrieve[][]=title&propsToRetrieve[][]=productCategory&propsToRetrieve[][]=shortDescription&propsToRetrieve[][]=urlKey&propsToRetrieve[][]=traits`

        const products = await this.scraper.get(url).then(res => JSON.parse(res).Products);

        return products.map(product => {
            return new StockxProduct({
                name: product.title,
                description: product.shortDescription,
                url: `https://stockx.com/${product.urlKey}`,
                id: product.objectID,
                sku: product.traits.find(t => t.name === "Style")?.value,
                seller: product.brand,
                colorway: product.colorway,
                markets: []
            }, this.scraper);
        });
    }
}