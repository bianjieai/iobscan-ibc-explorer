import { urlReplacePlaceholder } from '@/constants/apiUrl';
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
    ITransferTypeTxs,
    IResponseRelayerTrend,
    IRequestRelayedTrend,
    IRequestTotalRelayedValueOrFee,
    IResponseTotalRelayedValue,
    IResponseTotalFeeCost
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

export const getRelayedTrendAPI = async (params: IRequestRelayedTrend) => {
    const url = API_URL.ibcRelayedTrend.replace(urlReplacePlaceholder, params.relayer_id);
    return request<IResponse<IResponseRelayerTrend[]>>({
        url,
        method: 'get',
        params: params
    });
};

export const getTotalRelayedValueAPI = async (params: IRequestTotalRelayedValueOrFee) => {
    const url = API_URL.ibcTotalRelayedValue.replace(urlReplacePlaceholder, params.relayer_id);
    return request<IResponse<IResponseTotalRelayedValue>>({
        url,
        method: 'get'
    });
};

export const getTotalFeeCostAPI = async (params: IRequestTotalRelayedValueOrFee) => {
    const url = API_URL.ibcTotalFeeCost.replace(urlReplacePlaceholder, params.relayer_id);
    return request<IResponse<IResponseTotalFeeCost>>({
        url,
        method: 'get'
    });
};

export const getRelayerDetailsByRelayerIdAPI = async (relayerId: string) => {
    return request<IResponse<IResponseRelayerDetails>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}`,
        method: 'get'
    });
};

export const getTransferTypeTxsAPI = async (relayerId: string) => {
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
    return request<IResponse<IRelayerTransferList | number>>({
        url: `${API_URL.ibcRelayerDetailsUrl}${relayerId}/txs`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
