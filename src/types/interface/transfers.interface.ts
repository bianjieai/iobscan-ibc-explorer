import { IAmountDenom, IDenoms } from './index.interface';
import { IRequestPagination2 } from '@/types/interface/index.interface';

export interface IRequestIbcTxs extends IRequestPagination2 {
    date_range?: string;
    status?: string;
    chain_id?: string;
    symbol?: string;
    denom?: string;
    start_time?: string;
}

export interface IIbcTx {
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
        msg_amount: IAmountDenom;
    };
    dc_tx_info: {
        hash: string;
    };
    base_denom: string;
    denoms: IDenoms;
    tx_time: number;
    end_time: string;
    expanded?: boolean;
}

export interface IIbcTxDetail {
    base_denom: string;
    dc_addr: string;
    dc_chain_id: string;
    dc_channel: string;
    dc_port: string;
    denoms: IDenoms;
    sc_addr: string;
    sc_chain_id: string;
    sc_channel: string;
    sc_port: string;
    sc_tx_info: {
        hash: string;
        status: number;
        time: number;
        height: number;
        fee: {
            amount: IAmountDenom;
            gas: number;
        };
        msg_amount: {
            denom: string;
            amount: string;
        };
        msg: {
            type: string;
            msg: {
                packet_id: string;
                source_port: string;
                source_channel: string;
                token: IAmountDenom;
                sender: string;
                receiver: string;
                timeout_height: {
                    revision_number: number;
                    revision_height: number;
                };
                timeout_timestamp: number;
            };
        };
    };
    sequence: string;
    status: number;
    tx_time: number;
    dc_tx_info: {
        hash?: string;
        status?: number;
        time?: number;
        height?: number;
        fee?: {
            amount: IAmountDenom;
            gas: number;
        };
        msg_amount?: {
            denom: string;
            amount: string;
        };
        msg?: {
            type: string;
            msg: {
                packet_id: string;
                source_port: string;
                source_channel: string;
                token: IAmountDenom;
                sender: string;
                receiver: string;
                timeout_height: {
                    revision_number: number;
                    revision_height: number;
                };
                timeout_timestamp: number;
            };
        };
    };
    sc_signers: string[];
    dc_signers: string[];
    dc_connect: string;
    sc_connect: string;
}
