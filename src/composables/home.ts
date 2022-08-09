import { API_CODE } from '@/constants/apiCode';
import { getIbcStatisticsAPI } from '@/api/home';
import { findStatistics } from '@/helper/findStatisticsHelper';
import {
    ibcStatisticsChannelsDefault,
    ibcStatisticsDenomsDefault,
    ibcStatisticsTxsDefault,
    ibcStatisticsChainsDefault
} from '@/constants/index';
import { IResponseIbcStatisticItem } from '@/types/interface/home.interface';

export const useIbcStatistics = (timerInterval?: number) => {
    const ibcStatisticsChains = reactive(ibcStatisticsChainsDefault);
    const ibcStatisticsChannels = reactive(ibcStatisticsChannelsDefault);
    const ibcStatisticsDenoms = reactive(ibcStatisticsDenomsDefault);
    const ibcStatisticsTxs = reactive(ibcStatisticsTxsDefault);
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
    onMounted(() => {
        getIbcStatistics();
        if (Number(timerInterval) > 0) {
            timer = setInterval(() => {
                console.log('getIbcStatistics', timerInterval);
                getIbcStatistics();
            }, timerInterval);
        }
    });
    onBeforeUnmount(() => {
        timer && clearInterval(timer);
    });
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsTxs,
        getIbcStatistics
    };
};
