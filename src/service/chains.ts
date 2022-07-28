import { Ref, ref } from 'vue';
import { HttpHelper } from '../helper/httpHelper.js';
import { baseParams } from './tokens';
import { useIbcStatisticsChains } from '@/store/index';
import { UNKNOWN } from '../constants';
const urlPrefix = import.meta.env.VITE_BASE_GO_API;

const getChainListUrl = `${urlPrefix}/ibc/chainList`;

export const useGetChainsList = () => {
    const list = ref([]);

    const getList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        const result = await HttpHelper.get(getChainListUrl, {
            params: baseParams
        }).catch(() => {
            loading && (loading.value = false);
        });
        loading && (loading.value = false);
        const { code, data, message } = result;
        if (code === 0) {
            const { items } = data;
            // todo duanjie 待优化
            const ibcChainsStr = sessionStorage.getItem('allChains');
            let ibcChains: any;
            if (ibcChainsStr) {
                ibcChains = JSON.parse(ibcChainsStr);
            } else {
                const ibcStatisticsChainsStore = useIbcStatisticsChains();
                const getIbcChains = ibcStatisticsChainsStore.getIbcChainsAction;
                try {
                    await getIbcChains();
                    ibcChains = ibcStatisticsChainsStore.ibcChains;
                } catch (error) {
                    ibcChains = null;
                }
            }
            const ibcChainsAllMap: any = {};
            (ibcChains?.all || []).forEach((ibcChain: any) => {
                ibcChainsAllMap[ibcChain.chain_id] = ibcChain.chain_name;
            });
            list.value = items.map((item: any) => {
                const chainName = ibcChainsAllMap[item.chain_id];
                item.chainName = chainName ? chainName : UNKNOWN;
                return item;
            });
        } else {
            console.error(message);
        }
    };

    return {
        list,
        getList
    };
};
