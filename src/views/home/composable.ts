import { IIbcTx } from './../../types/interface/transfers.interface';
import { formatAge, getTimestamp } from '@/utils/timeTools';
import { IBaseDenom } from '@/types/interface/index.interface';
import { useIbcStatisticsChains } from '@/store/index';
import {
    ibcStatisticsChannelsDefault,
    ibcStatisticsDenomsDefault,
    channelsStatus,
    SYMBOL,
    PAGE_PARAMETERS,
    ibcStatisticsTxsDefault,
    txStatusNumber
} from '@/constants';
import { useTimeInterval } from '@/composables';

export const useIbcTxs = (timerInterval?: number) => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const ibcTxs = ibcStatisticsChainsStore.ibcTxs;
    const homeIbcTxs = ref([...ibcTxs]);
    const getIbcTxs = ibcStatisticsChainsStore.getIbcTxsAction;
    const expandedId = ref<string | null>();
    const setExpandByIndex = (recordId: string) => {
        expandedId.value = recordId;
        homeIbcTxs.value.forEach((item) => {
            if (item.record_id === recordId) {
                item.expanded = !item.expanded;
                if (!item.expanded) {
                    expandedId.value = null;
                }
            } else {
                item.expanded = false;
            }
        });
    };
    const setIbcTxs = (limitNumber = 10) => {
        ibcStatisticsChainsStore.ibcTxs = homeIbcTxs.value.slice(0, limitNumber);
    };
    useTimeInterval(() => {
        homeIbcTxs.value = homeIbcTxs.value.map((item: any) => {
            item.parseTime = formatAge(getTimestamp(), item.tx_time * 1000, '', '');
            return item;
        });
    });
    const initGetIbcTxs = async () => {
        homeIbcTxs.value = (await getIbcTxs({
            page_num: 1,
            page_size: 100,
            use_count: false
        })) as IIbcTx[];
        homeIbcTxs.value = homeIbcTxs.value.map((item: any) => {
            if (item.record_id === expandedId.value) {
                item.expanded = true;
            } else {
                item.expanded = false;
            }
            return item;
        });
        setIbcTxs();
    };
    let timer: number;
    onMounted(async () => {
        await ibcStatisticsChainsStore.getIbcDenomsAction();
        initGetIbcTxs();
        if (Number(timerInterval) > 0) {
            timer = setInterval(() => {
                console.log('initGetIbcTxs', timerInterval);
                initGetIbcTxs();
            }, timerInterval);
        }
    });
    onBeforeUnmount(() => {
        timer && clearInterval(timer);
    });
    return {
        homeIbcTxs,
        getIbcTxs,
        setExpandByIndex
    };
};

export const useGetIbcDenoms = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenoms, ibcBaseDenomsSymbolKeyMapGetter } =
        storeToRefs(ibcStatisticsChainsStore);
    const getIbcBaseDenom = ibcStatisticsChainsStore.getIbcBaseDenomsAction;
    const getBaseDenomInfoByDenom = (denom: string, chainId: string) => {
        return ibcBaseDenoms.value.find((item) => item.denom == denom && item.chain_id == chainId);
    };
    const ibcBaseDenomsSorted = computed(() => {
        const tokens: IBaseDenom[] = [];
        const customs = ibcBaseDenoms.value.filter((item) => {
            return item.symbol == SYMBOL.ATOM || item.symbol == SYMBOL.IRIS;
        });
        customs.sort((a, b) => a.symbol.localeCompare(b.symbol));
        ibcBaseDenoms.value
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
        ibcBaseDenomsSymbolKeyMapGetter,
        ibcBaseDenomsSorted,
        getIbcBaseDenom,
        getBaseDenomInfoByDenom
    };
};

export const useInterfaceActive = () => {
    const router = useRouter();
    const tipMsg =
        'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';
    const onClickViewAll = (msg: string) => {
        if (msg?.includes && msg.includes(PAGE_PARAMETERS.chains)) {
            router.push({
                name: 'Chains'
            });
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.channel)) {
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
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.tx)) {
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
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.denom)) {
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
    const onMenuSelected = () => {
        // 参数传递menuKey
        // console.log(menuKey);
    };
    return {
        tipMsg,
        onClickViewAll,
        onMenuSelected
    };
};
