import { API_URL } from '@/constants/apiUrl';
import { IResponseChainsList } from '@/types/interface/chains.interface';
import { IRequestPagination, IResponse } from '@/types/interface/index.interface';
import request from '@/utils/axios';
export const getChainsListAPI = async (param: IRequestPagination) => {
    const urlPrefix = import.meta.env.VITE_BASE_GO_API;
    return request<IResponse<IResponseChainsList | number>>({
        url: `${urlPrefix}${API_URL.ibcChainsListUrl}`,
        method: 'get',
        params: param
    });
};
