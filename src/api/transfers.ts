import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse, Paging } from '@/types/interface/index.interface';
import { IRequestIbcTxs, IIbcTx, IIbcTxDetail } from '@/types/interface/transfers.interface';

export const getIbcTxsAPI = (params: IRequestIbcTxs) => {
    return request<IResponse<Paging<IIbcTx[]> | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params
    });
};

export const getTxDetailsByTxHashAPI = (hash: string) => {
    return request<IResponse<IIbcTxDetail[]>>({
        url: `${API_URL.ibcTxDetailsUrl}${hash}`,
        method: 'get'
    });
};
