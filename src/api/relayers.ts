import { API_URL } from '@/constants/apiUrl';
import request from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';

export const getRelayersListAPI = async (param: IRequestRelayerList) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseRelayerList | number>>({
        url: `${urlPrefix}${API_URL.ibcRelayerListUrl}`,
        method: 'get',
        params: param
    });
};
