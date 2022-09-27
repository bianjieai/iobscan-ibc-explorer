export interface IResponseIbcDenom {
    chain_id: string;
    denom: string;
    base_denom: string;
    base_denom_chain_id: string;
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
