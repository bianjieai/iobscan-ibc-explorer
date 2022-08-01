import { IIbcTxc } from '@/types/interface/transfers.interface';
import { IResponseIbcDenom } from '@/types/interface/home.interface';
import { IBaseDenoms, IIbcChains } from '@/types/interface/index.interface';

export interface GlobalState {
    ibcChains: IIbcChains;
    ibcBaseDenoms: IBaseDenoms[];
    ibcBaseDenomsUniqueKeyMap: { [key: string]: IBaseDenoms };
    ibcBaseDenomsSymbolKeyMap: { [key: string]: IBaseDenoms };
    ibcDenoms: IResponseIbcDenom[];
    ibcDenomsMap: { [key: string]: IResponseIbcDenom };
    isShowLoading: boolean;
    ibcTxs: IIbcTxc[];
}
