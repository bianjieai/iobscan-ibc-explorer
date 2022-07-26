import request from '@/utils/axios';
import { IResponse, IIbcChains, IBaseDenoms } from '@/types/interface/baseApi.interface';

export const getIbcChainsAPI = () => {
    return request<IResponse<IIbcChains>>({
        url: '/ibc/chains',
        method: 'get'
    });
};

export const getIbcBaseDenomsAPI = () => {
    return request<IResponse<IBaseDenoms[]>>({
        url: '/ibc/baseDenoms',
        method: 'get'
    });
};
