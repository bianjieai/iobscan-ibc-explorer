import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IRequestIbcTxc, IResponseIbcTxc } from '@/types/interface/transfers.interface';

export const getIbcTxsAPI = (params: IRequestIbcTxc) => {
    return request<IResponse<IResponseIbcTxc | number>>({
        url: API_URL.ibcTxsUrl,
        method: 'get',
        params: params
    });
};
