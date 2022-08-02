import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { getRelayersListAPI } from '@/api/relayers';
import { TRelayerStatus } from '@/types/interface/components/table.interface';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';
import { BASE_PARAMS } from '@/constants';

export const useGetRelayersList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: IRequestRelayerList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getRelayersListAPI({
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseRelayerList;
                    list.value = ChainHelper.sortByChainName(items, params.chain)?.map(
                        (item: any) => {
                            item.txs_success_rate = formatTransfer_success_txs(
                                item.transfer_success_txs,
                                item.transfer_total_txs
                            );
                            return item;
                        }
                    );
                } else {
                    total.value = data as number;
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            loading && (loading.value = false);
            console.error(error);
        }
    };
    getList({ ...BASE_PARAMS, use_count: true });

    return {
        list,
        total,
        getList
    };
};

export const useQuery = () => {
    const route = useRoute();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TRelayerStatus;
    return {
        chainIdQuery,
        statusQuery
    };
};
export const useSelected = (
    chainIdQuery: string,
    statusQuery: TRelayerStatus,
    getList: any,
    loading: Ref<boolean>
) => {
    let pageUrl = '/relayers';
    const router = useRouter();
    const originalChainRef = () => {
        if (!chainIdQuery) return;
        if (chainIdQuery.includes(',')) {
            return `${chainIdQuery}`;
        } else {
            return `${chainIdQuery},allchain`;
        }
    };
    const searchChain = ref(originalChainRef());
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
    const refreshList = () => {
        getList({
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (chain_id?: string) => {
        searchChain.value = chain_id !== 'allchain,allchain' ? chain_id : '';
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: searchChain.value as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (value?: number | string) => {
        searchStatus.value = value as TRelayerStatus;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: value as TRelayerStatus
        });
        router.replace(pageUrl);
        refreshList();
    };

    onMounted(() => {
        refreshList();
    });
    return {
        searchChain,
        searchStatus,
        onSelectedChain,
        onSelectedStatus
    };
};
export const useRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    return {
        chainDropdown,
        statusDropdown
    };
};
export const useSubTitleComputed = (
    searchChain: Ref<string | undefined>,
    searchStatus: Ref<TRelayerStatus | undefined>,
    total: Ref<number>,
    list: Ref<never[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} relayers found`;
        } else {
            return `${formatBigNumber(list.value?.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} relayers found`;
        }
    });
    return {
        subtitle
    };
};
