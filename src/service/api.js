/* eslint-disable no-async-promise-executor */
/* eslint-disable no-param-reassign */
import { HttpHelper } from '../helper/httpHelper.js';
import { useRouter } from 'vue-router';

const router = useRouter();

function get(url, params) {
    return new Promise(async (res, rej) => {
        url = `/${url.replace(/^\//, '')}`;
        if (params?.params?.chain_id) {
            params.params.chain_id = params.params.chain_id?.replace(new RegExp('-', 'g'), '_');
        }
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
            if (url?.includes('/ibc/chains') || url?.includes('/ibc/txs')) {
                if (!err?.message?.includes('code 200')) {
                    router.push('/500');
                }
            }
            rej(err);
        }
    });
}

// function getIbcTxs(params) {
//     const url = '/ibc/txs';
//     const config = {
//         params
//     };
//     return get(url, config);
// }

function getIbcDenoms() {
    const url = '/ibc/denoms';
    return get(url);
}

function getIbcStatistics() {
    const url = '/ibc/statistics';
    return get(url);
}

function getIbcConfig() {
    const url = '/ibc/config';
    return get(url);
}

function getTxDetailsByTxHash(txHash) {
    const url = `/ibc/txs/${txHash}`;
    return get(url);
}

export { getIbcStatistics, getIbcConfig, getTxDetailsByTxHash, getIbcDenoms };
