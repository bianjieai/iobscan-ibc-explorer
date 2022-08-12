import { getChainsListAPI } from '@/api/chains';
import { useIbcChains } from '@/composables';
import { BASE_PARAMS, UNKNOWN } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IResponseChainsListItem } from '@/types/interface/chains.interface';
import { IIbcchain, IIbcchainMap } from '@/types/interface/index.interface';
import { Ref } from 'vue';
export const useGetChainsList = (loading?: Ref<boolean>) => {
    const chainsList = ref<IResponseChainsListItem[]>([]);
    const getChainsList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        let allData = [] as IResponseChainsListItem[];
        try {
            const allParams = { ...BASE_PARAMS };
            const getAllData = async () => {
                const result = await getChainsListAPI({
                    ...allParams
                });
                console.log(result);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (data.items.length < allParams.page_size) {
                        allData = [...(allData || []), ...data?.items];
                        loading && (loading.value = false);
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

                        chainsList.value = allData.map((item: IResponseChainsListItem) => {
                            const chainName = ibcChainsAllMap[item.chain_id];
                            item.chainName = chainName ? chainName : UNKNOWN;
                            return item;
                        });
                    } else {
                        allData = [...(allData || []), ...data?.items];
                        allParams.page_num++;
                        getAllData();
                    }
                } else {
                    console.error(message);
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
