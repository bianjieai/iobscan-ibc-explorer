import { useIbcStatisticsChains } from '@/store/index';
import { GET_IBCSTATISTICS, GET_IBCTXS, GET_IBCDENOMS } from '@/constants/actionTypes';
import {
    ibcStatisticsChannelsDefault,
    ibcStatisticsDenomsDefault,
    channelsStatus,
    SYMBOL,
    pageParameters,
    ibcStatisticsTxsDefault,
    txStatusNumber
} from '@/constants';

const ibcStatisticsChainsStore = useIbcStatisticsChains();

export const useIbcStatistics = () => {
    const ibcStatisticsChains = ibcStatisticsChainsStore.ibcStatisticsChains;
    const ibcStatisticsChannels = ibcStatisticsChainsStore.ibcStatisticsChannels;
    const ibcStatisticsDenoms = ibcStatisticsChainsStore.ibcStatisticsDenoms;
    const ibcStatisticsTxs = ibcStatisticsChainsStore.ibcStatisticsTxs;
    const getIbcStatistics = ibcStatisticsChainsStore[GET_IBCSTATISTICS];
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsTxs,
        getIbcStatistics
    };
};
export const useIbcChains = () => {
    const ibcChains = computed(() => ibcStatisticsChainsStore.ibcChains);
    const getIbcChains = ibcStatisticsChainsStore.getIbcChains;
    return {
        ibcChains,
        getIbcChains
    };
};
export const useIbcTxs = () => {
    const ibcTxs = computed(() => ibcStatisticsChainsStore.ibcTxs);
    const getIbcTxs = ibcStatisticsChainsStore[GET_IBCTXS];
    const setExpandByIndex = (idx) => {
        ibcStatisticsChainsStore.ibcTxs.value.forEach((item, index) => {
            if (idx == index) {
                item.expanded = !item.expanded;
            } else {
                item.expanded = false;
            }
        });
    };
    const limitIbcTxs = (limitNumber = 10) => {
        ibcStatisticsChainsStore.ibcTxs.value = ibcStatisticsChainsStore.ibcTxs.value.slice(
            0,
            limitNumber
        );
    };
    return {
        ibcTxs,
        getIbcTxs,
        setExpandByIndex,
        limitIbcTxs
    };
};
export const useClearInterval = () => {
    const clearIntervalTimer = () => {
        clearInterval(ibcStatisticsChainsStore.ibcTxTimer.value);
    };
    onBeforeUnmount(() => {
        clearIntervalTimer();
    });
    return {
        clearIntervalTimer
    };
};
export const useGetIbcDenoms = () => {
    const ibcBaseDenoms = ibcStatisticsChainsStore.ibcBaseDenoms;
    const getIbcDenoms = ibcStatisticsChainsStore[GET_IBCDENOMS];
    const getIbcBaseDenom = ibcStatisticsChainsStore.getIbcBaseDenoms;
    const getBaseDenomInfoByDenom = (denom, chainId) => {
        return (ibcBaseDenoms.value || []).find(
            (item) => item.denom == denom && item.chain_id == chainId
        );
    };
    const ibcBaseDenomsSorted = computed(() => {
        let tokens = [];
        let customs = (ibcBaseDenoms.value || []).filter((item) => {
            return item.symbol == SYMBOL.ATOM || item.symbol == SYMBOL.IRIS;
        });
        customs.sort((a, b) => a.symbol.localeCompare(b.symbol));
        (ibcBaseDenoms.value || [])
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .forEach((item) => {
                if (item.symbol != SYMBOL.ATOM && item.symbol != SYMBOL.IRIS) {
                    tokens.push(item);
                }
            });
        return [...customs, ...tokens];
    });
    return {
        ibcBaseDenoms,
        ibcBaseDenomsSorted,
        getIbcDenoms,
        getIbcBaseDenom,
        getBaseDenomInfoByDenom
    };
};
export const useInterfaceActive = () => {
    const router = useRouter();
    const tipMsg =
        'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';
    const onClickViewAll = (msg) => {
        if (msg?.includes && msg.includes(pageParameters.chains)) {
            router.push({
                name: 'Chains'
            });
        } else if (msg?.includes && msg.includes(pageParameters.channel)) {
            if (msg === ibcStatisticsChannelsDefault.channel_opened.statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: channelsStatus.channelOpenedStatus
                    }
                });
            } else if (msg === ibcStatisticsChannelsDefault.channel_closed.statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: channelsStatus.channelClosedStatus
                    }
                });
            } else {
                router.push({
                    name: 'Channels'
                });
            }
        } else if (msg?.includes && msg.includes(pageParameters.tx)) {
            if (msg === ibcStatisticsTxsDefault.tx_all.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: txStatusNumber.defaultStatus
                    }
                });
            } else if (msg === ibcStatisticsTxsDefault.tx_24hr_all.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: txStatusNumber.defaultStatus
                    }
                });
            } else if (msg === ibcStatisticsTxsDefault.tx_success.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: txStatusNumber.successStatus
                    }
                });
            } else if (msg === ibcStatisticsTxsDefault.tx_failed.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: txStatusNumber.failedStatus
                    }
                });
            }
        } else if (msg?.includes && msg.includes(pageParameters.denom)) {
            if (msg !== ibcStatisticsDenomsDefault.denom_all.statistics_name) {
                router.push({
                    name: 'Tokens'
                });
            }
        } else {
            // TODO shan 路由中不包含以上路由的提示
            // message.info({
            //     content: h(Message),
            //     icon: h('div'),
            // });
        }
    };
    const onMenuSelected = (menuKey) => {
        console.log(menuKey);
    };
    return {
        tipMsg,
        onClickViewAll,
        onMenuSelected
    };
};
