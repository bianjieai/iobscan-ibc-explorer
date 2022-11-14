<template>
    <InfoCard
        class="related_asset_c"
        icon="icon-a-relayedassets"
        title="Related Assets"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedAssetsChoose"
        @change-choose-btn="relayedAssetsChooseBtnFn"
    >
        <div class="related_asset_c__value">
            <div class="related_asset_c__value__title">Total related Value $200</div>
            <div class="related_asset_c__value__chart_warp">
                <!-- todo dj 接口逻辑待处理 -->
                <!-- <loading-component :type="LoadingType.container" /> -->
                <!-- <no-datas :text="nodata || network" /> -->
                <div ref="relayedValueDom" class="related_asset_c__value__chart_warp__chart"></div>
            </div>
        </div>
        <div class="related_asset_c__fee">
            <div class="related_asset_c__fee__title">Total Fee Cost $200</div>
            <div class="related_asset_c__fee__chart_warp">
                <div
                    ref="relayedFeeDom"
                    class="related_asset_c__fee__chart_warp__chart two_legend"
                ></div>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    // import { LoadingType } from '@/constants';
    // todo dj related assets 逻辑抽离
    import * as echarts from 'echarts';
    import { useWindowSize } from '@vueuse/core';
    const relayedAssetsChoose = ref(0);
    const relayedValueDom = ref<HTMLElement>();
    const relayedFeeDom = ref<HTMLElement>();
    const relayedAssetsChooseBtnFn = (index: number) => {
        relayedAssetsChoose.value = index;
    };
    const pieColorList = [
        'rgba(13, 71, 161, 1)',
        'rgba(47, 84, 235, 1)',
        'rgba(250, 140, 22, 1)',
        'rgba(41, 121, 255, 1)',
        'rgba(24, 144, 255, 1)',
        'rgba(89, 126, 247, 1)',
        'rgba(250, 173, 20, 1)',
        'rgba(64, 169, 255, 1)',
        'rgba(133, 165, 255, 1)',
        'rgba(130, 177, 255, 1)',
        'rgba(255, 192, 105, 1)',
        'rgba(255, 214, 102, 1)'
    ];
    const opacityPieColorList = [
        'rgba(13, 71, 161, 0.15)',
        'rgba(47, 84, 235, 0.15)',
        'rgba(250, 140, 22, 0.15)',
        'rgba(41, 121, 255, 0.15)',
        'rgba(24, 144, 255, 0.15)',
        'rgba(89, 126, 247, 0.15)',
        'rgba(250, 173, 20, 0.15)',
        'rgba(64, 169, 255, 0.15)',
        'rgba(133, 165, 255, 0.15)',
        'rgba(130, 177, 255, 0.15)',
        'rgba(255, 192, 105, 0.15)',
        'rgba(255, 214, 102, 0.15)'
    ];
    const tokenTotal = 5;
    const baseOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: null,
            borderWidth: 0,
            padding: 0,
            extraCssText: 'box-shadow: 0 0 0 transparent;',
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
                                              <img
                                                  src="https://iobscan.io/resources/xp-tokens/cosmoshub-4.png"
                                                  style="width: 20px; height: 20px"
                                              />
                                              <span
                                                  style="
                                                      margin-left: 8px;
                                                      font-size: 16px;
                                                      font-family: GolosUI-Medium, GolosUI;
                                                      font-weight: 500;
                                                      color: #000000;
                                                      line-height: 20px;
                                                  "
                                                  >${params.name}</span
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
                                                  >${params.data.value}</span
                                              >
                                              <span
                                                  style="
                                                      font-size: 14px;
                                                      font-family: GolosUI-Medium, GolosUI;
                                                      font-weight: 500;
                                                      color: rgba(0, 0, 0, 0.34);
                                                      line-height: 18px;
                                                  "
                                                  >/${params.percent}%</span
                                              >
                                          </div>
                                      </div>
                                  </div>
                              </div>`;
            }
        },
        legend: {
            top: null,
            bottom: 10,
            right: 0,
            orient: 'vertical',
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 9,
            padding: 0,
            textStyle: {
                padding: [1.4, 0, 0, 0],
                color: '#000000',
                fontWeight: 400,
                fontFamily: 'GolosUIWebRegular',
                fontSize: 12
            }
        },
        series: [
            {
                type: 'pie',
                silent: true,
                radius: [68, 80],
                center: [108, '50%'],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: true,
                    top: 'middle',
                    position: 'center',
                    formatter: `{text| IBC Token}\n\r\n\r{total|${tokenTotal}}`,
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: '#000000',
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
                data: [
                    {
                        value: 1048,
                        itemStyle: {
                            color: opacityPieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        itemStyle: {
                            color: opacityPieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        itemStyle: {
                            color: opacityPieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        itemStyle: {
                            color: opacityPieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        itemStyle: {
                            color: opacityPieColorList[4]
                        }
                    }
                ]
            },
            {
                type: 'pie',
                radius: [80, 100],
                center: [108, '50%'],
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
                    scaleSize: 8
                },
                data: [
                    {
                        value: 1048,
                        name: 'Search6...',
                        itemStyle: {
                            color: pieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        name: 'Direct',
                        itemStyle: {
                            color: pieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        name: 'Email',
                        itemStyle: {
                            color: pieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        name: 'Union Ads',
                        itemStyle: {
                            color: pieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        name: 'Video Ads',
                        itemStyle: {
                            color: pieColorList[4]
                        }
                    }
                ]
            }
        ]
    };
    const { width: widthClient } = useWindowSize();
    const relayedValueOption: any = {
        ...baseOption
    };
    const relayedFeeOption: any = {
        ...baseOption
    };
    const relayedValueChartLegendTwo = ref(false); // relayedValueOption.series[0].data.length <= 6
    const relayedFeeChartLegendTwo = ref(true); // relayedValueOption.series[0].data.length > 6
    const changeRelayedValueOption = () => {
        if (widthClient.value > 1183) {
            if (relayedValueChartLegendTwo.value) {
                relayedValueOption.legend.top = '35%';
            } else {
                relayedValueOption.legend.top = null;
            }
            relayedValueOption.legend.bottom = 10;
            relayedValueOption.legend.right = 0;
            relayedValueOption.series[0].radius = [68, 80];
            relayedValueOption.series[0].center = [108, '50%'];
            relayedValueOption.series[1].radius = [80, 100];
            relayedValueOption.series[1].center = [108, '50%'];
        } else if (widthClient.value > 767) {
            if (relayedValueChartLegendTwo.value) {
                relayedValueOption.legend.top = '25%';
                relayedValueOption.legend.bottom = 10;
                relayedValueOption.legend.right = 10;
                relayedValueOption.series[0].radius = [52, 62];
                relayedValueOption.series[0].center = [85, '53%'];
                relayedValueOption.series[1].radius = [62, 77];
                relayedValueOption.series[1].center = [85, '53%'];
            } else {
                relayedValueOption.legend.top = null;
                relayedValueOption.legend.bottom = 10;
                relayedValueOption.legend.right = 0;
                relayedValueOption.series[0].radius = [52, 62];
                relayedValueOption.series[0].center = [85, '53%'];
                relayedValueOption.series[1].radius = [62, 77];
                relayedValueOption.series[1].center = [85, '53%'];
            }
        }
    };
    const changeRelayedFeeOptionOption = () => {
        if (widthClient.value > 1183) {
            if (relayedFeeChartLegendTwo.value) {
                relayedFeeOption.legend.top = '35%';
            } else {
                relayedFeeOption.legend.top = null;
            }
            relayedFeeOption.legend.bottom = 10;
            relayedFeeOption.legend.right = 0;
            relayedFeeOption.series[0].radius = [68, 80];
            relayedFeeOption.series[0].center = [108, '50%'];
            relayedFeeOption.series[1].radius = [80, 100];
            relayedFeeOption.series[1].center = [108, '50%'];
        } else if (widthClient.value > 767) {
            if (relayedFeeChartLegendTwo.value) {
                relayedFeeOption.legend.top = '25%';
                relayedFeeOption.legend.bottom = 10;
                relayedFeeOption.legend.right = 10;
                relayedFeeOption.series[0].radius = [52, 62];
                relayedFeeOption.series[0].center = [85, '53%'];
                relayedFeeOption.series[1].radius = [62, 77];
                relayedFeeOption.series[1].center = [85, '53%'];
            } else {
                relayedFeeOption.legend.top = null;
                relayedFeeOption.legend.bottom = 10;
                relayedFeeOption.legend.right = 0;
                relayedFeeOption.series[0].radius = [52, 62];
                relayedFeeOption.series[0].center = [85, '53%'];
                relayedFeeOption.series[1].radius = [62, 77];
                relayedFeeOption.series[1].center = [85, '53%'];
            }
        }
    };
    onMounted(async () => {
        const relayedValueChart = echarts.init(relayedValueDom.value as HTMLElement);
        // todo dj  三屏适配
        //  pc 端
        //  数量小于6
        // legend  top: null,bottom: 10,right: 0,
        // series [0] radius: [68, 80],center: [108, '50%'],
        // series [1] radius: [80, 100],center: [108, '50%'],
        // 数量大于6
        // legend  top: '35%',bottom: 10,right: 0,
        // series [0] radius: [68, 80],center: [108, '50%'],
        // series [1] radius: [80, 100],center: [108, '50%'],

        relayedValueOption.series = [
            {
                type: 'pie',
                silent: true,
                radius: [68, 80],
                center: [108, '50%'],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: true,
                    top: 'middle',
                    position: 'center',
                    formatter: `{text| IBC Token}\n\r\n\r{total|${tokenTotal}}`,
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: '#000000',
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
                data: [
                    {
                        value: 1048,
                        itemStyle: {
                            color: opacityPieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        itemStyle: {
                            color: opacityPieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        itemStyle: {
                            color: opacityPieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        itemStyle: {
                            color: opacityPieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        itemStyle: {
                            color: opacityPieColorList[4]
                        }
                    }
                ]
            },
            {
                type: 'pie',
                radius: [80, 100],
                center: [108, '50%'],
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
                    scaleSize: 8
                },
                data: [
                    {
                        value: 1048,
                        name: 'Search6...',
                        itemStyle: {
                            color: pieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        name: 'Direct',
                        itemStyle: {
                            color: pieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        name: 'Email',
                        itemStyle: {
                            color: pieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        name: 'Union Ads',
                        itemStyle: {
                            color: pieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        name: 'Video Ads',
                        itemStyle: {
                            color: pieColorList[4]
                        }
                    }
                ]
            }
        ];

        // 点击取消之后，立即再次选中
        relayedValueChart.on('legendselectchanged', (params: any) => {
            relayedValueChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        changeRelayedValueOption();
        relayedValueChart.setOption(relayedValueOption, true);
        window.addEventListener('resize', () => {
            changeRelayedValueOption();
            relayedValueChart && relayedValueChart.setOption(relayedValueOption, true);
            relayedValueChart && relayedValueChart.resize();
        });
    });
    onMounted(async () => {
        const relayedFeeChart = echarts.init(relayedFeeDom.value as HTMLElement);
        relayedFeeOption.series = [
            {
                type: 'pie',
                silent: true,
                radius: [68, 80],
                center: [108, '50%'],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    opacity: 1
                },
                label: {
                    show: true,
                    top: 'middle',
                    position: 'center',
                    formatter: `{text| IBC Token}\n\r\n\r{total|${tokenTotal}}`,
                    padding: [7, 0, 0, 0],
                    opacity: 1,
                    rich: {
                        text: {
                            color: '#000000',
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
                data: [
                    {
                        value: 1048,
                        itemStyle: {
                            color: opacityPieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        itemStyle: {
                            color: opacityPieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        itemStyle: {
                            color: opacityPieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        itemStyle: {
                            color: opacityPieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        itemStyle: {
                            color: opacityPieColorList[4]
                        }
                    },
                    {
                        value: 1048,
                        itemStyle: {
                            color: opacityPieColorList[5]
                        }
                    },
                    {
                        value: 735,
                        itemStyle: {
                            color: opacityPieColorList[6]
                        }
                    },
                    {
                        value: 580,
                        itemStyle: {
                            color: opacityPieColorList[7]
                        }
                    },
                    {
                        value: 484,
                        itemStyle: {
                            color: opacityPieColorList[8]
                        }
                    },
                    {
                        value: 300,
                        itemStyle: {
                            color: opacityPieColorList[9]
                        }
                    }
                ]
            },
            {
                type: 'pie',
                radius: [80, 100],
                center: [108, '50%'],
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
                    scaleSize: 8
                },
                data: [
                    {
                        value: 1048,
                        name: 'Search6...',
                        itemStyle: {
                            color: pieColorList[0]
                        }
                    },
                    {
                        value: 735,
                        name: 'Direct1',
                        itemStyle: {
                            color: pieColorList[1]
                        }
                    },
                    {
                        value: 580,
                        name: 'Email1',
                        itemStyle: {
                            color: pieColorList[2]
                        }
                    },
                    {
                        value: 484,
                        name: 'Union1',
                        itemStyle: {
                            color: pieColorList[3]
                        }
                    },
                    {
                        value: 300,
                        name: 'Video1',
                        itemStyle: {
                            color: pieColorList[4]
                        }
                    },
                    {
                        value: 1048,
                        name: 'Search2...',
                        itemStyle: {
                            color: pieColorList[5]
                        }
                    },
                    {
                        value: 735,
                        name: 'Direct...',
                        itemStyle: {
                            color: pieColorList[6]
                        }
                    },
                    {
                        value: 580,
                        name: 'Email2',
                        itemStyle: {
                            color: pieColorList[7]
                        }
                    },
                    {
                        value: 484,
                        name: 'UnionA...',
                        itemStyle: {
                            color: pieColorList[8]
                        }
                    },
                    {
                        value: 300,
                        name: 'VideoA...',
                        itemStyle: {
                            color: pieColorList[9]
                        }
                    }
                ]
            }
        ];
        changeRelayedFeeOptionOption();
        relayedFeeChart.setOption(relayedFeeOption, true);
        relayedFeeChart.on('legendselectchanged', (params: any) => {
            relayedFeeChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        window.addEventListener('resize', () => {
            changeRelayedFeeOptionOption();
            relayedFeeChart && relayedFeeChart.setOption(relayedFeeOption, true);
            relayedFeeChart && relayedFeeChart.resize();
        });
    });
</script>

<style lang="less" scoped>
    .related_asset_c {
        :deep(.info_card__primary) {
            padding: 0;
            height: 589px;
            .flex(column, nowrap);
        }
        &__value {
            flex: 1;
            padding: 16px 0 0 0;
            .flex(column, nowrap);
            &__title {
                padding-left: 24px;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
                line-height: 18px;
            }
            &__chart_warp {
                width: 100%;
                flex: 1;
                .flex(row,nowrap,center,center);
                &__chart {
                    width: 295px;
                    height: 213px;
                }
                .two_legend {
                    width: 100%;
                    height: 213px;
                    padding: 0 27px;
                }
            }
        }
        &__fee {
            flex: 1;
            padding: 16px 0 0 0;
            .flex(column, nowrap);
            &__title {
                padding-left: 24px;
                font-size: 14px;
                font-weight: 400;
                color: #000000;
                line-height: 18px;
            }
            &__chart_warp {
                width: 100%;
                flex: 1;
                .flex(row,nowrap,center,center);
                &__chart {
                    width: 290px;
                    height: 213px;
                }
                .two_legend {
                    width: 100%;
                    height: 213px;
                    padding: 0 27px;
                }
            }
        }
    }
    @media screen and (max-width: 1183px) {
        .related_asset_c {
            :deep(.info_card__primary) {
                height: 250px;
                flex-direction: row;
            }
            &__value {
                flex: 1;
                padding: 0;
                margin: 16px 0 39px 0;
                border-right: 1px solid #eaeaea;
                &__title {
                }
                &__chart_warp {
                    &__chart {
                        width: 245px;
                        height: 180px;
                    }
                    .two_legend {
                        width: 333px;
                        height: 180px;
                        padding: 0;
                    }
                }
            }
            &__fee {
                flex: 1;
                padding: 0;
                margin: 16px 0 39px 0;
                border-right: 1px solid #eaeaea;
                &__title {
                }
                &__chart_warp {
                    &__chart {
                        width: 245px;
                        height: 180px;
                    }
                    .two_legend {
                        width: 333px;
                        height: 180px;
                        padding: 0;
                    }
                }
            }
        }
    }
</style>
