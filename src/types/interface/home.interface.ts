export interface IResponseIbcDenom {
    chain_id: string;
    denom: string;
    base_denom: string;
    denom_path: string;
    is_source_chain: boolean;
    symbol: string;
    create_at: number;
    update_at: number;
}

export interface IResponseIbcStatistics {
    statistics_name: string;
    count: number;
}
