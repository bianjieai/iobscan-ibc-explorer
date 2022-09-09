import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '@/helper/chainHelper';
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
import { BASE_PARAMS, CHAIN_DEFAULT_VALUE, PAGE_PARAMETERS, CHAIN_DEFAULT_ICON } from '@/constants';
import { useResetSearch } from '@/composables';
import { useRoute, useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
import { IIbcChains } from '@/types/interface/index.interface';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';

export const useGetRelayersList = () => {
    const relayersList = ref<IResponseRelayerListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);

    const getRelayersList = async (params: IRequestRelayerList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        let allData: IResponseRelayerListItem[] = [];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllData = async () => {
            try {
                const result = await getRelayersListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const items = (data as IResponseRelayerList).items;
                        if (items && items.length > 0) {
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...items];
                                loading && (loading.value = false);
                                relayersList.value = ChainHelper.formatTransfer(allData, allParams);
                            } else {
                                allData = [...(allData || []), ...items];
                                allParams.page_num++;
                                getAllData();
                            }
                        } else {
                            loading && (loading.value = false);
                            relayersList.value = ChainHelper.formatTransfer(allData, allParams);
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    relayersList.value = ChainHelper.formatTransfer(allData, allParams);
                    console.error(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                relayersList.value = ChainHelper.sortByChainName(allData, allParams.chain)?.map(
                    (item: IRelayersListItem) => {
                        item.txs_success_rate = formatTransfer_success_txs(
                            item.transfer_success_txs,
                            item.transfer_total_txs
                        );
                        return item;
                    }
                );
                console.error(error);
            } finally {
                if (!params.chain && !params.status) {
                    isHaveParams.value = false;
                } else {
                    isHaveParams.value = true;
                }
            }
        };
        getAllData();
    };
    getRelayersList({ ...BASE_PARAMS, use_count: true });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            relayersList.value.length,
            PAGE_PARAMETERS.relayers
        );
    });
    return {
        relayersList,
        getRelayersList,
        subtitle
    };
};

export const useRelayersSelected = (
    ibcChains: Ref<IIbcChains>,
    getRelayersList: (params: IRequestRelayerList) => Promise<void>,
    loading: Ref<boolean>
) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/relayers';
    const chainDropdown = ref();
    const statusDropdown = ref();
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
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TRelayerStatus;
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
    const onSelectedChain = (vals: IDataItem[]) => {
        const res = vals.map((v) => v.id);
        if (ChainHelper.isNeedSort(res, chainData.value)) {
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
    const onSelectedStatus = (value?: number | string) => {
        searchStatus.value = value as TRelayerStatus;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: value as TRelayerStatus
        });
        router.replace(pageUrl);
        refreshList();
    };
    const refreshList = () => {
        getRelayersList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };
    onMounted(() => {
        refreshList();
    });
    return {
        chainDropdown,
        statusDropdown,
        chainData,
        chainIds,
        statusQuery,
        onSelectedChain,
        onSelectedStatus
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
