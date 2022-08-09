import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import {
    IResponse,
    IIbcChains,
    IBaseDenom,
    IResponseData
} from '@/types/interface/index.interface';

export const getIbcChainsAPI = () => {
    return request<IResponse<IResponseData<IIbcChains[]>>>({
        url: API_URL.ibcChainsUrl,
        method: 'get'
    });
};

export const getIbcBaseDenomsAPI = () => {
    return request<IResponse<IResponseData<IBaseDenom[]>>>({
        url: API_URL.ibcBaseDenomsUrl,
        method: 'get'
    });
};
