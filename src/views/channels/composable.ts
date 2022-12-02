import { getChannelsListAPI } from '@/api/channels';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS, CHAIN_DEFAULT_VALUE, PAGE_PARAMETERS, CHAIN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import ChainHelper from '@/helper/chainHelper';
import {
    IResponseChannelsList,
    IRequestChannelsList,
    IResponseChannelsListItem
} from '@/types/interface/channels.interface';
import { TChannelStatus } from '@/types/interface/components/table.interface';
import { urlPageParser } from '@/utils/urlTools';
import { computed, onMounted, ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosCancel } from '@/utils/axios';
import { IDataItem, TDenom } from '@/components/BjSelect/interface';
import { IIbcChains } from '@/types/interface/index.interface';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';

export const useGetChannelsList = () => {
    const channelsList = ref<IResponseChannelsListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const getChannelsList = async (params: IRequestChannelsList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        if (params.chain) {
            params.chain = await ChainHelper.handleChainIdToChain(params.chain);
        }
        let allData: IResponseChannelsListItem[] = [];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllData = async () => {
            try {
                const result = await getChannelsListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const items = (data as IResponseChannelsList).items;
                        if (items && items.length > 0) {
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...items];
                                loading && (loading.value = false);
                                channelsList.value = ChainHelper.sortByPrettyName(
                                    allData,
                                    allParams.chain
                                );
                            } else {
                                allData = [...(allData || []), ...items];
                                allParams.page_num++;
                                getAllData();
                            }
                        } else {
                            loading && (loading.value = false);
                            channelsList.value = ChainHelper.sortByPrettyName(
                                allData,
                                allParams.chain
                            );
                            return;
                        }
                    } else {
                        total.value = data as number;
                    }
                } else {
                    loading && (loading.value = false);
                    channelsList.value = ChainHelper.sortByPrettyName(allData, allParams.chain);
                    console.error(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                channelsList.value = ChainHelper.sortByPrettyName(allData, allParams.chain);
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
    getChannelsList({ ...BASE_PARAMS, use_count: true });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            channelsList.value.length,
            PAGE_PARAMETERS.channels
        );
    });
    return {
        channelsList,
        getChannelsList,
        subtitle
    };
};

export const useChannelsSelected = (
    ibcChains: Ref<IIbcChains>,
    getChannelsList: (params: IRequestChannelsList) => Promise<void>,
    loading: Ref<boolean>
) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/channels';
    const chainDropdown = ref();
    const statusDropdown = ref();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TChannelStatus;
    const searchChain = ref(chainIdQuery ? chainIdQuery : undefined);
    const chainIds = ref<TDenom[]>(searchChain.value ? searchChain.value.split(',') : []);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
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
    const onSelectedChain = (vals: IDataItem[]) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Chain`
        );

        const res = vals.map((v) => v.id);
        if (ChainHelper.isNeedSort(res, chainData.value)) {
            chainIds.value = [res[1], res[0]];
        } else {
            chainIds.value = res;
        }

        const chain = chainIds.value.join(',');
        searchChain.value = chain !== 'allchain,allchain' ? chain : '';
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: searchChain.value as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (value?: number | string) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Status`
        );

        searchStatus.value = value as TChannelStatus;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: value as TChannelStatus
        });
        router.replace(pageUrl);
        refreshList();
    };
    const refreshList = () => {
        getChannelsList({
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
        statusQuery,
        chainIds,
        chainData,
        onSelectedChain,
        onSelectedStatus
    };
};

export const useChannelsColumnJump = () => {
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
