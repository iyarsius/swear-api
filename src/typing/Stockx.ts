import { IShoeSize } from "./Sizings";

export interface IStockx {
    name: string;
    description: string;
    category?: string;
    url: string;
    uuid: string;
    seller: string;
    colorway: string;
    lastSale?: number;
    salesLast72Hours?: number;
    totalSales?: number;
    retail?: number;
    sku?: string;
    releaseDate?: string;
    ticker?: string;
    markets: IStockxProductMarket[];
}

export interface IProductQueryResponse {
    products: IStockxProduct[];
    totalProducts: number;
    sneakers: number;
    collectibles: number;
    apparel: number;
    accessories: number;
    tradingCards: number;
    electronics: number;
    nft: number;
}

export interface IPartialStockxProduct {
    name: string;
    description: string;
    url: string;
    id: string;
    sku: string;
    seller: string;
    colorway: string;
    markets: IStockxProductMarket[];
};

export interface IStockxProduct extends IPartialStockxProduct {
    category?: string;
    ticker?: string;
    lastSale?: number;
    salesLast72Hours?: number;
    totalSales?: number;
    retail?: number;
    releaseDate?: string;
    imageURL(heigth?: number, width?:number): string;
    fetch(): Promise<IStockxProduct>;
    relatedProducts(): Promise<IStockxProduct[]>;
};

export interface IStockxProductMarket {
    sizing: IShoeSize
    lowestAsk: number;
    highestBid: number;
    lastSale: number;
    totalSales: number;
    salesLast72Hours: number;
};