/* eslint-disable no-async-promise-executor */
/* eslint-disable no-param-reassign */
import {HttpHelper} from '../helper/httpHelpers';
import router from "../router";

function get(url, params) {
    return new Promise(async (res, rej) => {
        url = `/${url.replace(/^\//, '')}`;
        if (params?.params?.chain_id) {
            params.params.chain_id = params.params.chain_id?.replace(new RegExp("\-", "g"), "_")
        }
        try {
            const data = await HttpHelper.get(url, params);
            if (data) {
                if (data?.data?.data?.length) {
                    data.data.data.forEach(item => {
                        if (item?.sc_chain_id) {
                            item.sc_chain_id = item.sc_chain_id?.replace(new RegExp("\_", "g"), "-") || item.sc_chain_id
                        }
                        if (item?.sc_chain_id) {
                            item.dc_chain_id = item.dc_chain_id?.replace(new RegExp("\_", "g"), "-") || item.dc_chain_id
                        }
                        if (item?.chain_id) {
                            item.chain_id = item.chain_id?.replace(new RegExp("\_", "g"), "-") || item.chain_id
                        }
                    })
                }
                if (data?.data?.length) {
                    data.data.forEach(item => {
                        if (item?.sc_chain_id) {
                            item.sc_chain_id = item.sc_chain_id?.replace(new RegExp("\_", "g"), "-") || item.sc_chain_id
                        }
                        if (item?.sc_chain_id) {
                            item.dc_chain_id = item.dc_chain_id?.replace(new RegExp("\_", "g"), "-") || item.dc_chain_id
                        }
                        if (item?.chain_id) {
                            item.chain_id = item.chain_id?.replace(new RegExp("\_", "g"), "-") || item.chain_id
                        }
                    })
                }
                if (data?.data?.active?.length) {
                    data.data.active.forEach(item => {
                        if (item?.chain_id) {
                            item.chain_id = item.chain_id?.replace(new RegExp("\_", "g"), "-") || item.chain_id
                        }
                    })
                }
                if (data?.data?.all?.length) {
                    data.data.all.forEach(item => {
                        if (item?.chain_id) {
                            item.chain_id = item.chain_id?.replace(new RegExp("\_", "g"), "-") || item.chain_id
                        }
                    })
                }
                if (data?.data?.inactive?.length) {
                    data.data.inactive.forEach(item => {
                        if (item?.chain_id) {
                            item.chain_id = item.chain_id?.replace(new RegExp("\_", "g"), "-") || item.chain_id
                        }
                    })
                }
                res(data.data || data);
            } else {
                console.error(`error from ${url}:`, JSON.stringify(data));
                rej(data);
            }
        } catch (err) {

            console.error(`error from ${url}:`, err.message);
            if(url?.includes('/api/ibc/chains') || url?.includes('/api/ibc/txs') ){
                if (err?.message?.includes('code 500')) {
                    router.push('/500')
                }
            }
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

function getTxDetailsByTxHash(txHash) {
    const url = `/api/ibc/txs/${txHash}`
    return get(url);
}

export {
    getIbcTxs,
    getIbcChains,
    getIbcBaseDenoms,
    getIbcDenoms,
    getIbcStatistics,
    getIbcConfig,
    getTxDetailsByTxHash,
};
