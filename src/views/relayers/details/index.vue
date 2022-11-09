<template>
    <PageContainer class="relayer_details">
        <PageTitle
            :title="`${relayerName} Relayer Details`"
            :title-icon="'icon-a-chainsserved'"
            :subtitle="`A total of ${servedChains} blockchains served`"
            :img-src="relayerIcon"
        />
        <layer-block class="relayer_details__statistic">
            <statistic-list type="horizontal" :msg="relayerInfo" />
        </layer-block>
        <InfoCard icon="icon-a-ChannelPairs" title="Channel Pairs">
            <ChannelPairsInfo v-if="channelPairsInfo" :channel-pairs-info="channelPairsInfo" />
            <no-datas v-else />
        </InfoCard>
        <div class="relayer_details__charts_wrap">
            <div class="relayer_details__charts_wrap__left">
                <div class="relayer_details__charts_wrap__left__top">
                    <InfoCard
                        class="relayer_details__charts_wrap__left__top__relayed_trend_wrap"
                        icon="icon-Trend"
                        title="Last 30D Relayed Trend"
                        :is-show-choose-btn="true"
                        :default-choose-btn="relayedTrendChoose"
                        @change-choose-btn="relayedTrendChooseBtnFn"
                    >
                        <!-- todo dj 由于有滚动条,echart 中的边距改成 dom css -->
                        <div ref="relayedTrendDom" style="width: 756px; height: 324px"></div>
                    </InfoCard>
                </div>
                <div class="relayer_details__charts_wrap__left__bottom">
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__transfer_type_wrap"
                        icon="icon-a-transfertype"
                        title="IBC Transfer Type"
                    >
                        <div class="relayer_details__charts_wrap__left__bottom__transfer_type">
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.receive.label"
                                :txs-count="recvPacketTxs"
                                :txs-percent="recvPacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                            />
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.acknowledge.label"
                                :txs-count="acknowledgePacketTxs"
                                :txs-percent="acknowledgePacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                                :process-color="'#40A9FF'"
                            />
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.timeout.label"
                                :txs-count="timeoutPacketTxs"
                                :txs-percent="timeoutPacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                                :process-color="'#FAAD14'"
                            />
                        </div>
                    </InfoCard>
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__success_rate"
                        icon="icon-a-successrate"
                        title="Success Rate"
                    >
                        <SuccessRateChart :success-rate-percent="successRatePercent" />
                    </InfoCard>
                </div>
            </div>
            <div class="relayer_details__charts_wrap__right">
                <InfoCard
                    class="relayer_details__charts_wrap__right__relayed_trend_wrap"
                    icon="icon-a-relayedassets"
                    title="Related Assets"
                    :is-show-choose-btn="true"
                    :default-choose-btn="0"
                >
                    <div ref="relayedTrendDom" style="width: 756px; height: 324px"></div>
                </InfoCard>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import ChannelPairsInfo from './components/ChannelPairsInfo.vue';
    import TransferTypeChart from './components/TransferTypeChart.vue';
    import SuccessRateChart from './components/SuccessRateChart.vue';
    import { TRANSFER_TYPE } from '@/constants';
    import {
        useGetRelayerDetailsInfo,
        useGetSuccessRatePercent,
        useGetTransferTypeData
    } from './composable';
    import * as echarts from 'echarts';
    const {
        relayerIcon,
        relayerName,
        servedChains,
        relayedTotalTxs,
        relayedSuccessTxs,
        relayerInfo,
        channelPairsInfo
    } = useGetRelayerDetailsInfo();
    const {
        recvPacketTxs,
        acknowledgePacketTxs,
        timeoutPacketTxs,
        totalTxsCount,
        recvPacketTxsPercent,
        acknowledgePacketTxsPercent,
        timeoutPacketTxsPercent
    } = useGetTransferTypeData();
    const { successRatePercent } = useGetSuccessRatePercent(relayedSuccessTxs, relayedTotalTxs);

    // todo dj 逻辑抽离
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
                                      <div style="width: 100%; height: 8px; background-color: rgba(61, 80, 255, 0.1)"></div>
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
                        10, 52, 100, 334, 390, 330, 10, 52, 100, 334, 390, 330, 10, 52, 100, 334,
                        390, 330, 10, 52, 100, 334, 390, 330, 10, 52, 100, 334, 390, 330
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
                    // todo dj 效果差，需沟通
                    // markPoint: {
                    //     symbol: 'circle',
                    //     silent: true,
                    //     symbolOffset: [0, '-50%'],
                    //     label: {
                    //         color: 'red'
                    //     },
                    //     // symbolSize: 2,
                    //     data: [{ type: 'max', name: 'Max' }]
                    // },
                    // markLine: {
                    //     silent: true,
                    //     data: [
                    //         {
                    //             type: 'max'
                    //         }
                    //     ],
                    //     label: {
                    //         position: 'start',
                    //         padding: 11.5,
                    //         color: 'blue'
                    //     },
                    //     lineStyle: {
                    //         type: [2, 3],
                    //         color: 'rgba(61,80,255,0.35)'
                    //     },
                    //     symbol: 'none'
                    // }
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
    .relayer_details {
        &__statistic {
            margin-top: 24px;
        }
        &__charts_wrap {
            .flex(row, nowrap, space-between, flex-start);
            &__left {
                flex: 1;
                &__top {
                    &__relayed_trend_wrap {
                        :deep(.info_card__primary) {
                            padding: 0;
                        }
                    }
                }
                &__bottom {
                    .flex(row, nowrap, space-between, flex-start);
                    &__transfer_type_wrap {
                        flex: 1;
                    }
                    &__transfer_type {
                        .flex(row, nowrap, space-between, flex-start);
                    }
                    &__success_rate {
                        margin-left: 16px;
                    }
                }
            }
            &__right {
                margin-left: 16px;
                flex: 1;
            }
        }
        flex-direction: column;
    }
</style>
