import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse, IResponseData } from '@/types/interface/index.interface';
import type {
    IResponseIbcDenom,
    IResponseIbcStatisticItem
} from '@/types/interface/home.interface';

export const getIbcDenomsAPI = () => {
    return request<IResponse<IResponseData<IResponseIbcDenom[]>>>({
        url: API_URL.ibcDenomsUrl,
        method: 'get'
    });
};

export const getIbcStatisticsAPI = () => {
    return request<IResponse<IResponseData<IResponseIbcStatisticItem[]>>>({
        url: API_URL.ibcStatisticsUrl,
        method: 'get'
    });
};
