export interface IShoeSize {
    sizeUS: string;
    sizeEU: string;
    sizeUK: string;
}

export interface ISizeConvesion {
    name: string;
    tickers: string[];
    sizes: IShoeSize[];
}
