import { defineStore } from "pinia";
import {findStatistics} from '../../helper/findStatistics';
import {
    ibcStatisticsChainsDefault,
} from '../../constants/index';
import {
    getIbcStatistics,
    getIbcChains,
} from '../../service/api';
import {
    GET_IBCSTATISTICS,
    GET_IBCCHAINS,
    GET_IBCDENOMS,
    GET_IBCBASEDENOMS,
    GET_IBCCONFIGS,
    GET_IBCTXS,
} from '../action-types';

export const useIbcStatisticsChains = defineStore('home', {
    state: () => {
        return {
            ibcStatisticsChains: ibcStatisticsChainsDefault,
            ibcChains: {value: []},
        }
    },
    actions: {
        async [GET_IBCSTATISTICS]() {
            const res = await getIbcStatistics();
            this.ibcStatisticsChains.chains_24hr = findStatistics(res, 'chains_24hr');
            this.ibcStatisticsChains.chain_all = findStatistics(res, 'chain_all');
        },
        async [GET_IBCCHAINS]() {
            const res = await getIbcChains();
            sessionStorage.setItem('allChains', JSON.stringify(res));
            this.ibcChains = res;
        }
    }
})

