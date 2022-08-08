import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import { IResponse, Paging } from '@/types/interface/index.interface';
import { IRequestIbcTxs, IIbcTx, IIbcTxDetail } from '@/types/interface/transfers.interface';

export const getIbcTxsAPI = (params: IRequestIbcTxs) => {
    executeCancel(params.use_count);
    return request<IResponse<Paging<IIbcTx[]> | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

export const getTxDetailsByTxHashAPI = (hash: string) => {
    return request<IResponse<IIbcTxDetail[]>>({
        url: `${API_URL.ibcTxDetailsUrl}${hash}`,
        method: 'get'
    });
};
