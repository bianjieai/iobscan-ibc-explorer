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

export interface IHeartmapDataItem {
    value: string;
    itemStyle: {
        color: string;
    };
    otherInfo: {
        prettyName: string;
        symbol: string;
        formatPrice: string;
        formatVolume: string;
        formatMarketCap: string;
        priceTrend: string;
        formatPriceGrowthRate: string;
        level: string;
    };
}

export interface IResponseTransferVolumeItem {
    chain: string;
    transfer_volume_in: string;
    transfer_volume_out: string;
    transfer_volume_total: string;
}

export interface ITransferVolumeItem extends IResponseTransferVolumeItem {
    pretty_name: string;
}

export interface IVolumeItem {
    datetime: string;
    value: string;
}

export interface IResponseTransferVolumeTrend {
    volume_in: IVolumeItem[];
    volume_out: IVolumeItem[];
    chain: string;
}

export interface IResponseDistribution {
    children: IResponseDistribution[];
    amount: string;
    denom: string;
    chain: string;
    hops: number;
}

export interface ISankeyDataNode {
    name: string;
    tooltip?: {
        show?: boolean;
    };
}

export interface ISankeyDataLink {
    source: string;
    target: string;
    value: string;
}

export interface ISankeyData {
    nodes: ISankeyDataNode[];
    links: ISankeyDataLink[];
}
