import request from '@/utils/axios';
import { API_URL } from '@/constants/apiUrl';
import type { IResponse } from '@/types/interface/index.interface';
import type {
    IResponseDistribution,
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

export const getOverviewDistributionAPI = async (base_denom: string, base_denom_chain: string) => {
    return request<IResponse<IResponseDistribution>>({
        url: API_URL.ibcOverviewTokenDistribution,
        params: { base_denom, base_denom_chain },
        method: 'get'
    });
};
