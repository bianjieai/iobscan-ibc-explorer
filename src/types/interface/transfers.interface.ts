import { IAmountDenom, IDenomTrace } from './index.interface';
import { IRequestPagination2 } from '@/types/interface/index.interface';

export interface IRequestIbcTxs extends IRequestPagination2 {
    date_range?: string;
    status?: string;
    chain_id?: string;
    base_denom?: string;
    base_denom_chain_id?: string;
    denom?: string;
    start_time?: string;
}
export interface IRequestIbcSource {
    chain_id: string;
    msg_type: string;
}

export interface ITxStatus {
    status: number;
}

export interface IIbcTx {
    record_id: string;
    sc_addr: string;
    dc_addr: string;
    status: number;
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
    base_denom_chain_id: string;
    denoms: IDenomTrace;
    tx_time: number;
    end_time: number;
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
export interface IRelayer {
    relayer_name: string;
    relayer_addr: string;
    icon: string;
}
export interface IRelayerInfo {
    sc_relayer: IRelayer;
    dc_relayer: IRelayer;
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
export interface IIbcTxSourceInfo {
    time: number;
    height: number;
    tx_hash: string;
    status: number;
    memo: string;
    type: string;
    signers?: string[];
    fee: {
        amount?: [
            {
                denom: string;
                amount: string;
            }
        ];
        gas?: number;
    };
    timeout_height?: string;
    timeout_timestamp?: number;
    ack?: string;
    proof_height?: string;
    next_sequence_recv?: number;
}
export interface IIbcTxInfo {
    sc_tx_info: IIbcTxSourceInfo;
    dc_tx_info: IIbcTxSourceInfo | null;
    refund_tx_info: IIbcTxSourceInfo | null;
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

export interface IUseViewSOurce {
    ibcTxInfo?: IIbcTxInfo;
    mark: IProgress;
    scInfo?: ITxInfo;
    dcInfo?: ITxInfo;
}

export interface IUseProgressList {
    ibcTxInfo: IIbcTxInfo | undefined;
    mark: IProgress;
    ibcTxStatus: number;
    scInfo: ITxInfo | undefined;
    dcInfo: ITxInfo | undefined;
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
export interface IIbcSource {
    events: string[];
    msgs: object;
}
export interface IProgress {
    progress: string;
    badge: string;
    step: string;
}

export interface IInfoList {
    label: string;
    dataKey?: string;
    value: string;
    isFormatStatus?: boolean;
    isFormatFee?: boolean;
    isFormatSigner?: boolean;
    isFormatTimestamp?: boolean;
    isFormatTimeoutTimestamp?: boolean;
}
export interface DataItem {
    key: string;
    name: string;
    value: string;
    children?: DataItem[];
}

export interface ITransfersQueryParams {
    date_range: number[];
    status: string[] | undefined;
    chain_id: string | undefined;
    base_denom: string | undefined;
    base_denom_chain_id: string | undefined;
    denom: string | undefined;
}
