// import { BaseDenom } from '@/types/baseDenom';
import { ref, Ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { getBaseDenomByKey } from '@/helper/baseDenomHelpers';
import { getRestString2 } from '@/helper/parseStringHelpers';

export type TIbcTokenType = 'Authed' | 'Other' | 'Genesis';

export type TTokenListParams = {
    base_denom?: string;
    chain?: string;
    token_type?: 'Authed' | 'Other';
    use_count?: boolean;
    loading?: Ref<boolean>;
};
export type TIbcTokenListParams = {
    chain?: string;
    token_type?: TIbcTokenType;
    use_count?: boolean;
    loading?: Ref<boolean>;
};

export type TBaseParams = {
    use_count: boolean;
    page_num: number;
    page_size: number;
};

export const baseParams: TBaseParams = {
    use_count: false,
    page_num: 1,
    page_size: 3000
};

const urlPrefix = import.meta.env.VITE_BASE_GO_API;

const getTokenListUrl = `${urlPrefix}/ibc/tokenList`;
const getIbcTokenListUrl = (base_denom: string) => `${urlPrefix}/ibc/${base_denom.replace('ibc/', '')}/ibcTokenList`;

export const useGetTokenList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TTokenListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        const result = await HttpHelper.get(getTokenListUrl, { params: { ...baseParams, ...params } }).catch(() => {
            loading && (loading.value = false);
        });
        loading && (loading.value = false);
        const { code, data, message } = result;
        if (code === 0) {
            if (!params.use_count) {
                const { items } = data;
                const temp: any = [];
                for (let i = 0; i < (items ?? []).length; i++) {
                    const item: any = items[i];
                    const baseDenom = await getBaseDenomByKey(item.chain_id, item.base_denom);
                    item['name'] = baseDenom ? getRestString2(baseDenom.symbol, 6) : getRestString2(item.base_denom, 6);
                    temp.push(item);
                }
                list.value = temp;
            } else {
                total.value = data;
            }
        } else {
            console.error(message);
        }
    };
    getList({ use_count: true });
    return {
        list,
        total,
        getList
    };
};

export const useGetIbcTokenList = (base_denom: string) => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TIbcTokenListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        const result = await HttpHelper.get(getIbcTokenListUrl(base_denom), {
            params: { ...baseParams, ...params }
        }).catch(() => {
            loading && (loading.value = false);
        });
        loading && (loading.value = false);
        const { code, data, message } = result;
        if (code === 0) {
            if (!params.use_count) {
                const { items } = data;
                list.value = items ?? [];
            } else {
                total.value = data;
            }
        } else {
            console.error(message);
        }
    };
    getList({ use_count: true });
    return {
        list,
        total,
        getList
    };
};
