export interface IRequestIbcDenom {
    chain_id: string;
    denom: string;
    base_denom: string;
    denom_path: string;
    is_source_chain: boolean;
    symbol: string;
    create_at: number;
    update_at: number;
}

export interface IRequestIbcStatistics {
    statistics_name: string;
    count: number;
}
