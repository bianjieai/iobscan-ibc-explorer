<template>
    <PageContainer class="relayer_details">
        <!-- Todo shan 需要 Relayer Name 过长情况的展示方案 -->
        <PageTitle
            :title="`${relayerName} Relayer Details`"
            :title-icon="'icon-a-chainsserved'"
            :subtitle="subTitle"
            :img-src="relayerIcon"
        />
        <layer-block class="relayer_details__statistic">
            <statistic-list type="horizontal" :msg="relayerInfo" />
        </layer-block>
        <InfoCard icon="icon-a-ChannelPairs" title="Channel Pairs">
            <ChannelPairsInfo v-if="channelPairsInfo" :channel-pairs-info="channelPairsInfo" />
            <no-datas v-if="!ibcStatisticsChainsStore.isShowLoading && !channelPairsInfo" />
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
                        <loading-component
                            v-if="transferTypeLoading"
                            :type="LoadingType.container"
                            :height="200"
                        />
                        <div
                            v-if="
                                !isShowModal &&
                                !transferTypeLoading &&
                                (recvPacketTxs || acknowledgePacketTxs || timeoutPacketTxs)
                            "
                            class="relayer_details__charts_wrap__left__bottom__transfer_type"
                        >
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
                        <no-datas
                            v-if="
                                isShowModal ||
                                (!transferTypeLoading &&
                                    !(recvPacketTxs && acknowledgePacketTxs && timeoutPacketTxs))
                            "
                            class="relayer_details__charts_wrap__left__bottom__transfer_type_wrap__nodatas"
                        />
                    </InfoCard>
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__success_rate"
                        icon="icon-a-successrate"
                        title="Success Rate"
                    >
                        <!-- Todo shan loading 状态添加 -->
                        <!-- <loading-component
                            v-if="transferTypeLoading"
                            :type="LoadingType.container"
                            :height="200"
                        /> -->
                        <SuccessRateChart
                            v-if="!isShowModal && !ibcStatisticsChainsStore.isShowLoading"
                            :success-rate-percent="successRatePercent"
                        />
                        <no-datas
                            v-if="
                                isShowModal ||
                                (!ibcStatisticsChainsStore.isShowLoading && !channelPairsInfo)
                            "
                            class="relayer_details__charts_wrap__left__bottom__success_rate__nodatas"
                        />
                    </InfoCard>
                </div>
            </div>
            <div class="relayer_details__charts_wrap__right">
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
            </div>
        </div>
        <InfoCard icon="icon-transactions" title="Transactions">
            <RelayerTransfer :served-chains-info="servedChainsInfo" :is-show-modal="isShowModal" />
        </InfoCard>
    </PageContainer>
    <IbcDialog v-if="isShowModal" :show-modal="isShowModal" :opacity="0.15"></IbcDialog>
</template>

<script setup lang="ts">
    import ChannelPairsInfo from './components/ChannelPairsInfo.vue';
    import TransferTypeChart from './components/TransferTypeChart.vue';
    import SuccessRateChart from './components/SuccessRateChart.vue';
    import RelayerTransfer from './components/RelayerTransfer.vue';
    import { LoadingType, TRANSFER_TYPE } from '@/constants';
    import {
        useGetRelayerDetailsInfo,
        useGetSuccessRatePercent,
        useGetTransferTypeData
    } from './composable';
    import * as echarts from 'echarts';
    import { useIbcStatisticsChains } from '@/store';

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const {
        relayerIcon,
        relayerName,
        servedChainsInfo,
        relayedTotalTxs,
        relayedSuccessTxs,
        relayerInfo,
        channelPairsInfo,
        isShowModal,
        subTitle
    } = useGetRelayerDetailsInfo();
    const {
        recvPacketTxs,
        acknowledgePacketTxs,
        timeoutPacketTxs,
        totalTxsCount,
        recvPacketTxsPercent,
        acknowledgePacketTxsPercent,
        timeoutPacketTxsPercent,
        transferTypeLoading
    } = useGetTransferTypeData();
    const { successRatePercent } = useGetSuccessRatePercent(relayedSuccessTxs, relayedTotalTxs);
    // todo dj relayedTrend 逻辑抽离
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
                        &__nodatas {
                            margin: 1px 0;
                            min-width: 460px;
                        }
                    }
                    &__transfer_type {
                        .flex(row, nowrap, space-between, flex-start);
                    }
                    &__success_rate {
                        margin-left: 16px;
                        &__nodatas {
                            margin: 1px 0;
                            min-width: 232px;
                        }
                    }
                }
            }
            &__right {
                margin-left: 16px;
                flex: 1;
            }
        }
    }
    @media screen and (max-width: 1120px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    .list_item__horizontal {
                        padding: 24px 0;
                        width: 100%;
                        border-bottom: 1px solid var(--bj-border-color);
                        border-right: 0;
                        &:nth-of-type(2n + 1) {
                            padding-left: 0;
                        }
                        &:nth-of-type(2n) {
                            padding-left: 24px;
                            .list_item {
                                border-right: 0;
                            }
                        }
                        &:first-child {
                            padding-top: 0;
                        }
                        &:nth-of-type(2) {
                            padding-top: 0;
                        }
                        &:last-child {
                            padding-bottom: 0;
                            border-bottom: 0;
                        }
                        &:nth-last-child(2) {
                            padding-bottom: 0;
                            border-bottom: 0;
                        }
                        .list_item {
                            width: 100%;
                            border-right: 1px solid var(--bj-border-color);
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        &__transfer_type_wrap {
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    grid-template-columns: repeat(1, 1fr);
                    .list_item__horizontal {
                        &:nth-of-type(2n + 1) {
                            .list_item {
                                border-right: 0;
                            }
                        }
                        &:nth-of-type(2n) {
                            padding-left: 0;
                        }
                        &:nth-of-type(2) {
                            padding-top: 24px;
                        }
                        &:nth-last-child(2) {
                            padding-bottom: 24px;
                            border-bottom: 1px solid var(--bj-border-color);
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        &__transfer_type_wrap {
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
</style>
