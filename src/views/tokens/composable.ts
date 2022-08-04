import { getTokensListAPI } from '@/api/tokens';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
import {
    IResponseTokensList,
    IRequestTokensList,
    TTokenType,
    ITokensListItem
} from '@/types/interface/tokens.interface';
import { urlPageParser } from '@/utils/urlTools';
import { computed, onMounted, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

export const useGetTokenList = () => {
    const tokensList = ref<ITokensListItem[]>([]);
    const total = ref<number>(0);

    const getTokensList = async (params: IRequestTokensList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getTokensListAPI({
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseTokensList;
                    const temp: ITokensListItem[] = [];
                    for (let i = 0; i < (items ?? []).length; i++) {
                        const item: ITokensListItem = items[i];
                        const baseDenom = await getBaseDenomByKey(item.chain_id, item.base_denom);
                        item['name'] = baseDenom
                            ? getRestString(baseDenom.symbol, 6, 0)
                            : getRestString(item.base_denom, 6, 0);
                        temp.push(item);
                    }
                    tokensList.value = temp;
                } else {
                    total.value = data as number;
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            loading && (loading.value = false);
            console.log(error);
        }
    };
    getTokensList({ ...BASE_PARAMS, use_count: true });
    return {
        tokensList,
        total,
        getTokensList
    };
};

export const useTokensQuery = () => {
    const route = useRoute();
    const chainIdQuery = route.query.chain as string;
    const denomQuery = route.query.denom as string;
    const statusQuery = route.query.status as TTokenType;
    return {
        chainIdQuery,
        denomQuery,
        statusQuery
    };
};

export const useTokensSelected = (
    denomQuery: string,
    chainIdQuery: string,
    statusQuery: TTokenType,
    getTokensList: (params: IRequestTokensList) => Promise<void>,
    getIbcBaseDenom: () => Promise<void>,
    loading: Ref<boolean>
) => {
    let pageUrl = '/tokens';
    const router = useRouter();
    const searchDenom = ref(denomQuery);
    const searchChain = ref<string | undefined>(chainIdQuery);
    const searchStatus = ref<TTokenType>(statusQuery);
    const refreshList = () => {
        getTokensList({
            ...BASE_PARAMS,
            base_denom: searchDenom.value,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedToken = (denom?: string | number) => {
        if (denom) {
            searchDenom.value = denom as string;
        } else {
            searchDenom.value = '';
        }
        pageUrl = urlPageParser(pageUrl, {
            key: 'denom',
            value: denom as string
        });
        router.replace(pageUrl);
        refreshList();
    };
    const onSelectedChain = (chain?: string | number) => {
        searchChain.value = chain ? String(chain) : undefined;
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (status?: string | number) => {
        searchStatus.value = status as TTokenType;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: status as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    onMounted(() => {
        getIbcBaseDenom();
        refreshList();
    });
    return {
        searchChain,
        searchDenom,
        searchStatus,
        onSelectedToken,
        onSelectedChain,
        onSelectedStatus
    };
};

export const useTokensRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    const tokensDropdown = ref();
    return {
        chainDropdown,
        statusDropdown,
        tokensDropdown
    };
};

export const useSubTitleComputed = (
    searchChain: Ref<string | undefined>,
    searchDenom: Ref<string>,
    searchStatus: Ref<TTokenType>,
    total: Ref<number>,
    tokensList: Ref<ITokensListItem[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value && !searchDenom.value) {
            return `${formatBigNumber(total.value, 0)} tokens found`;
        } else {
            return `${formatBigNumber(tokensList.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} tokens found`;
        }
    });
    return {
        subtitle
    };
};

export const useTokensColumnJump = (getBaseDenomInfoByDenom: any) => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const goIbcToken = (denom: string) => {
        router.push({
            path: '/tokens/details',
            query: {
                denom
            }
        });
    };

    const goTransfer = (denom: string, chainId: string) => {
        const baseDenomInfo = getBaseDenomInfoByDenom(denom, chainId);
        const query = baseDenomInfo ? { symbol: baseDenomInfo.symbol } : { denom };
        router.push({
            path: '/transfers',
            query: query
        });
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useResetSearch();
        resetSearch();
    };
    return {
        goChains,
        goIbcToken,
        goTransfer,
        resetSearchCondition
    };
};
