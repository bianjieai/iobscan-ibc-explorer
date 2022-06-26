import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useIbcStatisticsChains } from '../../store/home/index';
import { GET_IBCSTATISTICS, GET_IBCCHAINS, GET_IBCTXS, GET_IBCDENOMS, GET_IBCBASEDENOMS } from '../../store/action-types';

const ibcStatisticsChainsStore = useIbcStatisticsChains();

export const useIbcStatistics = () => {
    const ibcStatisticsChains = computed(() => ibcStatisticsChainsStore.ibcStatisticsChains);
    const ibcStatisticsChannels = computed(() => ibcStatisticsChainsStore.ibcStatisticsChannels);
    const ibcStatisticsDenoms = computed(() => ibcStatisticsChainsStore.ibcStatisticsDenoms);
    const ibcStatisticsTxs = computed(() => ibcStatisticsChainsStore.ibcStatisticsTxs);
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
    const ibcChains = sessionStorage.getItem('allChains') ? JSON.parse(sessionStorage.getItem('allChains')) : computed(() => ibcStatisticsChainsStore.ibcChains);
    const getIbcChains = ibcStatisticsChainsStore[GET_IBCCHAINS];
    return {
        ibcChains,
        getIbcChains
    }
}
export const useIbcTxs = () => {
    const ibcTxs = computed(()=> ibcStatisticsChainsStore.ibcTxs)?.value;
    const getIbcTxs = ibcStatisticsChainsStore[GET_IBCTXS];
    return {
        ibcTxs,
        getIbcTxs
    }
}
export const useClearInterval = () => {
    const clearInterval = () => {
        clearInterval(computed(() => ibcStatisticsChainsStore.ibcTxTimer)?.value);
    }
    return {
        clearInterval
    }
}
export const useGetIbcDenoms = () => {
    const ibcBaseDenoms = computed(() => ibcStatisticsChainsStore.ibcBaseDenoms)
    const getIbcDenoms = ibcStatisticsChainsStore[GET_IBCDENOMS];
    const getIbcBaseDenom = ibcStatisticsChainsStore[GET_IBCBASEDENOMS];
    return {
        ibcBaseDenoms,
        getIbcDenoms,
        getIbcBaseDenom
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
            router.push({
                name: 'Channels'
            })
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
            router.push({
                name: 'Tokens',
            });
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