import { getChainsListAPI } from '@/api/chains';
import { useIbcChains } from '@/composables';
import { BASE_PARAMS, UNKNOWN } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IResponseChainsList } from '@/types/interface/chains.interface';
import { Ref } from 'vue';

export const useGetChainsList = () => {
    const list = ref<any>([]);

    const getList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        try {
            const result = await getChainsListAPI({
                ...BASE_PARAMS
            });
            loading && (loading.value = false);
            const { code, data, message } = result;
            if (code === API_CODE.success) {
                const { items } = data as IResponseChainsList;
                const { ibcChains, getIbcChains } = useIbcChains();
                if (Object.keys(ibcChains.value).length <= 0) {
                    try {
                        await getIbcChains();
                    } catch (error) {
                        console.log('getIbcChains', error);
                    }
                }
                const ibcChainsAllMap: any = {};
                (ibcChains.value?.all || []).forEach((ibcChain: any) => {
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
        } catch (error) {
            loading && (loading.value = false);
            console.log(error);
        }
    };

    return {
        list,
        getList
    };
};

export const useJump = () => {
    const router = useRouter();
    const goChannels = (chain: string) => {
        router.push({
            path: '/channels',
            query: {
                chain
            }
        });
    };

    const goRelayers = (chain: string, status: number) => {
        router.push({
            path: '/relayers',
            query: {
                chain,
                status
            }
        });
    };
    const goTransfer = (chain_id: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain_id + ',allchain'
            }
        });
    };
    return {
        goChannels,
        goRelayers,
        goTransfer
    };
};
