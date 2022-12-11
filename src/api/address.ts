import { urlReplacePlaceholder } from '@/constants/apiUrl';
import { API_URL } from '@/constants/apiUrl';
import {
    IRequestAddress,
    IRequestAddressTxs,
    IResponseAddressBaseInfo,
    IResponseAddressTxsData
} from '@/types/interface/address.interface';
import { IResponse } from '@/types/interface/index.interface';
// import request, { executeCancel, setExecuteCancel } from '@/utils/axios';
import requestMock from '@/utils/axiosMock';

export const getAddressBaseInfoAPI = async (params: IRequestAddress) => {
    const url = API_URL.ibcAddressChain
        .replace(urlReplacePlaceholder, params.chain)
        .replace(urlReplacePlaceholder, params.address);
    return requestMock<IResponse<IResponseAddressBaseInfo>>({
        url,
        method: 'get'
    });
};

export const getAddressTxsAPI = async (params: IRequestAddressTxs) => {
    const url = API_URL.ibcAddressChainTxs
        .replace(urlReplacePlaceholder, params.chain)
        .replace(urlReplacePlaceholder, params.address);
    return requestMock<IResponse<IResponseAddressTxsData | number>>({
        url,
        method: 'get',
        params: params
    });
};

/*
// todo shan 待替换为真实请求
export const getAddressBaseInfoAPI = async (params: IRequestAddress) => {
    const url = API_URL.ibcAddressChain
        .replace(urlReplacePlaceholder, params.chain)
        .replace(urlReplacePlaceholder, params.address);
    return request<IResponse<IResponseAddress>>({
        url,
        method: 'get'
    });
};

export const getAddressTxsAPI = async (params: IRequestAddressTxs) => {
    executeCancel(params.use_count);
    const url = API_URL.ibcAddressChainTxs
        .replace(urlReplacePlaceholder, params.chain)
        .replace(urlReplacePlaceholder, params.address);
    return request<IResponse<IResponseAddressTxsData>>({
        url,
        method: 'get',
        params: params
        cancelToken: setExecuteCancel(params.use_count)
    });
};
*/
