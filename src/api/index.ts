import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import type {
    IResponse,
    IIbcChains,
    IBaseDenom,
    IResponseData
} from '@/types/interface/index.interface';
import type { ISearchPoint } from '@/types/interface/home.interface';

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

export const postIPAndInput = (params: ISearchPoint) => {
    return request({
        url: API_URL.ibcSearchPointUrl,
        method: 'post',
        data: params
    });
};
