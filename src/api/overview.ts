// todo shan 需切换为真实请求
// import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type {
    IResponseHeatmap,
    IResponseTransferVolumeItem,
    IResponseTransferVolumeTrend
} from '@/types/interface/overview.interface';
import requestMock from '@/utils/axiosMock';

export const getOverviewHeatmapAPI = async () => {
    return requestMock<IResponse<IResponseHeatmap>>({
        url: API_URL.ibcOverviewMarketHeatmap,
        method: 'get'
    });
};

export const getOverviewTransferVolumeAPI = async () => {
    // todo dj requestMock => request
    return requestMock<IResponse<IResponseTransferVolumeItem[]>>({
        url: API_URL.ibcOverviewTransferVolume,
        method: 'get'
    });
};

export const getOverviewTransferVolumeTrendAPI = async (chain = '') => {
    // todo dj requestMock => request
    return requestMock<IResponse<IResponseTransferVolumeTrend>>({
        url: API_URL.ibcOverviewChainTransferVolumeTrend,
        params: { chain },
        method: 'get'
    });
};
