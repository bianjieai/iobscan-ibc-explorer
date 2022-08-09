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
    return request<IResponse<IResponseTokensList | number>>({
        url: API_URL.ibcTokensListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};

export const getIbcTokenListAPI = async (base_denom: string, params: IRequestIbcTokenList) => {
    executeCancel(params.use_count);
    const ibcTokenListUrl = `/ibc/${base_denom.replace('ibc/', '')}${API_URL.ibcIbcTokenListUrl}`;
    return request<IResponse<IResponseIbcTokenList | number>>({
        url: ibcTokenListUrl,
        method: 'get',
        params: params,
        cancelToken: setExecuteCancel(params.use_count)
    });
};
