import { getChainsListAPI } from '@/api/chains';
import { useIbcChains } from '@/composables';
import { BASE_PARAMS, UNKNOWN } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IResponseChainsList, IResponseChainsListItem } from '@/types/interface/chains.interface';
import { IIbcchain, IIbcchainMap } from '@/types/interface/index.interface';
import { Ref } from 'vue';
export const useGetChainsList = (loading?: Ref<boolean>) => {
    const chainsList = ref<IResponseChainsListItem[]>([]);

    const getChainsList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        try {
            const allData = {} as IResponseChainsList;
            const getAllData = async () => {
                const result = await getChainsListAPI({
                    ...BASE_PARAMS
                });
                const { code, data, message } = result;
                if (data.constructor === Object) {
                    if (data.items.length < BASE_PARAMS.page_size) {
                        allData.items = (allData.items || []).concat(data?.items);
                        loading && (loading.value = false);
                        if (code === API_CODE.success) {
                            const { items } = allData as IResponseChainsList;
                            const { ibcChains, getIbcChains } = useIbcChains();
                            if (Object.keys(ibcChains.value).length <= 0) {
                                try {
                                    await getIbcChains();
                                } catch (error) {
                                    console.log('getIbcChains', error);
                                }
                            }
                            const ibcChainsAllMap: IIbcchainMap = {};
                            (ibcChains.value?.all || []).forEach((ibcChain: IIbcchain) => {
                                ibcChainsAllMap[ibcChain.chain_id] = ibcChain.chain_name;
                            });

                            chainsList.value = items.map((item: IResponseChainsListItem) => {
                                const chainName = ibcChainsAllMap[item.chain_id];
                                item.chainName = chainName ? chainName : UNKNOWN;
                                return item;
                            });
                        } else {
                            console.error(message);
                        }
                    } else {
                        allData.items = (allData.items || []).concat(data.items);
                        BASE_PARAMS.page_num++;
                        getAllData();
                    }
                }
            };
            getAllData();
        } catch (error) {
            loading && (loading.value = false);
            console.log(error);
        }
    };
    onMounted(() => {
        getChainsList(loading);
    });

    return {
        chainsList
    };
};

export const useChainsColumnJump = () => {
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
