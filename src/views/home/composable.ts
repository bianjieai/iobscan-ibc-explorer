import { IBaseDenoms } from '@/types/interface/index.interface';
import { API_CODE } from '@/constants/apiCode';
import { getIbcStatisticsAPI } from '@/api/home';
import { findStatistics } from '@/helper/findStatisticsHelper';
import { ibcStatisticsChainsDefault } from '@/constants/index';
import { useIbcStatisticsChains } from '@/store/index';
import { GET_IBCDENOMS } from '@/constants/actionTypes';
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

export const initHome = (
    getIbcStatistics: Function,
    getIbcTxs: Function,
    getIbcDenoms: Function,
    limitIbcTxs: Function
) => {
    onMounted(() => {
        getIbcStatistics();
        getIbcTxs({ page_num: 1, page_size: 100, use_count: false });
        getIbcDenoms();
    });
    onBeforeUnmount(() => {
        limitIbcTxs();
    });
};

export const useIbcStatistics = () => {
    const ibcStatisticsChains = reactive(ibcStatisticsChainsDefault);
    const ibcStatisticsChannels = reactive(ibcStatisticsChannelsDefault);
    const ibcStatisticsDenoms = reactive(ibcStatisticsDenomsDefault);
    const ibcStatisticsTxs = reactive(ibcStatisticsTxsDefault);
    const getIbcStatistics = async () => {
        try {
            const { code, data } = await getIbcStatisticsAPI();
            if (code === API_CODE.success) {
                ibcStatisticsChains.chains_24hr = findStatistics(data, 'chains_24hr');
                ibcStatisticsChains.chain_all = findStatistics(data, 'chain_all');
                ibcStatisticsChannels.channels_24hr = findStatistics(data, 'channels_24hr');
                ibcStatisticsChannels.channel_all = findStatistics(data, 'channel_all');
                ibcStatisticsChannels.channel_opened = findStatistics(data, 'channel_opened');
                ibcStatisticsChannels.channel_closed = findStatistics(data, 'channel_closed');
                ibcStatisticsDenoms.denom_all = findStatistics(data, 'denom_all');
                ibcStatisticsDenoms.base_denom_all = findStatistics(data, 'base_denom_all');
                ibcStatisticsTxs.tx_24hr_all = findStatistics(data, 'tx_24hr_all');
                ibcStatisticsTxs.tx_all = findStatistics(data, 'tx_all');
                ibcStatisticsTxs.tx_success = findStatistics(data, 'tx_success');
                ibcStatisticsTxs.tx_failed = findStatistics(data, 'tx_failed');
            }
        } catch (error) {
            console.log('getIbcStatisticsAPI', error);
        }
    };
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsTxs,
        getIbcStatistics
    };
};

export const useIbcChains = () => {
    const { ibcChains } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcChains = ibcStatisticsChainsStore.getIbcChainsAction;
    return {
        ibcChains,
        getIbcChains
    };
};

export const useIbcTxs = () => {
    const { ibcTxs } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcTxs = ibcStatisticsChainsStore.getIbcTxsAction;
    const setExpandByIndex = (idx: number) => {
        ibcStatisticsChainsStore.ibcTxs.forEach((item, index) => {
            if (idx == index) {
                item.expanded = !item.expanded;
            } else {
                item.expanded = false;
            }
        });
    };
    const limitIbcTxs = (limitNumber = 10) => {
        ibcStatisticsChainsStore.ibcTxs = ibcStatisticsChainsStore.ibcTxs.slice(0, limitNumber);
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
        clearInterval(ibcStatisticsChainsStore.ibcTxTimer);
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
    const getIbcBaseDenom = ibcStatisticsChainsStore.getIbcBaseDenomsAction;
    const getBaseDenomInfoByDenom = (denom: string, chainId: string) => {
        return ibcBaseDenoms.find((item) => item.denom == denom && item.chain_id == chainId);
    };
    const ibcBaseDenomsSorted = computed(() => {
        const tokens: IBaseDenoms[] = [];
        const customs = (ibcBaseDenoms || []).filter((item) => {
            return item.symbol == SYMBOL.ATOM || item.symbol == SYMBOL.IRIS;
        });
        customs.sort((a, b) => a.symbol.localeCompare(b.symbol));
        ibcBaseDenoms
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
    const onClickViewAll = (msg: string) => {
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
    const onMenuSelected = (menuKey: string) => {
        console.log(menuKey);
    };
    return {
        tipMsg,
        onClickViewAll,
        onMenuSelected
    };
};
