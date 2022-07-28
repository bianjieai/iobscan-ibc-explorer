import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse, IIbcChains, IBaseDenoms } from '@/types/interface/index.interface';

export const getIbcChainsAPI = () => {
    return request<IResponse<IIbcChains>>({
        url: API_URL.ibcChainsUrl,
        method: 'get'
    });
};

export const getIbcBaseDenomsAPI = () => {
    return request<IResponse<IBaseDenoms[]>>({
        url: API_URL.ibcBaseDenomsUrl,
        method: 'get'
    });
};
