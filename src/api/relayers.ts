import { API_URL } from '@/constants/apiUrl';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IRequestRelayerList, IResponseRelayerList } from '@/types/interface/relayers.interface';

export const getRelayersListAPI = async (params: IRequestRelayerList) => {
    executeCancel(params.use_count);
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseRelayerList | number>>({
        url: `${urlPrefix}${API_URL.ibcRelayerListUrl}`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
