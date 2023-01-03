import { getOverviewHeatmapAPI } from '@/api/overview';
import { DEFAULT_DISPLAY_TEXT, NoDataType } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { GROWTH_RATE } from '@/constants/overview';
import { formatBigNumber, formatDimension } from '@/helper/parseStringHelper';
import type {
    ILegendInfo,
    IResponseHeatmapTotalInfoFormat
} from '@/types/interface/overview.interface';
import moveDecimal from 'move-decimal-point';

export const useGetOverviewHeatmapInfo = () => {
    const heatmapTotalInfo = reactive<IResponseHeatmapTotalInfoFormat>({
        stablecoins_market_cap: DEFAULT_DISPLAY_TEXT,
        total_market_cap: DEFAULT_DISPLAY_TEXT,
        total_denom_number: DEFAULT_DISPLAY_TEXT,
        market_cap_growth_rate: DEFAULT_DISPLAY_TEXT,
        market_cap_trend: DEFAULT_DISPLAY_TEXT,
        total_transfer_volume: DEFAULT_DISPLAY_TEXT,
        atom_price: DEFAULT_DISPLAY_TEXT,
        atom_dominance: DEFAULT_DISPLAY_TEXT,
        market_cap_trend_desc: DEFAULT_DISPLAY_TEXT
    });
    const heatmapType = ref<NoDataType>();
    // todo dj 待补充加载中及热力图部分
    const formatMoveDecimal = (valueOrigin: string | number) => {
        if (valueOrigin === DEFAULT_DISPLAY_TEXT) return valueOrigin;
        return moveDecimal(Number(valueOrigin) || 0, 2);
    };
    const formatMarketCapTrend = (marketCapTrend: string) => {
        switch (marketCapTrend) {
            case GROWTH_RATE.increase.sign:
                return GROWTH_RATE.increase.label;
            case GROWTH_RATE.decrease.sign:
                return GROWTH_RATE.decrease.label;
            default:
                return DEFAULT_DISPLAY_TEXT;
        }
    };
    const getOverviewHeatmapInfo = async () => {
        heatmapType.value = undefined;
        try {
            const { code, data, message } = await getOverviewHeatmapAPI();
            if (code === API_CODE.success) {
                heatmapTotalInfo.stablecoins_market_cap = formatDimension(
                    data.total_info.stablecoins_market_cap
                );
                heatmapTotalInfo.total_market_cap = formatDimension(
                    data.total_info.total_market_cap
                );
                heatmapTotalInfo.total_denom_number = formatBigNumber(
                    data.total_info.total_denom_number
                );
                heatmapTotalInfo.market_cap_growth_rate = formatMoveDecimal(
                    data.total_info.market_cap_growth_rate
                );
                heatmapTotalInfo.market_cap_trend = data.total_info.market_cap_trend;
                heatmapTotalInfo.market_cap_trend_desc = formatMarketCapTrend(
                    data.total_info.market_cap_trend
                );
                heatmapTotalInfo.total_transfer_volume = formatDimension(
                    data.total_info.total_transfer_volume
                );
                heatmapTotalInfo.atom_price = formatDimension(data.total_info.atom_price);
                heatmapTotalInfo.atom_dominance = formatMoveDecimal(data.total_info.atom_dominance);
            } else {
                heatmapType.value = NoDataType.loadFailed;
                console.log(message);
            }
        } catch (error) {
            heatmapType.value = NoDataType.loadFailed;
            console.log(error);
        }
    };
    onMounted(() => {
        getOverviewHeatmapInfo();
    });
    return {
        heatmapTotalInfo
    };
};

export const useHeatmapChart = () => {
    const currentChooseLegend = ref<number>(-1);
    const currentChooseLegendStatus = ref<boolean>(true);
    const changeCurrentChooseLegend = (currentLegendInfo: ILegendInfo) => {
        currentChooseLegend.value = currentLegendInfo.currentLegend;
        currentChooseLegendStatus.value = currentLegendInfo.currentLegendStatus;
    };
    return {
        currentChooseLegend,
        changeCurrentChooseLegend
    };
};
