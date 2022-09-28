import { API_CODE } from '@/constants/apiCode';
import { getIbcStatisticsAPI } from '@/api/home';
import { findStatistics } from '@/helper/findStatisticsHelper';
import {
    IBC_STATISTICS_CHANNELS_DEFAULT,
    IBC_STATISTICS_DENOMS_DEFAULT,
    IBC_STATISTICS_TXS_DEFAULT,
    IBC_STATISTICS_CHAINS_DEFAULT
} from '@/constants/index';
import { IResponseIbcStatisticItem } from '@/types/interface/home.interface';
import { useIbcStatisticsChains } from '@/store';

export const useIbcStatistics = (timerInterval?: number) => {
    const ibcStatisticsChains = reactive(IBC_STATISTICS_CHAINS_DEFAULT);
    const ibcStatisticsChannels = reactive(IBC_STATISTICS_CHANNELS_DEFAULT);
    const ibcStatisticsDenoms = reactive(IBC_STATISTICS_DENOMS_DEFAULT);
    const ibcStatisticsTxs = reactive(IBC_STATISTICS_TXS_DEFAULT);
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { isDocumentHidden } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcStatistics = async () => {
        try {
            const { code, data } = await getIbcStatisticsAPI();
            if (code === API_CODE.success) {
                const items: IResponseIbcStatisticItem[] = data.items;
                ibcStatisticsChains.chains_24hr = findStatistics(items, 'chains_24hr');
                ibcStatisticsChains.chain_all = findStatistics(items, 'chain_all');
                ibcStatisticsChannels.channels_24hr = findStatistics(items, 'channels_24hr');
                ibcStatisticsChannels.channel_all = findStatistics(items, 'channel_all');
                ibcStatisticsChannels.channel_opened = findStatistics(items, 'channel_opened');
                ibcStatisticsChannels.channel_closed = findStatistics(items, 'channel_closed');
                ibcStatisticsDenoms.denom_all = findStatistics(items, 'denom_all');
                ibcStatisticsDenoms.base_denom_all = findStatistics(items, 'base_denom_all');
                ibcStatisticsTxs.tx_24hr_all = findStatistics(items, 'tx_24hr_all');
                ibcStatisticsTxs.tx_all = findStatistics(items, 'tx_all');
                ibcStatisticsTxs.tx_success = findStatistics(items, 'tx_success');
                ibcStatisticsTxs.tx_failed = findStatistics(items, 'tx_failed');
            }
        } catch (error) {
            console.log('getIbcStatisticsAPI', error);
        }
    };
    let timer: number;
    const intervalIbcStatistics = () => {
        timer = setInterval(() => {
            console.log('getIbcStatistics', timerInterval);
            getIbcStatistics();
        }, timerInterval);
    };
    onMounted(() => {
        getIbcStatistics();
        if (Number(timerInterval) > 0) {
            intervalIbcStatistics();
        }
    });
    onBeforeUnmount(() => {
        timer && clearInterval(timer);
    });
    watch(isDocumentHidden, (newVisibility) => {
        newVisibility && timer ? clearInterval(timer) : intervalIbcStatistics();
    });
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsTxs,
        getIbcStatistics
    };
};
