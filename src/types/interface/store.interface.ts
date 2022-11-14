import { IRelayerName } from './index.interface';
import { IIbcTx } from '@/types/interface/transfers.interface';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';
// import { IResponseIbcDenom } from '@/types/interface/home.interface';

export interface GlobalState {
    ibcChains: IIbcChains;
    ibcBaseDenoms: IBaseDenom[];
    // ibcDenoms: IResponseIbcDenom[];
    isShowLoading: boolean;
    isShow500: boolean;
    ibcTxs: IIbcTx[];
    isDocumentHidden: boolean;
    relayerNames: IRelayerName[];
    txSearchTimeMin: number;
}
