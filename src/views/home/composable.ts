import { IIbcTx } from './../../types/interface/transfers.interface';
import { formatAge, getTimestamp } from '@/utils/timeTools';
import { useIbcStatisticsChains } from '@/store/index';
import {
    IBC_STATISTICS_CHANNELS_DEFAULT,
    IBC_STATISTICS_DENOMS_DEFAULT,
    CHANNELS_STATUS,
    PAGE_PARAMETERS,
    IBC_STATISTICS_TXS_DEFAULT,
    TX_STATUS_NUMBER,
    MSG_DESC
} from '@/constants';
import { useTimeInterval } from '@/composables';

export const useIbcTxs = (timerInterval?: number) => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const ibcTxs = ibcStatisticsChainsStore.ibcTxs;
    const { isDocumentHidden } = storeToRefs(ibcStatisticsChainsStore);
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
        if (homeIbcTxs.value && homeIbcTxs.value.length > 0) {
            ibcStatisticsChainsStore.ibcTxs = homeIbcTxs.value.slice(0, limitNumber);
        }
    };
    useTimeInterval(() => {
        homeIbcTxs.value = homeIbcTxs.value?.map((item: any) => {
            item.parseTime = formatAge(getTimestamp(), item.tx_time * 1000, '', '');
            return item;
        });
    });
    const initGetIbcTxs = async (isNeedJudgeShow500 = true) => {
        try {
            homeIbcTxs.value = (await getIbcTxs(
                {
                    page_num: 1,
                    page_size: 100,
                    use_count: false
                },
                isNeedJudgeShow500
            )) as IIbcTx[];
            homeIbcTxs.value = homeIbcTxs.value?.map((item: any) => {
                if (item.record_id === expandedId.value) {
                    item.expanded = true;
                } else {
                    item.expanded = false;
                }
                return item;
            });
            setIbcTxs();
        } catch (error) {
            console.log(error);
        }
    };
    let timer: number;
    const intervalIbcTxs = () => {
        timer = setInterval(() => {
            console.log('initGetIbcTxs', timerInterval);
            initGetIbcTxs(false);
        }, timerInterval);
    };
    onMounted(async () => {
        initGetIbcTxs();
        if (Number(timerInterval) > 0) {
            intervalIbcTxs();
        }
    });
    onBeforeUnmount(() => {
        timer && clearInterval(timer);
    });
    watch(isDocumentHidden, (newDocumentHidden) => {
        newDocumentHidden && timer ? clearInterval(timer) : intervalIbcTxs();
    });
    return {
        homeIbcTxs,
        getIbcTxs,
        setExpandByIndex
    };
};

export const useInterfaceActive = () => {
    const router = useRouter();
    const tipMsg =
        'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';
    const onClickViewAll = (msg: string) => {
        (window as any).gtag('event', 'Home-点击链接', {
            clickLink: (MSG_DESC as any)[msg]
        });

        if (msg?.includes && msg.includes(PAGE_PARAMETERS.chains)) {
            router.push({
                name: 'Chains'
            });
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.channel)) {
            if (msg === IBC_STATISTICS_CHANNELS_DEFAULT.channel_opened.statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: CHANNELS_STATUS.channelOpenedStatus
                    }
                });
            } else if (msg === IBC_STATISTICS_CHANNELS_DEFAULT.channel_closed.statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: CHANNELS_STATUS.channelClosedStatus
                    }
                });
            } else {
                router.push({
                    name: 'Channels'
                });
            }
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.tx)) {
            if (msg === IBC_STATISTICS_TXS_DEFAULT.tx_all.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: TX_STATUS_NUMBER.defaultStatus
                    }
                });
            } else if (msg === IBC_STATISTICS_TXS_DEFAULT.tx_24hr_all.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: TX_STATUS_NUMBER.defaultStatus
                    }
                });
            } else if (msg === IBC_STATISTICS_TXS_DEFAULT.tx_success.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: TX_STATUS_NUMBER.successStatus
                    }
                });
            } else if (msg === IBC_STATISTICS_TXS_DEFAULT.tx_failed.statistics_name) {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: TX_STATUS_NUMBER.failedStatus
                    }
                });
            }
        } else if (msg?.includes && msg.includes(PAGE_PARAMETERS.denom)) {
            if (msg !== IBC_STATISTICS_DENOMS_DEFAULT.denom_all.statistics_name) {
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
