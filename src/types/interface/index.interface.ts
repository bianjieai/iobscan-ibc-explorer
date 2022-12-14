import { API_CODE } from '@/constants/apiCode';
import { CHAIN_STATUS } from '@/constants/index';
/*************** req ***********************/
export interface IRequestPagination {
    use_count?: boolean;
    page_num: number;
    page_size: number;
}

export interface IRequestPagination2 {
    use_count: boolean;
    page_num: number;
    page_size: number;
}

/*************** res *************************/
export interface IResponse<P = {}> {
    code: API_CODE;
    message?: string;
    data: P;
}

export interface IResponseData<P = {}> {
    items: P;
    time_stamp?: number;
}

export interface IResponsePagingData<P = {}> {
    items: P;
    page_info: IResponsePageInfo;
    time_stamp?: number;
}

export interface IResponsePageInfo {
    page_num: number;
    page_size: number;
    total_item: number;
    total_page: number;
}

export interface IIbcchain {
    current_chain_id: string;
    chain_name: string;
    pretty_name: string;
    icon: string;
    status: CHAIN_STATUS;
    addr_prefix: string[];
}

export interface IPrefixChain {
    chain_name: string;
    pretty_name: string;
}

export interface IHeaderInputOption {
    text: string;
    value: string;
    addrPrefix: string;
}
export interface IIbcchainMap {
    [propName: string]: string;
}

export interface IIbcChains {
    all: IIbcchain[];
    active: IIbcchain[];
    inactive: IIbcchain[];
}

export type TIbcChainsKeys = keyof IIbcChains;
export interface IBaseDenom {
    chain: string;
    denom: string;
    icon: string;
    scale: number;
    symbol: string;
}

export interface IAmountDenom {
    denom: string;
    amount: string;
}

export interface IDenomTrace {
    sc_denom: string;
    dc_denom: string;
}

export enum FooterMode {
    light,
    dark
}

export interface IPaginationParams {
    total: number;
    current: number;
    pageSize: number;
}

export interface IBottomStatus {
    statusImg: string;
    status: string;
}

export interface IDenomStatistic {
    [key: string]: {
        statistics_name: string;
        count: number | string;
        no_link?: boolean;
        unit?: string;
    };
}

export interface IRelayerName {
    source: string;
    matching: string;
}

export interface IResponseTokenInfo {
    denom: string;
    denom_chain: string;
    base_denom?: string;
    base_denom_chain?: string;
    amount: string;
}
