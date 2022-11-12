<template>
    <InfoCard
        class="relayed_trend_c"
        icon="icon-Trend"
        title="Last 30D Relayed Trend"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedTrendChoose"
        @change-choose-btn="relayedTrendChooseBtnFn"
    >
        <!-- todo dj 由于有滚动条,echart 中的边距改成 dom css -->
        <div class="relayed_trend_c__chart">
            <div ref="relayedTrendDom" style="width: 756px; height: 324px"></div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    // todo dj relayedTrend 逻辑抽离
    import * as echarts from 'echarts';
    const relayedTrendChoose = ref(0);
    const relayedTrendDom = ref<HTMLElement>();
    const relayedTrendChooseBtnFn = (index: number) => {
        relayedTrendChoose.value = index;
    };
    onMounted(() => {
        const relayedTrendChart = echarts.init(relayedTrendDom.value as HTMLElement);
        let option = {
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
                                                >${params.data}</span
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
                    data: [
                        '10-20',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        '10-20',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        '10-20',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        '10-20',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        '10-20',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat'
                    ],
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
                    data: [
                        10,
                        52,
                        100,
                        {
                            value: 500,
                            itemStyle: {
                                color: 'blue'
                            }
                        },
                        390,
                        330,
                        10,
                        52,
                        100,
                        334,
                        390,
                        330,
                        10,
                        52,
                        100,
                        334,
                        390,
                        330,
                        10,
                        52,
                        100,
                        334,
                        390,
                        330,
                        10,
                        52,
                        100,
                        334,
                        390,
                        330
                    ],
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
        relayedTrendChart.setOption(option, true);
        window.addEventListener('resize', () => {
            relayedTrendChart.resize();
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
