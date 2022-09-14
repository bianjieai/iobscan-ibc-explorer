import { IAmountDenom, IDenomTrace } from './index.interface';
import { IRequestPagination2 } from '@/types/interface/index.interface';

export interface IRequestIbcTxs extends IRequestPagination2 {
    date_range?: string;
    status?: string;
    chain_id?: string;
    symbol?: string;
    denom?: string;
    start_time?: string;
}

export interface ITxStatus {
    status: number;
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
    denoms: IDenomTrace;
    tx_time: number;
    end_time: string;
    expanded?: boolean;
}
export interface ITxInfo {
    address: string;
    chain_id: string;
    channel_id: string;
    port_id: string;
    connection_id: string;
    client_id: string;
}
export interface IRelayerInfo {
    relayer_name: string;
    sc_relayer_addr: string;
    dc_relayer_addr: string;
    icon: string;
}
export interface ITokenInfo {
    base_denom: string;
    base_denom_chain_id: string;
    send_token: {
        denom: string;
        denom_path: string;
    };
    recv_token: {
        denom: string;
        denom_path: string;
    };
    amount: string;
}
export interface IIbcTxInfo {
    sc_tx_info: {
        time: number;
        height: number;
        tx_hash: string;
        status: number;
        memo: string;
        type: string;
        signers?: string[];
        fee: {
            amount?: {
                denom: string;
                amount: string;
            };
            gas?: number;
            timeout_height: string;
            timeout_timestamp: number;
        };
    };
    dc_tx_info: {
        time: number;
        height: number;
        tx_hash: string;
        status: number;
        memo: string;
        type: string;
        signers?: string[];
        fee: {
            amount?: {
                denom: string;
                amount: string;
            };
            gas?: number;
            ack: string;
            proof_height: string;
        };
    };
    refund_tx_info: {
        time: number;
        height: number;
        tx_hash: string;
        status: number;
        memo: string;
        type: string;
        signers?: string[];
        fee: {
            amount?: {
                denom: string;
                amount: string;
            };
            gas?: number;
            ack?: string;
            proof_height: string;
            next_sequence_recv?: number;
        };
    };
}
export interface IUseTokenInfo {
    tokenInfo: ITokenInfo | undefined;
}
export interface IUseChainIfo {
    title: string;
    chainInfo: ITxInfo | undefined;
    isFlexColumn: boolean;
}
export interface IUseRelayer {
    title: string;
    relayerInfo: IRelayerInfo | undefined;
    scInfo: ITxInfo | undefined;
    dcInfo: ITxInfo | undefined;
    isFlexColumn: boolean;
}
export interface IUseSequence {
    sequence: string;
    isFlexColumn: boolean;
}
export interface IUseTxImg {
    ibcTxStatus: number;
    ibcTxInfo: IIbcTxInfo | undefined;
    txImg: string;
}
export interface IIbcTxDetail {
    sc_info: ITxInfo;
    dc_info: ITxInfo;
    sequence: string;
    status: number;
    token_info: ITokenInfo;
    relayer_info: IRelayerInfo;
    ibc_tx_info: IIbcTxInfo;
    error_log: string;
    is_list: boolean;
    items?: object[];
}

// export interface IIbcTxDetail {
//     base_denom: string;
//     base_denom_chain_id: string;
//     dc_addr: string;
//     dc_chain_id: string;
//     dc_channel: string;
//     dc_port: string;
//     denoms: IDenomTrace;
//     sc_addr: string;
//     sc_chain_id: string;
//     sc_channel: string;
//     sc_port: string;
//     sc_tx_info: {
//         hash: string;
//         status: number;
//         time: number;
//         height: number;
//         fee: {
//             amount: IAmountDenom;
//             gas: number;
//         };
//         msg_amount: {
//             denom: string;
//             amount: string;
//         };
//         msg: {
//             type: string;
//             msg: {
//                 packet_id: string;
//                 source_port: string;
//                 source_channel: string;
//                 token: IAmountDenom;
//                 sender: string;
//                 receiver: string;
//                 timeout_height: {
//                     revision_number: number;
//                     revision_height: number;
//                 };
//                 timeout_timestamp: number;
//             };
//         };
//     };
//     sequence: string;
//     status: number;
//     tx_time: number;
//     dc_tx_info: {
//         hash?: string;
//         status?: number;
//         time?: number;
//         height?: number;
//         fee?: {
//             amount: IAmountDenom;
//             gas: number;
//         };
//         msg_amount?: {
//             denom: string;
//             amount: string;
//         };
//         msg?: {
//             type: string;
//             msg: {
//                 packet_id: string;
//                 source_port: string;
//                 source_channel: string;
//                 token: IAmountDenom;
//                 sender: string;
//                 receiver: string;
//                 timeout_height: {
//                     revision_number: number;
//                     revision_height: number;
//                 };
//                 timeout_timestamp: number;
//             };
//         };
//     };
//     sc_signers: string[];
//     dc_signers: string[];
//     dc_connect: string;
//     sc_connect: string;
//     ack: string;
// }

export interface ITransfersDetails {
    label: string;
    value: string;
    dataKey?: string | undefined;
    isFormatChainID?: boolean | undefined;
    isChannelID?: boolean | undefined;
    isFormatToken?: boolean | undefined;
    isAddress?: boolean | undefined;
    isFormatStatus?: boolean | undefined;
    isFormatDate?: boolean | undefined;
    isFormatFee?: boolean | undefined;
    isNotLink?: boolean | undefined;
}

export interface ITransfersExpandDetails {
    label: string;
    value: string;
    dataKey: string;
    isExpand: boolean;
    isAck?: boolean | undefined;
    isFormatHeight?: boolean | undefined;
}

export interface IInfoList {
    label: string;
    dataKey?: string;
    value: string;
}
