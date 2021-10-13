import { createStore } from 'vuex';
import { findStatistics } from '../helper/findStatistics';
import {
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
} from '../constant';
import {
  SET_IBCSTATISTICS_CHAINS,
  SET_IBCSTATISTICS_CHANNELS,
  SET_IBCSTATISTICS_DENOMS,
  SET_IBCSTATISTICS_TXS,
  SET_IBCDENOMS,
  SET_IBCBASEDENOMS,
  SET_IBCCHAINS,
} from './mutation-types';
import {
  GET_IBCSTATISTICS, GET_IBCDENOMS, GET_IBCBASEDENOMS, GET_IBCCHAINS,
} from './action-types';
import {
  getIbcStatistics, getIbcDenoms, getIbcBaseDenoms, getIbcChains,
} from '../service/api';

export default createStore({
  state: {
    ibcStatisticsChains: ibcStatisticsChainsDefault,
    ibcStatisticsChannels: ibcStatisticsChannelsDefault,
    ibcStatisticsDenoms: ibcStatisticsDenomsDefault,
    ibcStatisticsTxs: ibcStatisticsTxsDefault,
    ibcDenoms: { value: [] },
    ibcBaseDenoms: { value: [] },
    ibcChains: { value: [] },
  },
  mutations: {
    [SET_IBCSTATISTICS_CHAINS](state, { chains_24hr, chain_all }) {
      state.ibcStatisticsChains.chains_24hr = chains_24hr;
      state.ibcStatisticsChains.chain_all = chain_all;
    },
    [SET_IBCSTATISTICS_CHANNELS](
      state,
      {
        channels_24hr, channel_all, channel_opened, channel_closed,
      },
    ) {
      state.ibcStatisticsChannels.channels_24hr = channels_24hr;
      state.ibcStatisticsChannels.channel_all = channel_all;
      state.ibcStatisticsChannels.channel_opened = channel_opened;
      state.ibcStatisticsChannels.channel_closed = channel_closed;
    },
    [SET_IBCSTATISTICS_DENOMS](state, { denom_all, base_denom_all }) {
      state.ibcStatisticsDenoms.denom_all = denom_all;
      state.ibcStatisticsDenoms.base_denom_all = base_denom_all;
    },
    [SET_IBCSTATISTICS_TXS](state, {
      tx_24hr_all, tx_all, tx_process, tx_success, tx_failed,
    }) {
      state.ibcStatisticsTxs.tx_24hr_all = tx_24hr_all;
      state.ibcStatisticsTxs.tx_all = tx_all;
      state.ibcStatisticsTxs.tx_process = tx_process;
      state.ibcStatisticsTxs.tx_success = tx_success;
      state.ibcStatisticsTxs.tx_failed = tx_failed;
    },
    [SET_IBCDENOMS](state, denoms) {
      state.ibcDenoms.value = denoms;
    },
    [SET_IBCBASEDENOMS](state, baseDenoms) {
      state.ibcBaseDenoms.value = baseDenoms;
    },
    [SET_IBCCHAINS](state, chains) {
      state.ibcChains.value = chains;
    },
  },
  actions: {
    [GET_IBCSTATISTICS](context) {
      getIbcStatistics().then((res) => {
        context.commit(SET_IBCSTATISTICS_CHAINS, {
          chains_24hr: findStatistics(res, 'chains_24hr'),
          chain_all: findStatistics(res, 'chain_all'),
        });
        context.commit(SET_IBCSTATISTICS_CHANNELS, {
          channels_24hr: findStatistics(res, 'channels_24hr'),
          channel_all: findStatistics(res, 'channel_all'),
          channel_opened: findStatistics(res, 'channel_opened'),
          channel_closed: findStatistics(res, 'channel_closed'),
        });
        context.commit(SET_IBCSTATISTICS_DENOMS, {
          denom_all: findStatistics(res, 'denom_all'),
          base_denom_all: findStatistics(res, 'base_denom_all'),
        });
        context.commit(SET_IBCSTATISTICS_TXS, {
          tx_24hr_all: findStatistics(res, 'tx_24hr_all'),
          tx_all: findStatistics(res, 'tx_all'),
          tx_process: findStatistics(res, 'tx_process'),
          tx_success: findStatistics(res, 'tx_success'),
          tx_failed: findStatistics(res, 'tx_failed'),
        });
      });
    },
    [GET_IBCDENOMS](context) {
      getIbcDenoms().then((res) => {
        context.commit(SET_IBCDENOMS, res);
      });
    },
    [GET_IBCBASEDENOMS](context) {
      getIbcBaseDenoms().then((res) => {
        context.commit(SET_IBCBASEDENOMS, res);
      });
    },
    [GET_IBCCHAINS](context) {
      getIbcChains().then((res) => {
        context.commit(SET_IBCCHAINS, res);
      });
    },
  },
  modules: {},
});
