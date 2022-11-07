import { getRelayerDetailsByRelayerIdAPI } from '@/api/relayers';
import { API_CODE } from '@/constants/apiCode';
import { RELAYER_DETAILS_INFO, SINGLE_ADDRESS_HEIGHT } from '@/constants/relayers';
import { useIbcStatisticsChains } from '@/store';
import { IDenomStatistic } from '@/types/interface/index.interface';
import { IChannelChain } from '@/types/interface/relayers.interface';

export const useGetRelayerDetailsInfo = () => {
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const relayerIcon = ref<string>('');
    const relayerName = ref<string>('');
    const servedChains = ref<number>(0);
    const relayerInfo = ref<IDenomStatistic>(RELAYER_DETAILS_INFO);
    const channelPairsInfo = ref<IChannelChain[]>();
    const isShowModal = ref<boolean>(false);
    const getRelayerDetailsInfo = () => {
        const route = useRoute();
        const relayerId: string = route?.params?.relayerId as string;
        const getRelayerDetailsByRelayerId = async () => {
            ibcStatisticsChainsStore.isShowLoading = true;
            try {
                const { code, data, message } = await getRelayerDetailsByRelayerIdAPI(relayerId);
                ibcStatisticsChainsStore.isShowLoading = false;
                if (code === API_CODE.success) {
                    if (data) {
                        relayerIcon.value = data.relayer_icon;
                        relayerName.value = data.relayer_name;
                        servedChains.value = data.served_chains;
                        relayerInfo.value.total_relayed_value.count = data.relayed_total_txs_value;
                        relayerInfo.value.total_txs.count = data.relayed_total_txs;
                        relayerInfo.value.served_channel_pairs.count =
                            data.channel_pair_info.length;
                        relayerInfo.value.total_fee_cost.count = data.total_fee_value;
                        channelPairsInfo.value = data.channel_pair_info;
                    }
                } else if (code === API_CODE.systemAbnormality) {
                    // Todo shan 需要修改 code 对应的值，界面中要引入弹窗，通过改值控制弹窗展示与否
                    isShowModal.value = true;
                } else {
                    ibcStatisticsChainsStore.isShow500 = true;
                    console.error(message);
                }
            } catch (error) {
                ibcStatisticsChainsStore.isShowLoading = false;
                ibcStatisticsChainsStore.isShow500 = true;
                console.error(error);
            }
        };
        getRelayerDetailsByRelayerId();
    };
    onMounted(() => {
        getRelayerDetailsInfo();
    });
    return {
        relayerIcon,
        relayerName,
        servedChains,
        relayerInfo,
        channelPairsInfo,
        isShowModal
    };
};

export const useChannelPairsAddressHeight = () => {
    const getPairAddressListHeight = (item: IChannelChain) => {
        const chainAAddressList = item.chain_a_addresses;
        const chainBAddressList = item.chain_b_addresses;
        const maxChainLength = Math.max(chainAAddressList.length, chainBAddressList.length);
        const maxHeight = maxChainLength * SINGLE_ADDRESS_HEIGHT;
        return maxHeight;
    };
    return {
        getPairAddressListHeight
    };
};
