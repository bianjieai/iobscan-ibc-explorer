import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type {
    IResponseHeatmap,
    IResponseTransferVolumeItem,
    IResponseTransferVolumeTrend
} from '@/types/interface/overview.interface';
// import requestMock from '@/utils/axiosMock';

export const getOverviewHeatmapAPI = async () => {
    return request<IResponse<IResponseHeatmap>>({
        url: API_URL.ibcOverviewMarketHeatmap,
        method: 'get'
    });
};

export const getOverviewTransferVolumeAPI = async () => {
    return request<IResponse<IResponseTransferVolumeItem[]>>({
        url: API_URL.ibcOverviewTransferVolume,
        method: 'get'
    });
};

export const getOverviewTransferVolumeTrendAPI = async (chain = '') => {
    return request<IResponse<IResponseTransferVolumeTrend>>({
        url: API_URL.ibcOverviewChainTransferVolumeTrend,
        params: { chain },
        method: 'get'
    });
};
