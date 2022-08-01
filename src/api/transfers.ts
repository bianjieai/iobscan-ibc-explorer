import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IRequestIbcTxs, IResponseIbcTxs } from '@/types/interface/transfers.interface';

export const getIbcTxsAPI = (params: IRequestIbcTxs) => {
    return request<IResponse<IResponseIbcTxs | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params
    });
};

export const getTxDetailsByTxHashAPI = (hash: string) => {
    return request<IResponse<IResponseIbcTxs>>({
        url: `${API_URL.ibcTxDetailsUrl}${hash}`,
        method: 'get'
    });
};
