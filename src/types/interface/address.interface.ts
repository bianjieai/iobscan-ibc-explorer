import type { IRequestPagination, IResponsePageInfo, IResponseTokenInfo } from './index.interface';

export interface IRequestAddress {
    chain: string;
    address: string;
}

export interface IRequestAddressTxs extends IRequestPagination {
    chain: string;
    address: string;
}

export interface IResponseAddressBaseInfo {
    address: string;
    chain: string;
    pub_key: string;
    pub_key_type: string;
    pub_key_algorithm: string;
    account_number: string;
    account_sequence: string;
}

export interface IResponseAddressTxs {
    tx_hash: string;
    tx_status: number;
    tx_type: string;
    port: string;
    sender: string;
    receiver: string;
    denom_info: IResponseTokenInfo;
    fee_info: IResponseTokenInfo;
    tx_time: number;
    ibc_version: string;
}
export interface IResponseAddressTxsFormat extends IResponseAddressTxs {
    format_tx_time: string;
    tag?: string;
}

export interface IResponseAddressTxsData {
    txs: IResponseAddressTxs[];
    page_info: IResponsePageInfo;
}

export interface IAddressBaseInfo {
    address: string;
    keyAlgorithm: string;
    accountSequence: string;
    pubKey: string;
}
export interface IAddressChainInfo {
    chainLogo: string;
    prettyName: string;
    isShowTooltip: boolean;
}
