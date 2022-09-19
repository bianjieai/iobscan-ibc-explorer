import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import type { IResponse, IResponsePagingData } from '@/types/interface/index.interface';
import type {
    IRequestIbcTxs,
    IIbcTx,
    IIbcTxDetail,
    IRequestIbcSource,
    IIbcSource
} from '@/types/interface/transfers.interface';

export const getIbcTxsAPI = (params: IRequestIbcTxs) => {
    executeCancel(params.use_count);
    return request<IResponse<IResponsePagingData<IIbcTx[]> | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

export const getTxDetailsByTxHashAPI = (hash: string) => {
    return request<IResponse<IIbcTxDetail>>({
        url: `${API_URL.ibcTxDetailsUrl}${hash}`,
        method: 'get'
    });
};

export const getTxDetailsViewSourceByTxHashAPI = (hash: string, params: IRequestIbcSource) => {
    return request<IResponse<IIbcSource>>({
        url: `${API_URL.ibcTxDetailsSourceUrl}${hash}`,
        method: 'get',
        params: params
    });
};
