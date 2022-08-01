import { IRequestPagination2 } from '@/types/interface/index.interface';

export interface IRequestIbcTxc extends IRequestPagination2 {
    date_range?: string;
    status?: string;
    chain_id?: string;
    symbol?: string;
    denom?: string;
    start_time?: string;
}

export interface IIbcTxc {
    record_id: string;
    sc_addr: string;
    dc_addr: string;
    status: string;
    sequence: string;
    dc_channel: string;
    sc_channel: string;
    sc_chain_id: string;
    dc_chain_id: string;
    sc_tx_info: {
        hash: string;
        msg_amount: {
            denom: string;
            amount: string;
        };
    };
    dc_tx_info: {
        hash: string;
    };
    base_denom: string;
    denoms: {
        sc_denom: string;
        dc_denom: string;
    };
    tx_time: number;
    end_time: string;
    expanded?: boolean;
}

export interface IResponseIbcTxc {
    data: IIbcTxc[];
    pageNum: number;
    pageSize: number;
}
