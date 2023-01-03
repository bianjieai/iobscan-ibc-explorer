// todo shan 需切换为真实请求
// import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type { IResponseHeatmap } from '@/types/interface/overview.interface';
import requestMock from '@/utils/axiosMock';
export const getOverviewHeatmapAPI = async () => {
    return requestMock<IResponse<IResponseHeatmap>>({
        url: API_URL.ibcOverviewMarketHeatmap,
        method: 'get'
    });
};
