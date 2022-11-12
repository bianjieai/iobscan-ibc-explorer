<template>
    <InfoCard
        class="relayer_details__charts_wrap__right__relayed_trend_wrap"
        icon="icon-a-relayedassets"
        title="Related Assets"
        :is-show-choose-btn="true"
        :default-choose-btn="relayedAssetsChoose"
        @change-choose-btn="relayedAssetsChooseBtnFn"
    >
        <div ref="relayedValueDom" style="width: 380px; height: 300px"></div>
    </InfoCard>
</template>

<script setup lang="ts">
    import * as echarts from 'echarts';
    // todo dj related assets 逻辑抽离
    const relayedAssetsChoose = ref(0);
    const relayedValueDom = ref<HTMLElement>();
    const relayedAssetsChooseBtnFn = (index: number) => {
        relayedAssetsChoose.value = index;
    };
    onMounted(() => {
        const relayedValueChart = echarts.init(relayedValueDom.value as HTMLElement);
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
        const totalRelayedValue = '200';
        const tokenTotal = 5;
        let option = {
            title: {
                text: `Total Relayed Value $${totalRelayedValue}`,
                textStyle: {
                    color: '#000000',
                    fontWeight: 400,
                    fontFamily: 'GolosUIWebRegular',
                    fontSize: 14,
                    lineHeight: 18
                }
            },
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
                // todo dj 距离需要控制
                // top: 100,
                bottom: '15%',
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
                    radius: [78, 90],
                    // todo dj 距离需调整
                    center: ['32%', '55%'],
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
                    radius: [91, 111],
                    // todo dj 距离需调整
                    center: ['32%', '55%'],
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
                            name: 'Search Engine',
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
        // 点击取消之后，立即再次选中
        relayedValueChart.on('legendselectchanged', (params: any) => {
            relayedValueChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        relayedValueChart.setOption(option, true);
        window.addEventListener('resize', () => {
            relayedValueChart.resize();
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
