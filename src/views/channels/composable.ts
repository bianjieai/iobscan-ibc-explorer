import { getChannelsListAPI } from '@/api/channels';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS, CHAIN_DEFAULT_VALUE, PAGE_PARAMETERS } from '@/constants';
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
import { CHAIN_ICON } from '@/constants/bjSelect';
import { IIbcChains } from '@/types/interface/index.interface';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';

export const useGetChannelsList = (loading: Ref<boolean>, ibcChains: Ref<IIbcChains>) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/channels';
    const channelsList = ref<IResponseChannelsListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TChannelStatus;

    const searchChain = ref(chainIdQuery ? chainIdQuery : undefined);
    const chainIds = ref<TDenom[]>(searchChain.value ? searchChain.value.split(',') : []);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
    const refreshList = () => {
        getChannelsList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (vals: IDataItem[]) => {
        // allChain 只能是最后一个，否则交换
        const res = vals.map((v) => v.id);
        if (ChainHelper.isNeedSort(res, vals)) {
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
        searchStatus.value = value as TChannelStatus;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: value as TChannelStatus
        });
        router.replace(pageUrl);
        refreshList();
    };

    onMounted(() => {
        refreshList();
    });

    const getChannelsList = async (params: IRequestChannelsList) => {
        const { loading } = params;

        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getChannelsListAPI({
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseChannelsList;
                    channelsList.value = ChainHelper.sortByChainName(items, params.chain);
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
        } finally {
            if (!searchChain.value && !searchStatus.value) {
                isHaveParams.value = false;
            } else {
                isHaveParams.value = true;
            }
        }
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
        subtitle,
        onSelectedChain,
        onSelectedStatus,
        chainIds,
        chainData,
        statusQuery
    };
};

export const useChannelsRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    return {
        chainDropdown,
        statusDropdown
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
