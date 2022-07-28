import { useIbcStatisticsChains } from '@/store/index';
import { IBaseDenoms } from '@/types/interface/index.interface';

export const getBaseDenomKey = (chainID: string, denom: string): string => {
    return chainID + '-' + denom;
};

export const getBaseDenomByKey = async (
    chainID: string,
    denom: string
): Promise<IBaseDenoms | undefined> => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    let ibcBaseDenomsMapStr = sessionStorage.getItem('ibcBaseDenomsMap');
    if (!ibcBaseDenomsMapStr) {
        await ibcStatisticsChainsStore.getIbcBaseDenomsAction();
    }
    ibcBaseDenomsMapStr = sessionStorage.getItem('ibcBaseDenomsMap');
    const ibcBaseDenomsMap = JSON.parse(ibcBaseDenomsMapStr ?? '{}');
    const key = getBaseDenomKey(chainID, denom);
    return ibcBaseDenomsMap[key];
};
