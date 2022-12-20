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
    const { ibcBaseDenomsUniqueKeyMapGetter } = toRefs(ibcStatisticsChainsStore);
    if (Object.keys(ibcBaseDenomsUniqueKeyMapGetter.value).length <= 0) {
        await ibcStatisticsChainsStore.getIbcBaseDenomsAction();
    }
    const key = getDenomKey(chain, denom);
    return ibcBaseDenomsUniqueKeyMapGetter.value[key];
};
