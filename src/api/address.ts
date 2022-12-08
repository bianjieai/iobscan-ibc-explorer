import request from '@/utils/axios';
import { IResponse } from '@/types/interface/index.interface';
import { IResponseTokenList } from '@/types/interface/address.interface';
import { API_URL, urlReplacePlaceholder, urlReplacePlaceholder2 } from '@/constants/apiUrl';
import requestMock from '@/utils/axiosMock';

export const getAddrTokenListAPI = async (chain: string, address: string) => {
    let url = API_URL.ibcAddrTokenList.replace(urlReplacePlaceholder, chain);
    url = url.replace(urlReplacePlaceholder2, address);
    return request<IResponse<IResponseTokenList>>({
        url,
        method: 'get'
    });
};

export const getAddrTokenListMock = async (chain: string, address: string) => {
    let url = API_URL.ibcAddrTokenList.replace(urlReplacePlaceholder, chain);
    url = url.replace(urlReplacePlaceholder2, address);
    return requestMock<IResponse<IResponseTokenList>>({
        url,
        method: 'get'
    });
};
