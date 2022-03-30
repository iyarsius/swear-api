import { IScraperConfig } from "../../typing/BaseScraper";
import { BaseScraper } from "../BaseScraper";
import { GoatProduct } from "./structures/GoatProduct";

export class Goat {
    private scraper: BaseScraper;

    constructor(config: IScraperConfig) {
        this.scraper = new BaseScraper(config);
    };

    // Get goat product list from SKU or keywords
    async searchProducts(input: string, productsToRetrieve: number = 1): Promise<GoatProduct[]> {
        // remove all non-alphanumeric characters except spaces
        input = input.replace(/[^a-zA-Z0-9 ]/g, '');

        const url = `https://pwcdauseo-zone.cnstrc.com/search/${input.replaceAll(' ', '%20')}?key=key_XT7bjdbvjgECO5d8&i=24978b78-b53a-4d04-9cf8-94248ed8d8f0&num_results_per_page=${productsToRetrieve}`

        const products = await this.scraper.get(url).then(res => JSON.parse(res).response.results);
        
        return products.map(product => {
            return new GoatProduct({
                name: product.value,
                url: `https://www.goat.com/${product.data.product_type}/${product.data.slug}`,
                id: product.data.id,
                sku: product.data.sku,
                colorway: product.data.color,
                condition: product.data.condition,
                category: product.product_type,
                imageURL: product.data.image_url,
                markets: []
            }, this.scraper);
        });
    }

    // Get goat product from SKU or keywords
    async getProduct(input: string): Promise<GoatProduct> {
        return await this.searchProducts(input, 1).then(products => products[0]);
    }
}