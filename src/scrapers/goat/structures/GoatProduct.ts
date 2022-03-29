import { IGoatProductMarket, IPartialGoatProduct, IGoatConditionMarket } from "../../../typing/Goat";
import { BaseScraper } from "../../BaseScraper";
import sizes from "../../../data/sizes";

export class GoatProduct {
    private scraper: BaseScraper;
    public name: string;
    public url: string;
    public id: string;
    public sku: string;
    public colorway: string;
    public imageURL: string;
    public ticker: string = '';
    public markets: IGoatProductMarket[];

    constructor(data: IPartialGoatProduct, scraper: BaseScraper) {
        this.name = data.name;
        this.url = data.url;
        this.sku = data.sku;
        this.id = data.id;
        this.colorway = data.colorway;
        this.markets = data.markets;
        this.scraper = scraper;
        this.imageURL = data.imageURL
    }

    async fetch() {
        // extract ticker from product name
        const nameWords = this.name.toUpperCase().split(' ');
        const ticker = nameWords.find(word => sizes.find(size => size.tickers.includes(word)));

        if (ticker) {
            this.ticker = ticker;
        };

        // randomize referer
        const random = Math.random() >= 0.5;
        let additionnalHeaders = [
            [ "referer", random ? "https://www.google.com/" : "https://www.goat.com/" ],
            [ "Accept", "application/json" ],
            [ "content-type", "application/json" ],
        ]

        // get csrf token from cookie if cookie exists and create header from it
        const csrfToken = this.scraper.getCookieValue('csrf');

        if (csrfToken) {
            additionnalHeaders.push(["x-csrf-token", csrfToken])
        }

        this.scraper.addCookieValue("currency", this.scraper.currencyCode);
        this.scraper.addCookieValue("country", this.scraper.countryCode);

        // Get variants
        const response = await this.scraper.get(
            `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${this.id}&countryCode=${this.scraper.countryCode}`,
            additionnalHeaders
        ).then(JSON.parse);

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

        return this;
    };
}