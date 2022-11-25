import { Ref } from 'vue';
import { IRequestPagination } from './index.interface';

export type TTokenType = 'Authed' | 'Other';
export type TIbcTokenType = 'Authed' | 'Other' | 'Genesis';

export interface IRequestTokensList extends IRequestPagination {
    base_denom?: string;
    base_denom_chain?: string;
    chain?: string;
    token_type?: TTokenType;
    loading?: Ref<boolean>;
}
export interface IRequestIbcTokenList extends IRequestPagination {
    base_denom?: string;
    base_denom_chain?: string;
    chain?: string;
    token_type?: TIbcTokenType;
    loading?: Ref<boolean>;
}

export interface IResponseTokensListItem {
    base_denom: string;
    chain: string;
    chains_involved: number;
    currency: string;
    ibc_transfer_amount: string;
    ibc_transfer_txs: number;
    price: number;
    supply: string;
    token_type: string;
}
export interface ITokensListItem extends IResponseTokensListItem {
    name?: string;
}

export interface IResponseIbcTokenListItem {
    amount: string;
    chain: string;
    denom: string;
    denom_path: string;
    ibc_hops: number;
    receive_txs: number;
    token_type: string;
}

export interface IResponseTokensList {
    items: IResponseTokensListItem[];
}

export interface IResponseIbcTokenList {
    items: IResponseIbcTokenListItem[];
}
