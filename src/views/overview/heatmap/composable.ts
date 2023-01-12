import { IHeatmapTotalInfoItem } from '@/types/interface/overview.interface';
import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
import { bigNumberCompared } from '@/utils/calculate';
import { firstLetterCapitalize } from '@/utils/stringTools';
import { getIsSafari } from '@/utils/systemTools';
import * as echarts from 'echarts';
import moveDecimal from 'move-decimal-point';
import { getOverviewHeatmapAPI } from '@/api/overview';
import { DEFAULT_DISPLAY_TEXT, NoDataType } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { GROWTH_RATE, HEATMAP_COLOR } from '@/constants/overview';
import { formatBigNumber } from '@/helper/parseStringHelper';
import { formatDimension } from '@/helper/overviewHelper';
import ChainHelper from '@/helper/chainHelper';
import type {
    IResponseHeatmapTotalInfoFormat,
    IHeartmapDataItem
} from '@/types/interface/overview.interface';

export const useOverviewHeatmap = () => {
    const decimal = 2;
    const heatmapLoading = ref(true);
    const heatmapNoDataType = ref<NoDataType>();
    const heatmapChartRefDom = ref();
    let heatmapChart: echarts.ECharts;
    const minWidth = 28;
    const lableMinFontSize = 8;
    const minHeight = lableMinFontSize * 2 + 2;
    const lableFontWeight = getIsSafari() ? 550 : 600;
    const heartmapData = ref<IHeartmapDataItem[]>([]);
    const rangeData = ref(Object.keys(HEATMAP_COLOR));

    const heatmapChartOption: any = {
        tooltip: {
            trigger: 'item',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'z-index:1;',
            formatter: (params: any) => {
                if (!params.data.otherInfo) return '';
                const otherInfo = params.data.otherInfo || {};
                const title = `${otherInfo.prettyName} (${otherInfo.symbol})`;
                const marketCapTrend = firstLetterCapitalize(
                    formatMarketCapTrend(otherInfo.priceTrend)
                );
                const marketCapTrendDisplay = `${otherInfo.priceTrend}${otherInfo.formatPriceGrowthRate}`;
                return `<div
                            style="
                                padding: 12px;
                                background: #ffffff;
                                box-shadow: 0px 2px 8px 0px #d9deec;
                                border-radius: 4px;
                                border: 1px solid #d9dfee;
                            "
                        >
                            <div
                                style="
                                    margin-bottom: 8px;
                                    height: 20px;
                                    font-size: 16px;
                                    font-family: 'GolosUI_Medium';
                                    font-weight: 500;
                                    color: #000000;
                                    line-height: 20px;
                                "
                            >
                                ${title}
                            </div>
                            <div style="height: 18px">
                                <span
                                    style="
                                        margin-right: 8px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >Price:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >$${otherInfo.formatPrice}</span
                                >
                            </div>
                            <div style="height: 18px">
                                <span
                                    style="
                                        margin-right: 8px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >IBC Transfer Volume:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >$${otherInfo.formatVolume}</span
                                >
                            </div>
                            <div style="height: 18px">
                                <span
                                    style="
                                        margin-right: 8px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >Market Cap:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >$${otherInfo.formatMarketCap}</span
                                >
                            </div>
                            <div style="height: 18px">
                                <span
                                    style="
                                        margin-right: 8px;
                                        font-size: 14px;
                                        font-family: 'GolosUI_Medium';
                                        font-weight: 500;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >${marketCapTrend}:</span
                                >
                                <span
                                    style="
                                        font-size: 14px;
                                        font-family: 'GolosUIWebRegular';
                                        font-weight: 400;
                                        color: #000000;
                                        line-height: 18px;
                                    "
                                    >${marketCapTrendDisplay}</span
                                >
                            </div>
                        </div>`;
            },
            confine: true
        },
        series: [
            {
                type: 'treemap',
                width: '100%',
                height: '100%',
                breadcrumb: {
                    show: false
                },
                roam: false,
                nodeClick: false,
                itemStyle: {
                    gapWidth: 1,
                    borderColor: '#fff'
                },
                labelLayout: function (params: any) {
                    if (params.rect.width < minWidth || params.rect.height < minHeight) {
                        return {
                            fontSize: 0.1
                        };
                    }
                    const fontSize = Math.max(
                        Math.sqrt(params.rect.width * params.rect.height) / 8,
                        lableMinFontSize
                    );
                    return {
                        fontSize: fontSize
                    };
                },
                label: {
                    show: true,
                    formatter: (params: any) => {
                        const otherInfo = params.data.otherInfo;
                        const priceGrowthRate = `${
                            otherInfo.formatPriceGrowthRate !== '0%' ? otherInfo.priceTrend : ''
                        }${otherInfo.formatPriceGrowthRate}`;
                        return `${otherInfo.symbol}\n${priceGrowthRate}`;
                    },
                    color: '#fff',
                    padding: 0,
                    fontWeight: lableFontWeight,
                    fontFamily: 'GolosUIWebRegular'
                },
                visibleMin: 20,
                data: []
            }
        ]
    };
    const getDimensionDefault: () => IHeatmapTotalInfoItem = () => {
        return {
            result: DEFAULT_DISPLAY_TEXT,
            isDimension: false
        };
    };
    const heatmapTotalInfo = reactive<IResponseHeatmapTotalInfoFormat>({
        stablecoins_market_cap: getDimensionDefault(),
        total_market_cap: getDimensionDefault(),
        total_denom_number: DEFAULT_DISPLAY_TEXT,
        market_cap_growth_rate: DEFAULT_DISPLAY_TEXT,
        market_cap_trend: DEFAULT_DISPLAY_TEXT,
        total_transfer_volume: getDimensionDefault(),
        atom_price: getDimensionDefault(),
        atom_dominance: DEFAULT_DISPLAY_TEXT,
        market_cap_trend_desc: DEFAULT_DISPLAY_TEXT
    });
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
    const decimalToPercentage = (valueOrigin: string | number) => {
        if (valueOrigin === DEFAULT_DISPLAY_TEXT) return valueOrigin;
        return moveDecimal(String(valueOrigin) || 0, 2);
    };

    // +10% :  >= 10%;9 % : 10 % > x > 3 %;3 %: 3 % >= x > 0 %;0 % : 0 %
    // -3 % : 0 % > x > = -3 %;-9 % : -3 % > x > -10 %; -10 % : x <= -10 %
    const getHeatmapLevel = (value: string | number) => {
        if (bigNumberCompared(value, '0.10') !== '-1') {
            return '+10%';
        } else if (bigNumberCompared(value, '0.03') === '1') {
            return '+9%';
        } else if (bigNumberCompared(value, '0') === '1') {
            return '+3%';
        } else if (bigNumberCompared(value, '0') === '0') {
            return '0%';
        } else if (bigNumberCompared(value, '-0.03') !== '-1') {
            return '-3%';
        } else if (bigNumberCompared(value, '-0.10') === '1') {
            return '-9%';
        } else {
            return '-10%';
        }
    };

    const getOverviewHeatmapInfo = async () => {
        heatmapNoDataType.value = undefined;
        heatmapLoading.value = true;
        try {
            const { code, data, message } = await getOverviewHeatmapAPI();
            if (code === API_CODE.success) {
                heatmapTotalInfo.stablecoins_market_cap = formatDimension(
                    data.total_info.stablecoins_market_cap,
                    decimal,
                    true
                ) as IHeatmapTotalInfoItem;
                heatmapTotalInfo.total_market_cap = formatDimension(
                    data.total_info.total_market_cap,
                    decimal,
                    true
                ) as IHeatmapTotalInfoItem;
                heatmapTotalInfo.total_denom_number = formatBigNumber(
                    data.total_info.total_denom_number
                );
                heatmapTotalInfo.market_cap_growth_rate = decimalToPercentage(
                    data.total_info.market_cap_growth_rate
                );
                heatmapTotalInfo.market_cap_trend = data.total_info.market_cap_trend;
                heatmapTotalInfo.market_cap_trend_desc = formatMarketCapTrend(
                    data.total_info.market_cap_trend
                );
                heatmapTotalInfo.total_transfer_volume = formatDimension(
                    data.total_info.total_transfer_volume,
                    decimal,
                    true
                ) as IHeatmapTotalInfoItem;
                heatmapTotalInfo.atom_price = formatDimension(
                    data.total_info.atom_price,
                    decimal,
                    true
                ) as IHeatmapTotalInfoItem;
                heatmapTotalInfo.atom_dominance = decimalToPercentage(
                    data.total_info.atom_dominance
                );
                if (data.items.length > 0) {
                    const temp: IHeartmapDataItem[] = [];
                    for (let i = 0; i < data.items.length; i++) {
                        const item = data.items[i];
                        const chainInfo = await ChainHelper.getChainInfoByKey(item.chain);
                        const baseDenomInfo = await getBaseDenomByKey(item.chain, item.denom);
                        const level = getHeatmapLevel(
                            `${item.price_trend}${item.price_growth_rate}`
                        );
                        temp.push({
                            value: item.market_cap_value,
                            itemStyle: {
                                color: HEATMAP_COLOR[level]
                            },
                            otherInfo: {
                                prettyName: chainInfo?.pretty_name || item.chain,
                                symbol: baseDenomInfo?.symbol || item.denom,
                                formatPrice: formatBigNumber(item.price),
                                formatVolume: formatDimension(item.transfer_volume_value) as string,
                                formatMarketCap: formatDimension(item.market_cap_value) as string,
                                priceTrend: item.price_trend,
                                formatPriceGrowthRate:
                                    decimalToPercentage(item.price_growth_rate) + '%',
                                level
                            }
                        });
                    }
                    heartmapData.value = [...temp];
                    heatmapLoading.value = false;
                    changeChartData();
                } else {
                    heatmapLoading.value = false;
                    heatmapNoDataType.value = NoDataType.noData;
                }
            } else {
                heatmapLoading.value = false;
                heatmapNoDataType.value = NoDataType.loadFailed;
                console.log(message);
            }
        } catch (error) {
            heatmapLoading.value = false;
            heatmapNoDataType.value = NoDataType.loadFailed;
            console.log(error);
        }
    };
    const handleNoDataType = () => {
        if (heatmapNoDataType.value !== NoDataType.loadFailed) {
            heatmapNoDataType.value = NoDataType.noData;
        }
    };
    const changeChartData = () => {
        const temp = heartmapData.value.filter((item) => {
            return rangeData.value.includes(item.otherInfo.level);
        });
        if (temp.length > 0) {
            heatmapNoDataType.value = undefined;
            heatmapChartOption.series[0].data = [...temp];
            nextTick(() => {
                heatmapChartSizeFn();
                // console.log(heatmapChartOption.series);
                heatmapChart && heatmapChart.setOption(heatmapChartOption, true);
            });
        } else {
            handleNoDataType();
        }
    };
    const changeChooseLegend = (params: string[]) => {
        if (params.length > 0) {
            rangeData.value = [...params];
            if (!heatmapLoading.value) {
                changeChartData();
            }
        } else {
            handleNoDataType();
        }
    };
    const heatmapChartSizeFn = () => {
        heatmapChart && heatmapChart.resize();
    };
    onMounted(async () => {
        heatmapChart = echarts.init(heatmapChartRefDom.value as HTMLElement);
        await getOverviewHeatmapInfo();
        window.addEventListener('resize', heatmapChartSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', heatmapChartSizeFn);
    });
    return {
        heatmapLoading,
        heatmapNoDataType,
        heatmapChartRefDom,
        heatmapTotalInfo,
        changeChooseLegend
    };
};
