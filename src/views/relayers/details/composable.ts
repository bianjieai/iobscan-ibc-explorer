import { getRelayerDetailsByRelayerIdAPI } from '@/api/relayers';
import { useLoading } from '@/composables';
import { API_CODE } from '@/constants/apiCode';
import { RELAYER_DETAILS_INFO } from '@/constants/relayers';
import { IDenomStatistic } from '@/types/interface/index.interface';

export const useGetRelayerDetailsInfo = () => {
    const { loading } = useLoading();
    const relayerIcon = ref<string>('');
    const relayerName = ref<string>('');
    const servedChains = ref<number>(0);
    const relayerInfo = ref<IDenomStatistic>(RELAYER_DETAILS_INFO);
    const getRelayerDetailsInfo = () => {
        const route = useRoute();
        const relayerId: string = route?.params?.relayerId as string;
        const getRelayerDetailsByRelayerId = async () => {
            if (loading) {
                loading.value = true;
            }
            try {
                const { code, data, message } = await getRelayerDetailsByRelayerIdAPI(relayerId);
                loading && (loading.value = false);
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
                    }
                } else {
                    console.error(message);
                }
            } catch (error) {
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
        relayerInfo
    };
};
