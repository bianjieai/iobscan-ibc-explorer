import { Ref, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import * as echarts from 'echarts';
import moveDecimal from 'move-decimal-point';
import BigNumber from 'bignumber.js';
import QRCode from 'qrcodejs2-fix';
import ChainHelper from '@/helper/chainHelper';
import { isAddressDetailsName } from '@/helper/routerHelper';
import {
    CHAIN_DEFAULT_ICON,
    DEFAULT_DISPLAY_TEXT,
    IbcVersion,
    NoDataType,
    PAGE_PARAMETERS,
    PIE_OTHERS,
    TOKEN_DEFAULT_ICON,
    TRANSFER_TYPE,
    UNKNOWN
} from '@/constants';
import type {
    IAccountData,
    IAccountListItem,
    IAddressAccountTableItem,
    IAddressTokenTableItem,
    IRequestAddressTxs,
    IResponseAddressTxs,
    IResponseAddressTxsData,
    IResponseAddressTxsFormat,
    ITokenList,
    ITokenListItem,
    PieLegendData
} from '@/types/interface/address.interface';
import {
    exportAddressTxsAPI,
    getAddrBaseInfoAPI,
    getAddrAccountListAPI,
    getAddrTokenListAPI,
    getAddrTxsAPI
} from '@/api/address';
import { API_CODE } from '@/constants/apiCode';
import { getBaseDenomByKey, getDenomKey } from '@/helper/baseDenomHelper';
import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
import { formatString } from '@/utils/stringTools';
import { OPACITY_PIE_COLOR_LIST, PIE_COLOR_LIST, UNIT_SIGNS } from '@/constants/relayers';
import type { PieData } from '@/types/interface/relayers.interface';
import { calculatePercentage } from '@/utils/calculate';
import { useNeedCustomColumns, useShowUtcIcon } from '@/composables';
import { formatPriceAndTotalValue } from '@/helper/addressHelper';
import { dayjsFormatDate } from '@/utils/timeTools';
import { getTextWidth } from '@/utils/urlTools';
import type { IPaginationParams } from '@/types/interface/index.interface';
import { IN_OUT_TAG } from '@/constants/address';

export const getTotalValue = (totalValue: string) => {
    if (!totalValue || Number(totalValue) === 0) return `${UNIT_SIGNS} 0`;
    return `${UNIT_SIGNS} ${formatBigNumber(totalValue, 2)}`;
};

export const useGetChainAddress = () => {
    const route = useRoute();
    const router = useRouter();
    const getChainAddress = () => {
        const currentChain = (route.query?.chain || '') as string;
        const currentAddress = (route.params.address as string).toLowerCase();
        return {
            currentChain,
            currentAddress
        };
    };
    const handleNoChainFn = (chain?: string) => {
        if (!chain) {
            router.replace(`/searchResult/${chain}`);
        }
    };
    const { currentChain, currentAddress } = getChainAddress();
    return {
        currentChain,
        currentAddress,
        handleNoChainFn,
        getChainAddress,
        route,
        router
    };
};

export const useGetBaseInfo = () => {
    const { handleNoChainFn, getChainAddress, route, router } = useGetChainAddress();
    const currentChainInfo = reactive({
        chainLogo: CHAIN_DEFAULT_ICON,
        prettyName: DEFAULT_DISPLAY_TEXT
    });
    const baseInfoLoading = ref<boolean>(true);
    const baseInfo = reactive({
        address: DEFAULT_DISPLAY_TEXT,
        keyAlgorithm: DEFAULT_DISPLAY_TEXT,
        accountSequence: DEFAULT_DISPLAY_TEXT,
        pubKey: DEFAULT_DISPLAY_TEXT
    });
    const { width: widthClient } = useWindowSize();
    const isShowTooltip = ref<boolean>(false);
    const getAddressBaseInfo = async (chain: string, address: string) => {
        baseInfoLoading.value = true;
        try {
            const { code, message, data } = await getAddrBaseInfoAPI(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    baseInfo.keyAlgorithm = data.pub_key_algorithm || DEFAULT_DISPLAY_TEXT;
                    baseInfo.accountSequence = data.account_sequence || DEFAULT_DISPLAY_TEXT;
                    baseInfo.pubKey = data.pub_key || DEFAULT_DISPLAY_TEXT;
                } else {
                    console.log(message);
                }
            } else if (code === API_CODE.noMatchAddress) {
                router.replace(`/searchResult/${address}?chain=${chain}`);
            } else {
                console.log(message);
            }
            baseInfoLoading.value = false;
        } catch (error) {
            console.log(error);
            baseInfoLoading.value = false;
        }
    };
    const getMatchChainInfo = async (chain: string) => {
        const chainInfo = await ChainHelper.getChainInfoByKey(chain);
        currentChainInfo.chainLogo = chainInfo?.icon || CHAIN_DEFAULT_ICON;
        currentChainInfo.prettyName = chainInfo?.pretty_name || DEFAULT_DISPLAY_TEXT;
    };
    const prettyNameSize = computed(() => {
        return getTextWidth(currentChainInfo.prettyName, '16px GolosUI_Medium');
    });
    const initBaseInfo = () => {
        const { currentChain, currentAddress } = getChainAddress();
        handleNoChainFn(currentChain);
        baseInfo.address = currentAddress;
        getAddressBaseInfo(currentChain, currentAddress);
        getMatchChainInfo(currentChain);
    };
    watch([prettyNameSize, widthClient], ([newPrettyNameSize, newWidthClient]) => {
        if (newWidthClient > 895) {
            isShowTooltip.value = newPrettyNameSize > 120;
        } else {
            isShowTooltip.value = newPrettyNameSize > 240;
        }
    });
    watch(route, (newRoute) => {
        if (isAddressDetailsName(newRoute.name as string)) {
            initBaseInfo();
        }
    });
    onMounted(() => {
        initBaseInfo();
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

export const useGetAddressTokens = () => {
    const tokensLoading = ref(true);
    const tokensNoDataType = ref<NoDataType>();
    const tokensData = ref<ITokenList>();
    const baseInfoTotalValue = ref(DEFAULT_DISPLAY_TEXT);
    const { route, getChainAddress } = useGetChainAddress();

    const getAddrTokenList = async (chain: string, address: string) => {
        try {
            tokensLoading.value = true;
            tokensNoDataType.value = undefined;
            tokensData.value = undefined;
            baseInfoTotalValue.value = DEFAULT_DISPLAY_TEXT;
            const { code, data, message } = await getAddrTokenListAPI(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.total_value = data.total_value || '0';
                    data.tokens = data.tokens
                        .map((token) => {
                            token.denom_amount = token.denom_amount || '0';
                            token.denom_available_amount = token.denom_available_amount || '0';
                            token.denom_value = token.denom_value || '0';
                            return token;
                        })
                        .sort((a, b) => new BigNumber(b.denom_value).comparedTo(a.denom_value));
                    const tokens: ITokenListItem[] = [];
                    for (let i = 0; i < data.tokens.length; i++) {
                        const item = data.tokens[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        let displayAmount: string;
                        let displayAvailableAmount: string;
                        if (baseDenom) {
                            const tempAmount = moveDecimal(item.denom_amount, -baseDenom.scale);
                            const tempAvailableAmount = moveDecimal(
                                item.denom_available_amount,
                                -baseDenom.scale
                            );
                            displayAmount = formatBigNumber(tempAmount, 6);
                            displayAvailableAmount = formatBigNumber(tempAvailableAmount, 6);
                        } else {
                            displayAmount = formatBigNumber(item.denom_amount, 6);
                            displayAvailableAmount = formatBigNumber(
                                item.denom_available_amount,
                                6
                            );
                        }
                        tokens.push({
                            ...item,
                            displayAmount,
                            displayAvailableAmount,
                            tokenInfo: baseDenom
                        });
                    }
                    tokensData.value = {
                        tokens,
                        total_value: data.total_value
                    };
                    baseInfoTotalValue.value = getTotalValue(data.total_value);
                } else {
                    tokensData.value = {
                        tokens: [],
                        total_value: '0'
                    };
                    baseInfoTotalValue.value = getTotalValue('');
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

    const initData = () => {
        const { currentChain, currentAddress } = getChainAddress();
        getAddrTokenList(currentChain, currentAddress);
    };

    initData();
    watch(route, (newVal) => {
        if (isAddressDetailsName(newVal.name as string)) {
            initData();
        }
    });
    return {
        tokensLoading,
        tokensNoDataType,
        tokensData,
        baseInfoTotalValue
    };
};

export const useGetAddressAccounts = () => {
    const accountsLoading = ref(true);
    const accountsNoDataType = ref<NoDataType>();
    const accountsData = ref<IAccountData>();
    const { route, getChainAddress } = useGetChainAddress();

    const getAddrAccountList = async (chain: string, address: string) => {
        try {
            accountsLoading.value = true;
            accountsNoDataType.value = undefined;
            accountsData.value = undefined;
            const { code, data, message } = await getAddrAccountListAPI(chain, address);
            if (code === API_CODE.success) {
                if (data) {
                    data.total_value = data.total_value || '0';
                    data.accounts = data.accounts
                        .map((account) => {
                            account.token_value = account.token_value || '0';
                            return account;
                        })
                        .sort((a, b) => new BigNumber(b.token_value).comparedTo(a.token_value));
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

    const initData = () => {
        const { currentChain, currentAddress } = getChainAddress();
        getAddrAccountList(currentChain, currentAddress);
    };

    initData();
    watch(route, (newVal) => {
        if (isAddressDetailsName(newVal.name as string)) {
            initData();
        }
    });
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

    const isFailed = computed(() => addressAllocationType.value === NoDataType.loadFailed);

    const firstColumnLegendData = computed(() => {
        return legendData.value.length > 0 ? legendData.value.slice(0, 4) : [];
    });
    const secondColumnLegendData = computed(() => {
        return legendData.value.length > 4 ? legendData.value.slice(4, 8) : [];
    });
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
                    formatter: `{text|Assets}\n\r\n\r{total|${formatBigNumber(
                        totalCount.value,
                        0
                    )}}`,
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
    const initEchart = () => {
        addressAllocationChart ||
            (addressAllocationChart = echarts.init(addressAllocationChartDom.value as HTMLElement));
        addressAllocationChart.setOption(addressAllocationOption, true);
        window.addEventListener('resize', addressAllocationChartSizeFn);
    };
    let keyIndex = 0;
    onMounted(() => {
        watch(
            () => data?.value,
            (newValue) => {
                if (newValue) {
                    totalValue.value = getTotalValue(newValue.total_value);
                    totalCount.value = newValue.tokens.length;
                    addressAllocationOption.series[0].label.formatter = `{text|Assets}\n\r\n\r{total|${formatBigNumber(
                        totalCount.value,
                        0
                    )}}`;
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
                                denom_available_amount: '',
                                price: 0,
                                denom_value: spliceValueTotal,
                                displayAmount: '',
                                displayAvailableAmount: '',
                                tokenInfo: undefined
                            });
                        }
                        tokens.forEach((token, i) => {
                            const uniqueName =
                                getDenomKey(token.base_denom_chain, token.base_denom) + keyIndex++;
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
                        initEchart();
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
        highlightFn,
        isFailed
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
        if (addressTokensLoading?.value || addressTokensType?.value === NoDataType.loadFailed)
            return `A total of ${DEFAULT_DISPLAY_TEXT} tokens found`;
        const num = formatBigNumber(tokensList.value.length, 0);
        return `A total of ${num} tokens found`;
    });
    const isFailed = computed(() => addressTokensType.value === NoDataType.loadFailed);
    const { width: widthClient } = useWindowSize();
    const getPopupContainer = (): HTMLElement =>
        document.querySelector('.address_tokens_c__table')!;
    const amountPopoverPlacement = ref('right');
    watch(
        () => widthClient.value,
        (newValue) => {
            amountPopoverPlacement.value = newValue > 689 ? 'right' : 'top';
        },
        {
            immediate: true
        }
    );
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
                        displayAvailable: token.displayAvailableAmount,
                        price: formatPriceAndTotalValue(String(token.price)),
                        totalValue: formatPriceAndTotalValue(token.denom_value)
                    });
                });
                tokensList.value = [...temp];
            } else {
                tokensList.value = [];
            }
        },
        {
            immediate: true
        }
    );
    return {
        tokensSubTitle,
        tokensList,
        needCustomColumns,
        isFailed,
        getPopupContainer,
        amountPopoverPlacement
    };
};

export const usAddressAccount = (
    data: Ref<IAccountListItem[] | undefined> | undefined,
    addressAccountLoading: Ref<boolean | undefined>,
    addressAccountType: Ref<NoDataType | undefined>
) => {
    const { getChainAddress, route } = useGetChainAddress();
    const currentAddress = ref('');
    const updateCurrAddress = () => {
        currentAddress.value = getChainAddress().currentAddress;
    };
    const accountsList = ref<IAddressAccountTableItem[]>([]);
    const { needCustomColumns, needCustomHeaders } = useNeedCustomColumns(
        PAGE_PARAMETERS.addressDetailsAccount
    );
    const accountsSubTitle = computed(() => {
        if (addressAccountLoading?.value || addressAccountType?.value === NoDataType.loadFailed)
            return `A total of ${DEFAULT_DISPLAY_TEXT} addresses found`;
        const num = formatBigNumber(accountsList.value.length, 0);
        return `A total of ${num} addresses found`;
    });

    const isFailed = computed(() => addressAccountType.value === NoDataType.loadFailed);
    const { showUtcIcon } = useShowUtcIcon(addressAccountLoading, addressAccountType);
    watch(
        () => data?.value,
        (newValue) => {
            if (newValue) {
                const temp: IAddressAccountTableItem[] = [];
                newValue.forEach((account) => {
                    temp.push({
                        chain: account.chain,
                        address: account.address,
                        tokenDenom: formatBigNumber(account.token_denom_num, 0),
                        totalValue: formatPriceAndTotalValue(account.token_value),
                        formatLastUpdated: account.last_update_time
                            ? dayjsFormatDate(account.last_update_time * 1000, 'YY-MM-DD HH:mm:ss')
                            : DEFAULT_DISPLAY_TEXT,
                        lastUpdatedTimestamp: account.last_update_time
                    });
                });
                accountsList.value = [...temp];
            } else {
                accountsList.value = [];
            }
        },
        {
            immediate: true
        }
    );

    updateCurrAddress();
    watch(route, (newVal) => {
        if (isAddressDetailsName(newVal.name as string)) {
            updateCurrAddress();
        }
    });

    return {
        accountsSubTitle,
        needCustomColumns,
        needCustomHeaders,
        accountsList,
        currentAddress,
        isFailed,
        showUtcIcon
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
    const isShowAddressAccountTokenRatioChart = computed(() => {
        return !addressRatioLoading?.value && !addressRatioType?.value;
    });
    const isFailed = computed(() => addressRatioType.value === NoDataType.loadFailed);
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
                        const displayName = params.data.displayName;
                        return `{text|${displayName}}\n\r\n\r{value|${getTotalValue(
                            params.data.value
                        )}}`;
                    },
                    top: 'middle',
                    position: 'center',
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    overflow: 'truncate',
                    ellipsis: '...',
                    width: 145,
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
    const initEchart = () => {
        addressAccountTokenRatioChart ||
            (addressAccountTokenRatioChart = echarts.init(
                addressAccountTokenRatioChartDom.value as HTMLElement
            ));
        addressAccountTokenRatioChart.setOption(addressAccountTokenRatioOption, true);
        addressAccountTokenRatioChart.on('mouseover', (params) => {
            highlightFn(params.name);
        });
        window.addEventListener('resize', addressAccountTokenRatioChartSizeFn);
    };
    let keyIndex = 0;
    onMounted(async () => {
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
                            const uniqueName = account.chain + keyIndex++;
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
                        initEchart();
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
        highlightFn,
        isFailed
    };
};

export const useGetAddressTxs = (pagination: IPaginationParams) => {
    const { getChainAddress, route } = useGetChainAddress();
    const routeChain = ref<string>('');
    const routeAddress = ref<string>('');
    const addressTxsLoading = ref<boolean>(true);
    const addressPageisDisabled = ref<boolean>(true);
    const loadingCondition = ref<NoDataType>();
    const addressTxsList = ref<IResponseAddressTxsFormat[]>([]);
    const formatData = (dateData: IResponseAddressTxs[]) => {
        const formatDateData = dateData.map((item) => {
            let tag: string;
            if (
                item.tx_type === TRANSFER_TYPE.acknowledge.type ||
                item.tx_type === TRANSFER_TYPE.timeout.type
            ) {
                item.sender = DEFAULT_DISPLAY_TEXT;
                item.receiver = DEFAULT_DISPLAY_TEXT;
                tag = '';
            } else if (item.tx_type === TRANSFER_TYPE.receive.type) {
                tag = IN_OUT_TAG.in;
            } else if (item.tx_type === TRANSFER_TYPE.transfer.type) {
                tag = IN_OUT_TAG.out;
            } else {
                tag = '';
            }
            const format_tx_time = dayjsFormatDate(item.tx_time * 1000, 'YY-MM-DD HH:mm:ss');
            return {
                ...item,
                format_tx_time,
                tag
            };
        });
        return formatDateData;
    };
    const getAddressTxs = async (params: IRequestAddressTxs) => {
        if (params.use_count) {
            addressPageisDisabled.value = true;
        } else {
            addressTxsLoading.value = true;
        }
        loadingCondition.value = undefined;
        try {
            const { code, message, data } = await getAddrTxsAPI({ ...params });
            if (code === API_CODE.success) {
                if (params.use_count) {
                    pagination.total = data as number;
                    addressPageisDisabled.value = false;
                } else {
                    if ((data as IResponseAddressTxsData).txs?.length) {
                        addressTxsList.value = formatData((data as IResponseAddressTxsData).txs);
                        loadingCondition.value = undefined;
                    } else {
                        addressTxsList.value = [];
                        loadingCondition.value = NoDataType.noData;
                    }
                    addressTxsLoading.value = false;
                }
            } else {
                addressTxsLoading.value = false;
                addressPageisDisabled.value = true;
                loadingCondition.value = NoDataType.loadFailed;
                console.log(message);
            }
        } catch (error) {
            if (params.use_count) {
                addressPageisDisabled.value = true;
            } else {
                addressTxsLoading.value = false;
            }
            loadingCondition.value = NoDataType.loadFailed;
            console.log(error);
        }
    };
    const onPaginationChange = (current: number, pageSize: number) => {
        pagination.current = current;
        getAddressTxs({
            chain: routeChain.value,
            address: routeAddress.value,
            page_num: pagination.current,
            page_size: pageSize,
            use_count: false
        });
    };
    const subTitle = computed(() => {
        if (addressPageisDisabled?.value || loadingCondition.value === NoDataType.loadFailed)
            return `A total of ${DEFAULT_DISPLAY_TEXT} IBC Transactions found`;
        return `A total of ${formatBigNumber(pagination.total || '0', 0)} IBC Transactions found`;
    });
    const showMoreIcon = (ibcVersion: string) => {
        return ibcVersion === IbcVersion['ICS-27'] || ibcVersion === IbcVersion['ICS-721'];
    };
    const initAddrTxs = () => {
        const { currentChain, currentAddress } = getChainAddress();
        routeChain.value = currentChain;
        routeAddress.value = currentAddress;
        getAddressTxs({
            chain: routeChain.value,
            address: routeAddress.value,
            page_num: 1,
            page_size: 5,
            use_count: true
        });
        getAddressTxs({
            chain: routeChain.value,
            address: routeAddress.value,
            page_num: pagination.current,
            page_size: pagination.pageSize,
            use_count: false
        });
    };
    const { showUtcIcon } = useShowUtcIcon(addressTxsLoading, loadingCondition);

    watch(route, (newRoute) => {
        if (isAddressDetailsName(newRoute.name as string)) {
            initAddrTxs();
        }
    });
    onMounted(() => {
        initAddrTxs();
    });
    return {
        routeChain,
        routeAddress,
        addressTxsLoading,
        addressPageisDisabled,
        loadingCondition,
        addressTxsList,
        onPaginationChange,
        subTitle,
        showMoreIcon,
        showUtcIcon
    };
};

export const useExportAddressTxs = () => {
    const downloadUrl = ref<string>('');
    const exportAddressTxs = (chain: string, address: string) => {
        downloadUrl.value = exportAddressTxsAPI(chain, address);
    };
    return {
        exportAddressTxs,
        downloadUrl
    };
};
