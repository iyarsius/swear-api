import { IScraperConfig } from "./typing/BaseScraper";
import { Stockx } from "./scrapers/stockx";
import { Goat } from "./scrapers/goat";

export class SwearApi {
    public stockx: Stockx;
    public goat: Goat;

    constructor(config: IScraperConfig) {
        this.stockx = new Stockx(config);
        this.goat = new Goat(config);
    };
}