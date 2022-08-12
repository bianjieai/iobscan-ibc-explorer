import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { getRelayersListAPI } from '@/api/relayers';
import { TRelayerStatus } from '@/types/interface/components/table.interface';
import {
    IRelayersListItem,
    IRequestRelayerList,
    IResponseRelayerListItem
} from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';
import { BASE_PARAMS } from '@/constants';
import { useResetSearch } from '@/composables';
import { useRoute, useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
import { CHAIN_ICON } from '@/constants/bjSelect';
import { CHAIN_DEFAULT_VALUE } from '@/constants/relayers';

export const useGetRelayersList = () => {
    const relayersList = ref<IResponseRelayerListItem[]>([]);
    const total = ref<number>(0);

    const getRelayersList = async (params: IRequestRelayerList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        let allData = [] as IResponseRelayerListItem[];
        try {
            const allParams = { ...BASE_PARAMS, ...params };
            const getAllData = async () => {
                const result = await getRelayersListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        if (data.items.length < allParams.page_size) {
                            allData = [...(allData || []), ...data?.items];
                            loading && (loading.value = false);
                            relayersList.value = ChainHelper.sortByChainName(
                                allData,
                                allParams.chain
                            )?.map((item: IRelayersListItem) => {
                                item.txs_success_rate = formatTransfer_success_txs(
                                    item.transfer_success_txs,
                                    item.transfer_total_txs
                                );
                                return item;
                            });
                        } else if (data.items && data.items.length === allParams.page_size) {
                            allData = [...(allData || []), ...data?.items];
                            allParams.page_num++;
                            getAllData();
                        } else {
                            console.error(message);
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    console.error(message);
                }
            };
            getAllData();
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
    loading: Ref<boolean>,
    ibcChains: any
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
    const chainIds = ref<TDenom[]>(searchChain.value ? searchChain.value.split(',') : []);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
    const refreshList = () => {
        getRelayersList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (vals: IDataItem[]) => {
        // allChain 只能是最后一个，否则交换
        const res = vals.map((v) => v.id);
        if (res[0] === 'allchain') {
            chainIds.value = [res[1], res[0]];
        } else {
            chainIds.value = res;
        }

        const chain_id = chainIds.value.join(',');
        searchChain.value = chain_id !== 'allchain,allchain' ? chain_id : '';
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: searchChain.value as string
        });
        router.replace(pageUrl);
        refreshList();
    };

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
                    icon: v.icon || CHAIN_ICON,
                    metaData: v
                }))
            }
        ];
    });

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
        chainIds,
        searchChain,
        chainData,
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
