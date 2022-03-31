import { IShoeSize } from "./Sizings";

export interface IPartialGoatProduct {
    name: string;
    url: string;
    sku: string;
    id: string;
    imageURL(): string;
    category: string;
    colorway: string;
    markets: IGoatProductMarket[];
};

export interface IGoatProduct extends IPartialGoatProduct {
    ticker?: string;
    fetch(): Promise<IGoatProduct>;
};

export interface IGoatConditionMarket {
    itemCondition: string;
    boxCondition: string;
    lastSale: number;
    lowestAsk: number;
    stockStatus: string; 
};

export interface IGoatProductMarket {
    sizing: IShoeSize;
    conditions: IGoatConditionMarket[];
};