import { computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useIbcStatisticsChains } from '../../store/home/index';
import { GET_IBCSTATISTICS, GET_IBCCHAINS, GET_IBCTXS, GET_IBCDENOMS, GET_IBCBASEDENOMS } from '../../store/action-types';
import { ibcStatisticsChannelsDefault, ibcStatisticsDenomsDefault, channelsStatus } from '../../constants';

const ibcStatisticsChainsStore = useIbcStatisticsChains();

export const useIbcStatistics = () => {
    const ibcStatisticsChains = ibcStatisticsChainsStore.ibcStatisticsChains;
    const ibcStatisticsChannels = ibcStatisticsChainsStore.ibcStatisticsChannels;
    const ibcStatisticsDenoms = ibcStatisticsChainsStore.ibcStatisticsDenoms;
    const ibcStatisticsTxs = ibcStatisticsChainsStore.ibcStatisticsTxs;
    const getIbcStatistics = ibcStatisticsChainsStore[GET_IBCSTATISTICS];
    return {
        ibcStatisticsChains,
        ibcStatisticsChannels,
        ibcStatisticsDenoms,
        ibcStatisticsTxs,
        getIbcStatistics
    }
}
export const useIbcChains = () => {
    const ibcChains = computed(() => ibcStatisticsChainsStore.ibcChains);
    const getIbcChains = ibcStatisticsChainsStore[GET_IBCCHAINS];
    return {
        ibcChains,
        getIbcChains
    }
}
export const useIbcTxs = () => {
    const ibcTxs = computed(() => ibcStatisticsChainsStore.ibcTxs);
    const getIbcTxs = ibcStatisticsChainsStore[GET_IBCTXS];
    const setExpandByIndex = (idx)=>{
        ibcStatisticsChainsStore.ibcTxs.value.forEach((item, index) => {
            if (idx == index) {
                item.expanded = !item.expanded;
            }else{
                item.expanded = false;
            }
        });
    }
    return {
        ibcTxs,
        getIbcTxs,
        setExpandByIndex
    }
}
export const useClearInterval = () => {
    const clearIntervalTimer = () => {
        clearInterval(ibcStatisticsChainsStore.ibcTxTimer.value);
    }
    onBeforeUnmount(() => {
        clearIntervalTimer();
    })
    return {
        clearIntervalTimer
    }
}
export const useGetIbcDenoms = () => {
    const ibcBaseDenoms = ibcStatisticsChainsStore.ibcBaseDenoms;
    const getIbcDenoms = ibcStatisticsChainsStore[GET_IBCDENOMS];
    const getIbcBaseDenom = ibcStatisticsChainsStore[GET_IBCBASEDENOMS];
    return {
        ibcBaseDenoms,
        getIbcDenoms,
        getIbcBaseDenom,
    }
}
export const useInterfaceActive = () => {
    const router = useRouter();
    const tipMsg = 'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';
    const onClickViewAll = (msg) => {
        if (msg?.includes && msg.includes('chains')) {
            router.push({
                name: 'Chains'
            })
        } else if (msg?.includes && msg.includes('channel')) {
            if(msg === ibcStatisticsChannelsDefault['channel_opened'].statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: channelsStatus.channelOpenedStatus
                    }
                })
            } else if(msg === ibcStatisticsChannelsDefault['channel_closed'].statistics_name) {
                router.push({
                    name: 'Channels',
                    query: {
                        status: channelsStatus.channelClosedStatus
                    }
                })
            } else {
                router.push({
                    name: 'Channels'
                })
            }
        } else if (msg?.includes && msg.includes('tx')) {
            if (msg === 'tx_all') {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: '1,2,3,4'
                    }
                });
            } else if (msg === 'tx_24hr_all') {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: '1,2,3,4'
                    }
                });
            } else if (msg === 'tx_success') {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: '1'
                    }
                });
            } else if (msg === 'tx_failed') {
                router.push({
                    name: 'Transfers',
                    query: {
                        status: '2,4'
                    }
                });
            }
        } else if (msg?.includes && msg.includes('denom')) {
            if(msg !== ibcStatisticsDenomsDefault['denom_all'].statistics_name) {
                router.push({
                    name: 'Tokens',
                });
            }
        } else {
            // TODO shan 路由中不包含以上路由的提示
    
            // message.info({
            //     content: h(Message),
            //     icon: h('div'),
            // });
        }
    }
    const onMenuSelected = (menuKey) => {
        // console.log(menuKey);
        // ibcChainsFilter
    };
    return {
        tipMsg,
        onClickViewAll,
        onMenuSelected
    }
}