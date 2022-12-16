import type { ITableTokenInfo } from './components/table.interface';
import type {
    IBaseDenom,
    IIbcchain,
    IRequestPagination,
    IResponsePageInfo,
    IResponseTokenInfo
} from './index.interface';
import type { TIbcTokenType } from './tokens.interface';

export interface IResponseTokenListItem {
    denom: string;
    chain: string;
    base_denom: string;
    base_denom_chain: string;
    denom_type: TIbcTokenType;
    denom_amount: string;
    denom_available_amount: string;
    price: number;
    denom_value: string;
}
export interface ITokenListItem extends IResponseTokenListItem {
    displayAmount: string;
    displayAvailableAmount: string;
    tokenInfo?: IBaseDenom;
}

export interface IResponseTokenData {
    tokens: IResponseTokenListItem[];
    total_value: string;
}

export interface IResponseAccountListItem {
    chain: string;
    address: string;
    token_denom_num: number;
    token_value: string;
    last_update_time: number;
}

export interface IAccountListItem extends IResponseAccountListItem {
    chainInfo?: IIbcchain;
}

export interface IAccountData {
    accounts: IAccountListItem[];
    total_value: string;
}

export interface IResponseAccountData {
    accounts: IResponseAccountListItem[];
    total_value: string;
}

export interface ITokenList {
    tokens: ITokenListItem[];
    total_value: string;
}

export interface PieLegendData {
    key: string;
    lengedColor: string;
    percentage: string;
    legendName: string;
}

export interface IAddressTokenTableItem {
    tokenId: string;
    tokenInfo: ITableTokenInfo;
    displayAmount: string;
    displayAvailable: string;
    price: string;
    totalValue: string;
}

export interface IAddressAccountTableItem {
    chain: string;
    address: string;
    tokenDenom: number;
    totalValue: string;
    formatLastUpdated: string;
    lastUpdatedTimestamp: number;
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
    sc_chain: string;
    receiver: string;
    dc_chain: string;
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
}
