import { useIbcStatisticsChains } from '@/store/index';
import {
    CHAINNAME,
    CHAIN_DEFAULT_ICON,
    CHAIN_DEFAULT_VALUE,
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
import dayjs from 'dayjs';
import { JSONparse, rmIbcPrefix } from '@/helper/parseStringHelper';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
import { dayjsFormatDate } from '@/utils/timeTools';
import ChainHelper from '@/helper/chainHelper';
import { Ref } from 'vue';
import { urlParser } from '@/utils/urlTools';
import { axiosCancel } from '@/utils/axios';
import { IIbcTx, ITransfersQueryParams } from '@/types/interface/transfers.interface';

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
                (item: IIbcchain) => item.chain_name === CHAINNAME.COSMOSHUB
            );
            const irishubChain = ibcChains.value.all.filter(
                (item: IIbcchain) => item.chain_name === CHAINNAME.IRISHUB
            );
            const notIncludesIrisAndCosmosChains: IIbcchain[] = [];
            ibcChains.value.all.forEach((item: IIbcchain) => {
                if (
                    item.chain_name !== CHAINNAME.COSMOSHUB &&
                    item.chain_name !== CHAINNAME.IRISHUB
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
        paramsBaseDenomChainId: string | undefined = undefined,
        paramsDenom: string | undefined = undefined,
        startTimestamp = 0,
        endTimestamp = 0;
    const searchToken = ref<string | undefined>();
    const inputFlag = ref(false);
    const dateRange = reactive({ value: [] });
    const chainId = route?.query.chain as string;
    if (chainId) {
        url += `&chain=${chainId}`;
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
    if (route?.query?.baseDenomChainId) {
        url += `&baseDenomChainId=${route.query.baseDenomChainId}`;
        paramsBaseDenomChainId = route?.query.baseDenomChainId as string | undefined;
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
        startTimestamp = dayjs(route.query.startTime as any).unix();
    }
    if (route?.query?.endTime) {
        url += `&endTime=${route.query.endTime}`;
        endTimestamp = dayjs(route.query.endTime as any)
            .endOf('day')
            .unix();
    }
    if (startTimestamp && endTimestamp) {
        dateRange.value = [dayjs(startTimestamp * 1000), dayjs(endTimestamp * 1000)] as any;
    }
    searchToken.value = (paramsBaseDenom || '') + (paramsBaseDenomChainId || '');
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
        chain_id: chainId,
        base_denom: paramsBaseDenom,
        base_denom_chain_id: paramsBaseDenomChainId,
        denom: paramsDenom
    });
    return {
        url,
        searchToken,
        inputFlag,
        dateRange,
        chainId,
        queryParams
    };
};

export const useSubTitleFilter = (
    pagination: IPaginationParams,
    ibcStatisticsTxs: IDenomStatistic
) => {
    const ibcTxTotalMoreThan500k = ref<boolean>(false);
    const isHashFilterParams = ref<boolean>(false);
    const isIbcTxTotalAndHashFilter = computed(() => {
        if (ibcTxTotalMoreThan500k.value) {
            if (isHashFilterParams.value) {
                if (pagination.total === TOTAL_BOUND) {
                    return 'Last 500k transfers found';
                }
                return `${pagination.total} of the last 500k transfers found`;
            }
            return 'Last 500k transfers found';
        } else {
            if (isHashFilterParams.value) {
                return `${pagination.total} of the ${ibcStatisticsTxs.tx_all.count} transfers found`;
            }
            return `A total of ${ibcStatisticsTxs.tx_all.count} transfers found`;
        }
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
    isHashFilterParams: Ref<boolean>,
    tableDatas: Ref<IIbcTx[]>,
    queryParams: ITransfersQueryParams
) => {
    let isDateDefaultValue = false;
    const getIbcTxsData = (params: any, page_num: number, page_size: number, use_count = false) => {
        showTransferLoading.value = true;
        getIbcTxs({
            page_num,
            page_size,
            use_count,
            ...params
        })
            .then((data: IIbcTx[] | number) => {
                if (typeof data === 'number') {
                    pagination.total = data;
                } else {
                    tableDatas.value = data;
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
                        !params.chain_id &&
                        !params.denom &&
                        !params.base_denom &&
                        !params.base_denom_chain_id &&
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
            if (!startTime) {
                isDateDefaultValue = true;
            }
            isDateDefaultValue = false;
        } else if (queryParams.date_range.length === 0) {
            isDateDefaultValue = true;
        }
        const params = {
            status: queryParams.status?.toString(),
            chain_id: queryParams.chain_id,
            date_range: queryParams.date_range?.toString(),
            base_denom: queryParams.base_denom,
            base_denom_chain_id: queryParams.base_denom_chain_id,
            denom: queryParams.denom
        };
        getIbcTxsData(params, 1, 10, true);
        getIbcTxsData(params, pagination.current, pagination.pageSize);
    };
    queryDatas();
    return {
        queryDatas,
        getIbcTxsData
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
    dateRange: {
        value: never[];
    },
    queryDatas: () => void
) => {
    const router = useRouter();
    const { ibcBaseDenomsSorted } = useGetIbcDenoms();
    const chainDropdown = ref();
    const chainIds = ref<TDenom[]>(chainId ? (chainId as string).split(',') : []);
    const startTime = (time: string | number | Date) => {
        const nowTimeDate = new Date(time);
        return nowTimeDate.setHours(0, 0, 0, 0);
    };
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
                    id: v.denom + v.chain_id,
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
                    title: v.chain_name,
                    id: v.chain_id,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const changeInputFlag = (flag: boolean) => {
        inputFlag.value = flag;
    };
    const disabledDate = (current: any) =>
        current && (current > dayjs().endOf('day') || current < dayjs(1617007625 * 1000));
    const judgeQueryParams = () => {
        url = `/transfers?pageNum=${pagination.current}&pageSize=${pagination.pageSize}`;
        if (queryParams?.chain_id) {
            url += `&chain=${queryParams.chain_id}`;
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
        if (queryParams?.base_denom_chain_id) {
            url += `&baseDenomChainId=${queryParams.base_denom_chain_id}`;
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
        const denomChainId = val?.metaData?.chain_id;
        if (id) {
            if (val?.inputFlag) {
                inputFlag.value = true;
                const transferId = (id as string).replace(/^ibc\//i, '');
                queryParams.denom = id ? `ibc/${transferId.toUpperCase()}` : undefined;
                queryParams.base_denom = undefined;
                queryParams.base_denom_chain_id = undefined;
            } else {
                inputFlag.value = false;
                queryParams.base_denom = denom || id;
                queryParams.base_denom_chain_id = denomChainId;
                queryParams.denom = undefined;
            }
            searchToken.value = id as string;
        } else {
            inputFlag.value = false;
            queryParams.base_denom = undefined;
            queryParams.base_denom_chain_id = undefined;
            queryParams.denom = undefined;
            searchToken.value = '';
        }
        judgeQueryParams();
        queryDatas();
    };
    const onSelectedChain = (vals: IDataItem[]) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Chain');
        chainIds.value = vals?.map((v) => v.id);
        const chain_id = chainIds.value.join(',');
        queryParams.chain_id = chain_id !== 'allchain,allchain' ? chain_id : '';
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
    const onChangeRangePicker = (dates: any) => {
        (window as any).gtag('event', 'Transfers-点击过滤条件Date');
        pagination.current = 1;
        dateRange.value = dates;
        queryParams.date_range[0] = Math.floor(startTime(dayjs(dates[0]).valueOf()) / 1000);
        queryParams.date_range[1] = Math.floor(
            startTime(dayjs(dates[1]).valueOf()) / 1000 + 60 * 60 * 24 - 1
        );
        judgeQueryParams();
        queryDatas();
    };
    const onClickReset = () => {
        chainDropdown.value.selectedChain = [];
        dateRange.value = [];
        queryParams.date_range = [];
        queryParams.status = TRANSFERS_STATUS_OPTIONS.DEFAULT_OPTIONS;
        queryParams.chain_id = undefined;
        queryParams.base_denom = undefined;
        queryParams.base_denom_chain_id = undefined;
        queryParams.denom = undefined;
        pagination.current = 1;
        url = '/transfers';
        router.replace(url);
        chainIds.value = [];
        searchToken.value = undefined;
        queryDatas();
    };
    return {
        chainDropdown,
        chainIds,
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
    const handleClickRow = (record: any) => {
        return {
            onClick: () => {
                router.push(`/transfers/details?txhash=${record.sc_tx_info.hash}`);
            }
        };
    };
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
        if (params?.baseDenomChainId) {
            url += `&baseDenomChainId=${params.baseDenomChainId}`;
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
            const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
            if (result) {
                return result.icon || CHAIN_DEFAULT_ICON;
            }
        }
        return CHAIN_DEFAULT_ICON;
    };
    return {
        handleClickRow,
        onPaginationChange,
        getImageUrl,
        findIbcChainIcon
    };
};
