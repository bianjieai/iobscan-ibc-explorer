import request from '@/utils/axios';

export const getIbcTxsAPI = (params: any) => {
    return request({
        url: '/ibc/txs',
        method: 'get',
        params
    });
};
