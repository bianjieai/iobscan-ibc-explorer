import { useIbcStatisticsChains } from '@/store/index';
import { TRANSFER_TABLE_COLUMN, DEFAULT_TITLE, TOKEN_DEFAULT_ICON } from '@/constants';
import { IPaginationParams } from '@/types/interface/index.interface';
import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { API_CODE } from '@/constants/apiCode';

export const useIbcDenoms = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcDenoms } = storeToRefs(ibcStatisticsChainsStore);
    onMounted(() => {
        ibcStatisticsChainsStore.getIbcDenomsAction();
    });
    return {
        ibcDenoms
    };
};

export const useSelectedSymbol = () => {
    const selectedSymbol = ref(DEFAULT_TITLE.defaultTokens);
    const isShowSymbolIcon = ref(false);
    const clearInput = ref(0);
    const selectedChain = reactive({
        value: {
            chain_name: undefined
        }
    });
    const isShowChainIcon = ref(false);
    return {
        selectedSymbol,
        isShowSymbolIcon,
        clearInput,
        selectedChain,
        isShowChainIcon
    };
};

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

export const useFindIcon = (props: any) => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { ibcBaseDenomsSymbolKeyMapGetter } = storeToRefs(ibcStatisticsChainsStore);
    const findSymbolIcon = () => {
        const findSymbolConfig = props.ibcBaseDenoms?.find(
            (baseDenom: any) => baseDenom.symbol === props.selectedSymbol
        );
        if (findSymbolConfig) {
            return findSymbolConfig.icon || TOKEN_DEFAULT_ICON;
        }
        return TOKEN_DEFAULT_ICON;
    };
    const findChainIcon = () => {
        const findChainConfig = props?.options?.find(
            (item: any) => item.chain_id === props.selectedChain.chain_id
        );
        if (findChainConfig) {
            return findChainConfig.icon || TOKEN_DEFAULT_ICON;
        }
        return TOKEN_DEFAULT_ICON;
    };
    const isShowSymbol = (key: string) => {
        const result = {
            symbolDenom: '',
            symbolIcon: ''
        };
        if (Array.isArray(props.ibcBaseDenoms)) {
            const findSymbol = ibcBaseDenomsSymbolKeyMapGetter.value[key];
            result.symbolDenom = findSymbol ? findSymbol.symbol : key;
            result.symbolIcon = findSymbol ? findSymbol.icon : '';
        }
        return result;
    };
    return {
        findSymbolIcon,
        findChainIcon,
        isShowSymbol
    };
};

export const useGetTableColumns = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const tableColumns = reactive(TRANSFER_TABLE_COLUMN);
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
            getTxDetailsByTxHashAPI(Object.keys(route.query).join(''))
                .then((result) => {
                    const { code, data } = result;
                    if (code === API_CODE.success) {
                        if (data?.items?.length === 1) {
                            router.push(
                                `/transfers/details?hash=${Object.keys(route.query).join('')}`
                            );
                        }
                    }
                })
                .catch((error) => {
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
