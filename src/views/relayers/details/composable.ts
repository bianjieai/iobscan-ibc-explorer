import { getChartTooltip } from '@/helper/relayerHelper';
import {
    getRelayerDetailsByRelayerIdAPI,
    getRelayerTransferListAPI,
    getTransferTypeTxsAPI
} from '@/api/relayers';
import { IDataItem } from '@/components/BjSelect/interface';
import { useMatchBaseDenom } from '@/composables';
import {
    CHAINNAME,
    CHAIN_DEFAULT_ICON,
    RELAYER_DEFAULT_ICON,
    TOKEN_DEFAULT_ICON,
    TRANSFER_TYPE
} from '@/constants';
import { API_CODE, API_ERRPR_MESSAGE } from '@/constants/apiCode';
import { RELAYER_DETAILS_INFO, RT_COLUMN_TYPE, SINGLE_ADDRESS_HEIGHT } from '@/constants/relayers';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber, formatNum } from '@/helper/parseStringHelper';
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
import { PIE_COLOR_LIST, OPACITY_PIE_COLOR_LIST } from '@/constants/relayers';
import { getTotalFeeCostAPI, getTotalRelayedValueAPI } from '@/api/relayers';
import { DEFAULT_DISPLAY_TEXT } from '@/constants';
import {
    RelayedValueData,
    FormatDenomItem,
    RelatedAssetsPieType
} from '@/types/interface/relayers.interface';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatString } from '@/utils/stringTools';
import { calculatePercentage } from '@/utils/calculate';

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
    // chain_name 先左右排，再上下排
    const sortChannelPairsByChainName = async (channelPairsInfoArr: IChannelChain[]) => {
        if (!channelPairsInfoArr?.length) return [];
        const chainChannelLRSort = ChainHelper.sortByChainName(channelPairsInfoArr);
        const chainChannelArr = [];
        for (const i in chainChannelLRSort) {
            const chainInfo = await ChainHelper.getChainInfoByKey(chainChannelLRSort[i].chain_a);
            if (chainInfo) {
                chainChannelArr.push({
                    chainName: chainInfo.chain_name,
                    channelInfo: chainChannelLRSort[i]
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
                    relayerIcon.value = RELAYER_DEFAULT_ICON;
                    isShowModal.value = true;
                } else {
                    ibcStatisticsChainsStore.isShow500 = true;
                    console.error(message);
                }
            } catch (error) {
                ibcStatisticsChainsStore.isShow500 = true;
                console.error(error);
            } finally {
                ibcStatisticsChainsStore.isShowLoading = false;
            }
        };
        getRelayerDetailsByRelayerId();
    };
    const subTitle = computed(() => {
        return `A total of ${
            isShowModal.value ? '--' : servedChainsInfo.value?.length
        } blockchains served`;
    });
    const relayerImgSrc = (relayerIcon: string, relayerName: string): string => {
        if (relayerIcon) {
            return relayerIcon;
        } else if (!relayerName) {
            return RELAYER_DEFAULT_ICON;
        } else {
            return '';
        }
    };
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
        subTitle,
        relayerImgSrc
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
                    pagination.total = 0;
                    relayerTransferTableData.value = [];
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
        console.log(selectedChainInfo, 'selectedChainInfo');

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
    const tokenAmount = ref<string | number>('');
    const formarTokenDenomByChainDenom = async () => {
        const { feeAmount, tokenIcon, symbol } = await useMatchBaseDenom(
            chain.value,
            denom.value,
            amount.value
        );
        tokenLogo.value = tokenIcon;
        tokenSymbol.value = symbol;
        tokenAmount.value = formatNum(feeAmount);
    };
    watch(
        [tokenInfo, type],
        ([newTokenInfo, newType]) => {
            switch (newType) {
                case RT_COLUMN_TYPE.token:
                    chain.value = newTokenInfo.base_denom_chain || '';
                    denom.value = newTokenInfo.base_denom || '';
                    amount.value = newTokenInfo.amount;
                    break;
                case RT_COLUMN_TYPE.fee:
                    chain.value = newTokenInfo.denom_chain || '';
                    denom.value = newTokenInfo.denom || '';
                    amount.value = newTokenInfo.amount;
                    break;
            }
            formarTokenDenomByChainDenom();
        },
        { immediate: true }
    );

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

    const chartTooltip = computed(() => {
        return getChartTooltip(relayedTrendChoose.value);
    });
    const tooltipBreakpoint = 560;
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
                if (widthClient.value > tooltipBreakpoint) {
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
                                                    >${chartTooltip.value.key}:
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
                                                    >${chartTooltip.value.symbol}${formatBigNumber(
                        params.data.value,
                        0
                    )}</span
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
                } else {
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
                                                    >${chartTooltip.value.key}:
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
                                                    >${chartTooltip.value.symbol}${formatBigNumber(
                        params.data.value,
                        0
                    )}</span
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
                                    </div>`;
                }
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
            option.series[0].data = relayedTrendData.txsValue;
        } else {
            option.series[0].data = relayedTrendData.txs;
        }
        relayedTrendChart && relayedTrendChart.setOption(option, true);
    };
    const changeOptionByWidth = () => {
        option.series[0].barWidth = widthClient.value > 560 ? 10 : 8;
        option.tooltip.confine = widthClient.value > tooltipBreakpoint ? false : true;
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

export const useRelatedAssetChart = (
    relayedAssetsChoose: Ref<number>,
    type: Ref<RelatedAssetsPieType>
) => {
    const route = useRoute();
    const relayerId: string = route.params.relayerId as string;

    const chartTooltip = computed(() => {
        return getChartTooltip(relayedAssetsChoose.value);
    });

    const getBaseOption = () => {
        const baseOption = {
            tooltip: {
                trigger: 'item',
                backgroundColor: null,
                borderWidth: 0,
                padding: 0,
                extraCssText: 'box-shadow: 0 0 0 transparent;',
                formatter: (params: any) => {
                    return `<div style="display: flex; align-items: center; transform: translate(6px, 0)">
                                <div
                                    style="
                                    display: flex;
                                    margin-left: 4px;
                                    background: #ffffff;
                                    box-shadow: 0px 2px 8px 0px #d9deec;
                                    border-radius: 4px;
                                    border: 1px solid #d9dfee;
                                    "
                                    >
                                      <div>
                                          <div style="display: flex; justify-content: flex-start; padding: 12px 12px 6px">
                                              <img
                                                  src="${params.data.imgUrl}"
                                                  style="width: 20px; height: 20px"
                                              />
                                              <span
                                                  style="
                                                      margin-left: 8px;
                                                      font-size: 16px;
                                                      font-family: GolosUI-Medium, GolosUI;
                                                      font-weight: 500;
                                                      color: #000000;
                                                      line-height: 20px;
                                                  "
                                                  >${formatString(params.name)}</span
                                              >
                                          </div>
                                          <div style="display: flex; justify-content: flex-start; padding: 0px 12px 14px">
                                              <span
                                                  style="
                                                      font-size: 14px;
                                                      font-family: 'GolosUI_Medium';
                                                      color: #000;
                                                      font-weight: 500;
                                                      line-height: 18px;
                                                  "
                                                  >${chartTooltip.value.key}:
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
                                                  >${chartTooltip.value.symbol}${formatBigNumber(
                        params.data.value,
                        0
                    )}</span
                                              >
                                              <span
                                                  style="
                                                      font-size: 14px;
                                                      font-family: GolosUI-Medium, GolosUI;
                                                      font-weight: 500;
                                                      color: rgba(0, 0, 0, 0.34);
                                                      line-height: 18px;
                                                  "
                                                  >/${params.data.percent}%</span
                                              >
                                          </div>
                                      </div>
                                  </div>
                              </div>`;
                }
            },
            legend: {
                top: null,
                bottom: 10,
                right: 0,
                orient: 'vertical',
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 9,
                padding: 0,
                formatter: (name: string) => {
                    return formatString(name);
                },
                textStyle: {
                    padding: [1.4, 0, 0, 0],
                    color: '#000000',
                    fontWeight: 400,
                    fontFamily: 'GolosUIWebRegular',
                    fontSize: 12
                }
            },
            series: [
                {
                    type: 'pie',
                    silent: true,
                    radius: [68, 80],
                    minAngle: 2,
                    center: [108, '50%'],
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 2,
                        opacity: 1
                    },
                    label: {
                        show: true,
                        top: 'middle',
                        position: 'center',
                        padding: [7, 0, 0, 0],
                        opacity: 1,
                        rich: {
                            text: {
                                color: '#000000',
                                fontWeight: 400,
                                fontFamily: 'GolosUIWebRegular',
                                fontSize: 16,
                                lineHeight: 16
                            },
                            total: {
                                color: '#000000',
                                fontWeight: 600,
                                fontFamily: 'GolosUIWebRegular',
                                fontSize: 24,
                                lineHeight: 24
                            }
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: []
                },
                {
                    type: 'pie',
                    radius: [80, 100],
                    center: [108, '50%'],
                    minAngle: 2,
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    emphasis: {
                        scaleSize: 8
                    },
                    data: []
                }
            ]
        };
        return baseOption;
    };
    const { width: widthClient } = useWindowSize();

    // todo dj 饼图样式需要调整
    const changeRelayedAssetsOption = (
        option: any,
        widthClient: number,
        isTwoColumnsLegend: boolean
    ) => {
        if (widthClient > 1183) {
            if (isTwoColumnsLegend) {
                option.legend.top = '35%';
            } else {
                option.legend.top = null;
            }
            option.legend.bottom = 10;
            option.legend.right = 0;
            option.series[0].radius = [68, 80];
            option.series[0].center = [108, '50%'];
            option.series[1].radius = [80, 100];
            option.series[1].center = [108, '50%'];
        } else {
            if (isTwoColumnsLegend) {
                option.legend.top = '25%';
                option.legend.bottom = 10;
                option.legend.right = 10;
                option.series[0].radius = [52, 60];
                option.series[0].center = [85, '53%'];
                option.series[1].radius = [60, 76];
                option.series[1].center = [85, '53%'];
            } else {
                option.legend.top = null;
                option.legend.bottom = 10;
                option.legend.right = 0;
                option.series[0].radius = [52, 60];
                option.series[0].center = [85, '53%'];
                option.series[1].radius = [60, 76];
                option.series[1].center = [85, '53%'];
            }
        }
    };

    const relayedValueDom = ref<HTMLElement>();
    const relayedValueOption: any = getBaseOption();
    let relayedValueChart: echarts.ECharts;
    const relayedValueLoading = ref(true);
    const relayedValueNoData = ref(false);
    const relayedValueNetworkError = ref(false);
    const changeRelayedValueOption = () => {
        const legend =
            relayedAssetsChoose.value === 0
                ? totalRelayedValueData.valueTwoLegend
                : totalRelayedValueData.txsTwoLegend;
        changeRelayedAssetsOption(relayedValueOption, widthClient.value, legend);
    };
    const relayedValueSizeFn = () => {
        if (relayedValueChart) {
            changeRelayedValueOption();
            relayedValueChart.setOption(relayedValueOption, true);
            relayedValueChart.resize();
        }
    };
    const relayedValueAbnormalText = computed(() => {
        if (relayedValueNoData.value) {
            return API_ERRPR_MESSAGE.noData;
        } else if (relayedValueNetworkError.value) {
            return API_ERRPR_MESSAGE.networkError;
        } else {
            return '';
        }
    });
    const totalRelayedValueData = reactive<RelayedValueData>({
        totalValue: DEFAULT_DISPLAY_TEXT,
        value: [],
        valueOpacity: [],
        txs: [],
        txsOpacity: [],
        totalTxs: DEFAULT_DISPLAY_TEXT,
        totalDenomCount: 0,
        valueTwoLegend: false,
        txsTwoLegend: false
    });
    const isRelayedValueType = computed(() => type.value === RelatedAssetsPieType.relayedValue);

    const totalRelayedTitle = computed(() => {
        if (relayedAssetsChoose.value === 0) {
            return `Total ${
                isRelayedValueType.value ? 'related Value' : 'Fee Cost'
            } $${formatBigNumber(totalRelayedValueData.totalValue, 0)}`;
        } else {
            return `Total ${isRelayedValueType.value ? 'related Txs' : 'Fee Txs'} ${formatBigNumber(
                totalRelayedValueData.totalTxs,
                0
            )}`;
        }
    });
    const getRelayedValueData = async () => {
        try {
            relayedValueLoading.value = true;
            relayedValueNoData.value = false;
            relayedValueNetworkError.value = false;
            const getDataApi = isRelayedValueType.value
                ? getTotalRelayedValueAPI
                : getTotalFeeCostAPI;
            const { code, data, message } = await getDataApi({
                relayer_id: relayerId
            });
            if (code === API_CODE.success) {
                if (data) {
                    if (!isRelayedValueType.value) {
                        (data as any).total_txs_value = (data as any).total_fee_value;
                        data.denom_list = data.denom_list.map((item) => {
                            item.txs_value = (item as any).fee_value;
                            item.base_denom = (item as any).denom;
                            item.base_denom_chain = (item as any).denom_chain;
                            return item;
                        });
                    }
                    totalRelayedValueData.totalValue = (data as any).total_txs_value;
                    totalRelayedValueData.totalTxs = data.total_txs;
                    totalRelayedValueData.totalDenomCount = data.total_denom_count;
                    const denomList: FormatDenomItem[] = [];
                    for (let i = 0; i < data.denom_list.length; i++) {
                        const item = data.denom_list[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        if (baseDenom) {
                            denomList.push({
                                imgUrl: baseDenom.icon || CHAIN_DEFAULT_ICON,
                                name: baseDenom.symbol,
                                ...item
                            });
                        } else {
                            denomList.push({
                                imgUrl: CHAIN_DEFAULT_ICON,
                                name: item.base_denom,
                                ...item
                            });
                        }
                    }
                    const valueDenomList = [...denomList];
                    const txsDenomList = [...denomList];
                    valueDenomList.sort((a, b) =>
                        new BigNumber(b.txs_value).comparedTo(a.txs_value)
                    );
                    txsDenomList.sort((a, b) => new BigNumber(b.txs).comparedTo(a.txs));
                    const needMaxNum = 12;
                    if (data.denom_list.length > needMaxNum) {
                        const spliceValueDenomList = valueDenomList.splice(needMaxNum - 1);
                        const spliceTxsDenomList = txsDenomList.splice(needMaxNum - 1);
                        const spliceValueTotal = spliceValueDenomList.reduce((total, current) => {
                            return new BigNumber(total).plus(current.txs_value).toString();
                        }, '0');
                        const spliceTxsTotal = spliceTxsDenomList.reduce((total, current) => {
                            return new BigNumber(total).plus(current.txs).toNumber();
                        }, 0);
                        valueDenomList.push({
                            imgUrl: CHAIN_DEFAULT_ICON,
                            name: 'Others',
                            base_denom: '',
                            base_denom_chain: '',
                            txs_value: spliceValueTotal,
                            txs: 0
                        });
                        txsDenomList.push({
                            imgUrl: CHAIN_DEFAULT_ICON,
                            name: 'Others',
                            base_denom: '',
                            base_denom_chain: '',
                            txs: spliceTxsTotal,
                            txs_value: ''
                        });
                    }
                    for (let i = 0; i < valueDenomList.length; i++) {
                        const valueDenom = valueDenomList[i];
                        totalRelayedValueData.valueOpacity.push({
                            value: valueDenom.txs_value,
                            itemStyle: {
                                color: OPACITY_PIE_COLOR_LIST[i]
                            }
                        });
                        totalRelayedValueData.value.push({
                            value: valueDenom.txs_value,
                            imgUrl: valueDenom.imgUrl,
                            name: valueDenom.name,
                            percent: calculatePercentage(
                                valueDenom.txs_value,
                                totalRelayedValueData.totalValue
                            ),
                            itemStyle: {
                                color: PIE_COLOR_LIST[i]
                            }
                        });
                    }
                    for (let i = 0; i < txsDenomList.length; i++) {
                        const txsDenom = txsDenomList[i];
                        totalRelayedValueData.txsOpacity.push({
                            value: txsDenom.txs,
                            itemStyle: {
                                color: OPACITY_PIE_COLOR_LIST[i]
                            }
                        });
                        totalRelayedValueData.txs.push({
                            value: txsDenom.txs,
                            imgUrl: txsDenom.imgUrl,
                            name: txsDenom.name,
                            percent: calculatePercentage(txsDenom.txs, data.total_txs),
                            itemStyle: {
                                color: PIE_COLOR_LIST[i]
                            }
                        });
                    }
                    totalRelayedValueData.valueTwoLegend = totalRelayedValueData.value.length > 6;
                    totalRelayedValueData.txsTwoLegend = totalRelayedValueData.txs.length > 6;
                } else {
                    relayedValueNoData.value = true;
                    totalRelayedValueData.totalValue = DEFAULT_DISPLAY_TEXT;
                    totalRelayedValueData.value = [];
                    totalRelayedValueData.valueOpacity = [];
                    totalRelayedValueData.totalTxs = DEFAULT_DISPLAY_TEXT;
                    totalRelayedValueData.txs = [];
                    totalRelayedValueData.txsOpacity = [];
                }
            } else if (code === API_CODE.unRegisteredRelayer) {
                relayedValueNoData.value = true;
                console.error(message);
            } else {
                relayedValueNetworkError.value = true;
                console.error(message);
            }
        } catch (error) {
            relayedValueNetworkError.value = true;
            console.error(error);
        } finally {
            relayedValueLoading.value = false;
        }
    };
    const twoLegendRelayedValue = computed(() => {
        return relayedAssetsChoose.value === 0
            ? totalRelayedValueData.valueTwoLegend
            : totalRelayedValueData.txsTwoLegend;
    });

    const relayedAssetsChooseBtnFn = (index: number) => {
        const labelCenter = isRelayedValueType.value ? 'IBC Token' : 'Fee Token';
        if (index === 0) {
            relayedValueOption.series[0].label.formatter = `{text|${labelCenter}}\n\r\n\r{total|${totalRelayedValueData.value.length}}`;
            relayedValueOption.series[0].data = totalRelayedValueData.valueOpacity;
            relayedValueOption.series[1].data = totalRelayedValueData.value;
        } else {
            relayedValueOption.series[0].label.formatter = `{text|${labelCenter}}\n\r\n\r{total|${totalRelayedValueData.txs.length}}`;
            relayedValueOption.series[0].data = totalRelayedValueData.txsOpacity;
            relayedValueOption.series[1].data = totalRelayedValueData.txs;
        }
        relayedValueChart.setOption(relayedValueOption, true);
    };
    onMounted(async () => {
        await getRelayedValueData();
        relayedValueChart = echarts.init(relayedValueDom.value as HTMLElement);
        relayedValueChart.on('legendselectchanged', (params: any) => {
            // todo dj  点击复制，且出现提示框
            relayedValueChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        relayedAssetsChooseBtnFn(0);
        changeRelayedValueOption();
        relayedValueChart.resize();
        relayedValueChart.setOption(relayedValueOption, true);
        window.addEventListener('resize', relayedValueSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', relayedValueSizeFn);
    });
    return {
        totalRelayedTitle,
        relayedValueLoading,
        relayedValueNoData,
        relayedValueNetworkError,
        relayedValueAbnormalText,
        twoLegendRelayedValue,
        relayedAssetsChooseBtnFn,
        relayedValueDom
    };
};
