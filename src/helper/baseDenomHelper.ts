import { useIbcStatisticsChains } from '@/store/index';
import { IBaseDenom } from '@/types/interface/index.interface';

export const getDenomKey = (chain: string, denom: string): string => {
    return chain + '-' + denom;
};

export const getBaseDenomByKey = async (
    chain: string,
    denom: string
): Promise<IBaseDenom | undefined> => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenomsUniqueKeyMapGetter } = ibcStatisticsChainsStore;
    if (Object.keys(ibcBaseDenomsUniqueKeyMapGetter).length <= 0) {
        await ibcStatisticsChainsStore.getIbcBaseDenomsAction();
    }
    const key = getDenomKey(chain, denom);
    return ibcBaseDenomsUniqueKeyMapGetter[key];
};
