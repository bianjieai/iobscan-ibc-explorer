import { getChainsListAPI } from '@/api/chains';
import { useIbcChains } from '@/composables';
import { BASE_PARAMS, UNKNOWN } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IResponseChainsList, IResponseChainsListItem } from '@/types/interface/chains.interface';
import { IIbcchain, IIbcchainMap } from '@/types/interface/index.interface';
import ChainHelper from '@/helper/chainHelper';
import { Ref } from 'vue';
export const useGetChainsList = (loading?: Ref<boolean>) => {
    const chainsList = ref<IResponseChainsListItem[]>([]);
    const getChainsList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        let allData: IResponseChainsListItem[] = [];
        const allParams = { ...BASE_PARAMS };
        try {
            const getAllData = async () => {
                const result = await getChainsListAPI({
                    ...allParams
                });
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    const items = (data as IResponseChainsList).items;
                    if (items && items.length > 0) {
                        if (items.length < allParams.page_size) {
                            allData = [...(allData || []), ...items];
                            loading && (loading.value = false);
                            chainsList.value = await ChainHelper.sortByChainMap(allData);
                            console.log(chainsList.value);
                        } else {
                            allData = [...(allData || []), ...items];
                            allParams.page_num++;
                            getAllData();
                        }
                    } else {
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
                        return;
                    }
                } else {
                    loading && (loading.value = false);
                    chainsList.value = await ChainHelper.sortByChainMap(allData);
                    console.error(message);
                }
            };
            getAllData();
        } catch (error) {
            loading && (loading.value = false);
            chainsList.value = await ChainHelper.sortByChainMap(allData);
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
