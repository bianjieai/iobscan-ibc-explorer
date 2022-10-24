import { useIbcStatisticsChains } from '@/store/index';
import { TRANSFER_TABLE_COLUMN } from '@/constants';
import { IPaginationParams } from '@/types/interface/index.interface';
import { getTxDetailsByTxHashAPI } from '@/api/transfers';
import { API_CODE } from '@/constants/apiCode';

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
