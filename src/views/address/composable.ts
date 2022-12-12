import { Ref } from 'vue';
import { useWindowSize } from '@vueuse/core';
import * as echarts from 'echarts';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bignumber.js';
import QRCode from 'qrcodejs2-fix';
import ChainHelper from '@/helper/chainHelper';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { getDenomKey } from '@/helper/baseDenomHelper';
import { formatPriceAndTotalValue } from '@/helper/addressHelper';
import { getRestString } from '@/helper/parseStringHelper';
import { formatString } from '@/utils/stringTools';
import { calculatePercentage } from '@/utils/calculate';
import { dayjsFormatDate } from '@/utils/timeTools';
import { getTextWidth } from '@/utils/urlTools';
import { getAddrTokenListMock, getAddrAccountListMock, getAddressBaseInfoAPI } from '@/api/address';
import {
    NoDataType,
    TOKEN_DEFAULT_ICON,
    CHAIN_DEFAULT_ICON,
    PIE_OTHERS,
    DEFAULT_DISPLAY_TEXT,
    PAGE_PARAMETERS,
    UNKNOWN
} from '@/constants';
import { OPACITY_PIE_COLOR_LIST, PIE_COLOR_LIST, UNIT_SIGNS } from '@/constants/relayers';
import { API_CODE } from '@/constants/apiCode';
import {
    ITokenList,
    ITokenListItem,
    IAccountListItem,
    IAddressTokenTableItem,
    IAddressAccountTableItem,
    IAccountData,
    PieLegendData
} from '@/types/interface/address.interface';
import { PieData } from '@/types/interface/relayers.interface';
import { useNeedCustomColumns } from '@/composables';

export const useGetAddressTokens = () => {
    const tokensLoading = ref(true);
    const tokensNoDataType = ref<NoDataType>();
    const tokensData = ref<ITokenList>();

    const getAddrTokenList = async (chain: string, address: string) => {
        try {
            tokensLoading.value = true;
            tokensNoDataType.value = undefined;
            const { code, data, message } = await getAddrTokenListMock(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.tokens = data.tokens.sort((a, b) =>
                        new BigNumber(b.denom_value).comparedTo(a.denom_value)
                    );
                    const tokens: ITokenListItem[] = [];
                    for (let i = 0; i < data.tokens.length; i++) {
                        const item = data.tokens[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        let displayAmount: string;
                        let displayAvaliableAmount: string;
                        if (baseDenom) {
                            const tempAmount = moveDecimal(item.denom_amount, -baseDenom.scale);
                            const tempAvaliableAmount = moveDecimal(
                                item.denom_avaliable_amount,
                                -baseDenom.scale
                            );
                            displayAmount = formatBigNumber(tempAmount, 6);
                            displayAvaliableAmount = formatBigNumber(tempAvaliableAmount, 6);
                        } else {
                            displayAmount = formatBigNumber(item.denom_amount, 6);
                            displayAvaliableAmount = formatBigNumber(
                                item.denom_avaliable_amount,
                                6
                            );
                        }
                        tokens.push({
                            ...item,
                            displayAmount,
                            displayAvaliableAmount,
                            tokenInfo: baseDenom
                        });
                    }
                    tokensData.value = {
                        tokens,
                        total_value: data.total_value
                    };
                } else {
                    tokensData.value = {
                        tokens: [],
                        total_value: '0'
                    };
                }
            } else {
                tokensNoDataType.value = NoDataType.loadFailed;
                console.error(message);
            }
        } catch (error) {
            tokensNoDataType.value = NoDataType.loadFailed;
            console.error(error);
        } finally {
            tokensLoading.value = false;
        }
    };

    // todo dj 接口入参待处理
    getAddrTokenList('chain', 'address');
    return {
        tokensLoading,
        tokensNoDataType,
        tokensData
    };
};

// todo dj accountsData.total_value 如果不可用，单独处理一个字段供 baseInfo 使用
export const useGetAddressAccounts = () => {
    const accountsLoading = ref(true);
    const accountsNoDataType = ref<NoDataType>();
    const accountsData = ref<IAccountData>();

    const getAddrAccountList = async (chain: string, address: string) => {
        try {
            accountsLoading.value = true;
            accountsNoDataType.value = undefined;
            const { code, data, message } = await getAddrAccountListMock(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.accounts = data.accounts.sort((a, b) =>
                        new BigNumber(b.token_value).comparedTo(a.token_value)
                    );
                    const accounts: IAccountListItem[] = [];
                    for (let i = 0; i < data.accounts.length; i++) {
                        const item = data.accounts[i];
                        const chainInfo = await ChainHelper.getChainInfoByKey(item.chain);
                        accounts.push({
                            ...item,
                            chainInfo
                        });
                    }
                    accountsData.value = {
                        accounts,
                        total_value: data.total_value
                    };
                } else {
                    accountsData.value = {
                        accounts: [],
                        total_value: '0'
                    };
                }
            } else {
                accountsNoDataType.value = NoDataType.loadFailed;
                console.error(message);
            }
        } catch (error) {
            accountsNoDataType.value = NoDataType.loadFailed;
            console.error(error);
        } finally {
            accountsLoading.value = false;
        }
    };

    // todo dj 接口入参待处理
    getAddrAccountList('chain', 'address');
    return {
        accountsLoading,
        accountsNoDataType,
        accountsData
    };
};

export const useAddressAllocation = (
    data: Ref<ITokenList | undefined>,
    addressAllocationLoading: Ref<boolean | undefined>,
    addressAllocationType: Ref<NoDataType | undefined>
) => {
    const totalValue = ref('--');
    const totalCount = ref(0);
    const legendData = ref<PieLegendData[]>([]);
    const addressAllocationChartDom = ref();
    let addressAllocationChart: echarts.ECharts;

    const firstColumnLegendData = computed(() => {
        return legendData.value.length > 0 ? legendData.value.slice(0, 4) : [];
    });
    const secondColumnLegendData = computed(() => {
        return legendData.value.length > 4 ? legendData.value.slice(4, 8) : [];
    });
    const getTotalValue = (totalValue: string) => {
        if (!totalValue || Number(totalValue) === 0) return '0';
        return formatBigNumber(totalValue, 2);
    };
    const isShowAddressAllocationChart = computed(() => {
        return !addressAllocationLoading?.value && !addressAllocationType?.value;
    });
    const addressAllocationOption: any = {
        tooltip: {
            trigger: 'item',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;z-index:1;',
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
                                        <img src="${
                                            params.data.imgUrl
                                        }" style="width: 20px; height: 20px" />
                                        <span
                                            style="
                                                margin-left: 8px;
                                                font-size: 16px;
                                                font-family: 'GolosUI_Medium';
                                                font-weight: 500;
                                                color: #000000;
                                                line-height: 20px;
                                            "
                                            >${formatString(params.data.displayName)}</span
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
                                            >Value:
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
                                            >${UNIT_SIGNS} ${formatBigNumber(
                    params.data.value,
                    2
                )}</span
                                        ></div
                                    >
                                </div>
                            </div>
                        </div>`;
            },
            confine: false
        },
        legend: {
            show: false
        },
        series: [
            {
                type: 'pie',
                silent: true,
                radius: [78, 92],
                minAngle: 2,
                center: 'center',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: true,
                    formatter: `{text|Assets}\n\r\n\r{total|${totalCount.value}}`,
                    top: 'middle',
                    position: 'center',
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: 'rgba(0, 0, 0, 0.75)',
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
                radius: [92, 116],
                center: 'center',
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
                    scaleSize: 5
                },
                data: []
            }
        ]
    };
    const addressAllocationChartSizeFn = () => {
        addressAllocationChart && addressAllocationChart.resize();
    };
    const handleChangeNoDataOption = () => {
        addressAllocationOption.series[0].itemStyle.color = '#F9F9F9';
        addressAllocationOption.series[0].data = [0];
        addressAllocationOption.series[1].itemStyle.color = '#F2F2F2';
        addressAllocationOption.series[1].data = [0];
        addressAllocationOption.series[1].silent = true;
    };
    onMounted(async () => {
        addressAllocationChart = echarts.init(addressAllocationChartDom.value as HTMLElement);
        window.addEventListener('resize', addressAllocationChartSizeFn);
        watch(
            () => data?.value,
            (newValue) => {
                if (newValue) {
                    totalValue.value = getTotalValue(newValue.total_value);
                    totalCount.value = newValue.tokens.length;
                    addressAllocationOption.series[0].label.formatter = `{text|Assets}\n\r\n\r{total|${totalCount.value}}`;
                    if (totalCount.value <= 0) {
                        handleChangeNoDataOption();
                        legendData.value = [];
                    } else {
                        const allocationValueData: PieData[] = [];
                        const allocationValueOpacityData: PieData[] = [];
                        const templegendData: PieLegendData[] = [];
                        const tokens = [...newValue.tokens];
                        const needMaxNum = 8;
                        if (tokens.length > needMaxNum) {
                            const spliceValueDenomList = tokens.splice(needMaxNum - 1);
                            const spliceValueTotal = spliceValueDenomList.reduce(
                                (total, current) => {
                                    return new BigNumber(total)
                                        .plus(current.denom_value)
                                        .toString();
                                },
                                '0'
                            );
                            tokens.push({
                                denom: PIE_OTHERS,
                                chain: '',
                                base_denom: PIE_OTHERS,
                                base_denom_chain: PIE_OTHERS,
                                denom_type: 'Other',
                                denom_amount: '',
                                denom_avaliable_amount: '',
                                price: 0,
                                denom_value: spliceValueTotal,
                                displayAmount: '',
                                displayAvaliableAmount: '',
                                tokenInfo: undefined
                            });
                        }
                        tokens.forEach((token, i) => {
                            const uniqueName = getDenomKey(
                                token.base_denom_chain,
                                token.base_denom
                            );
                            const percent = calculatePercentage(
                                token.denom_value,
                                newValue.total_value,
                                2
                            );
                            const symbol = token.tokenInfo?.symbol || token.denom;
                            allocationValueData.push({
                                name: uniqueName,
                                displayName: symbol,
                                value: token.denom_value,
                                imgUrl: token.tokenInfo?.icon || TOKEN_DEFAULT_ICON,
                                percent,
                                itemStyle: {
                                    color: PIE_COLOR_LIST[i]
                                }
                            });
                            allocationValueOpacityData.push({
                                value: token.denom_value,
                                itemStyle: {
                                    color: OPACITY_PIE_COLOR_LIST[i]
                                }
                            });
                            templegendData.push({
                                key: uniqueName,
                                lengedColor: PIE_COLOR_LIST[i],
                                percentage: percent + '%',
                                legendName: symbol
                            });
                        });
                        legendData.value = [...templegendData];
                        addressAllocationOption.series[0].data = [...allocationValueOpacityData];
                        addressAllocationOption.series[1].data = [...allocationValueData];
                    }
                    nextTick(() => {
                        addressAllocationChart.resize();
                        addressAllocationChart.setOption(addressAllocationOption, true);
                    });
                }
            },
            {
                immediate: true
            }
        );
    });
    const highlightFn = (key: string, isOpen: boolean) => {
        addressAllocationChart &&
            addressAllocationChart.dispatchAction({
                type: isOpen ? 'highlight' : 'downplay',
                seriesIndex: 1,
                name: key
            });
    };
    onBeforeUnmount(() => {
        window.removeEventListener('resize', addressAllocationChartSizeFn);
    });
    return {
        addressAllocationChartDom,
        totalValue,
        firstColumnLegendData,
        secondColumnLegendData,
        isShowAddressAllocationChart,
        highlightFn
    };
};

export const useAddressTokens = (
    data: Ref<ITokenListItem[] | undefined> | undefined,
    addressTokensLoading: Ref<boolean | undefined>,
    addressTokensType: Ref<NoDataType | undefined>
) => {
    const tokensList = ref<IAddressTokenTableItem[]>([]);
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.addressDetailsToken);
    const tokensSubTitle = computed(() => {
        if (addressTokensLoading?.value) return `A total of ${DEFAULT_DISPLAY_TEXT} tokens found`;
        if (addressTokensType?.value === NoDataType.loadFailed) return '';
        const num = tokensList.value.length;
        return `A total of ${num} tokens found`;
    });

    watch(
        () => data?.value,
        (newValue) => {
            if (newValue) {
                const temp: IAddressTokenTableItem[] = [];
                newValue.forEach((token) => {
                    const chainInfo = token.tokenInfo;
                    const tokenInfo = chainInfo
                        ? {
                              defaultTitle: token.denom,
                              title: getRestString(chainInfo.symbol, 6, 0),
                              subtitle: token.denom_type,
                              imgSrc: chainInfo?.icon || TOKEN_DEFAULT_ICON
                          }
                        : {
                              defaultTitle: token.denom,
                              title: UNKNOWN,
                              subtitle: token.denom_type,
                              imgSrc: TOKEN_DEFAULT_ICON
                          };
                    temp.push({
                        tokenId: token.chain + token.denom,
                        tokenInfo,
                        displayAmount: token.displayAmount,
                        displayAvaliable: token.displayAvaliableAmount,
                        price: formatPriceAndTotalValue(String(token.price)),
                        totalValue: formatPriceAndTotalValue(token.denom_amount)
                    });
                });
                tokensList.value = [...temp];
            }
        },
        {
            immediate: true
        }
    );
    return {
        tokensSubTitle,
        tokensList,
        needCustomColumns
    };
};

export const usAddressAccount = (
    data: Ref<IAccountListItem[] | undefined> | undefined,
    addressAccountLoading: Ref<boolean | undefined>,
    addressAccountType: Ref<NoDataType | undefined>
) => {
    const router = useRouter();
    const goAddress = (isJumpAddress: boolean, chain: string, address: string) => {
        if (isJumpAddress) {
            // todo dj 跳转路径待确认
            router.push(`/address/${address}?chain=${chain}`);
        }
    };
    const accountsList = ref<IAddressAccountTableItem[]>([]);
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.addressDetailsAccount
    );
    const accountsSubTitle = computed(() => {
        if (addressAccountLoading?.value)
            return `A total of ${DEFAULT_DISPLAY_TEXT} addresses found`;
        if (addressAccountType?.value === NoDataType.loadFailed) return '';
        const num = accountsList.value.length;
        return `A total of ${num} addresses found`;
    });

    watch(
        () => data?.value,
        (newValue) => {
            if (newValue) {
                const temp: IAddressAccountTableItem[] = [];
                newValue.forEach((account) => {
                    temp.push({
                        chain: account.chain,
                        // todo dj address 待处理
                        isJumpAddress:
                            account.address !== 'cosmos16dc379m0qj64g4pr4nkl7ewak52qy2srf6xl03',
                        address: account.address,
                        tokenDenom: account.token_denom_num,
                        totalValue: formatPriceAndTotalValue(account.token_value),
                        formatLastUpdated: dayjsFormatDate(account.last_update_time),
                        lastUpdatedTimestamp: account.last_update_time
                    });
                });
                accountsList.value = [...temp];
            }
        },
        {
            immediate: true
        }
    );

    return {
        accountsSubTitle,
        needCustomColumns,
        needCustomHeaders,
        accountsList,
        goAddress
    };
};

export const useAddressAccountTokensRatio = (
    data: Ref<IAccountData | undefined>,
    addressRatioLoading: Ref<boolean | undefined>,
    addressRatioType: Ref<NoDataType | undefined>
) => {
    const totalValue = ref('--');
    const legendData = ref<PieLegendData[]>([]);
    const addressAccountTokenRatioChartDom = ref();
    let addressAccountTokenRatioChart: echarts.ECharts;
    const firstColumnLegendData = computed(() => {
        return legendData.value.length > 0 ? legendData.value.slice(0, 4) : [];
    });
    const secondColumnLegendData = computed(() => {
        return legendData.value.length > 4 ? legendData.value.slice(4, 8) : [];
    });
    const getTotalValue = (totalValue: string) => {
        if (!totalValue || Number(totalValue) === 0) return '0';
        return formatBigNumber(totalValue, 2);
    };
    const isShowAddressAccountTokenRatioChart = computed(() => {
        return !addressRatioLoading?.value && !addressRatioType?.value;
    });
    const addressAccountTokenRatioOption: any = {
        legend: {
            show: false
        },
        series: [
            {
                type: 'pie',
                silent: true,
                radius: [66, 90],
                minAngle: 2,
                center: 'center',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: []
            },
            {
                type: 'pie',
                radius: [90, 114],
                center: 'center',
                minAngle: 2,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    formatter: (params: any) => {
                        // todo dj displayName 展示规则
                        const displayName = params.data.displayName;
                        return `{text|${displayName}}\n\r\n\r{value|${UNIT_SIGNS}${getTotalValue(
                            params.data.value
                        )}}`;
                    },
                    top: 'middle',
                    position: 'center',
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: 'rgba(0, 0, 0, 0.75)',
                            fontWeight: 400,
                            fontFamily: 'GolosUIWebRegular',
                            fontSize: 16,
                            lineHeight: 10
                        },
                        value: {
                            color: '#000000',
                            fontWeight: 500,
                            fontFamily: 'GolosUI_Medium',
                            fontSize: 16,
                            lineHeight: 16
                        }
                    }
                },
                labelLine: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    scaleSize: 5
                },
                data: []
            }
        ]
    };
    const addressAccountTokenRatioChartSizeFn = () => {
        addressAccountTokenRatioChart && addressAccountTokenRatioChart.resize();
    };
    const handleChangeNoDataOption = () => {
        addressAccountTokenRatioOption.series[0].itemStyle.color = '#F9F9F9';
        addressAccountTokenRatioOption.series[0].data = [0];
        addressAccountTokenRatioOption.series[0].radius = [66, 90];
        addressAccountTokenRatioOption.series[1].itemStyle.color = '#F2F2F2';
        addressAccountTokenRatioOption.series[1].data = [0];
        addressAccountTokenRatioOption.series[1].radius = [90, 114];
        addressAccountTokenRatioOption.series[1].silent = true;
    };
    const highlightArr: string[] = [];
    let once = true;
    const highlightFn = (key: string) => {
        if (once) {
            addressAccountTokenRatioOption.series[0].radius = [73, 90];
            addressAccountTokenRatioChart &&
                addressAccountTokenRatioChart.setOption(addressAccountTokenRatioOption);
            once = false;
        }
        highlightArr.forEach((item) => {
            addressAccountTokenRatioChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 1,
                name: item
            });
        });
        highlightArr.length = 0;
        addressAccountTokenRatioChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 1,
            name: key
        });
        highlightArr.push(key);
    };
    onMounted(async () => {
        addressAccountTokenRatioChart = echarts.init(
            addressAccountTokenRatioChartDom.value as HTMLElement
        );
        window.addEventListener('resize', addressAccountTokenRatioChartSizeFn);
        watch(
            () => data?.value,
            (newValue) => {
                if (newValue) {
                    totalValue.value = getTotalValue(newValue.total_value);
                    const tokenNum = newValue.accounts.length;
                    if (tokenNum <= 0) {
                        handleChangeNoDataOption();
                        legendData.value = [];
                    } else {
                        const tokenRatioValueData: PieData[] = [];
                        const tokenRatioValueOpacityData: PieData[] = [];
                        const templegendData: PieLegendData[] = [];
                        const accounts = [...newValue.accounts];
                        const needMaxNum = 8;
                        if (accounts.length > needMaxNum) {
                            const spliceValueDenomList = accounts.splice(needMaxNum - 1);
                            const spliceValueTotal = spliceValueDenomList.reduce(
                                (total, current) => {
                                    return new BigNumber(total)
                                        .plus(current.token_value)
                                        .toString();
                                },
                                '0'
                            );
                            accounts.push({
                                chain: PIE_OTHERS,
                                address: '',
                                token_denom_num: 0,
                                token_value: spliceValueTotal,
                                last_update_time: 0,
                                chainInfo: undefined
                            });
                        }
                        accounts.forEach((account, i) => {
                            const uniqueName = account.chain;
                            const percent = calculatePercentage(
                                account.token_value,
                                newValue.total_value,
                                2
                            );
                            const prettyName = account.chainInfo?.pretty_name || account.chain;
                            tokenRatioValueData.push({
                                name: uniqueName,
                                displayName: prettyName,
                                value: account.token_value,
                                imgUrl: account.chainInfo?.icon || CHAIN_DEFAULT_ICON,
                                percent,
                                itemStyle: {
                                    color: PIE_COLOR_LIST[i]
                                }
                            });
                            tokenRatioValueOpacityData.push({
                                value: account.token_value,
                                itemStyle: {
                                    color: OPACITY_PIE_COLOR_LIST[i]
                                }
                            });
                            templegendData.push({
                                key: uniqueName,
                                lengedColor: PIE_COLOR_LIST[i],
                                percentage: percent + '%',
                                legendName: prettyName
                            });
                        });
                        legendData.value = [...templegendData];
                        addressAccountTokenRatioOption.series[0].data = [
                            ...tokenRatioValueOpacityData
                        ];
                        addressAccountTokenRatioOption.series[1].data = [...tokenRatioValueData];
                    }
                    nextTick(() => {
                        addressAccountTokenRatioChart.resize();
                        addressAccountTokenRatioChart.setOption(
                            addressAccountTokenRatioOption,
                            true
                        );
                        addressAccountTokenRatioChart.on('mouseover', (params) => {
                            highlightFn(params.name);
                        });
                    });
                }
            },
            {
                immediate: true
            }
        );
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', addressAccountTokenRatioChartSizeFn);
    });
    return {
        addressAccountTokenRatioChartDom,
        totalValue,
        firstColumnLegendData,
        secondColumnLegendData,
        isShowAddressAccountTokenRatioChart,
        highlightFn
    };
};

export const useGetChainAddress = () => {
    const route = useRoute();
    const currentChain = route.query?.chain as string;
    const currentAddress = (route.params.address as string).toLowerCase();
    return {
        currentChain,
        currentAddress
    };
};

export const useGetBaseInfo = () => {
    const router = useRouter();
    const { currentChain, currentAddress } = useGetChainAddress();
    const addressParams = {
        chain: currentChain,
        address: currentAddress
    };
    const currentChainInfo = reactive({
        chainLogo: CHAIN_DEFAULT_ICON,
        prettyName: DEFAULT_DISPLAY_TEXT,
        isShowTooltip: false
    });
    const baseInfoLoading = ref<boolean>(true);
    const baseInfo = reactive({
        address: currentAddress,
        keyAlgorithm: DEFAULT_DISPLAY_TEXT,
        accountSequence: DEFAULT_DISPLAY_TEXT,
        pubKey: DEFAULT_DISPLAY_TEXT
    });
    const { width: widthClient } = useWindowSize();
    const isShowTooltip = ref<boolean>(false);
    const getAddressBaseInfo = async () => {
        baseInfoLoading.value = true;
        try {
            const { code, message, data } = await getAddressBaseInfoAPI(
                addressParams.chain,
                addressParams.address
            );
            if (code === API_CODE.success) {
                if (data) {
                    baseInfo.keyAlgorithm = data.pub_key_algorithm || DEFAULT_DISPLAY_TEXT;
                    baseInfo.accountSequence = data.account_sequence || DEFAULT_DISPLAY_TEXT;
                    baseInfo.pubKey = data.pub_key || DEFAULT_DISPLAY_TEXT;
                } else {
                    console.log(message);
                }
            } else if (code === API_CODE.noMatchAddress) {
                router.push(`/searchResult/${currentAddress}?chain=${currentChain}`);
            } else {
                console.log(message);
            }
            baseInfoLoading.value = false;
        } catch (error) {
            console.log(error);
            baseInfoLoading.value = false;
        }
    };
    const getMatchChainInfo = async () => {
        const chainInfo = await ChainHelper.getChainInfoByKey(currentChain);
        if (chainInfo) {
            currentChainInfo.chainLogo = chainInfo.icon;
            currentChainInfo.prettyName = chainInfo.pretty_name;
        } else {
            currentChainInfo.chainLogo = CHAIN_DEFAULT_ICON;
            currentChainInfo.prettyName = DEFAULT_DISPLAY_TEXT;
        }
    };
    const prettyNameSize = computed(() => {
        return getTextWidth(currentChainInfo.prettyName, '16px GolosUI_Medium');
    });
    watch([prettyNameSize, widthClient], ([newPrettyNameSize, newWidthClient]) => {
        if (newWidthClient > 895) {
            isShowTooltip.value = newPrettyNameSize > 120;
        } else {
            isShowTooltip.value = newPrettyNameSize > 240;
        }
    });
    onMounted(() => {
        if (!currentChain) {
            router.push(`/searchResult/${currentAddress}`);
        } else {
            getAddressBaseInfo();
            getMatchChainInfo();
        }
    });
    return {
        baseInfoLoading,
        baseInfo,
        currentChainInfo,
        isShowTooltip
    };
};

export const useCreateQRCode = () => {
    const { currentAddress } = useGetChainAddress();
    const qrCodeDom = ref<HTMLElement>();
    const qrcode = ref();
    const createQRCode = (currentAddress: string) => {
        const addressQRCode = qrCodeDom.value;
        qrcode.value = new QRCode(addressQRCode, {
            width: 80,
            height: 80,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.L
        });
        qrcode.value.clear();
        qrcode.value.makeCode(currentAddress);
    };
    onMounted(() => {
        createQRCode(currentAddress);
    });
    onBeforeUnmount(() => {
        qrcode.value.clear();
    });
    return {
        qrCodeDom
    };
};
