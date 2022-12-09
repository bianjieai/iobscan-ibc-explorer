import { ITableTokenInfo } from './components/table.interface';
import { IBaseDenom } from './index.interface';
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

export interface IResponseTokenList {
    tokens: IResponseTokenListItem[];
    total_value: string;
}

export interface ITokenListItem extends IResponseTokenListItem {
    displayAmount: string;
    displayAvaliableAmount: string;
    chainInfo?: IBaseDenom;
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
