import { IGoatProductMarket, IPartialGoatProduct, IGoatConditionMarket } from "../../../typing/Goat";
import { BaseScraper } from "../../BaseScraper";
import sizes from "../../../data/sizes";

export class GoatProduct {
    private scraper: BaseScraper;
    public imageURL: () => string;
    public name: string;
    public description: string;
    public seller: string;
    public releaseDate: string;
    public url: string;
    public category: string;
    public id: string;
    public sku: string;
    public colorway: string;
    public lowestAsk: number;
    public ticker: string;
    public markets: IGoatProductMarket[];

    constructor(data: IPartialGoatProduct, scraper: BaseScraper) {
        this.name = data.name;
        this.url = data.url;
        this.sku = data.sku;
        this.id = data.id;
        this.category = data.category;
        this.colorway = data.colorway;
        this.markets = data.markets;
        this.scraper = scraper;
        this.imageURL = data.imageURL
    }

    async fetch() {
        // extract ticker from product name
        const nameWords = this.name.toUpperCase().split(' ');
        const ticker = nameWords.find(word => sizes.find(size => size.tickers.includes(word)));

        this.ticker = "";
        if (ticker) {
            this.ticker = ticker;
        };

        // randomize referer
        const random = Math.random() >= 0.5;
        let additionnalHeaders = [
            ["Accept", "application/json"],
        ];

        // generate accept-language header from country code
        switch (this.scraper.countryCode) {
            case "US":
                additionnalHeaders.push(["accept-language", "en-US,en;q=0.9"]);
                break;
            case "GB":
                additionnalHeaders.push(["accept-language", "en-GB,en;q=0.9"]);
                break;
            case "CA":
                additionnalHeaders.push(["accept-language", "en-CA,en;q=0.9"]);
                break;
            case "FR":
                additionnalHeaders.push(["accept-language", "fr-FR,fr;q=0.9"]);
                break;
            case "DE":
                additionnalHeaders.push(["accept-language", "de-DE,de;q=0.9"]);
                break;
            default: additionnalHeaders.push(["accept-language", "en-US,en;q=0.9"]);
        }

        const headers = [
            `GOAT/2.51.0 (iPad: iOS 13.3; Scale/2.00) Locale/${this.scraper.countryCode.toLowerCase()}`,
            `GOAT/2.51.0 (iPad: iOS 15.0.2; Scale/2.00) Locale/${this.scraper.countryCode.toLowerCase()}`,
            `GOAT/2.51.0 (iPhone: iOS 13.3; Scale/2.00) Locale/${this.scraper.countryCode.toLowerCase()}`,
            `GOAT/2.51.0 (iPhone: iOS 15.0.2; Scale/2.00) Locale/${this.scraper.countryCode.toLowerCase()}`
        ]

        // add random header
        additionnalHeaders.push(["user-agent", headers[Math.floor(Math.random() * headers.length)]]);

        this.scraper.addCookieValue("currency", this.scraper.currencyCode);

        const algoliaPayload = {
            "query": "",
            "facetFilters": [`product_template_id:${this.id}`],
        };

        const requests = await Promise.all([
            this.scraper.get(
                `https://www.goat.com/api/v1/product_variants/buy_bar_data?productTemplateId=${this.id}&countryCode=${this.scraper.countryCode}`,
                additionnalHeaders
            ).then(JSON.parse),
            this.scraper.post(
                `https://2fwotdvm2o-dsn.algolia.net/1/indexes/product_variants_v2/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.10.5)%3B%20Browser%20(lite)&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a&x-algolia-application-id=2FWOTDVM2O`,
                JSON.stringify(algoliaPayload),
                [["X-Alg-PT", "1"], ["X-Content-Type-Options", "nosniff"]],
            ).then(JSON.parse),
        ])
        // Get variants
        const response = requests[0];
        const algoliaResponse = requests[1].hits[0];

        this.releaseDate = algoliaResponse.release_date.split('T')[0];
        this.description = algoliaResponse.story_html;
        this.seller = algoliaResponse._highlightResult.brand_name.value;

        // Parse variants into markets
        response.map(variant => {
            // check if variant size is already in markets
            const market = this.markets.find(market => market.sizing?.sizeUS === variant.sizeOption.presentation);

            if (market) {
                market.conditions.push({
                    itemCondition: variant.shoeCondition,
                    boxCondition: variant.boxCondition,
                    lastSale: variant.lastSoldPriceCents,
                    lowestAsk: variant.lowestPriceCents,
                    stockStatus: variant.stockStatus
                });
            } else {
                const sizing = this.scraper.convertSize(variant.sizeOption.presentation, 'US', this.ticker);

                this.markets.push({
                    sizing,
                    conditions: [{
                        itemCondition: variant.shoeCondition,
                        boxCondition: variant.boxCondition,
                        lastSale: variant.lastSoldPriceCents,
                        lowestAsk: variant.lowestPriceCents,
                        stockStatus: variant.stockStatus
                    }]
                });
            };
        });

        const asks = response.map(variant => variant.lowestPriceCents.amount);

        // find lowest price in markets;
        this.lowestAsk = asks.sort((a, b) => a - b)[0] / 100;

        return this;
    };

    async relatedProducts(productsToRetrieve: number = 15) {
        const response = await this.scraper.get(`https://www.goat.com/api/v1/product_templates/recommended?count=${productsToRetrieve}&productTemplateId=${this.id}`).then(JSON.parse);

        const products = response.productTemplates;
        return products.map(product => new GoatProduct({
            name: product.name,
            id: product.id,
            category: product.productType,
            colorway: product.details,
            imageURL: product.pictureUrl,
            sku: product.sku,
            url: `https://www.goat.com/${product.productType}/${product.slug}`,
            markets: []

        }, this.scraper));
    }
}