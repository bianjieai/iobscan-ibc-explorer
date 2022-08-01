import { IIbcTx } from '@/types/interface/transfers.interface';
import { IResponseIbcDenom } from '@/types/interface/home.interface';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';

export interface GlobalState {
    ibcChains: IIbcChains;
    ibcBaseDenoms: IBaseDenom[];
    ibcBaseDenomsUniqueKeyMap: { [key: string]: IBaseDenom };
    ibcBaseDenomsSymbolKeyMap: { [key: string]: IBaseDenom };
    ibcDenoms: IResponseIbcDenom[];
    ibcDenomsMap: { [key: string]: IResponseIbcDenom };
    isShowLoading: boolean;
    ibcTxs: IIbcTx[];
}
