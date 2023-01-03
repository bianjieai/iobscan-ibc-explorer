export interface IResponseHeatmapItem {
    price: number;
    price_growth_rate: number;
    price_trend: string;
    denom: string;
    chain: string;
    market_cap_value: string;
    transfer_volume_value: string;
}
export interface IResponseHeatmapTotalInfo {
    stablecoins_market_cap: string | number;
    total_market_cap: string | number;
    total_denom_number: string | number;
    market_cap_growth_rate: number | string;
    market_cap_trend: string;
    total_transfer_volume: string | number;
    atom_price: number | string;
    atom_dominance: number | string;
}
export interface IResponseHeatmapTotalInfoFormat extends IResponseHeatmapTotalInfo {
    market_cap_trend_desc: string;
}
export interface IResponseHeatmap {
    items: IResponseHeatmapItem[];
    total_info: IResponseHeatmapTotalInfo;
}
export interface ILegendInfo {
    currentLegend: number;
    currentLegendStatus: boolean;
}
