import { getChannelsListAPI } from '@/api/channels';
import { useJump } from '@/composables';
import { BASE_PARAMS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import ChainHelper from '@/helper/chainHelper';
import { formatBigNumber } from '@/helper/parseStringHelper';
import {
    IResponseChannelsList,
    IRequestChannelsList,
    IResponseChannelsListItem
} from '@/types/interface/channels.interface';
import { TChannelStatus } from '@/types/interface/components/table.interface';
import { urlPageParser } from '@/utils/urlTools';
import { computed, onMounted, ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useGetChannelsList = () => {
    const list = ref<IResponseChannelsListItem[]>([]);
    const total = ref<number>(0);

    const getList = async (params: IRequestChannelsList) => {
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
                    list.value = ChainHelper.sortByChainName(items, params.chain);
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
    const statusQuery = route.query.status as TChannelStatus;
    return {
        chainIdQuery,
        statusQuery
    };
};

export const useSelected = (
    chainIdQuery: string,
    statusQuery: TChannelStatus,
    getList: (params: IRequestChannelsList) => Promise<void>,
    loading: Ref<boolean>
) => {
    let pageUrl = '/channels';

    const router = useRouter();
    const searchChain = ref(chainIdQuery ? chainIdQuery : undefined);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);
    const refreshList = () => {
        getList({
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
    searchStatus: Ref<TChannelStatus | undefined>,
    total: Ref<number>,
    list: Ref<IResponseChannelsListItem[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} channels found`;
        } else {
            return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} channels found`;
        }
    });
    return {
        subtitle
    };
};

export const useColumnJump = () => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useJump();
        resetSearch();
    };
    return {
        goChains,
        resetSearchCondition
    };
};
