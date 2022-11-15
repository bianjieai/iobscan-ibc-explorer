import {
    getRelayerDetailsByRelayerIdAPI,
    getRelayerTransferListAPI,
    getTransferTypeTxsAPI
} from '@/api/relayers';
import { IDataItem } from '@/components/BjSelect/interface';
import { useMatchBaseDenom } from '@/composables';
import { CHAINNAME, CHAIN_DEFAULT_ICON, TOKEN_DEFAULT_ICON, TRANSFER_TYPE } from '@/constants';
import { API_CODE, API_ERRPR_MESSAGE } from '@/constants/apiCode';
import { RELAYER_DETAILS_INFO, RT_COLUMN_TYPE, SINGLE_ADDRESS_HEIGHT } from '@/constants/relayers';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import { useIbcStatisticsChains } from '@/store';
import { IDenomStatistic, IIbcchain, IPaginationParams } from '@/types/interface/index.interface';
import {
    IChannelChain,
    IRelayerTransferItem,
    IRequestRelayerTransfer,
    IRtTokenInfo
} from '@/types/interface/relayers.interface';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { Ref } from 'vue';
import { BigNumber } from 'bignumber.js';
import { getRelayedTrendAPI } from '@/api/relayers';
import { RelayerTrendData, BarData } from '@/types/interface/relayers.interface';
import { useWindowSize } from '@vueuse/core';

export const useGetRelayerDetailsInfo = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const relayerIcon = ref<string>('');
    const relayerName = ref<string>('');
    const servedChainsInfo = ref<string[]>([]);
    const relayedTotalTxs = ref<number>(0);
    const relayedSuccessTxs = ref<number>(0);
    const relayerInfo = ref<IDenomStatistic>(RELAYER_DETAILS_INFO);
    const channelPairsInfo = ref<IChannelChain[]>([]);
    const isShowModal = ref<boolean>(false);
    // 根据 chain_a 的 chain_name 排序
    const sortChannelPairsByChainName = async (channelPairsInfoArr: IChannelChain[]) => {
        if (!channelPairsInfoArr?.length) return [];
        const chainChannelArr = [];
        for (const i in channelPairsInfoArr) {
            const chainInfo = await ChainHelper.getChainInfoByKey(channelPairsInfoArr[i].chain_a);
            if (chainInfo) {
                chainChannelArr.push({
                    chainName: chainInfo.chain_name,
                    channelInfo: channelPairsInfoArr[i]
                });
            }
        }
        const cosmosChainChannel = chainChannelArr
            .filter((item) => item.chainName === CHAINNAME.COSMOSHUB)
            .map((item) => item.channelInfo);

        const irishubChainChannel = chainChannelArr
            .filter((item) => item.chainName === CHAINNAME.IRISHUB)
            .map((item) => item.channelInfo);
        const otherChainChannel = chainChannelArr
            .filter(
                (item) =>
                    item.chainName !== CHAINNAME.COSMOSHUB && item.chainName !== CHAINNAME.IRISHUB
            )
            .sort((a, b) => {
                return a.chainName.localeCompare(b.chainName);
            })
            .map((item) => item.channelInfo);

        return [...cosmosChainChannel, ...irishubChainChannel, ...otherChainChannel];
    };

    const getRelayerDetailsInfo = () => {
        const route = useRoute();
        const relayerId: string = route?.params?.relayerId as string;
        const getRelayerDetailsByRelayerId = async () => {
            ibcStatisticsChainsStore.isShowLoading = true;
            try {
                const { code, data, message } = await getRelayerDetailsByRelayerIdAPI(relayerId);
                ibcStatisticsChainsStore.isShowLoading = false;
                if (code === API_CODE.success) {
                    if (data) {
                        relayerIcon.value = data.relayer_icon;
                        relayerName.value = data.relayer_name;
                        servedChainsInfo.value = data.served_chains_info;
                        relayedTotalTxs.value = data.relayed_total_txs;
                        relayedSuccessTxs.value = data.relayed_success_txs;
                        relayerInfo.value.total_relayed_value.count = data.relayed_total_txs_value;
                        relayerInfo.value.total_txs.count = relayedTotalTxs.value;
                        relayerInfo.value.served_channel_pairs.count =
                            data.channel_pair_info?.length;
                        relayerInfo.value.total_fee_cost.count = data.total_fee_value;
                        channelPairsInfo.value = await sortChannelPairsByChainName(
                            data.channel_pair_info
                        );
                    }
                } else if (code === API_CODE.unRegisteredRelayer) {
                    isShowModal.value = true;
                } else {
                    ibcStatisticsChainsStore.isShow500 = true;
                    console.error(message);
                }
            } catch (error) {
                ibcStatisticsChainsStore.isShowLoading = false;
                ibcStatisticsChainsStore.isShow500 = true;
                console.error(error);
            }
        };
        getRelayerDetailsByRelayerId();
    };
    const subTitle = computed(() => {
        return `A total of ${
            isShowModal.value ? '--' : servedChainsInfo.value?.length
        } blockchains served`;
    });
    onMounted(() => {
        getRelayerDetailsInfo();
    });
    return {
        relayerIcon,
        relayerName,
        servedChainsInfo,
        relayedTotalTxs,
        relayedSuccessTxs,
        relayerInfo,
        channelPairsInfo,
        isShowModal,
        subTitle
    };
};

export const useChannelPairsAddressHeight = () => {
    const getPairAddressListHeight = (item: IChannelChain) => {
        const chainAAddressList = item.chain_a_addresses;
        const chainBAddressList = item.chain_b_addresses;
        const maxChainLength = Math.max(chainAAddressList.length, chainBAddressList.length);
        const maxHeight = maxChainLength * SINGLE_ADDRESS_HEIGHT;
        return maxHeight;
    };
    return {
        getPairAddressListHeight
    };
};

export const useGetTransferTypeData = () => {
    const recvPacketTxs = ref<number>(0);
    const acknowledgePacketTxs = ref<number>(0);
    const timeoutPacketTxs = ref<number>(0);
    const transferTypeLoading = ref<boolean>(true);
    const getTransferTypeTxsData = () => {
        const route = useRoute();
        const relayerId: string = route?.params?.relayerId as string;
        const getTransferTypeTxs = async () => {
            try {
                const { code, data, message } = await getTransferTypeTxsAPI(relayerId);
                transferTypeLoading.value = false;
                if (code === API_CODE.success) {
                    if (data) {
                        recvPacketTxs.value = data.recv_packet_txs;
                        acknowledgePacketTxs.value = data.acknowledge_packet_txs;
                        timeoutPacketTxs.value = data.timeout_packet_txs;
                    } else {
                        console.error(message);
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                transferTypeLoading.value = false;
                console.error(error);
            }
        };
        getTransferTypeTxs();
    };
    const totalTxsCount = computed(() => {
        const totalTxs = recvPacketTxs.value + acknowledgePacketTxs.value + timeoutPacketTxs.value;
        return totalTxs;
    });
    const recvPacketTxsPercent = ref<number>(0);
    const getRecvPacketTxsPercent = computed({
        get() {
            const getRecvPacketTxsPercentData = formatTransfer_success_txs(
                recvPacketTxs.value,
                totalTxsCount.value
            );
            return getRecvPacketTxsPercentData;
        },
        set(_new) {
            recvPacketTxsPercent.value = _new;
        }
    });
    const acknowledgePacketTxsPercent = computed(() => {
        const getRecvPacketTxsPercentData = formatTransfer_success_txs(
            acknowledgePacketTxs.value,
            totalTxsCount.value
        );
        return getRecvPacketTxsPercentData;
    });
    const timeoutPacketTxsPercent = computed(() => {
        const getRecvPacketTxsPercentData = formatTransfer_success_txs(
            timeoutPacketTxs.value,
            totalTxsCount.value
        );
        return getRecvPacketTxsPercentData;
    });
    const totalTxsPersent = computed(() => {
        const totalPercentData =
            getRecvPacketTxsPercent.value +
            acknowledgePacketTxsPercent.value +
            timeoutPacketTxsPercent.value;
        return totalPercentData;
    });
    watch(totalTxsPersent, (newTotalTxsPercent) => {
        if (newTotalTxsPercent) {
            if (newTotalTxsPercent > 100) {
                getRecvPacketTxsPercent.value -= newTotalTxsPercent - 100;
            } else if (newTotalTxsPercent < 100) {
                getRecvPacketTxsPercent.value += 100 - newTotalTxsPercent;
            } else {
                getRecvPacketTxsPercent.value = getRecvPacketTxsPercent.value;
            }
        }
    });

    onMounted(() => {
        getTransferTypeTxsData();
    });
    return {
        recvPacketTxs,
        acknowledgePacketTxs,
        timeoutPacketTxs,
        totalTxsCount,
        recvPacketTxsPercent,
        acknowledgePacketTxsPercent,
        timeoutPacketTxsPercent,
        transferTypeLoading
    };
};

export const useTransferTypeChart = (
    type: Ref<string>,
    txsCount: Ref<number>,
    txsPercent: Ref<number>,
    totalTxsCount: Ref<number>,
    processColor: Ref<string>
) => {
    const transferTypeDom = ref<HTMLElement>();
    let transferTypeChart: echarts.ECharts;
    let typeShort = '';
    switch (type.value) {
        case TRANSFER_TYPE.receive.label:
            typeShort = TRANSFER_TYPE.receive.short;
            break;
        case TRANSFER_TYPE.acknowledge.label:
            typeShort = TRANSFER_TYPE.acknowledge.short;
            break;
        case TRANSFER_TYPE.timeout.label:
            typeShort = TRANSFER_TYPE.timeout.short;
            break;
    }
    const option = {
        title: {
            text: `${txsPercent.value}%`,
            left: 'center',
            top: 'center',
            textStyle: {
                color: '#000',
                fontSize: 16,
                fontFamily: 'GolosUI_Medium',
                fontWeight: 400,
                lineHeight: 20
            }
        },
        tooltip: {
            position: ['65%', '13%'],
            backgroundColor: null,
            borderWidth: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;',
            formatter: () => {
                return `
                    <div style="position: relative;padding: 14px 12px;background: #FFFFFF;box-shadow: 0px 2px 8px 0px #D9DEEC;border-radius: 4px;border: 1px solid #D9DFEE;">
                        <span style="font-size: 14px;font-family: GolosUI_Medium;color: #000;line-height: 18px;">${typeShort} Txs: </span>
                        <span style="margin-left: 8px;font-size: 14px;color: rgba(0,0,0,0.75);line-height: 18px;">
                            ${formatBigNumber(txsCount.value)}
                        </span>
                        <div style="position: absolute;top: 50%;left: -20px;transform: translateY(-50%);border-top: 5px solid transparent;border-right: 8px solid #3D50FF;border-bottom: 5px solid transparent;border-left: 8px solid transparent;"></div>
                    </div>
                `;
            }
        },
        visualMap: {
            show: false
        },
        series: [
            {
                type: 'pie',
                radius: [34, 50],
                data: [
                    {
                        value: `${txsCount.value}`,
                        itemStyle: { color: `${processColor.value}` }
                    },
                    {
                        value: `${totalTxsCount.value - txsCount.value}`,
                        itemStyle: { color: 'rgba(0,0,0,0.05)' }
                    }
                ],
                emphasis: {
                    scale: false,
                    label: {
                        show: false
                    }
                },
                label: {
                    show: false
                },
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff'
                }
            }
        ]
    };
    const transferTypeResize = () => {
        transferTypeChart && transferTypeChart.resize();
    };
    onMounted(() => {
        transferTypeChart = echarts.init(transferTypeDom.value as HTMLElement);
        option && transferTypeChart.setOption(option, true);
        window.addEventListener('resize', transferTypeResize);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', transferTypeResize);
    });
    return {
        transferTypeDom
    };
};

export const useGetSuccessRatePercent = (
    relayedSuccessTxs: Ref<number>,
    relayedTotalTxs: Ref<number>
) => {
    const successRatePercent = computed(() => {
        const successRate = formatTransfer_success_txs(
            relayedSuccessTxs.value,
            relayedTotalTxs.value
        );
        return successRate;
    });
    return {
        successRatePercent
    };
};

export const useSuccessRateChart = (successRatePercent: Ref<number>) => {
    const successRateDom = ref<HTMLElement>();
    let successRateChart: echarts.ECharts;
    const option = {
        series: [
            {
                type: 'gauge',
                radius: '78%',
                splitNumber: 5,
                progress: {
                    show: true,
                    width: 14,
                    itemStyle: {
                        color: '#3D50FF'
                    }
                },
                splitLine: {
                    length: 1,
                    distance: -23,
                    lineStyle: {
                        width: 4,
                        color: '#BAC1FF',
                        cap: 'round'
                    }
                },
                axisTick: {
                    show: true,
                    splitNumber: 100,
                    length: 1,
                    distance: -22,
                    lineStyle: {
                        color: '#BAC1FF',
                        type: 'solid'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 14,
                        color: [[1, '#F2F2F2']]
                    }
                },
                axisLabel: {
                    distance: -8,
                    color: 'rgba(0,0,0,0.35)',
                    fontSize: 12,
                    lineHeight: 18
                },
                pointer: {
                    length: '100%',
                    icon: 'triangle',
                    width: 4,
                    itemStyle: {
                        color: '#BAC1FF'
                    }
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 4,
                    itemStyle: {
                        borderWidth: 4,
                        borderColor: '#BAC1FF'
                    }
                },
                title: {
                    show: false
                },
                detail: {
                    offsetCenter: [0, '85%'],
                    fontSize: 24,
                    fontFamily: 'GolosUI_Medium',
                    valueAnimation: true,
                    formatter: function (value: number) {
                        return `${value.toFixed(0)}%`;
                    }
                },
                data: [
                    {
                        value: successRatePercent.value
                    }
                ]
            },
            {
                type: 'gauge',
                radius: '54%',
                axisLine: {
                    lineStyle: {
                        width: 0,
                        color: [
                            [0.1, 'rgba(61,80,255,0.1)'],
                            [1, 'transparent']
                        ]
                    }
                },
                progress: {
                    show: true,
                    width: 12,
                    itemStyle: {
                        color: 'rgba(61,80,255,0.1)'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                pointer: {
                    length: '100%',
                    icon: 'triangle',
                    width: 4,
                    itemStyle: {
                        color: '#BAC1FF'
                    }
                },
                detail: { show: false },
                data: [
                    {
                        value: successRatePercent.value
                    }
                ]
            }
        ]
    };
    const successRateResize = () => {
        successRateChart && successRateChart.resize();
    };
    onMounted(() => {
        successRateChart = echarts.init(successRateDom.value as HTMLElement);
        option && successRateChart.setOption(option, true);
        window.addEventListener('resize', successRateResize);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', successRateResize);
    });
    return {
        successRateDom
    };
};

export const usePagination = () => {
    const pagination = reactive<IPaginationParams>({
        total: 0,
        current: 1,
        pageSize: 5
    });
    return {
        pagination
    };
};

export const useSelectedSearch = (
    servedChainsInfo: Ref<string[]>,
    pagination: IPaginationParams
) => {
    const router = useRouter();
    const route = useRoute();
    const relayerChain = ref<IIbcchain[]>([]);
    const relayerId: string = route?.params?.relayerId as string;
    const relayerTransferTableData = ref<IRelayerTransferItem[]>([]);
    const dateRange = reactive({ value: [] });
    const disabledDate = (current: any) =>
        current && (current > dayjs().endOf('day') || current < dayjs(1617007625 * 1000));
    const startTxTime = ref<number | undefined>(undefined);
    const endTxTime = ref<number | undefined>(undefined);
    const rtTableLoading = ref<boolean>(true);
    watch(servedChainsInfo, (newServedChainsInfo) => {
        const sortServedChainsInfo = async () => {
            if (!newServedChainsInfo?.length) return [];
            const chainInfoArr: IIbcchain[] = [];
            for (const i in newServedChainsInfo) {
                const chainInfo = await ChainHelper.getChainInfoByKey(newServedChainsInfo[i]);
                if (chainInfo) {
                    chainInfoArr.push(chainInfo);
                }
            }
            relayerChain.value = [...chainInfoArr];
        };
        sortServedChainsInfo();
    });
    const relayerChainData = computed(() => {
        return [
            {
                children: ChainHelper.sortArrsByNames(relayerChain.value).map((item) => ({
                    title: item.chain_name,
                    id: item.chain_id,
                    icon: item.icon || CHAIN_DEFAULT_ICON,
                    metaData: item
                }))
            }
        ];
    });
    const defaultChain = computed(() => {
        return relayerChainData.value[0]?.children[0];
    });
    const searchChain = ref<string>(defaultChain.value?.id);
    const getRelayerTransferTxs = (
        params: IRequestRelayerTransfer,
        page_num = 1,
        page_size = 5,
        use_count = false
    ) => {
        const getRelayerTransferTxsData = async () => {
            try {
                const { code, data, message } = await getRelayerTransferListAPI(relayerId, {
                    ...params,
                    page_num,
                    page_size,
                    use_count
                });
                rtTableLoading.value = false;
                if (code === API_CODE.success) {
                    if (data) {
                        if (typeof data === 'number') {
                            pagination.total = data;
                        } else {
                            relayerTransferTableData.value = data.items;
                        }
                    } else {
                        console.error(message);
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
                rtTableLoading.value = false;
                console.error(error);
            }
        };
        getRelayerTransferTxsData();
    };
    const queryDatas = (params: IRequestRelayerTransfer) => {
        getRelayerTransferTxs(params, 1, 5, true);
        getRelayerTransferTxs(params, pagination.current, pagination.pageSize, false);
    };
    watch(defaultChain, (newDefaultChain) => {
        if (newDefaultChain) {
            queryDatas({
                chain: newDefaultChain.id,
                page_num: 1,
                page_size: 5
            });
        }
    });
    const onSelectedChain = (selectedChainInfo?: IDataItem) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Chain`
        );
        pagination.current = 1;
        const chain = selectedChainInfo?.id;
        searchChain.value = chain ? String(chain) : '';
        if (chain) {
            refreshList({
                chain: chain as string,
                tx_time_start: startTxTime.value?.toString(),
                tx_time_end: endTxTime.value?.toString(),
                page_num: pagination.current,
                page_size: pagination.pageSize
            });
        }
    };
    const startTime = (time: string | number | Date) => {
        const nowTimeDate = new Date(time);
        return nowTimeDate.setHours(0, 0, 0, 0);
    };
    const onChangeRangePicker = (dates: any) => {
        dateRange.value = dates;
        startTxTime.value = Math.floor(startTime(dayjs(dates[0]).valueOf()) / 1000);
        endTxTime.value = Math.floor(
            startTime(dayjs(dates[1]).valueOf()) / 1000 + 60 * 60 * 24 - 1
        );
        refreshList({
            chain: searchChain.value || defaultChain.value.id,
            tx_time_start: startTxTime.value?.toString(),
            tx_time_end: endTxTime.value?.toString(),
            page_num: 1,
            page_size: 5
        });
    };
    const onClickReset = () => {
        pagination.current = 1;
        searchChain.value = defaultChain.value.id;
        dateRange.value = [];
        startTxTime.value = undefined;
        endTxTime.value = undefined;
        refreshList({
            chain: defaultChain.value.id,
            page_num: 1,
            page_size: 5
        });
    };
    const onPaginationChange = (current: number, pageSize: number) => {
        pagination.current = current;
        refreshList({
            chain: searchChain.value || defaultChain.value.id,
            tx_time_start: startTxTime.value?.toString(),
            tx_time_end: endTxTime.value?.toString(),
            page_num: pagination.current,
            page_size: pageSize
        });
    };
    const refreshList = (params: IRequestRelayerTransfer) => {
        queryDatas(params);
    };
    const formatTransferType = (type: string) => {
        switch (type) {
            case TRANSFER_TYPE.transfer.type:
                return TRANSFER_TYPE.transfer.short;
            case TRANSFER_TYPE.receive.type:
                return TRANSFER_TYPE.receive.short;
            case TRANSFER_TYPE.acknowledge.type:
                return TRANSFER_TYPE.acknowledge.short;
            case TRANSFER_TYPE.timeout.type:
                return TRANSFER_TYPE.timeout.short;
        }
    };
    return {
        defaultChain,
        relayerChainData,
        searchChain,
        onSelectedChain,
        relayerTransferTableData,
        formatTransferType,
        onPaginationChange,
        onClickReset,
        dateRange,
        disabledDate,
        onChangeRangePicker,
        rtTableLoading
    };
};

export const useFormatTokenDenom = (tokenInfo: Ref<IRtTokenInfo>, type: Ref<string>) => {
    const chain = ref<string>('');
    const denom = ref<string>('');
    const amount = ref<string>('');
    const tokenLogo = ref<string>(TOKEN_DEFAULT_ICON);
    const tokenSymbol = ref<string>('');
    const tokenAmount = ref<string>('');
    switch (type.value) {
        case RT_COLUMN_TYPE.token:
            chain.value = tokenInfo.value.base_denom_chain || '';
            denom.value = tokenInfo.value.base_denom || '';
            amount.value = tokenInfo.value.amount;
            break;
        case RT_COLUMN_TYPE.fee:
            chain.value = tokenInfo.value.denom_chain || '';
            denom.value = tokenInfo.value.denom || '';
            amount.value = tokenInfo.value.amount;
            break;
    }

    const formarTokenDenomByChainDenom = async () => {
        const { feeAmount, tokenIcon, symbol } = await useMatchBaseDenom(
            chain.value,
            denom.value,
            amount.value
        );
        tokenLogo.value = tokenIcon;
        tokenSymbol.value = symbol;
        tokenAmount.value = feeAmount;
    };
    formarTokenDenomByChainDenom();
    return {
        tokenLogo,
        tokenSymbol,
        tokenAmount
    };
};

export const useRelayedTrend = () => {
    const relayedTrendChoose = ref(0);
    const relayedTrendDom = ref<HTMLElement>();
    const route = useRoute();
    const relayerId: string = route.params.relayerId as string;
    const relayedTrendLoading = ref(true);
    const relayedTrendNoData = ref(false);
    const relayedTrendNetworkError = ref(false);
    const relayedAbnormalText = computed(() => {
        if (relayedTrendNoData.value) {
            return API_ERRPR_MESSAGE.noData;
        } else if (relayedTrendNetworkError.value) {
            return API_ERRPR_MESSAGE.networkError;
        } else {
            return '';
        }
    });
    const { width: widthClient } = useWindowSize();
    let relayedTrendChart: echarts.ECharts;
    const option: any = {
        grid: {
            left: 0,
            right: 0,
            top: 32,
            bottom: 0,
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            position: 'top',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;',
            formatter: (params: any) => {
                // <div style="width: 100%; height: 8px; background-color: rgba(61, 80, 255, 0.1)"></div>
                return `<div style="display: flex; flex-direction: column; align-items: center; transform: translate(0,6px);">
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: column;
                                            margin-bottom: 4px;
                                            background: #ffffff;
                                            box-shadow: 0px 2px 8px 0px #d9deec;
                                            border-radius: 4px;
                                            border: 1px solid #d9dfee;
                                        "
                                    >
                                        <div style="display: flex; justify-content: flex-start; padding: 12px 12px 8px">
                                            <span
                                                style="
                                                    font-size: 14px;
                                                    font-family: 'GolosUI_Medium';
                                                    color: #000;
                                                    font-weight: 500;
                                                    line-height: 18px;
                                                "
                                                >Transfers:
                                            </span>
                                            <span
                                                style="
                                                    margin-left: 8px;
                                                    font-size: 14px;
                                                    color: rgba(0, 0, 0, 0.75);
                                                    font-family: 'GolosUIWebRegular';
                                                    font-weight: 400;
                                                    line-height: 18px;
                                                "
                                                >${formatBigNumber(params.data.value, 0)}</span
                                            >
                                        </div>
                                        <div style="display: flex; justify-content: flex-start; padding: 0px 12px 12px">
                                            <span
                                                style="
                                                    font-size: 14px;
                                                    font-family: 'GolosUI_Medium';
                                                    color: #000;
                                                    font-weight: 500;
                                                    line-height: 18px;
                                                "
                                                >Date:
                                            </span>
                                            <span
                                                style="
                                                    margin-left: 8px;
                                                    font-size: 14px;
                                                    color: rgba(0, 0, 0, 0.75);
                                                    font-family: 'GolosUIWebRegular';
                                                    font-weight: 400;
                                                    line-height: 18px;
                                                "
                                                >${params.name}</span
                                            >
                                        </div>
                                    </div>
                                    <div
                                        style="
                                            border-top: 8px solid #3d50ff;
                                            border-right: 5px solid transparent;
                                            border-bottom: 8px solid transparent;
                                            border-left: 5px solid transparent;
                                        "
                                    ></div>
                                </div>`;
            }
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    margin: 16,
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'GolosUIWebRegular',
                    fontWeight: 400,
                    lineHeight: 18
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 3,
                    margin: 8,
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'GolosUIWebRegular',
                    fontWeight: 'normal',
                    lineHeight: 18
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0.15)',
                        width: 2
                    }
                }
            }
        ],
        series: [
            {
                type: 'bar',
                barWidth: 10,
                barMinHeight: 1,
                data: [],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(61,80,255,0.6)' },
                        { offset: 1, color: 'rgba(61,80,255,0.35)' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: 'rgba(61, 80, 255, 1)'
                    }
                }
            }
        ]
    };
    const relayedTrendData = reactive<RelayerTrendData>({
        date: [],
        txs: [],
        txsValue: []
    });
    const relayedTrendChooseBtnFn = (index: number) => {
        relayedTrendChoose.value = index;
        if (relayedTrendChoose.value === 0) {
            option.series[0].data = relayedTrendData.txs;
        } else {
            option.series[0].data = relayedTrendData.txsValue;
        }
        relayedTrendChart && relayedTrendChart.setOption(option, true);
    };
    const changeOptionByWidth = () => {
        option.series[0].barWidth = widthClient.value > 560 ? 10 : 8;
        option.tooltip.confine = widthClient.value > 496 ? false : true;
        option.grid.top = widthClient.value > 496 ? 32 : 28;
    };
    const getRelayedTrendData = async () => {
        try {
            relayedTrendLoading.value = true;
            relayedTrendNoData.value = false;
            relayedTrendNetworkError.value = false;
            const { code, data, message } = await getRelayedTrendAPI({
                relayer_id: relayerId
            });
            relayedTrendLoading.value = false;
            if (code === API_CODE.success) {
                if (data && data.length > 0) {
                    const originDates: string[] = [];
                    const originTxs: number[] = [];
                    const originTxsValues: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        originDates.push(item.date);
                        originTxs.push(item.txs);
                        originTxsValues.push(item.txs_value || '0');
                    }
                    const maxTxs = BigNumber.max.apply(null, originTxs).toString();
                    const maxTxsValue = BigNumber.max.apply(null, originTxsValues).toString();
                    const txs: BarData[] = originTxs.map((txs) => {
                        return {
                            value: txs,
                            itemStyle: {
                                color:
                                    txs.toString() === maxTxs
                                        ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: '#3D50FF' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: 'rgba(61,80,255,0.6)' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                            }
                        };
                    });
                    const txsValue: BarData[] = originTxsValues.map((txsValue) => {
                        return {
                            value: txsValue,
                            itemStyle: {
                                color:
                                    txsValue.toString() === maxTxsValue
                                        ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: '#3D50FF' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: 'rgba(61,80,255,0.6)' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                            }
                        };
                    });
                    relayedTrendData.date = originDates.map((originData) => {
                        const linkSymbol = '-';
                        return originData.split(linkSymbol).splice(1).join(linkSymbol);
                    });
                    relayedTrendData.txs = txs;
                    relayedTrendData.txsValue = txsValue;
                } else {
                    relayedTrendNoData.value = true;
                    relayedTrendData.date = [];
                    relayedTrendData.txs = [];
                    relayedTrendData.txsValue = [];
                }
            } else if (code === API_CODE.unRegisteredRelayer) {
                relayedTrendNoData.value = true;
                relayedTrendData.date = [];
                relayedTrendData.txs = [];
                relayedTrendData.txsValue = [];
                console.error(message);
            } else {
                relayedTrendNetworkError.value = true;
                console.error(message);
            }
        } catch (error) {
            relayedTrendLoading.value = false;
            relayedTrendNetworkError.value = true;
            console.error(error);
        }
    };
    const resizeFn = () => {
        if (relayedTrendChart) {
            changeOptionByWidth();
            relayedTrendChart.setOption(option, true);
            relayedTrendChart.resize();
        }
    };
    onMounted(async () => {
        await getRelayedTrendData();
        relayedTrendChart = echarts.init(relayedTrendDom.value as HTMLElement);
        option.xAxis[0].data = relayedTrendData.date;
        relayedTrendChooseBtnFn(0);
        changeOptionByWidth();
        relayedTrendChart.setOption(option, true);
        window.addEventListener('resize', resizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeFn);
    });
    return {
        relayedTrendDom,
        relayedTrendChoose,
        relayedTrendChooseBtnFn,
        relayedTrendLoading,
        relayedTrendNoData,
        relayedTrendNetworkError,
        relayedAbnormalText
    };
};
