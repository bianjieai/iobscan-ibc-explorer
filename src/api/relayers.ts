import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import requestMock from '@/utils/axiosMock';
import { IResponse } from '@/types/interface/index.interface';
import {
    IRequestRelayerList,
    IResponseRelayerDetails,
    IResponseRelayerList
} from '@/types/interface/relayers.interface';

export const getRelayersListAPI = async (params: IRequestRelayerList) => {
    executeCancel(params.use_count);
    return request<IResponse<IResponseRelayerList | number>>({
        url: API_URL.ibcRelayerListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

export const getRelayersListMock = async (params: IRequestRelayerList) => {
    executeCancel(params.use_count);
    return requestMock<IResponse<IResponseRelayerList | number>>({
        url: API_URL.ibcRelayerListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

// Todo shan 需切换成真实 API
export const getRelayerDetailsByRelayerIdAPI = async (relayerId: string) => {
    return requestMock<IResponse<IResponseRelayerDetails>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}`,
        method: 'get'
    });
};
/*
// Relayer Details API 真实
export const getRelayerDetailsByRelayerIdAPI = async (relayerId: string) => {
    return request<IResponse<IResponseRelayerList | number>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}`,
        method: 'get'
    });
};
*/
