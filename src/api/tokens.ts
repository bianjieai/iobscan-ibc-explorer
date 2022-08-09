import { API_URL } from '@/constants/apiUrl';
import { IResponse } from '@/types/interface/index.interface';
import {
    IRequestIbcTokenList,
    IRequestTokensList,
    IResponseIbcTokenList,
    IResponseTokensList
} from '@/types/interface/tokens.interface';
import request, { executeCancel, setExecuteCancel } from '@/utils/axios';

export const getTokensListAPI = async (params: IRequestTokensList) => {
    executeCancel(params.use_count);
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseTokensList | number>>({
        url: `${urlPrefix}${API_URL.ibcTokensListUrl}`,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

export const getIbcTokenListAPI = async (base_denom: string, params: IRequestIbcTokenList) => {
    executeCancel(params.use_count);
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    const ibcTokenListUrl = `${urlPrefix}/ibc/${base_denom.replace('ibc/', '')}${
        API_URL.ibcIbcTokenListUrl
    }`;
    return request<IResponse<IResponseIbcTokenList | number>>({
        url: ibcTokenListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
