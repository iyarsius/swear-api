import { IShoeSize } from "./Sizings";

export interface IPartialGoatProduct {
    name: string;
    condition: string;
    url: string;
    id: string;
    category: string;
    colorway: string;
    imageURL: string;
    markets: IGoatProductMarket[];
};

export interface IGoatProduct extends IPartialGoatProduct {
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