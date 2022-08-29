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

export const useGetIbcTokenList = () => {
    const route = useRoute();
    const baseDenomQuery = route.query.denom as string;
    const ibcTokenList = ref<IResponseIbcTokenListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const getIbcTokenList = async (params: IRequestIbcTokenList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        let allData = [] as IResponseIbcTokenListItem[];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllIbcTokenData = async () => {
            try {
                const result = await getIbcTokenListAPI(baseDenomQuery, allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const { items } = data as IResponseIbcTokenList;
                        if (items?.length) {
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...items];
                                loading && (loading.value = false);
                                ibcTokenList.value = allData;
                            } else {
                                allData = [...(allData || []), ...items];
                                allParams.page_num++;
                                getAllIbcTokenData();
                            }
                        } else {
                            loading && (loading.value = false);
                            ibcTokenList.value = allData;
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    ibcTokenList.value = allData;
                    console.log(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                ibcTokenList.value = allData;
                console.log(error);
            } finally {
                if (!params.chain && !params.token_type) {
                    isHaveParams.value = false;
                } else {
                    isHaveParams.value = true;
                }
            }
        };
        getAllIbcTokenData();
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
    return {
        ibcTokenList,
        getIbcTokenList,
        subtitle,
        baseDenomQuery
    };
};

export const useIbcTokenSelected = (
    ibcChains: Ref<IIbcChains>,
    baseDenomQuery: string,
    getIbcBaseDenom: () => Promise<void>,
    getIbcTokenList: (params: IRequestIbcTokenList) => Promise<void>,
    ibcBaseDenoms: Ref<IBaseDenom[]>,
    loading: Ref<boolean>
) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/tokens/details';
    const chainDropdown = ref();
    const statusDropdown = ref();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TIbcTokenType;
    const searchChain = ref<string | undefined>(chainIdQuery ?? undefined);
    const searchStatus = ref<TIbcTokenType | undefined>(statusQuery);
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
    const onSelectedStatus = (status?: string | number) => {
        searchStatus.value = status as TIbcTokenType;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: status as TIbcTokenType
        });
        router.replace(pageUrl);
        refreshList();
    };
    const refreshList = () => {
        getIbcTokenList({
            ...BASE_PARAMS,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    onMounted(() => {
        getIbcBaseDenom();
        refreshList();
    });
    return {
        chainDropdown,
        statusDropdown,
        searchChain,
        chainData,
        onSelectedChain,
        onSelectedStatus,
        baseDenomInfo,
        statusQuery
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
