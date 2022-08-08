import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { getRelayersListAPI } from '@/api/relayers';
import { TRelayerStatus } from '@/types/interface/components/table.interface';
import {
    IRelayersListItem,
    IRequestRelayerList,
    IResponseRelayerList,
    IResponseRelayerListItem
} from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';
import { BASE_PARAMS } from '@/constants';
import { useResetSearch } from '@/composables';
import { useRoute, useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';

export const useGetRelayersList = () => {
    const relayersList = ref<IResponseRelayerListItem[]>([]);
    const total = ref<number>(0);

    const getRelayersList = async (params: IRequestRelayerList) => {
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
                    relayersList.value = ChainHelper.sortByChainName(items, params.chain)?.map(
                        (item: IRelayersListItem) => {
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
            if (!axiosCancel(error)) {
                loading && (loading.value = false);
            }
            console.error(error);
        }
    };
    getRelayersList({ ...BASE_PARAMS, use_count: true });

    return {
        relayersList,
        total,
        getRelayersList
    };
};

export const useRelayersQuery = () => {
    const route = useRoute();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TRelayerStatus;
    return {
        chainIdQuery,
        statusQuery
    };
};
export const useRelayersSelected = (
    chainIdQuery: string,
    statusQuery: TRelayerStatus,
    getRelayersList: (params: IRequestRelayerList) => Promise<void>,
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
        getRelayersList({
            ...BASE_PARAMS,
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
export const useRelayersRef = () => {
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
    relayersList: Ref<IResponseRelayerListItem[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} relayers found`;
        } else {
            return `${formatBigNumber(relayersList.value?.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} relayers found`;
        }
    });
    return {
        subtitle
    };
};
export const useRelayersColumnJump = () => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useResetSearch();
        resetSearch();
    };
    return {
        goChains,
        resetSearchCondition
    };
};
