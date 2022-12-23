import { API_CODE } from '@/constants/apiCode';
import { getIbcStatisticsAPI } from '@/api/home';
import {
    IBC_STATISTICS_CHANNELS_DEFAULT,
    IBC_STATISTICS_DENOMS_DEFAULT,
    IBC_STATISTICS_RELAYER_DEFAULT,
    IBC_STATISTICS_TXS_DEFAULT,
    IBC_STATISTICS_CHAINS_DEFAULT
} from '@/constants/index';
import { IResponseIbcStatisticItem } from '@/types/interface/home.interface';
import { useIbcStatisticsChains } from '@/store';

export const useIbcStatistics = (timerInterval?: number) => {
    const ibcStatisticsChains = reactive(IBC_STATISTICS_CHAINS_DEFAULT);
    const ibcStatisticsChannels = reactive(IBC_STATISTICS_CHANNELS_DEFAULT);
    const ibcStatisticsDenoms = reactive(IBC_STATISTICS_DENOMS_DEFAULT);
    const ibcStatisticsRelayer = reactive(IBC_STATISTICS_RELAYER_DEFAULT);
    const ibcStatisticsTxs = reactive(IBC_STATISTICS_TXS_DEFAULT);
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const { isDocumentHidden } = storeToRefs(ibcStatisticsChainsStore);
    const getIbcStatistics = async () => {
        try {
            const { code, data } = await getIbcStatisticsAPI();
            if (code === API_CODE.success) {
                const items: IResponseIbcStatisticItem[] = data.items;
                const statisticsNameMap = new Map();
                items.forEach((item) => {
                    statisticsNameMap.set(item.statistics_name, item);
                });
                const findStatistics = (key: string) =>
                    statisticsNameMap.get(key) || {
                        statistics_name: key,
                        count: 0
                    };
                ibcStatisticsChains.chains_24hr = findStatistics('chains_24hr');
                ibcStatisticsChains.chain_all = findStatistics('chain_all');
                ibcStatisticsChannels.channels_24hr = findStatistics('channels_24hr');
                ibcStatisticsChannels.channel_all = findStatistics('channel_all');
                ibcStatisticsChannels.channel_opened = findStatistics('channel_opened');
                ibcStatisticsChannels.channel_closed = findStatistics('channel_closed');
                ibcStatisticsDenoms.base_denom_all = findStatistics('base_denom_all');
                ibcStatisticsRelayer.relayers = findStatistics('relayers');
                ibcStatisticsTxs.tx_24hr_all = findStatistics('tx_24hr_all');
                ibcStatisticsTxs.tx_all = findStatistics('tx_all');
                ibcStatisticsTxs.tx_success = findStatistics('tx_success');
                ibcStatisticsTxs.tx_failed = findStatistics('tx_failed');
            }
        } catch (error) {
            console.log('getIbcStatisticsAPI', error);
        }
    };
    const intervalFunction = () => {
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
        watch(isDocumentHidden, (newDocumentHidden) => {
            newDocumentHidden ? timer && clearInterval(timer) : intervalIbcStatistics();
        });
    };
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsRelayer,
        ibcStatisticsTxs,
        getIbcStatistics,
        intervalFunction
    };
};
