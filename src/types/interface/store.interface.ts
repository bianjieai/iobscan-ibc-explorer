import { IIbcTx } from '@/types/interface/transfers.interface';
import { IResponseIbcDenom } from '@/types/interface/home.interface';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';

export interface GlobalState {
    ibcChains: IIbcChains;
    ibcBaseDenoms: IBaseDenom[];
    ibcDenoms: IResponseIbcDenom[];
    isShowLoading: boolean;
    ibcTxs: IIbcTx[];
}
