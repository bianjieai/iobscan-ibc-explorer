/* eslint-disable no-async-promise-executor */
/* eslint-disable no-param-reassign */
import { HttpHelper } from '../helper/httpHelpers';

function get(url, params) {
  return new Promise(async (res, rej) => {
    url = `/${url.replace(/^\//, '')}`;
    try {
      const data = await HttpHelper.get(url, params);
      if (data) {
        res(data.data || data);
      } else {
        console.error(`error from ${url}:`, JSON.stringify(data));
        rej(data);
      }
    } catch (err) {
      console.error(`error from ${url}:`, err.message);
      rej(err);
    }
  });
}

function getIbcTxs(params) {
  const url = '/api/ibc/txs';
  const config = {
    params,
  };
  return get(url, config);
}

function getIbcChains() {
  const url = '/api/ibc/chains';
  return get(url);
}

function getIbcBaseDenoms() {
  const url = '/api/ibc/baseDenoms';
  return get(url);
}

function getIbcDenoms() {
  const url = '/api/ibc/denoms';
  return get(url);
}

function getIbcStatistics() {
  const url = '/api/ibc/statistics';
  return get(url);
}

function getIbcConfig() {
  const url = '/api/ibc/config';
  return get(url);
}

export {
  getIbcTxs, getIbcChains, getIbcBaseDenoms, getIbcDenoms, getIbcStatistics, getIbcConfig,
};
