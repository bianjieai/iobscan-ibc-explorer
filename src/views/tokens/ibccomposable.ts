import { getIbcTokenListAPI } from '@/api/tokens';
import { useJump } from '@/composables';
import { BASE_PARAMS, PAGE_PARAMETERS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { formatBigNumber, getRestString } from '@/helper/parseStringHelper';
import { IBaseDenom } from '@/types/interface/index.interface';
import {
    IRequestIbcTokenList,
    IResponseIbcTokenList,
    IResponseIbcTokenListItem,
    TIbcTokenType
} from '@/types/interface/tokens.interface';
import { isNullOrEmpty } from '@/utils/objectTools';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';

export const useGetIbcTokenList = (base_denom: string) => {
    const list = ref<IResponseIbcTokenListItem[]>([]);
    const total = ref<number>(0);

    const getList = async (params: IRequestIbcTokenList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getIbcTokenListAPI(base_denom, {
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseIbcTokenList;
                    list.value = items;
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
    getList({ ...BASE_PARAMS, use_count: true });
    return {
        list,
        total,
        getList
    };
};

export const useQuery = () => {
    const route = useRoute();
    const baseDenomQuery = route.query.denom as string;
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TIbcTokenType;
    return {
        baseDenomQuery,
        chainIdQuery,
        statusQuery
    };
};

export const useSelected = (
    chainIdQuery: string,
    statusQuery: TIbcTokenType,
    getList: (params: IRequestIbcTokenList) => Promise<void>,
    getIbcBaseDenom: () => Promise<void>,
    loading: Ref<boolean>
) => {
    let pageUrl = '/tokens/details';
    const router = useRouter();
    const searchChain = ref<string | undefined>(chainIdQuery ?? undefined);
    const searchStatus = ref<TIbcTokenType | undefined>(statusQuery);
    const refreshList = () => {
        getList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (chain?: string | number) => {
        searchChain.value = chain as string;
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (status?: string | number) => {
        searchStatus.value = status as TIbcTokenType;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: status as TIbcTokenType
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

export const useBaseDenomInfoComputed = (
    ibcBaseDenoms: Ref<IBaseDenom[]>,
    baseDenomQuery: string
) => {
    const baseDenomInfo = computed(() => {
        const filterData = ibcBaseDenoms.value.filter(
            (item: IBaseDenom) => item.denom === baseDenomQuery
        );
        let symbol = '';
        const filterSymbol = filterData[0]?.symbol;

        if (filterData.length === 0 || isNullOrEmpty(filterSymbol)) {
            symbol = getRestString(baseDenomQuery, 3, 8);
        } else {
            if (filterSymbol.includes('ibc')) {
                symbol = getRestString(filterSymbol.replace(/ibc\//, ''), 3, 8);
            } else {
                symbol = filterSymbol;
            }
        }

        return {
            symbol,
            imgSrc: filterData[0]?.icon
                ? filterData[0]?.icon
                : new URL('../../assets/token-default.png', import.meta.url).href
        };
    });
    return {
        baseDenomInfo
    };
};
export const useSubTitleComputed = (
    searchChain: Ref<string | undefined>,
    searchStatus: Ref<TIbcTokenType | undefined>,
    total: Ref<number>,
    list: Ref<IResponseIbcTokenListItem[]>
) => {
    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} tokens found`;
        } else {
            return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(
                total.value,
                0
            )} tokens found`;
        }
    });
    return {
        subtitle
    };
};

export const useColumnJump = (baseDenomQuery: string) => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const goTransfer = (chain_id: string, denom: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain_id,
                denom
            }
        });
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useJump();
        resetSearch(`/${PAGE_PARAMETERS.tokens}/details?denom=${baseDenomQuery}`);
    };
    return {
        goChains,
        goTransfer,
        resetSearchCondition
    };
};
