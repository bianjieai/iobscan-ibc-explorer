import { useIbcStatisticsChains } from '@/store';
import {
    PRETTYNAME,
    CHAIN_DEFAULT_ICON,
    CHAIN_DEFAULT_VALUE,
    DEFAULT_DISPLAY_TEXT,
    TOKEN_DEFAULT_ICON,
    TOTAL_BOUND,
    TRANSFERS_STATUS_OPTIONS,
    TRANSFER_TABLE_COLUMN,
    TX_STATUS_NUMBER,
    UNKNOWN_SYMBOL
} from '@/constants';
import {
    IDenomStatistic,
    IIbcchain,
    IIbcChains,
    IPaginationParams
} from '@/types/interface/index.interface';
import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { API_CODE } from '@/constants/apiCode';
import { useGetIbcDenoms } from '@/composables';
import { formatBigNumber, JSONparse, rmIbcPrefix } from '@/helper/parseStringHelper';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
import { dayjsUtc, dayjsFormatDate } from '@/utils/timeTools';
import ChainHelper from '@/helper/chainHelper';
import { Ref } from 'vue';
import { urlParser } from '@/utils/urlTools';
import { axiosCancel } from '@/utils/axios';
import { IIbcTx, IIbcTxCount, ITransfersQueryParams } from '@/types/interface/transfers.interface';
import { Dayjs } from 'dayjs';

export const usePagination = () => {
    const route = useRoute();
    const pagination = reactive<IPaginationParams>({
        total: 0,
        current: Number(route?.query?.pageNum) || 1,
        pageSize: 10
    });
    return {
        pagination
    };
};

export const useGetTableColumns = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const tableColumns = TRANSFER_TABLE_COLUMN;
    const showTransferLoading = ref(true);
    const ibcTxs = ibcStatisticsChainsStore.ibcTxs;
    const tableDatas = ref([...ibcTxs]);
    const getIbcTxs = ibcStatisticsChainsStore.getIbcTxsAction;
    watch(
        () => tableDatas.value,
        () => {
            setIbcTxs();
        }
    );
    const setIbcTxs = (limitNumber = 10) => {
        if (tableDatas.value && tableDatas.value.length > 0) {
            ibcStatisticsChainsStore.ibcTxs = tableDatas.value.slice(0, limitNumber);
        }
    };
    return {
        tableColumns,
        showTransferLoading,
        tableDatas,
        getIbcTxs
    };
};
export const useIsVisible = () => {
    const isVisible = ref(false);
    const visibleChange = (visible: boolean) => {
        isVisible.value = visible;
    };
    return {
        isVisible,
        visibleChange
    };
};

export const useNoResult = () => {
    const route = useRoute();
    const router = useRouter();
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    watch(route, (newValue) => {
        if (newValue?.query) {
            searchInputValue.value = Object.keys(route.query);
        }
    });
    const searchInputValue = reactive({
        value: ['']
    });
    if (route?.query) {
        if (/^[A-F0-9]{64}$/.test(Object.keys(route.query).join(''))) {
            ibcStatisticsChainsStore.isShowLoading = true;
            getTxDetailsByTxHashAPI(Object.keys(route.query).join(''))
                .then((result) => {
                    const { code, data } = result;
                    if (code === API_CODE.success) {
                        if (data) {
                            ibcStatisticsChainsStore.isShowLoading = false;
                            if (!data.is_list) {
                                router.push(
                                    `/transfers/details?txhash=${Object.keys(route.query).join('')}`
                                );
                            } else {
                                router.push('/transfers');
                            }
                        } else {
                            ibcStatisticsChainsStore.isShowLoading = false;
                        }
                    }
                })
                .catch((error) => {
                    ibcStatisticsChainsStore.isShowLoading = false;
                    console.log('getTxDetailsByTxHashAPI', error);
                });
        } else {
            router.push(`/searchResult?${Object.keys(route.query).join('')}`);
        }
        searchInputValue.value = Object.keys(route.query);
    }
    const toHome = () => {
        router.push('/home');
    };
    return {
        searchInputValue,
        toHome
    };
};

export const useSortIbcChains = (ibcChains: Ref<IIbcChains>) => {
    const setAllChains = (ibcChains: Ref<IIbcChains>) => {
        if (ibcChains?.value?.all) {
            const cosmosChain = ibcChains.value.all.filter(
                (item: IIbcchain) => item.pretty_name === PRETTYNAME.COSMOSHUB
            );
            const irishubChain = ibcChains.value.all.filter(
                (item: IIbcchain) => item.pretty_name === PRETTYNAME.IRISHUB
            );
            const notIncludesIrisAndCosmosChains: IIbcchain[] = [];
            ibcChains.value.all.forEach((item: IIbcchain) => {
                if (
                    item.pretty_name !== PRETTYNAME.COSMOSHUB &&
                    item.pretty_name !== PRETTYNAME.IRISHUB
                ) {
                    notIncludesIrisAndCosmosChains.push(item);
                }
            });
            if (notIncludesIrisAndCosmosChains?.length) {
                notIncludesIrisAndCosmosChains.sort((a: any, b: any) => {
                    return a.chain_name.toLowerCase() < b.chain_name.toLowerCase()
                        ? -1
                        : a.chain_name.toLowerCase() > b.chain_name.toLowerCase()
                        ? 1
                        : 0;
                });
            }
            ibcChains.value.all = [
                ...cosmosChain,
                ...irishubChain,
                ...notIncludesIrisAndCosmosChains
            ];
        }
    };
    setAllChains(ibcChains);
    watch(
        () => ibcChains,
        (newValue) => {
            if (newValue?.value?.all) {
                setAllChains(newValue);
            }
        }
    );
};

export const useRouteParams = () => {
    const route = useRoute();
    const pageNum = 1,
        pageSize = 10;
    let url = `/transfers?pageNum=${pageNum}&pageSize=${pageSize}`;
    let paramsStatus = undefined,
        paramsBaseDenom: string | undefined = undefined,
        paramsBaseDenomChain: string | undefined = undefined,
        paramsDenom: string | undefined = undefined,
        startTimestamp = 0,
        endTimestamp = 0;
    const searchToken = ref<string | undefined>();
    const inputFlag = ref(false);
    const dateRange = ref<[Dayjs, Dayjs] | undefined>(undefined);
    const chain = route?.query.chain as string;
    if (chain) {
        url += `&chain=${chain}`;
    }
    if (route?.query?.denom) {
        url += `&denom=${route.query.denom}`;
        paramsDenom = route?.query.denom as string;
    }
    if (
        route?.query?.baseDenom &&
        (route?.query?.baseDenom as string)?.toLowerCase() !== UNKNOWN_SYMBOL
    ) {
        url += `&baseDenom=${route.query.baseDenom}`;
        paramsBaseDenom = route?.query.baseDenom as string | undefined;
    }
    if (route?.query?.baseDenomChain) {
        url += `&baseDenomChain=${route.query.baseDenomChain}`;
        paramsBaseDenomChain = route?.query.baseDenomChain as string | undefined;
    }
    if (route?.query?.status) {
        const defaultOptions = TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS;
        const successOptions = TRANSFERS_STATUS_OPTIONS.SUCCESS_OPTIONS;
        const failedOptions = TRANSFERS_STATUS_OPTIONS.FAILED_OPTIONS;
        const processingOptions = TRANSFERS_STATUS_OPTIONS.PROCESSING_OPTIONS;
        paramsStatus = (route?.query?.status as string).split(',');
        switch (JSON.stringify(paramsStatus)) {
            case JSON.stringify(successOptions):
                paramsStatus = successOptions;
                break;
            case JSON.stringify(failedOptions):
                paramsStatus = failedOptions;
                break;
            case JSON.stringify(processingOptions):
                paramsStatus = processingOptions;
                break;
            default:
                paramsStatus = defaultOptions;
                break;
        }
        url += `&status=${route.query.status}`;
    }
    if (route?.query?.startTime) {
        url += `&startTime=${route.query.startTime}`;
        startTimestamp = dayjsUtc(route.query.startTime as any).unix();
    }
    if (route?.query?.endTime) {
        url += `&endTime=${route.query.endTime}`;
        endTimestamp = dayjsUtc(route.query.endTime as any)
            .endOf('day')
            .unix();
    }
    if (startTimestamp && endTimestamp) {
        dateRange.value = [dayjsUtc(startTimestamp * 1000), dayjsUtc(endTimestamp * 1000)];
    }
    searchToken.value = (paramsBaseDenom || '') + (paramsBaseDenomChain || '');
    if (paramsDenom && rmIbcPrefix(paramsDenom as string).length) {
        searchToken.value = rmIbcPrefix(paramsDenom as string);
        inputFlag.value = true;
    }
    const queryParams = reactive<ITransfersQueryParams>({
        date_range:
            startTimestamp && endTimestamp
                ? [startTimestamp, endTimestamp]
                : [0, Math.floor(new Date().getTime() / 1000)],
        status: paramsStatus || TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS,
        chain: chain,
        base_denom: paramsBaseDenom,
        base_denom_chain: paramsBaseDenomChain,
        denom: paramsDenom
    });
    return {
        url,
        searchToken,
        inputFlag,
        dateRange,
        chain,
        queryParams
    };
};

export const useSubTitleFilter = (
    isHashFilterParams: Ref<boolean>,
    pagination: IPaginationParams,
    ibcStatisticsTxs: IDenomStatistic,
    isShowValuedText: Ref<boolean>,
    countLoading: Ref<boolean>,
    txsValue: Ref<string>
) => {
    const ibcTxTotalMoreThan500k = ref<boolean>(false);
    const getDisplaySubtitle = (
        showDefault: boolean,
        total: number,
        showValuedText: boolean,
        valuedText: string
    ) => {
        const displayTotal = !showDefault ? formatBigNumber(total || '0', 0) : DEFAULT_DISPLAY_TEXT;
        const displayValued = !showDefault
            ? formatBigNumber(valuedText || '0', 0)
            : DEFAULT_DISPLAY_TEXT;
        return !showValuedText || total === 0
            ? `${displayTotal} of the latest 500k transfers found`
            : `${displayTotal} of the latest 500k transfers were found and valued at $${displayValued}`;
    };
    const isIbcTxTotalAndHashFilter = computed(() => {
        if (isHashFilterParams.value) {
            return getDisplaySubtitle(
                countLoading.value,
                pagination.total,
                isShowValuedText.value,
                txsValue.value
            );
        }
        return ibcTxTotalMoreThan500k.value
            ? 'Latest 500k transfers found'
            : `A total of ${formatBigNumber(ibcStatisticsTxs.tx_all.count, 0)} transfers found`;
    });
    watch(ibcStatisticsTxs, (newValue) => {
        if (newValue?.tx_all?.count <= TOTAL_BOUND) {
            ibcTxTotalMoreThan500k.value = false;
        } else {
            ibcTxTotalMoreThan500k.value = true;
        }
    });
    return {
        isHashFilterParams,
        isIbcTxTotalAndHashFilter
    };
};

export const useQueryDatas = (
    showTransferLoading: Ref<boolean>,
    pagination: IPaginationParams,
    getIbcTxs: any,
    tableDatas: Ref<IIbcTx[]>,
    queryParams: ITransfersQueryParams
) => {
    let isDateDefaultValue = false;

    const isHashFilterParams = ref<boolean>(false);
    const isShowValuedText = ref(false);
    const countLoading = ref(false);
    const txsValue = ref<string>('');
    const getIbcTxsData = async (
        params: any,
        page_num: number,
        page_size: number,
        use_count = false
    ) => {
        showTransferLoading.value = true;
        if (params.chain) {
            params.chain = await ChainHelper.handleChainIdToChain(params.chain);
        }
        getIbcTxs({
            page_num,
            page_size,
            use_count,
            ...params
        })
            .then((data: IIbcTx[] | IIbcTxCount) => {
                if (use_count) {
                    pagination.total = (data as IIbcTxCount).txs_count;
                    txsValue.value = (data as IIbcTxCount).txs_value;
                    countLoading.value = false;
                } else {
                    tableDatas.value = data as IIbcTx[];
                    showTransferLoading.value = false;
                }
            })
            .catch((error: any) => {
                if (!axiosCancel(error)) {
                    showTransferLoading.value = false;
                }
                console.log(error);
            })
            .finally(() => {
                if (use_count) {
                    if (
                        !params.chain &&
                        !params.denom &&
                        !params.base_denom &&
                        !params.base_denom_chain &&
                        params.status === TX_STATUS_NUMBER.defaultStatus &&
                        isDateDefaultValue
                    ) {
                        isHashFilterParams.value = false;
                    } else {
                        isHashFilterParams.value = true;
                    }
                }
            });
    };
    const queryDatas = () => {
        if (queryParams.date_range?.length === 2) {
            const startTime = queryParams.date_range[0];
            isDateDefaultValue = !startTime;
        } else if (queryParams.date_range.length === 0) {
            isDateDefaultValue = true;
        }
        const params = {
            status: queryParams.status?.toString(),
            chain: queryParams.chain,
            date_range: queryParams.date_range?.toString(),
            base_denom: queryParams.base_denom,
            base_denom_chain: queryParams.base_denom_chain,
            denom: queryParams.denom
        };
        isShowValuedText.value = Boolean(queryParams.chain);
        countLoading.value = true;
        getIbcTxsData(params, 1, 10, true);
        getIbcTxsData(params, pagination.current, pagination.pageSize);
    };
    queryDatas();
    return {
        queryDatas,
        getIbcTxsData,
        isHashFilterParams,
        isShowValuedText,
        countLoading,
        txsValue
    };
};

export const useSelectedParams = (
    pagination: IPaginationParams,
    ibcChains: Ref<IIbcChains>,
    queryParams: ITransfersQueryParams,
    searchToken: Ref<string | undefined>,
    chainId: string,
    url: string,
    inputFlag: Ref<boolean>,
    dateRange: Ref<[Dayjs, Dayjs] | undefined>,
    queryDatas: () => void
) => {
    const router = useRouter();
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenomsSorted } = useGetIbcDenoms();
    const chainDropdown = ref();
    const chains = ref<TDenom[]>(chainId ? (chainId as string).split(',') : []);
    const chainGetPopupContainer = (): HTMLElement => document.querySelector('.transfer__middle')!;
    const tokenData = computed(() => {
        return [
            {
                groupName: '',
                children: [
                    {
                        title: 'All Tokens',
                        id: '',
                        metaData: null
                    }
                ]
            },
            {
                groupName: 'Authed IBC Tokens',
                children: ibcBaseDenomsSorted.value.map((v) => ({
                    title: v.symbol,
                    id: v.denom + v.chain,
                    icon: v.icon || TOKEN_DEFAULT_ICON,
                    metaData: v
                }))
            },
            {
                groupName: 'Other IBC Tokens',
                children: [
                    {
                        id: 'Others',
                        title: 'Others',
                        icon: TOKEN_DEFAULT_ICON
                    }
                ]
            }
        ];
    });
    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        doubleTime: true,
                        id: CHAIN_DEFAULT_VALUE,
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v) => ({
                    title: v.pretty_name,
                    id: v.pretty_name,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const changeInputFlag = (flag: boolean) => {
        inputFlag.value = flag;
    };
    const disabledDate = (current: Dayjs): boolean => {
        const currentStart = dayjsUtc(current).startOf('day');
        const max = dayjsUtc().endOf('day');
        const min = dayjsUtc(
            (ibcStatisticsChainsStore.txSearchTimeMin || 1617007625) * 1000
        ).startOf('day');
        return currentStart && (currentStart < min || currentStart > max);
    };
    const judgeQueryParams = () => {
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pagination.pageSize}`;
        if (queryParams?.chain) {
            url += `&chain=${queryParams.chain}`;
        }
        if (queryParams?.denom) {
            url += `&denom=${queryParams.denom}`;
        }
        if (
            queryParams?.base_denom &&
            (queryParams?.base_denom as string)?.toLowerCase() !== UNKNOWN_SYMBOL
        ) {
            url += `&baseDenom=${queryParams.base_denom}`;
        }
        if (queryParams?.base_denom_chain) {
            url += `&baseDenomChain=${queryParams.base_denom_chain}`;
        }
        if (queryParams?.status) {
            url += `&status=${queryParams.status.join(',')}`;
        }
        if (queryParams?.date_range?.length) {
            if (queryParams?.date_range.length === 1) {
                const timeStamp = queryParams.date_range[0];
                const endTime = dayjsFormatDate(timeStamp * 1000, 'YYYY-MM-DD');
                url += `&startTime=&endTime=${endTime}`;
            }
            if (queryParams?.date_range.length === 2) {
                const startTimeStamp = queryParams.date_range[0];
                const entTimeStamp = queryParams.date_range[1];
                const startTime = startTimeStamp
                    ? dayjsFormatDate(startTimeStamp * 1000, 'YYYY-MM-DD')
                    : '';
                const endTime = dayjsFormatDate(entTimeStamp * 1000, 'YYYY-MM-DD');
                url += `&startTime=${startTime}&endTime=${endTime}`;
            }
        }
        router.replace(url);
    };
    const onSelectedToken = (val?: IDataItem) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Token');
        pagination.current = 1;
        const id = val?.id;
        const denom = val?.metaData?.denom;
        const denomChain = val?.metaData?.chain;
        if (id) {
            if (val?.inputFlag) {
                inputFlag.value = true;
                const transferId = (id as string).replace(/^ibc\//i, '');
                queryParams.denom = id ? `ibc/${transferId.toUpperCase()}` : undefined;
                queryParams.base_denom = undefined;
                queryParams.base_denom_chain = undefined;
            } else {
                inputFlag.value = false;
                queryParams.base_denom = denom || id;
                queryParams.base_denom_chain = denomChain;
                queryParams.denom = undefined;
            }
            searchToken.value = id as string;
        } else {
            inputFlag.value = false;
            queryParams.base_denom = undefined;
            queryParams.base_denom_chain = undefined;
            queryParams.denom = undefined;
            searchToken.value = '';
        }
        judgeQueryParams();
        queryDatas();
    };
    const onSelectedChain = (vals: IDataItem[]) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Chain');
        chains.value = vals?.map((v) => v.id);
        const chain = chains.value.join(',');
        queryParams.chain = chain !== 'allchain,allchain' ? chain : '';
        pagination.current = 1;
        judgeQueryParams();
        queryDatas();
    };
    const handleSelectChange = (item: any) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Status');
        pagination.current = 1;
        queryParams.status = item ? JSONparse(item) : item;
        judgeQueryParams();
        queryDatas();
    };
    const onChangeRangePicker = (dates: [Dayjs, Dayjs]) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Date');
        pagination.current = 1;
        dateRange.value = dates;
        queryParams.date_range[0] = dayjsUtc(dates[0]).startOf('day').unix();
        queryParams.date_range[1] = dayjsUtc(dates[1]).endOf('day').unix();
        judgeQueryParams();
        queryDatas();
    };
    const onClickReset = () => {
        chainDropdown.value.selectedChain = [];
        dateRange.value = undefined;
        queryParams.date_range = [];
        queryParams.status = TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS;
        queryParams.chain = undefined;
        queryParams.base_denom = undefined;
        queryParams.base_denom_chain = undefined;
        queryParams.denom = undefined;
        pagination.current = 1;
        url = '/transfers';
        router.replace(url);
        chains.value = [];
        searchToken.value = undefined;
        queryDatas();
    };
    return {
        chainDropdown,
        chains,
        chainGetPopupContainer,
        tokenData,
        chainData,
        changeInputFlag,
        disabledDate,
        onSelectedToken,
        onSelectedChain,
        handleSelectChange,
        onChangeRangePicker,
        onClickReset
    };
};

export const useTransfersTable = (
    pagination: IPaginationParams,
    url: string,
    getIbcTxsData: (params: any, page_num: number, page_size: number, use_count?: boolean) => void,
    queryParams: ITransfersQueryParams,
    ibcChains: Ref<IIbcChains>
) => {
    const router = useRouter();
    const onPaginationChange = (current: number, pageSize: number) => {
        pagination.current = current;
        const params = urlParser(url);
        url = `/transfers?pageNum=${current}&pageSize=${pageSize}`;

        if (params?.chain) {
            url += `&chain=${params.chain}`;
        }
        if (params?.denom) {
            url += `&denom=${params.denom}`;
        }
        if (params?.baseDenom && (params?.baseDenom as string)?.toLowerCase() !== UNKNOWN_SYMBOL) {
            url += `&baseDenom=${params.baseDenom}`;
        }
        if (params?.baseDenomChain) {
            url += `&baseDenomChain=${params.baseDenomChain}`;
        }
        if (params?.status) {
            url += `&status=${params.status}`;
        }
        if (params?.startTime || params.startTime === '') {
            url += `&startTime=${params.startTime}`;
        }
        if (params?.endTime || params.endTime === '') {
            url += `&endTime=${params.endTime}`;
        }
        router.replace(url);
        getIbcTxsData(queryParams, pagination.current, pagination.pageSize);
    };
    const getImageUrl = (status: string | number) => {
        return new URL(`../../assets/status/transfer_status${status}.png`, import.meta.url).href;
    };
    const findIbcChainIcon = (chainId: string) => {
        if (ibcChains && ibcChains.value.all) {
            const result = ibcChains.value.all.find((item) => item.chain_name === chainId);
            if (result) {
                return result.icon || CHAIN_DEFAULT_ICON;
            }
        }
        return CHAIN_DEFAULT_ICON;
    };
    return {
        onPaginationChange,
        getImageUrl,
        findIbcChainIcon
    };
};
