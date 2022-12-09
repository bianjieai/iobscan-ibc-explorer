<template>
    <InfoCard class="address_allocation" icon="icon-a-relayedassets" title="Allocation">
        <loading-component v-if="addressAllocationLoading" :type="LoadingType.container" />
        <no-datas v-else-if="addressAllocationType" :type="addressAllocationType" />
        <div v-show="isShowAddressAllocationChart" class="address_allocation__chart_c">
            <div class="address_allocation__chart_c__title"
                >Total Value&nbsp;&nbsp;{{ UNIT_SIGNS }} {{ totalValue }}
            </div>
            <div class="address_allocation__chart_c__content_c">
                <div
                    ref="addressAllocationChartDom"
                    class="address_allocation__chart_c__content_c__chart"
                ></div>
                <div class="address_allocation__chart_c__content_c__legend">
                    <div class="address_allocation__chart_c__content_c__legend__left">
                        <PieLegend
                            v-for="legend in firstColumnLegendData"
                            :key="legend.key"
                            class="allocation_pie_legend"
                            :lenged-color="legend.lengedColor"
                            :legend-name="legend.legendName"
                            :percentage="legend.percentage"
                            @mouseover="highlightFn(legend.key, true)"
                            @mouseleave="highlightFn(legend.key, false)"
                        />
                    </div>
                    <div class="address_allocation__chart_c__content_c__legend__right">
                        <PieLegend
                            v-for="legend in secondColumnLegendData"
                            :key="legend.key"
                            class="allocation_pie_legend cursor"
                            :lenged-color="legend.lengedColor"
                            :legend-name="legend.legendName"
                            :percentage="legend.percentage"
                            @mouseover="highlightFn(legend.key, true)"
                            @mouseleave="highlightFn(legend.key, false)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import { OPACITY_PIE_COLOR_LIST, PIE_COLOR_LIST, UNIT_SIGNS } from '@/constants/relayers';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    import { formatString } from '@/utils/stringTools';
    import PieLegend from './PieLegend.vue';
    import * as echarts from 'echarts';
    import { LoadingType, NoDataType, TOKEN_DEFAULT_ICON } from '@/constants';
    import { ITokenList, PieLegendData } from '@/types/interface/address.interface';
    import { getDenomKey } from '@/helper/baseDenomHelper';
    import { calculatePercentage } from '@/utils/calculate';
    import { PieData } from '@/types/interface/relayers.interface';
    import BigNumber from 'bignumber.js';
    import { PIE_OTHERS } from '@/constants/index';

    interface IProps {
        data?: ITokenList;
        addressAllocationLoading?: boolean;
        addressAllocationType?: NoDataType;
    }
    const props = defineProps<IProps>();
    const { data, addressAllocationLoading, addressAllocationType } = toRefs(props);

    // todo dj 待抽离
    const totalValue = ref('--');
    const totalCount = ref(0);
    const legendData = ref<PieLegendData[]>([]);

    const firstColumnLegendData = computed(() => {
        return legendData.value.length > 0 ? legendData.value.slice(0, 4) : [];
    });
    const secondColumnLegendData = computed(() => {
        return legendData.value.length > 4 ? legendData.value.slice(4, 8) : [];
    });
    const getTotalValue = (totalValue: string) => {
        if (!totalValue || Number(totalValue) === 0) return '0';
        return formatBigNumber(totalValue, 2);
    };
    const addressAllocationChartDom = ref();
    const isShowAddressAllocationChart = computed(() => {
        return !addressAllocationLoading?.value && !addressAllocationType?.value;
    });
    const addressAllocationOption: any = {
        tooltip: {
            trigger: 'item',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;z-index:1;',
            formatter: (params: any) => {
                return `<div style="display: flex; align-items: center; transform: translate(6px, 0)">
                            <div
                                style="
                                    display: flex;
                                    margin-left: 4px;
                                    background: #ffffff;
                                    box-shadow: 0px 2px 8px 0px #d9deec;
                                    border-radius: 4px;
                                    border: 1px solid #d9dfee;
                                "
                            >
                                <div>
                                    <div style="display: flex; justify-content: flex-start; padding: 12px 12px 6px">
                                        <img src="${
                                            params.data.imgUrl
                                        }" style="width: 20px; height: 20px" />
                                        <span
                                            style="
                                                margin-left: 8px;
                                                font-size: 16px;
                                                font-family: 'GolosUI_Medium';
                                                font-weight: 500;
                                                color: #000000;
                                                line-height: 20px;
                                            "
                                            >${formatString(params.data.symbol)}</span
                                        >
                                    </div>
                                    <div style="display: flex; justify-content: flex-start; padding: 0px 12px 14px">
                                        <span
                                            style="
                                                font-size: 14px;
                                                font-family: 'GolosUI_Medium';
                                                color: #000;
                                                font-weight: 500;
                                                line-height: 18px;
                                            "
                                            >Value:
                                        </span>
                                        <span
                                            style="
                                                margin-left: 8px;
                                                font-size: 14px;
                                                color: rgba(0, 0, 0, 0.75);
                                                font-family: 'GolosUIWebRegular';
                                                font-weight: 400;
                                                line-height: 18px;
                                            "
                                            >${UNIT_SIGNS} ${formatBigNumber(
                    params.data.value,
                    0
                )}</span
                                        ></div
                                    >
                                </div>
                            </div>
                        </div>`;
            },
            confine: false
        },
        legend: {
            show: false
        },
        series: [
            {
                type: 'pie',
                silent: true,
                radius: [78, 92],
                minAngle: 2,
                center: 'center',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: true,
                    formatter: `{text|Assets}\n\r\n\r{total|${totalCount.value}}`,
                    top: 'middle',
                    position: 'center',
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: 'rgba(0, 0, 0, 0.75)',
                            fontWeight: 400,
                            fontFamily: 'GolosUIWebRegular',
                            fontSize: 16,
                            lineHeight: 16
                        },
                        total: {
                            color: '#000000',
                            fontWeight: 600,
                            fontFamily: 'GolosUIWebRegular',
                            fontSize: 24,
                            lineHeight: 24
                        }
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            },
            {
                type: 'pie',
                radius: [92, 116],
                center: 'center',
                minAngle: 2,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                emphasis: {
                    scaleSize: 5
                },
                data: []
            }
        ]
    };
    let addressAllocationChart: echarts.ECharts;
    const addressAllocationChartSizeFn = () => {
        addressAllocationChart && addressAllocationChart.resize();
    };
    const handleChangeNoDataOption = () => {
        addressAllocationOption.series[0].itemStyle.color = '#F9F9F9';
        addressAllocationOption.series[0].data = [0];
        addressAllocationOption.series[1].itemStyle.color = '#F2F2F2';
        addressAllocationOption.series[1].data = [0];
        addressAllocationOption.series[1].silent = true;
    };
    onMounted(async () => {
        addressAllocationChart = echarts.init(addressAllocationChartDom.value as HTMLElement);
        window.addEventListener('resize', addressAllocationChartSizeFn);
        watch(
            () => data?.value,
            (newValue) => {
                if (newValue) {
                    totalValue.value = getTotalValue(newValue.total_value);
                    totalCount.value = newValue.tokens.length;
                    addressAllocationOption.series[0].label.formatter = `{text|Assets}\n\r\n\r{total|${totalCount.value}}`;
                    if (totalCount.value <= 0) {
                        handleChangeNoDataOption();
                        legendData.value = [];
                    } else {
                        const allocationValueData: PieData[] = [];
                        const allocationValueOpacityData: PieData[] = [];
                        const templegendData: PieLegendData[] = [];
                        const tokens = [...newValue.tokens];
                        const needMaxNum = 8;
                        if (tokens.length > needMaxNum) {
                            const spliceValueDenomList = tokens.splice(needMaxNum - 1);
                            const spliceValueTotal = spliceValueDenomList.reduce(
                                (total, current) => {
                                    return new BigNumber(total)
                                        .plus(current.denom_value)
                                        .toString();
                                },
                                '0'
                            );
                            tokens.push({
                                denom: PIE_OTHERS,
                                chain: '',
                                base_denom: PIE_OTHERS,
                                base_denom_chain: PIE_OTHERS,
                                denom_type: 'Other',
                                denom_amount: '',
                                denom_avaliable_amount: '',
                                price: 0,
                                denom_value: spliceValueTotal,
                                displayAmount: '',
                                displayAvaliableAmount: '',
                                chainInfo: undefined
                            });
                        }
                        tokens.forEach((token, i) => {
                            const uniqueName = getDenomKey(
                                token.base_denom_chain,
                                token.base_denom
                            );
                            const percent = calculatePercentage(
                                token.denom_value,
                                newValue.total_value,
                                2
                            );
                            const symbol = token.chainInfo?.symbol || token.denom;
                            allocationValueData.push({
                                name: uniqueName,
                                symbol: symbol,
                                value: token.denom_value,
                                imgUrl: token.chainInfo?.icon || TOKEN_DEFAULT_ICON,
                                percent,
                                itemStyle: {
                                    color: PIE_COLOR_LIST[i]
                                }
                            });
                            allocationValueOpacityData.push({
                                value: token.denom_value,
                                itemStyle: {
                                    color: OPACITY_PIE_COLOR_LIST[i]
                                }
                            });
                            templegendData.push({
                                key: uniqueName,
                                lengedColor: PIE_COLOR_LIST[i],
                                percentage: percent + '%',
                                legendName: symbol
                            });
                        });
                        legendData.value = [...templegendData];
                        addressAllocationOption.series[0].data = [...allocationValueOpacityData];
                        addressAllocationOption.series[1].data = [...allocationValueData];
                    }
                    nextTick(() => {
                        addressAllocationChart.resize();
                        addressAllocationChart.setOption(addressAllocationOption, true);
                    });
                }
            },
            {
                immediate: true
            }
        );
    });
    const highlightFn = (key: string, isOpen: boolean) => {
        addressAllocationChart &&
            addressAllocationChart.dispatchAction({
                type: isOpen ? 'highlight' : 'downplay',
                seriesIndex: 1,
                name: key
            });
    };
    onBeforeUnmount(() => {
        window.removeEventListener('resize', addressAllocationChartSizeFn);
    });
</script>

<style lang="less" scoped>
    .address_allocation {
        max-width: 420px;
        min-width: 362px;
        .flex(column);
        :deep(.info_card__primary) {
            height: 476px;
            padding: 0;
            .flex(column,nowrap);
            & > div {
                flex: 1;
            }
        }
        &__chart_c {
            &__title {
                margin: 16px 0 0 24px;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
                line-height: 18px;
                &__key {
                    margin-right: 8px;
                }
            }
            &__content_c {
                .flex(column);
                &__chart {
                    width: 100%;
                    height: 283px;
                }
                &__legend {
                    .flex(row);
                    padding: 24px 24px 0 24px;
                    &__left {
                        flex: 1;
                        margin-right: 32px;
                        .allocation_pie_legend {
                            justify-content: flex-end;
                            margin-bottom: 8px;
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                    &__right {
                        flex: 1;
                        .allocation_pie_legend {
                            margin-bottom: 8px;
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
