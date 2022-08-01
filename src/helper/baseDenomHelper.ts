import { useIbcStatisticsChains } from '@/store/index';
import { IBaseDenoms } from '@/types/interface/index.interface';

export const getDenomKey = (chainID: string, denom: string): string => {
    return chainID + '-' + denom;
};

export const getBaseDenomByKey = async (
    chainID: string,
    denom: string
): Promise<IBaseDenoms | undefined> => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenomsSymbolKeyMap } = ibcStatisticsChainsStore;
    if (Object.keys(ibcBaseDenomsSymbolKeyMap.value).length <= 0) {
        await ibcStatisticsChainsStore.getIbcBaseDenomsAction();
    }
    const key = getDenomKey(chainID, denom);
    return ibcBaseDenomsSymbolKeyMap[key];
};
