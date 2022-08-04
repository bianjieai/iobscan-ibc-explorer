import { API_URL } from '@/constants/apiUrl';
import { IRequestChannelsList, IResponseChannelsList } from '@/types/interface/channels.interface';
import { IResponse } from '@/types/interface/index.interface';
import request from '@/utils/axios';
export const getChannelsListAPI = async (param: IRequestChannelsList) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseChannelsList | number>>({
        url: `${urlPrefix}${API_URL.ibcChannelsListUrl}`,
        method: 'get',
        params: param
    });
};
