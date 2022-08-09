import { API_URL } from '@/constants/apiUrl';
import { IRequestChannelsList, IResponseChannelsList } from '@/types/interface/channels.interface';
import { IResponse } from '@/types/interface/index.interface';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';

export const getChannelsListAPI = async (params: IRequestChannelsList) => {
    executeCancel(params.use_count);
    return request<IResponse<IResponseChannelsList | number>>({
        url: API_URL.ibcChannelsListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
