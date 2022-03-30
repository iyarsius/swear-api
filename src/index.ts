import { IScraperConfig } from "./typing/BaseScraper";
import { Stockx } from "./scrapers/stockx";
import { Goat } from "./scrapers/goat";
import { BaseScraper } from "./scrapers/BaseScraper";
import { IShoeSize } from "./typing/Sizings";

export class SwearApi {
    public stockx: Stockx;
    public goat: Goat;
    private scraper: BaseScraper;
    public convertSize: (size: string, sizeType: string, ticker: string) => IShoeSize;

    constructor(config: IScraperConfig) {
        this.stockx = new Stockx(config);
        this.goat = new Goat(config);
        this.scraper = new BaseScraper(config);
        this.convertSize = this.scraper.convertSize;
    };
}