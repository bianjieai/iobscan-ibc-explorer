import { TChannelStatus } from '@/components/responsive/component.interface';
import { ref, Ref } from 'vue';
import { HttpHelper } from '../helper/httpHelper.js';
import { baseParams } from './tokens';
import ChainHelper from '../helper/chainHelper';

export type TChannelsListParams = {
    chain?: string;
    status?: TChannelStatus;
    use_count?: boolean;
    loading?: Ref<boolean>;
};

const urlPrefix = import.meta.env.VITE_BASE_GO_API;

const getChannelsListUrl = `${urlPrefix}/ibc/channelList`;

export const useGetChannelsList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TChannelsListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        const result = await HttpHelper.get(getChannelsListUrl, {
            params: {
                ...baseParams,
                ...params
            }
        }).catch(() => {
            loading && (loading.value = false);
        });
        loading && (loading.value = false);
        const { code, data, message } = result;
        if (code === 0) {
            if (!params.use_count) {
                const { items } = data;
                list.value = ChainHelper.sortByChainName(items, params.chain);
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
