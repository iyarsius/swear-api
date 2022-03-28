import { BaseScraper } from "./scrapers/BaseScraper";
import { IScraperConfig } from "./typing/BaseScraper";
import { Stockx } from "./scrapers/stockx";
import { Goat } from "./scrapers/goat";

export class HypeScraper extends BaseScraper {
    public stockx: Stockx;
    public goat: Goat;

    constructor(config: IScraperConfig) {     
        super(config);
        this.stockx = new Stockx(config);
        this.goat = new Goat(config);
    };
}