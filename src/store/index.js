import { createStore } from 'vuex';
import { findStatistics } from '../helper/findStatistics';
import {
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
  ageTimerInterval,
} from '../constant';
import {
  SET_IBCSTATISTICS_CHAINS,
  SET_IBCSTATISTICS_CHANNELS,
  SET_IBCSTATISTICS_DENOMS,
  SET_IBCSTATISTICS_TXS,
  SET_IBCDENOMS,
  SET_IBCBASEDENOMS,
  SET_IBCCHAINS,
  SET_IBCCONFIGS,
  SET_IBCTXS,
  SET_IBCTXSCOUNT,
  SET_IBCTXTIMER,
} from './mutation-types';
import {
  GET_IBCSTATISTICS,
  GET_IBCDENOMS,
  GET_IBCBASEDENOMS,
  GET_IBCCHAINS,
  GET_IBCCONFIGS,
  GET_IBCTXS,
} from './action-types';
import {
  getIbcStatistics,
  getIbcDenoms,
  getIbcBaseDenoms,
  getIbcChains,
  getIbcConfig,
  getIbcTxs,
} from '../service/api';
import { JSONparse } from '../helper/parseString';
import Tools from '../util/Tools';

export default createStore({
  state: {
    ibcStatisticsChains: ibcStatisticsChainsDefault,
    ibcStatisticsChannels: ibcStatisticsChannelsDefault,
    ibcStatisticsDenoms: ibcStatisticsDenomsDefault,
    ibcStatisticsTxs: ibcStatisticsTxsDefault,
    ibcDenoms: { value: [] },
    ibcBaseDenoms: { value: [] },
    ibcChains: { value: [] },
    configs: {},
    ibcTxs: { value: [] },
    ibcTxsCount: { value: 0 },
    ibcTxTimer: { value: {} },
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
      tx_24hr_all, tx_all, tx_success, tx_failed,
    }) {
      state.ibcStatisticsTxs.tx_24hr_all = tx_24hr_all;
      state.ibcStatisticsTxs.tx_all = tx_all;
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
    [SET_IBCCONFIGS](state, configs) {
      state.configs = configs;
    },
    [SET_IBCTXS](state, ibcTxs) {
      state.ibcTxs.value = ibcTxs;
    },
    [SET_IBCTXSCOUNT](state, ibcTxsCount) {
      if (typeof ibcTxsCount !== 'number') {
        state.ibcTxsCount.value = ibcTxsCount.data;
      } else {
        state.ibcTxsCount.value = ibcTxsCount;
      }
    },
    [SET_IBCTXTIMER](state, ibcTxTimer) {
      state.ibcTxTimer.value = ibcTxTimer;
    },
  },
  actions: {
    [GET_IBCSTATISTICS]({ commit }) {
      getIbcStatistics().then((res) => {
        commit(SET_IBCSTATISTICS_CHAINS, {
          chains_24hr: findStatistics(res, 'chains_24hr'),
          chain_all: findStatistics(res, 'chain_all'),
        });
        commit(SET_IBCSTATISTICS_CHANNELS, {
          channels_24hr: findStatistics(res, 'channels_24hr'),
          channel_all: findStatistics(res, 'channel_all'),
          channel_opened: findStatistics(res, 'channel_opened'),
          channel_closed: findStatistics(res, 'channel_closed'),
        });
        commit(SET_IBCSTATISTICS_DENOMS, {
          denom_all: findStatistics(res, 'denom_all'),
          base_denom_all: findStatistics(res, 'base_denom_all'),
        });
        commit(SET_IBCSTATISTICS_TXS, {
          tx_24hr_all: findStatistics(res, 'tx_24hr_all'),
          tx_all: findStatistics(res, 'tx_all'),
          tx_success: findStatistics(res, 'tx_success'),
          tx_failed: findStatistics(res, 'tx_failed'),
        });
      });
    },
    [GET_IBCDENOMS]({ commit }) {
      getIbcDenoms().then((res) => {
        commit(SET_IBCDENOMS, res);
      });
    },
    [GET_IBCBASEDENOMS]({ commit }) {
      getIbcBaseDenoms().then((res) => {
        commit(SET_IBCBASEDENOMS, res);
      });
    },
    [GET_IBCCHAINS]({ commit }) {
      getIbcChains().then((res) => {
        commit(SET_IBCCHAINS, res);
      });
    },
    [GET_IBCCONFIGS]({ commit }) {
      const configs = JSONparse(sessionStorage.getItem('configs'));
      let result = null;
      if (configs) {
        result = Promise.resolve(commit(SET_IBCCONFIGS, configs));
      } else {
        result = new Promise((resolve) => {
          getIbcConfig().then((res) => {
            commit(SET_IBCCONFIGS, res);
            sessionStorage.setItem('configs', JSON.stringify(res));
            resolve();
          });
        });
      }
      return result;
    },
    [GET_IBCTXS]({ commit, state }, queryParams) {
      const { use_count } = queryParams;
      return new Promise((resolve) => {
        getIbcTxs(queryParams).then((res) => {
          const result = res.data;
          if (use_count) {
            commit(SET_IBCTXSCOUNT, res);
            resolve();
          } else {
            clearInterval(state.ibcTxTimer.value);
            commit(
              SET_IBCTXTIMER,
              setInterval(() => {
                commit(
                  SET_IBCTXS,
                  result.map((item) => {
                    const auth = Tools.findDenomAuth(
                      state.ibcDenoms.value,
                      item.denoms.sc_denom,
                      item.sc_chain_id,
                    );
                    let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
                    let symbolDenom = item.base_denom || '';
                    let symbolIcon = '';
                    if (auth) {
                      const findSymbol = Tools.findSymbol(
                        state.ibcBaseDenoms.value,
                        item.base_denom,
                        item.sc_chain_id,
                      );
                      if (findSymbol) {
                        symbolNum = Tools.parseSymbolNum(
                          (item.sc_tx_info?.msg_amount?.amount || 0) * 10 ** -findSymbol.scale,
                        );
                        symbolDenom = findSymbol.symbol;
                        symbolIcon = findSymbol.icon;
                      }
                    }
                    return {
                      ...item,
                      symbolNum,
                      symbolDenom,
                      symbolIcon,
                      tx_time: Tools.formatAge(Tools.getTimestamp(), item.tx_time * 1000, '', ''),
                    };
                  }),
                );
              }, ageTimerInterval),
            );
            resolve('ok');
          }
        });
      });
    },
  },
  modules: {},
});
