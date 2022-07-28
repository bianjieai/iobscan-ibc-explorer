import { TRelayerStatus } from '@/types/interface/table.interface.js';
import { ref, Ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';
import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '../helper/chainHelper';

type TRelayersListParams = {
    chain?: string;
    status?: TRelayerStatus;
    use_count?: boolean;
    loading?: Ref<boolean>;
};

const urlPrefix = import.meta.env.VITE_BASE_GO_API;

const getRelayersListUrl = `${urlPrefix}/ibc/relayerList`;

export const useGetRelayersList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TRelayersListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        const result = await HttpHelper.get(getRelayersListUrl, {
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
                list.value = ChainHelper.sortByChainName(items, params.chain)?.map((item: any) => {
                    item.txs_success_rate = formatTransfer_success_txs(
                        item.transfer_success_txs,
                        item.transfer_total_txs
                    );
                    return item;
                });
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
