import { ITableTokenInfo } from './components/table.interface';
import { IBaseDenom, IIbcchain } from './index.interface';
import { TIbcTokenType } from './tokens.interface';

export interface IResponseTokenListItem {
    denom: string;
    chain: string;
    base_denom: string;
    base_denom_chain: string;
    denom_type: TIbcTokenType;
    denom_amount: string;
    denom_avaliable_amount: string;
    price: number;
    denom_value: string;
}
export interface ITokenListItem extends IResponseTokenListItem {
    displayAmount: string;
    displayAvaliableAmount: string;
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
    displayAvaliable: string;
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
