import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import { IResponse, IResponsePagingData } from '@/types/interface/index.interface';
import { IRequestIbcTxs, IIbcTx, IIbcTxDetail } from '@/types/interface/transfers.interface';
import axios from 'axios';

export const getIbcTxsAPI = (params: IRequestIbcTxs) => {
    executeCancel(params.use_count);
    return request<IResponse<IResponsePagingData<IIbcTx[]> | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

// todo shan 需要切换回正确的接口请求方法
export const getTxDetailsByTxHashAPI = (hash: string) => {
    return new Promise<IResponse<IIbcTxDetail>>((resolve) => {
        axios.get('http://yapi.bianjie.ai/mock/23/ibc/txs/%7Bhash%7D?a=1').then((res) => {
            resolve(res.data);
        });
    });
    return request<IResponse<IIbcTxDetail>>({
        url: `${API_URL.ibcTxDetailsUrl}${hash}`,
        method: 'get'
    });
};
// export const getTxDetailsByTxHashAPI = (hash: string) => {
//     return request<IResponse<IIbcTxDetail>>({
//         url: `${API_URL.ibcTxDetailsUrl}${hash}`,
//         method: 'get'
//     });
// };
