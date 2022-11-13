<template>
    <InfoCard
        class="relayed_trend_c"
        icon="icon-Trend"
        title="Last 30D Relayed Trend"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedTrendChoose"
        @change-choose-btn="relayedTrendChooseBtnFn"
    >
        <!-- todo loading nodata network  -->
        <!-- todo dj 由于有滚动条,echart 中的边距改成 dom css -->
        <div class="relayed_trend_c__chart">
            <div ref="relayedTrendDom" style="width: 756px; height: 324px"></div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    // todo dj relayedTrend 逻辑抽离
    import { BigNumber } from 'bignumber.js';
    import { getRelayedTrendMock } from '@/api/relayers';
    import { API_CODE } from '@/constants/apiCode';
    import { RelayerTrendData, BarData } from '@/types/interface/relayers.interface';
    import * as echarts from 'echarts';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    const relayedTrendChoose = ref(0);
    const relayedTrendDom = ref<HTMLElement>();
    const route = useRoute();
    const relayerId: string = route.params.relayerId as string;
    const relayedTrendLoading = ref(false);
    let relayedTrendData = reactive<RelayerTrendData>({
        date: [],
        txs: [],
        txsValue: []
    });
    const getRelayedTrendData = async () => {
        try {
            // todo dj mock => api
            const { code, data, message } = await getRelayedTrendMock({
                relayer_id: relayerId
            });
            relayedTrendLoading.value = false;
            if (code === API_CODE.success) {
                if (data && data.length > 0) {
                    const originDates: string[] = [];
                    const originTxs: number[] = [];
                    const originTxsValues: string[] = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        originDates.push(item.date);
                        originTxs.push(item.txs);
                        originTxsValues.push(item.txs_value);
                    }
                    const maxTxs = BigNumber.max.apply(null, originTxs).toString();
                    const maxTxsValue = BigNumber.max.apply(null, originTxsValues).toString();
                    const txs: BarData[] = originTxs.map((txs) => {
                        return {
                            value: txs,
                            itemStyle: {
                                // todo dj 最高的柱子的颜色，blue待替换
                                color:
                                    txs.toString() === maxTxs
                                        ? 'blue'
                                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: 'rgba(61,80,255,0.6)' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                            }
                        };
                    });
                    const txsValue: BarData[] = originTxsValues.map((txsValue) => {
                        return {
                            value: txsValue,
                            itemStyle: {
                                // todo dj 最高的柱子的颜色，blue待替换
                                color:
                                    txs.toString() === maxTxsValue
                                        ? 'blue'
                                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                              { offset: 0, color: 'rgba(61,80,255,0.6)' },
                                              { offset: 1, color: 'rgba(61,80,255,0.35)' }
                                          ])
                            }
                        };
                    });
                    relayedTrendData.date = originDates.map((originData) => {
                        const linkSymbol = '-';
                        return originData.split(linkSymbol).splice(1).join(linkSymbol);
                    });
                    relayedTrendData.txs = txs;
                    relayedTrendData.txsValue = txsValue;
                } else {
                    relayedTrendData = {
                        date: [],
                        txs: [],
                        txsValue: []
                    };
                }
            } else {
                console.error(message);
            }
        } catch (error) {
            relayedTrendLoading.value = false;
            console.error(error);
        }
    };
    let option: any = {
        grid: {
            left: 24,
            right: 24,
            top: 32,
            bottom: 24,
            containLabel: true
        },
        tooltip: {
            trigger: 'item',
            position: 'top',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;',
            formatter: (params: any) => {
                // <div style="width: 100%; height: 8px; background-color: rgba(61, 80, 255, 0.1)"></div>
                return `<div style="display: flex; flex-direction: column; align-items: center; transform: translate(0,6px);">
                                    <div
                                        style="
                                            display: flex;
                                            flex-direction: column;
                                            margin-bottom: 4px;
                                            background: #ffffff;
                                            box-shadow: 0px 2px 8px 0px #d9deec;
                                            border-radius: 4px;
                                            border: 1px solid #d9dfee;
                                        "
                                    >
                                        <div style="display: flex; justify-content: flex-start; padding: 12px 12px 8px">
                                            <span
                                                style="
                                                    font-size: 14px;
                                                    font-family: 'GolosUI_Medium';
                                                    color: #000;
                                                    font-weight: 500;
                                                    line-height: 18px;
                                                "
                                                >Transfers:
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
                                                >${formatBigNumber(params.data.value, 0)}</span
                                            >
                                        </div>
                                        <div style="display: flex; justify-content: flex-start; padding: 0px 12px 12px">
                                            <span
                                                style="
                                                    font-size: 14px;
                                                    font-family: 'GolosUI_Medium';
                                                    color: #000;
                                                    font-weight: 500;
                                                    line-height: 18px;
                                                "
                                                >Date:
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
                                                >${params.name}</span
                                            >
                                        </div>
                                    </div>
                                    <div
                                        style="
                                            border-top: 8px solid #3d50ff;
                                            border-right: 5px solid transparent;
                                            border-bottom: 8px solid transparent;
                                            border-left: 5px solid transparent;
                                        "
                                    ></div>
                                </div>`;
            }
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    margin: 16,
                    textStyle: {
                        color: '#000',
                        fontSize: 14,
                        fontFamily: 'GolosUIWebRegular',
                        fontWeight: 400,
                        lineHeight: 18
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 3,
                    margin: 8,
                    textStyle: {
                        color: '#000',
                        fontSize: 14,
                        fontFamily: 'GolosUIWebRegular',
                        fontWeight: 'normal',
                        lineHeight: 18
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0,0,0,0.15)',
                        width: 2
                    }
                }
            }
        ],
        series: [
            {
                type: 'bar',
                barWidth: 10,
                data: [],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(61,80,255,0.6)' },
                        { offset: 1, color: 'rgba(61,80,255,0.35)' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#3D50FF' },
                            { offset: 1, color: 'rgba(61,80,255,0.35)' }
                        ])
                    }
                }
            }
        ]
    };
    let relayedTrendChart: echarts.ECharts;
    const relayedTrendChooseBtnFn = (index: number) => {
        relayedTrendChoose.value = index;
        option.series[0].data =
            relayedTrendChoose.value === 0 ? relayedTrendData.txs : relayedTrendData.txsValue;
        relayedTrendChart && relayedTrendChart.setOption(option, true);
    };
    onMounted(async () => {
        await getRelayedTrendData();
        relayedTrendChart = echarts.init(relayedTrendDom.value as HTMLElement);
        option.xAxis[0].data = relayedTrendData.date;
        option.series[0].data =
            relayedTrendChoose.value === 0 ? relayedTrendData.txs : relayedTrendData.txsValue;
        relayedTrendChart.setOption(option, true);
        window.addEventListener('resize', () => {
            relayedTrendChart && relayedTrendChart.resize();
        });
    });
</script>

<style lang="less" scoped>
    .relayed_trend_c {
        :deep(.info_card__primary) {
            padding: 0;
        }
        &__chart {
        }
    }
</style>
