import { IChainsListItem } from '@/types/interface/chains.interface';
import { getChainsListAPI } from '@/api/chains';
import { BASE_PARAMS } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { IResponseChainsList, IResponseChainsListItem } from '@/types/interface/chains.interface';
import ChainHelper from '@/helper/chainHelper';
import { Ref } from 'vue';

export const useGetChainsList = (loading?: Ref<boolean>) => {
    const chainsList = ref<IChainsListItem[]>([]);
    const getChainsList = async (loading?: Ref<boolean>) => {
        if (loading) {
            loading.value = true;
        }
        let allData: IResponseChainsListItem[] = [];
        const allParams = { ...BASE_PARAMS };
        const getAllData = async () => {
            try {
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
                            chainsList.value = await ChainHelper.getChainName(allData);
                        } else {
                            allData = [...(allData || []), ...items];
                            allParams.page_num++;
                            getAllData();
                        }
                    } else {
                        loading && (loading.value = false);
                        chainsList.value = await ChainHelper.getChainName(allData);
                        return;
                    }
                } else {
                    loading && (loading.value = false);
                    chainsList.value = await ChainHelper.getChainName(allData);
                    console.error(message);
                }
            } catch (error) {
                loading && (loading.value = false);
                chainsList.value = await ChainHelper.getChainName(allData);
                console.log(error);
            }
        };
        getAllData();
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
    const goTransfer = (chain: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain + ',allchain'
            }
        });
    };
    return {
        goChannels,
        goRelayers,
        goTransfer
    };
};
