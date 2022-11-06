import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import requestMock from '@/utils/axiosMock';
import { IResponse } from '@/types/interface/index.interface';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';

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
