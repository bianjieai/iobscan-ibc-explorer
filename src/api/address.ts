import { urlReplacePlaceholder } from '@/constants/apiUrl';
import { API_URL } from '@/constants/apiUrl';
import { IRequestAddress, IResponseAddressBaseInfo } from '@/types/interface/address.interface';
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
*/
