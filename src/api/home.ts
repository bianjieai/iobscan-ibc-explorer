import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IResponseIbcDenom, IResponseIbcStatistics } from '@/types/interface/home.interface';

export const getIbcDenomsAPI = () => {
    return request<IResponse<IResponseIbcDenom[]>>({
        url: API_URL.ibcDenomsUrl,
        method: 'get'
    });
};

export const getIbcStatisticsAPI = () => {
    return request<IResponse<IResponseIbcStatistics[]>>({
        url: API_URL.ibcStatisticsUrl,
        method: 'get'
    });
};
