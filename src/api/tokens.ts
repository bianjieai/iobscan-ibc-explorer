import { API_URL } from '@/constants/apiUrl';
import { IResponse } from '@/types/interface/index.interface';
import {
    IRequestIbcTokenList,
    IRequestTokensList,
    IResponseIbcTokenList,
    IResponseTokensList
} from '@/types/interface/tokens.interface';
import request from '@/utils/axios';
export const getTokensListAPI = async (param: IRequestTokensList) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseTokensList | number>>({
        url: `${urlPrefix}${API_URL.ibcTokensListUrl}`,
        method: 'get',
        params: param
    });
};

export const getIbcTokenListAPI = async (base_denom: string, param: IRequestIbcTokenList) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    const ibcTokenListUrl = `${urlPrefix}/ibc/${base_denom.replace('ibc/', '')}${
        API_URL.ibcIbcTokenListUrl
    }`;
    return request<IResponse<IResponseIbcTokenList | number>>({
        url: ibcTokenListUrl,
        method: 'get',
        params: param
    });
};
