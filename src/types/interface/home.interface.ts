export interface IResponseIbcDenom {
    chain: string;
    denom: string;
    base_denom: string;
    base_denom_chain: string;
    denom_path: string;
    symbol: string;
}

export interface IResponseIbcStatisticItem {
    statistics_name: string;
    count: number;
}

export interface ISearchPoint {
    ip: string;
    content: string;
}
