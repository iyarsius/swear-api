import { ISizeConvesion } from "../typing/Sizings";

// Store all sizes conversions
export = [
    {
        name: "baby",
        tickers: [ "TD", "C" ],
        sizes: [
            { sizeUS: "1", sizeEU: "16", sizeUK: "0.5" },
            { sizeUS: "1.5", sizeEU: "16.5", sizeUK: "1" },
            { sizeUS: "2", sizeEU: "17", sizeUK: "1.5" },
            { sizeUS: "2.5", sizeEU: "18", sizeUK: "2" },
            { sizeUS: "3", sizeEU: "18.5", sizeUK: "2.5" },
            { sizeUS: "3.5", sizeEU: "19", sizeUK: "3" },
            { sizeUS: "4", sizeEU: "19.5", sizeUK: "3.5" },
            { sizeUS: "4.5", sizeEU: "20", sizeUK: "4" },
            { sizeUS: "5", sizeEU: "21", sizeUK: "4.5" },
            { sizeUS: "5.5", sizeEU: "21.5", sizeUK: "5" },
            { sizeUS: "6", sizeEU: "22", sizeUK: "5.5" },
            { sizeUS: "6.5", sizeEU: "22.5", sizeUK: "6" },
            { sizeUS: "7", sizeEU: "23.5", sizeUK: "6.5" },
            { sizeUS: "7.5", sizeEU: "24", sizeUK: "7" },
            { sizeUS: "8", sizeEU: "25", sizeUK: "7.5" },
            { sizeUS: "8.5", sizeEU: "25.5", sizeUK: "8" },
            { sizeUS: "9", sizeEU: "26", sizeUK: "8.5" },
            { sizeUS: "9.5", sizeEU: "26.5", sizeUK: "9" },
            { sizeUS: "10", sizeEU: "27", sizeUK: "9.5" },
        ]
    },
    {
        name: 'kids',
        tickers: ["C", "Y", 'PS'],
        sizes: [
            { sizeUS: "10.5", sizeEU: "27.5", sizeUK: "10" },
            { sizeUS: "11", sizeEU: "28", sizeUK: "10.5" },
            { sizeUS: "11.5", sizeEU: "28.5", sizeUK: "11" },
            { sizeUS: "12", sizeEU: "29.5", sizeUK: "11.5" },
            { sizeUS: "12.5", sizeEU: "30", sizeUK: "12" },
            { sizeUS: "13", sizeEU: "31", sizeUK: "12.5" },
            { sizeUS: "13.5", sizeEU: "31.5", sizeUK: "13" },
            { sizeUS: "1", sizeEU: "32", sizeUK: "13.5" },
            { sizeUS: "1.5", sizeEU: "33", sizeUK: "1" },
            { sizeUS: "2", sizeEU: "33.5", sizeUK: "1.5" },
            { sizeUS: "2.5", sizeEU: "34", sizeUK: "2" },
            { sizeUS: "3", sizeEU: "35", sizeUK: "2.5" },
        ],
    },
    {
        name: 'infant',
        tickers: ["Y", "GS"],
        sizes: [
            { sizeUS: "3.5", sizeEU: "35.5", sizeUK: "3" },
            { sizeUS: "4", sizeEU: "36", sizeUK: "3.5" },
            { sizeUS: "4.5", sizeEU: "36.5", sizeUK: "4" },
            { sizeUS: "5", sizeEU: "37.5", sizeUK: "4.5" },
            { sizeUS: "5.5", sizeEU: "38", sizeUK: "5" },
            { sizeUS: "6", sizeEU: "38.5", sizeUK: "5.5" },
            { sizeUS: "6.5", sizeEU: "39", sizeUK: "6" },
            { sizeUS: "7", sizeEU: "40", sizeUK: "6.5" },
        ],
    },
    {
        name: "men",
        tickers: [""],
        sizes: [
            { sizeUS: "3.5", sizeEU: "35.5", sizeUK: "3" },
            { sizeUS: "4", sizeEU: "36", sizeUK: "3.5" },
            { sizeUS: "4.5", sizeEU: "36.5", sizeUK: "4" },
            { sizeUS: "5", sizeEU: "37.5", sizeUK: "4.5" },
            { sizeUS: "5.5", sizeEU: "38", sizeUK: "5" },
            { sizeUS: "6", sizeEU: "38.5", sizeUK: "5.5" },
            { sizeUS: "6.5", sizeEU: "39", sizeUK: "6" },
            { sizeUS: "7", sizeEU: "40", sizeUK: "6" },
            { sizeUS: "7.5", sizeEU: "40.5", sizeUK: "7" },
            { sizeUS: "8", sizeEU: "41", sizeUK: "7" },
            { sizeUS: "8.5", sizeEU: "42", sizeUK: "7.5" },
            { sizeUS: "9", sizeEU: "42.5", sizeUK: "8" },
            { sizeUS: "9.5", sizeEU: "43", sizeUK: "8.5" },
            { sizeUS: "10", sizeEU: "44", sizeUK: "9" },
            { sizeUS: "10.5", sizeEU: "44.5", sizeUK: "9.5" },
            { sizeUS: "11", sizeEU: "45", sizeUK: "10" },
            { sizeUS: "11.5", sizeEU: "45.5", sizeUK: "10.5" },
            { sizeUS: "12", sizeEU: "46", sizeUK: "11" },
            { sizeUS: "12.5", sizeEU: "47", sizeUK: "11.5" },
            { sizeUS: "13", sizeEU: "47.5", sizeUK: "12" },
            { sizeUS: "13.5", sizeEU: "48", sizeUK: "12.5" },
            { sizeUS: "14", sizeEU: "48.5", sizeUK: "13" },
            { sizeUS: "14.5", sizeEU: "49", sizeUK: "13.5" },
            { sizeUS: "15", sizeEU: "49.5", sizeUK: "14" },
            { sizeUS: "15.5", sizeEU: "50", sizeUK: "14.5" },
            { sizeUS: "16", sizeEU: "50.5", sizeUK: "15" },
            { sizeUS: "16.5", sizeEU: "51", sizeUK: "15.5" },
            { sizeUS: "17", sizeEU: "51.5", sizeUK: "16" },
            { sizeUS: "17.5", sizeEU: "52", sizeUK: "16.5" },
            { sizeUS: "18", sizeEU: "52.5", sizeUK: "17" },
            { sizeUS: "18.5", sizeEU: "53", sizeUK: "17.5" },
            { sizeUS: "19", sizeEU: "53.5", sizeUK: "18" },
            { sizeUS: "19.5", sizeEU: "54", sizeUK: "18.5" },
            { sizeUS: "20", sizeEU: "54.5", sizeUK: "19" },
            { sizeUS: "20.5", sizeEU: "55", sizeUK: "19.5" },
            { sizeUS: "21", sizeEU: "55.5", sizeUK: "20" },
            { sizeUS: "21.5", sizeEU: "56", sizeUK: "20.5" },
            { sizeUS: "22", sizeEU: "56.5", sizeUK: "21" }
        ],
    },
    {
        name: "women",
        tickers: ["W", "WMNS"],
        sizes: [
            { sizeUS: "5", sizeEU: "35.5", sizeUK: "3" },
            { sizeUS: "5.5", sizeEU: "36", sizeUK: "3.5" },
            { sizeUS: "6", sizeEU: "36.5", sizeUK: "4" },
            { sizeUS: "6.5", sizeEU: "37.5", sizeUK: "4.5" },
            { sizeUS: "7", sizeEU: "38", sizeUK: "5" },
            { sizeUS: "7.5", sizeEU: "38.5", sizeUK: "5.5" },
            { sizeUS: "8", sizeEU: "39", sizeUK: "6" },
            { sizeUS: "8.5", sizeEU: "40", sizeUK: "6" },
            { sizeUS: "9", sizeEU: "40.5", sizeUK: "7" },
            { sizeUS: "9.5", sizeEU: "41", sizeUK: "7" },
            { sizeUS: "10", sizeEU: "42", sizeUK: "7.5" },
            { sizeUS: "10.5", sizeEU: "42.5", sizeUK: "8" },
            { sizeUS: "11", sizeEU: "43", sizeUK: "8.5" },
            { sizeUS: "11.5", sizeEU: "44", sizeUK: "9" },
            { sizeUS: "12", sizeEU: "44.5", sizeUK: "9.5" },
            { sizeUS: "12.5", sizeEU: "45", sizeUK: "10" },
            { sizeUS: "13", sizeEU: "45.5", sizeUK: "10.5" },
            { sizeUS: "13.5", sizeEU: "46", sizeUK: "11" },
            { sizeUS: "14", sizeEU: "47", sizeUK: "11.5" },
            { sizeUS: "14.5", sizeEU: "47.5", sizeUK: "12" },
            { sizeUS: "15", sizeEU: "48", sizeUK: "12.5" },
            { sizeUS: "15.5", sizeEU: "48.5", sizeUK: "13" },
            { sizeUS: "16", sizeEU: "49", sizeUK: "13.5" },
            { sizeUS: "16.5", sizeEU: "49.5", sizeUK: "14" },
            { sizeUS: "17", sizeEU: "50", sizeUK: "14.5" },
            { sizeUS: "17.5", sizeEU: "50.5", sizeUK: "15" },
            { sizeUS: "18", sizeEU: "51", sizeUK: "15.5" },
            { sizeUS: "18.5", sizeEU: "51.5", sizeUK: "16" },
            { sizeUS: "19", sizeEU: "52", sizeUK: "16.5" },
            { sizeUS: "19.5", sizeEU: "52.5", sizeUK: "17" },
            { sizeUS: "20", sizeEU: "53", sizeUK: "17.5" },
            { sizeUS: "20.5", sizeEU: "53.5", sizeUK: "18" },
            { sizeUS: "21", sizeEU: "54", sizeUK: "18.5" },
            { sizeUS: "21.5", sizeEU: "54.5", sizeUK: "19" },
            { sizeUS: "22", sizeEU: "55", sizeUK: "19.5" },
            { sizeUS: "22.5", sizeEU: "55.5", sizeUK: "20" },
            { sizeUS: "23", sizeEU: "56", sizeUK: "20.5" },
            { sizeUS: "23.5", sizeEU: "56.5", sizeUK: "21" }
        ],
    }
] as ISizeConvesion[];