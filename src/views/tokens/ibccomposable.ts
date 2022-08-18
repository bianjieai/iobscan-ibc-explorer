import { axiosCancel } from '@/utils/axios';
import { getIbcTokenListAPI } from '@/api/tokens';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS, PAGE_PARAMETERS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { getRestString } from '@/helper/parseStringHelper';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';
import {
    IRequestIbcTokenList,
    IResponseIbcTokenList,
    IResponseIbcTokenListItem,
    TIbcTokenType
} from '@/types/interface/tokens.interface';
import { isNullOrEmpty } from '@/utils/objectTools';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';
import { IDataItem } from '@/components/BjSelect/interface';
import ChainHelper from '@/helper/chainHelper';
import { CHAIN_ICON } from '@/constants/bjSelect';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';

export const useGetIbcTokenList = (
    loading: Ref<boolean>,
    ibcChains: Ref<IIbcChains>,
    getIbcBaseDenom: () => Promise<void>,
    ibcBaseDenoms: Ref<IBaseDenom[]>
) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/tokens/details';
    const ibcTokenList = ref<IResponseIbcTokenListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const baseDenomQuery = route.query.denom as string;
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TIbcTokenType;
    const searchChain = ref<string | undefined>(chainIdQuery ?? undefined);
    const searchStatus = ref<TIbcTokenType | undefined>(statusQuery);
    const refreshList = () => {
        getIbcTokenList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    const onSelectedChain = (val?: IDataItem) => {
        const chain = val?.id;
        searchChain.value = chain as string;
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: chain as string
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
                        id: '',
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v: any) => ({
                    title: v.chain_name,
                    id: v.chain_id,
                    icon: v.icon || CHAIN_ICON,
                    metaData: v
                }))
            }
        ];
    });

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

    const getIbcTokenList = async (params: IRequestIbcTokenList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getIbcTokenListAPI(baseDenomQuery, {
                ...BASE_PARAMS,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseIbcTokenList;
                    ibcTokenList.value = items;
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
            console.log(error);
        } finally {
            if (!searchChain.value && !searchStatus.value) {
                isHaveParams.value = false;
            } else {
                isHaveParams.value = true;
            }
        }
    };
    getIbcTokenList({ ...BASE_PARAMS, use_count: true });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            ibcTokenList.value.length,
            PAGE_PARAMETERS.tokens
        );
    });
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
        ibcTokenList,
        subtitle,
        searchChain,
        chainData,
        onSelectedChain,
        onSelectedStatus,
        baseDenomInfo,
        baseDenomQuery,
        statusQuery
    };
};

export const useIbcTokenRef = () => {
    const chainDropdown = ref();
    const statusDropdown = ref();
    return {
        chainDropdown,
        statusDropdown
    };
};

export const useIbcTokenColumnJump = (baseDenomQuery: string) => {
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
        const { resetSearch } = useResetSearch();
        resetSearch(`/${PAGE_PARAMETERS.tokens}/details?denom=${baseDenomQuery}`);
    };
    return {
        goChains,
        goTransfer,
        resetSearchCondition
    };
};
