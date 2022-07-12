import { TBaseDenoms } from '@/hooks/chainAndDenom.interface';
import { useIbcStatisticsChains } from '@/store/home/index';
import { GET_IBCDENOMS } from '@/store/action-types';

export const getBaseDenomKey = (chainID: string, denom: string,): string => {
    return chainID + "-" + denom;
}

export const getBaseDenomByKey = async (chainID: string, denom: string): Promise<TBaseDenoms | undefined> => { 
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    let ibcBaseDenomsMapStr = sessionStorage.getItem("ibcBaseDenomsMap");
    if (!ibcBaseDenomsMapStr) {
        await ibcStatisticsChainsStore[GET_IBCDENOMS]();
    }
    ibcBaseDenomsMapStr = sessionStorage.getItem("ibcBaseDenomsMap");
    const ibcBaseDenomsMap = JSON.parse(ibcBaseDenomsMapStr ?? "{}");
    const key = getBaseDenomKey(chainID, denom);
    return ibcBaseDenomsMap[key];
}
