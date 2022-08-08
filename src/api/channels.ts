import { API_URL } from '@/constants/apiUrl';
import { IRequestChannelsList, IResponseChannelsList } from '@/types/interface/channels.interface';
import { IResponse } from '@/types/interface/index.interface';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';

export const getChannelsListAPI = async (params: IRequestChannelsList) => {
    executeCancel(params.use_count);
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseChannelsList | number>>({
        url: `${urlPrefix}${API_URL.ibcChannelsListUrl}`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
