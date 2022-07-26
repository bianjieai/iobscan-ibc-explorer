import request from '@/utils/axios';
import { IResponse } from '@/types/interface/baseApi.interface';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';

export const getRelayersListAPI = async (param: IRequestRelayerList) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseRelayerList | number>>({
        url: `${urlPrefix}/ibc/relayerList`,
        method: 'get',
        params: param
    });
};
