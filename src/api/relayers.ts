import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import requestMock from '@/utils/axiosMock';
import { IResponse } from '@/types/interface/index.interface';
import {
    IRelayerTransferList,
    IRequestRelayerList,
    IRequestRelayerTransfer,
    IResponseRelayerDetails,
    IResponseRelayerList,
    ITransferTypeTxs
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

export const getRelayersNameListAPI = async () => {
    return request<IResponse<string[]>>({
        url: API_URL.ibcRelayerRelayerName,
        method: 'get'
    });
};

export const getRelayersNameListMock = async () => {
    return requestMock<IResponse<string[]>>({
        url: API_URL.ibcRelayerRelayerName,
        method: 'get'
    });
};

// Todo shan 需切换成真实 API
export const getRelayerDetailsByRelayerIdAPI = async (relayerId: string) => {
    return requestMock<IResponse<IResponseRelayerDetails>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}`,
        method: 'get'
    });
};

export const getTransferTypeTxsAPI = async (relayerId: string) => {
    return requestMock<IResponse<ITransferTypeTxs>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}/transferTypeTxs`,
        method: 'get'
    });
};

export const getRelayerTransferListAPI = async (
    relayerId: string,
    params: IRequestRelayerTransfer
) => {
    executeCancel(params.use_count);
    return requestMock<IResponse<IRelayerTransferList>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}/txs`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
/*
// Relayer Details API 真实
export const getRelayerDetailsByRelayerIdAPI = async (relayerId: string) => {
    return request<IResponse<IResponseRelayerDetails>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}`,
        method: 'get'
    });
};

export const getTransferTypeTxs = async (relayerId: string) => {
    return request<IResponse<ITransferTypeTxs>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}/transferTypeTxs`,
        method: 'get'
    });
};

export const getRelayerTransferListAPI = async (
    relayerId: string,
    params: IRequestRelayerTransfer
) => {
    executeCancel(params.use_count);
    return requestMock<IResponse<IRelayerTransferList>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}/txs`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
*/
