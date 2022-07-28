import { baseParams } from '@/service/tokens';
import { formatTransfer_success_txs } from '@/helper/tableCellHelper';
import ChainHelper from '@/helper/chainHelper';
import { getRelayersListAPI } from '@/api/relayers';
import { IResponseRelayerList, TRelayersListParams } from '@/types/interface/relayers.interface';
import { API_CODE } from '@/constants/apiCode';

export const useGetRelayersList = () => {
    const list = ref([]);
    const total = ref(0);

    const getList = async (params: TRelayersListParams = {}) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        try {
            const result = await getRelayersListAPI({
                ...baseParams,
                ...params
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                if (!params.use_count) {
                    const { items } = data as IResponseRelayerList;
                    list.value = ChainHelper.sortByChainName(items, params.chain)?.map(
                        (item: any) => {
                            item.txs_success_rate = formatTransfer_success_txs(
                                item.transfer_success_txs,
                                item.transfer_total_txs
                            );
                            return item;
                        }
                    );
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
    getList({ use_count: true });

    return {
        list,
        total,
        getList
    };
};
