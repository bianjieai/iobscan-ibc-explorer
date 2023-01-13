import { IResponseTokensListItem } from './../../types/interface/tokens.interface';
import { getTokensListAPI } from '@/api/tokens';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS, PAGE_PARAMETERS, CHAIN_DEFAULT_ICON, TOKEN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import {
    IResponseTokensList,
    IRequestTokensList,
    TTokenType,
    ITokensListItem
} from '@/types/interface/tokens.interface';
import { urlPageParser } from '@/utils/urlTools';
import { computed, ComputedRef, onMounted, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { IDataItem } from '@/components/BjSelect/interface';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';
import { axiosCancel } from '@/utils/axios';
import ChainHelper from '@/helper/chainHelper';
import { CHAIN_DEFAULT_VALUE, TOKEN_DEFAULT_VALUE } from '@/constants/tokens';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';
import { rmIbcPrefix } from '@/helper/parseStringHelper';

export const useGetTokenList = () => {
    const tokensList = ref<ITokensListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);

    const getTokensList = async (params: IRequestTokensList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        if (params.chain) {
            params.chain = await ChainHelper.handleChainIdToChain(params.chain);
        }
        let allData = [] as IResponseTokensListItem[];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllData = async () => {
            try {
                const result = await getTokensListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const items = (data as IResponseTokensList).items;
                        if (items && items.length > 0) {
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...items];
                                loading && (loading.value = false);
                                tokensList.value = await ChainHelper.getBaseDenom(allData);
                            } else {
                                allData = [...(allData || []), ...items];
                                allParams.page_num++;
                                getAllData();
                            }
                        } else {
                            loading && (loading.value = false);
                            tokensList.value = allData;
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    tokensList.value = await ChainHelper.getBaseDenom(allData);
                    console.error(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                tokensList.value = await ChainHelper.getBaseDenom(allData);
                console.log(error);
            } finally {
                if (!params.chain && !params.token_type && !params.base_denom) {
                    isHaveParams.value = false;
                } else {
                    isHaveParams.value = true;
                }
            }
        };
        getAllData();
    };
    getTokensList({ ...BASE_PARAMS, use_count: true });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            tokensList.value.length,
            PAGE_PARAMETERS.tokens
        );
    });
    return {
        tokensList,
        getTokensList,
        subtitle
    };
};

export const useTokensSelected = (
    ibcBaseDenomsSorted: ComputedRef<IBaseDenom[]>,
    ibcChains: Ref<IIbcChains>,
    getTokensList: (params: IRequestTokensList) => Promise<void>,
    getIbcBaseDenom: () => Promise<void>,
    loading: Ref<boolean>
) => {
    const router = useRouter();
    const route = useRoute();
    const inputFlag = ref(false);
    const changeInputFlag = (flag: boolean) => {
        inputFlag.value = flag;
    };
    let pageUrl = '/tokens';
    const chainDropdown = ref();
    const statusDropdown = ref();
    const tokensDropdown = ref();
    const chainIdQuery = route.query.chain as string;
    const baseDenomQuery = route.query.denom as string;
    const baseDenomChainQuery = route.query.denomChain as string;
    const statusQuery = route.query.status as TTokenType;
    const searchDenom = ref(baseDenomQuery);
    const searchDenomChain = ref(baseDenomChainQuery);
    let rmIbcPrefixBaseDenomQuery = '';
    if (baseDenomQuery && rmIbcPrefix(baseDenomQuery as string).length) {
        rmIbcPrefixBaseDenomQuery = rmIbcPrefix(baseDenomQuery as string);
    }
    const searchTokenKey = ref<string | undefined>(
        rmIbcPrefixBaseDenomQuery
            ? rmIbcPrefixBaseDenomQuery || '' + baseDenomChainQuery || ''
            : undefined
    );
    const searchChain = ref<string | undefined>(chainIdQuery);
    const searchStatus = ref<TTokenType>(statusQuery);
    const tokenData = computed(() => {
        return [
            {
                groupName: '',
                children: [
                    {
                        title: 'All Tokens',
                        id: TOKEN_DEFAULT_VALUE,
                        metaData: null
                    }
                ]
            },
            {
                groupName: 'Authed IBC Tokens',
                children: ibcBaseDenomsSorted.value.map((v) => ({
                    title: v.symbol,
                    id: v.denom + v.chain,
                    icon: v.icon || TOKEN_DEFAULT_ICON,
                    metaData: v
                }))
            },
            {
                groupName: 'Other IBC Tokens',
                children: [
                    {
                        id: 'others',
                        title: 'Others',
                        icon: TOKEN_DEFAULT_ICON
                    }
                ]
            }
        ];
    });

    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        id: CHAIN_DEFAULT_VALUE,
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v: any) => ({
                    title: v.pretty_name,
                    id: v.pretty_name,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });

    const onSelectedToken = (val?: IDataItem) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Token`
        );
        const id = val?.id;
        const denom = val?.metaData?.denom;
        const denomChain = val?.metaData?.chain;
        if (id) {
            if (val?.inputFlag) {
                inputFlag.value = true;
                const transferId = (id as string).replace(/^ibc\//i, '');
                const ibcId = `ibc/${transferId.toUpperCase()}`;
                searchDenom.value = ibcId;
            } else {
                inputFlag.value = false;
                searchDenom.value = denom || id;
            }
            searchDenomChain.value = denomChain;
            searchTokenKey.value = id as string;
        } else {
            inputFlag.value = false;
            searchDenom.value = '';
            searchDenomChain.value = '';
            searchTokenKey.value = '';
        }
        pageUrl = urlPageParser(
            pageUrl,
            {
                key: 'denom',
                value: searchDenom.value
            },
            {
                key: 'denomChain',
                value: searchDenomChain.value
            }
        );
        router.replace(pageUrl);
        refreshList();
    };
    const onSelectedChain = (val?: IDataItem) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Chain`
        );

        const chain = val?.id;
        searchChain.value = chain !== undefined ? String(chain) : undefined;
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (status?: string | number) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Token Type`
        );

        searchStatus.value = status as TTokenType;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: status as string
        });
        router.replace(pageUrl);
        refreshList();
    };
    const refreshList = () => {
        getTokensList({
            ...BASE_PARAMS,
            base_denom: searchDenom.value,
            base_denom_chain: searchDenomChain.value,
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
        tokensDropdown,
        onSelectedToken,
        onSelectedChain,
        onSelectedStatus,
        tokenData,
        chainData,
        searchTokenKey,
        searchChain,
        statusQuery,
        inputFlag,
        changeInputFlag
    };
};

export const useTokensColumnJump = (getBaseDenomInfoByDenom: any) => {
    const router = useRouter();
    const goChains = () => {
        router.push('/chains');
    };
    const goIbcToken = (baseDenom: string, baseDenomChain: string) => {
        router.push({
            path: '/tokens/details',
            query: {
                denom: baseDenom,
                denomChain: baseDenomChain
            }
        });
    };
    const goTransfer = (denom: string, chain: string) => {
        const baseDenomInfo = getBaseDenomInfoByDenom(denom, chain);
        const query = baseDenomInfo
            ? { baseDenom: baseDenomInfo.denom, baseDenomChain: baseDenomInfo.chain }
            : { denom };
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
