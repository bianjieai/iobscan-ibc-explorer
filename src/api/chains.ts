import { API_URL } from '@/constants/apiUrl';
import { IChainsListParams, IResponseChainsList } from '@/types/interface/chains.interface';
import { IResponse } from '@/types/interface/index.interface';
import request from '@/utils/axios';
export const getChainsListAPI = async (params: IChainsListParams) => {
    return request<IResponse<IResponseChainsList | number>>({
        url: API_URL.ibcChainsListUrl,
        method: 'get',
        params: params
    });
};
