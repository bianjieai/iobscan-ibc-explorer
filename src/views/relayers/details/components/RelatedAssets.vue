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
            <div class="related_asset_c__value__title">{{ totalRelayedTitle }}</div>
            <div class="related_asset_c__value__chart_warp">
                <loading-component v-if="relayedValueLoading" :type="LoadingType.container" />
                <no-datas
                    v-else-if="relayedValueNoData || relayedValueNetworkError"
                    :text="relayedValueAbnormalText"
                />
                <div
                    v-show="
                        !relayedValueLoading && !(relayedValueNoData || relayedValueNetworkError)
                    "
                    ref="relayedValueDom"
                    class="related_asset_c__value__chart_warp__chart"
                    :class="{ two_legend: twoLegendRelayedValue }"
                ></div>
            </div>
        </div>
        <div class="related_asset_c__fee">
            <div class="related_asset_c__fee__title">Total Fee Cost $200</div>
            <div class="related_asset_c__fee__chart_warp">
                <div ref="relayedFeeDom" class="related_asset_c__fee__chart_warp__chart"></div>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    // todo dj related assets 逻辑抽离
    import { LoadingType } from '@/constants';
    import * as echarts from 'echarts';
    import { useWindowSize } from '@vueuse/core';
    import { PIE_COLOR_LIST, OPACITY_PIE_COLOR_LIST } from '@/constants/relayers';
    import { API_CODE, API_ERRPR_MESSAGE } from '@/constants/apiCode';
    import { getTotalRelayedValueAPI } from '@/api/relayers';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import { RelayedValueData, FormatDenomItem } from '@/types/interface/relayers.interface';
    import chainDefaultUrl from '@/assets/home/chain-default.png';
    import { getBaseDenomByKey } from '@/helper/baseDenomHelper';
    import BigNumber from 'bignumber.js';
    import { formatString } from '@/utils/stringTools';
    import { calculatePercentage } from '@/utils/calculate';
    import { formatBigNumber } from '@/helper/parseStringHelper';

    const route = useRoute();
    const relayerId: string = route.params.relayerId as string;
    const relayedAssetsChoose = ref(0);
    const relayedAssetsChooseBtnFn = (index: number) => {
        relayedAssetsChoose.value = index;
        if (index === 0) {
            relayedValueOption.series[0].label.formatter = `{text| IBC Token}\n\r\n\r{total|${totalRelayedValueData.value.length}}`;
            relayedValueOption.series[0].data = totalRelayedValueData.valueOpacity;
            relayedValueOption.series[1].data = totalRelayedValueData.value;
        } else {
            relayedValueOption.series[0].label.formatter = `{text| IBC Token}\n\r\n\r{total|${totalRelayedValueData.txs.length}}`;
            relayedValueOption.series[0].data = totalRelayedValueData.txsOpacity;
            relayedValueOption.series[1].data = totalRelayedValueData.txs;
        }
        relayedValueChart.setOption(relayedValueOption, true);
    };
    const getBaseOption = () => {
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
                                                  src="${params.data.imgUrl}"
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
                                                  >${formatString(params.name)}</span
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
                                                  >${formatBigNumber(params.data.value, 0)}</span
                                              >
                                              <span
                                                  style="
                                                      font-size: 14px;
                                                      font-family: GolosUI-Medium, GolosUI;
                                                      font-weight: 500;
                                                      color: rgba(0, 0, 0, 0.34);
                                                      line-height: 18px;
                                                  "
                                                  >/${params.data.percent}%</span
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
                formatter: (name: string) => {
                    return formatString(name);
                },
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
                    data: []
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
                    data: []
                }
            ]
        };
        return baseOption;
    };
    const { width: widthClient } = useWindowSize();

    const changeRelayedAssetsOption = (
        option: any,
        widthClient: number,
        isTwoColumnsLegend: boolean
    ) => {
        if (widthClient > 1183) {
            if (isTwoColumnsLegend) {
                option.legend.top = '35%';
            } else {
                option.legend.top = null;
            }
            option.legend.bottom = 10;
            option.legend.right = 0;
            option.series[0].radius = [68, 80];
            option.series[0].center = [108, '50%'];
            option.series[1].radius = [80, 100];
            option.series[1].center = [108, '50%'];
        } else {
            if (isTwoColumnsLegend) {
                option.legend.top = '25%';
                option.legend.bottom = 10;
                option.legend.right = 10;
                option.series[0].radius = [52, 62];
                option.series[0].center = [85, '53%'];
                option.series[1].radius = [62, 77];
                option.series[1].center = [85, '53%'];
            } else {
                option.legend.top = null;
                option.legend.bottom = 10;
                option.legend.right = 0;
                option.series[0].radius = [52, 62];
                option.series[0].center = [85, '53%'];
                option.series[1].radius = [62, 77];
                option.series[1].center = [85, '53%'];
            }
        }
    };

    const relayedValueDom = ref<HTMLElement>();
    const relayedValueOption: any = getBaseOption();
    let relayedValueChart: echarts.ECharts;
    const relayedValueLoading = ref(true);
    const relayedValueNoData = ref(false);
    const relayedValueNetworkError = ref(false);
    const changeRelayedValueOption = () => {
        const legend =
            relayedAssetsChoose.value === 0
                ? totalRelayedValueData.valueTwoLegend
                : totalRelayedValueData.txsTwoLegend;
        changeRelayedAssetsOption(relayedValueOption, widthClient.value, legend);
    };
    const relayedValueSizeFn = () => {
        if (relayedValueChart) {
            changeRelayedValueOption();
            relayedValueChart.setOption(relayedValueOption, true);
            relayedValueChart.resize();
        }
    };
    const relayedValueAbnormalText = computed(() => {
        if (relayedValueNoData.value) {
            return API_ERRPR_MESSAGE.noData;
        } else if (relayedValueNetworkError.value) {
            return API_ERRPR_MESSAGE.networkError;
        } else {
            return '';
        }
    });
    const totalRelayedValueData = reactive<RelayedValueData>({
        totalValue: DEFAULT_DISPLAY_TEXT,
        value: [],
        valueOpacity: [],
        txs: [],
        txsOpacity: [],
        totalTxs: DEFAULT_DISPLAY_TEXT,
        totalDenomCount: 0,
        valueTwoLegend: false,
        txsTwoLegend: false
    });

    const totalRelayedTitle = computed(() => {
        if (relayedAssetsChoose.value === 0) {
            return `Total related Value $${formatBigNumber(totalRelayedValueData.totalValue, 0)}`;
        } else {
            return `Total related Txs ${formatBigNumber(totalRelayedValueData.totalTxs, 0)}`;
        }
    });
    const getRelayedValueData = async () => {
        try {
            relayedValueLoading.value = true;
            relayedValueNoData.value = false;
            relayedValueNetworkError.value = false;
            const { code, data, message } = await getTotalRelayedValueAPI({
                relayer_id: relayerId
            });
            relayedValueLoading.value = false;
            if (code === API_CODE.success) {
                if (data) {
                    totalRelayedValueData.totalValue = data.total_txs_value;
                    totalRelayedValueData.totalTxs = data.total_txs;
                    totalRelayedValueData.totalDenomCount = data.total_denom_count;
                    const denomList: FormatDenomItem[] = [];
                    for (let i = 0; i < data.denom_list.length; i++) {
                        const item = data.denom_list[i];
                        const baseDenom = await getBaseDenomByKey(
                            item.base_denom_chain,
                            item.base_denom
                        );
                        if (baseDenom) {
                            denomList.push({
                                imgUrl: baseDenom.icon,
                                name: baseDenom.symbol,
                                ...item
                            });
                        } else {
                            denomList.push({
                                imgUrl: chainDefaultUrl,
                                name: item.base_denom,
                                ...item
                            });
                        }
                    }
                    const valueDenomList = [...denomList];
                    const txsDenomList = [...denomList];
                    valueDenomList.sort((a, b) => BigNumber(b.txs_value).comparedTo(a.txs_value));
                    txsDenomList.sort((a, b) => BigNumber(b.txs).comparedTo(a.txs));
                    const needMaxNum = 12;
                    if (data.denom_list.length > needMaxNum) {
                        const spliceValueDenomList = valueDenomList.splice(needMaxNum - 1);
                        const spliceTxsDenomList = txsDenomList.splice(needMaxNum - 1);
                        const spliceValueTotal = spliceValueDenomList.reduce((total, current) => {
                            return BigNumber(total).plus(current.txs_value).toString();
                        }, '0');
                        const spliceTxsTotal = spliceTxsDenomList.reduce((total, current) => {
                            return BigNumber(total).plus(current.txs).toNumber();
                        }, 0);
                        valueDenomList.push({
                            imgUrl: chainDefaultUrl,
                            name: 'Others',
                            base_denom: '',
                            base_denom_chain: '',
                            txs_value: spliceValueTotal,
                            txs: 0
                        });
                        txsDenomList.push({
                            imgUrl: chainDefaultUrl,
                            name: 'Others',
                            base_denom: '',
                            base_denom_chain: '',
                            txs: spliceTxsTotal,
                            txs_value: ''
                        });
                    }
                    for (let i = 0; i < valueDenomList.length; i++) {
                        const valueDenom = valueDenomList[i];
                        totalRelayedValueData.valueOpacity.push({
                            value: valueDenom.txs_value,
                            itemStyle: {
                                color: OPACITY_PIE_COLOR_LIST[i]
                            }
                        });
                        totalRelayedValueData.value.push({
                            value: valueDenom.txs_value,
                            imgUrl: valueDenom.imgUrl,
                            name: valueDenom.name,
                            percent: calculatePercentage(
                                valueDenom.txs_value,
                                data.total_txs_value
                            ),
                            itemStyle: {
                                color: PIE_COLOR_LIST[i]
                            }
                        });
                    }
                    for (let i = 0; i < txsDenomList.length; i++) {
                        const txsDenom = txsDenomList[i];
                        totalRelayedValueData.txsOpacity.push({
                            value: txsDenom.txs,
                            itemStyle: {
                                color: OPACITY_PIE_COLOR_LIST[i]
                            }
                        });
                        totalRelayedValueData.txs.push({
                            value: txsDenom.txs,
                            imgUrl: txsDenom.imgUrl,
                            name: txsDenom.name,
                            percent: calculatePercentage(txsDenom.txs, data.total_txs),
                            itemStyle: {
                                color: PIE_COLOR_LIST[i]
                            }
                        });
                    }
                    totalRelayedValueData.valueTwoLegend = totalRelayedValueData.value.length > 6;
                    totalRelayedValueData.txsTwoLegend = totalRelayedValueData.txs.length > 6;
                } else {
                    relayedValueNoData.value = true;
                    totalRelayedValueData.totalValue = DEFAULT_DISPLAY_TEXT;
                    totalRelayedValueData.value = [];
                    totalRelayedValueData.valueOpacity = [];
                    totalRelayedValueData.totalTxs = DEFAULT_DISPLAY_TEXT;
                    totalRelayedValueData.txs = [];
                    totalRelayedValueData.txsOpacity = [];
                }
            } else if (code === API_CODE.unRegisteredRelayer) {
                relayedValueNoData.value = true;
                console.error(message);
            } else {
                relayedValueNetworkError.value = true;
                console.error(message);
            }
        } catch (error) {
            relayedValueLoading.value = false;
            relayedValueNetworkError.value = true;
            console.error(error);
        }
    };
    const twoLegendRelayedValue = computed(() => {
        return relayedAssetsChoose.value === 0
            ? totalRelayedValueData.valueTwoLegend
            : totalRelayedValueData.txsTwoLegend;
    });
    onMounted(async () => {
        await getRelayedValueData();
        relayedValueChart = echarts.init(relayedValueDom.value as HTMLElement);
        relayedValueChart.on('legendselectchanged', (params: any) => {
            relayedValueChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        relayedAssetsChooseBtnFn(0);
        changeRelayedValueOption();
        relayedValueChart.resize();
        relayedValueChart.setOption(relayedValueOption, true);
        window.addEventListener('resize', relayedValueSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', relayedValueSizeFn);
    });

    const relayedFeeDom = ref<HTMLElement>();
    const relayedFeeOption: any = getBaseOption();
    const relayedFeeChartLegendTwo = ref(true); // relayedValueOption.series[0].data.length > 6
    let relayedFeeChart: echarts.ECharts;
    // const relayedFeeLoading = ref(true);
    // const relayedFeeNoData = ref(false);
    // const relayedFeeNetworkError = ref(false);
    const changeRelayedFeeOption = () => {
        changeRelayedAssetsOption(
            relayedFeeOption,
            widthClient.value,
            relayedFeeChartLegendTwo.value
        );
    };
    const relayedFeeSizeFn = () => {
        if (relayedFeeChart) {
            changeRelayedFeeOption();
            relayedFeeChart.setOption(relayedFeeOption, true);
            relayedFeeChart.resize();
        }
    };
    onMounted(async () => {
        relayedFeeChart = echarts.init(relayedFeeDom.value as HTMLElement);
        changeRelayedFeeOption();
        relayedFeeChart.setOption(relayedFeeOption, true);
        relayedFeeChart.on('legendselectchanged', (params: any) => {
            relayedFeeChart.setOption({
                legend: { selected: { [params.name]: true } }
            });
        });
        window.addEventListener('resize', relayedFeeSizeFn);
    });
    onBeforeUnmount(() => {
        window.removeEventListener('resize', relayedFeeSizeFn);
    });
</script>

<style lang="less" scoped>
    .related_asset_c {
        :deep(.info_card__primary) {
            padding: 0;
            height: 589px;
            .flex(column, nowrap);
        }
        &__value,
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
                    width: 295px;
                    height: 213px;
                }
                .two_legend {
                    width: 100%;
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
            &__value,
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
                        padding: 0;
                    }
                }
            }
            &__fee {
                border-right: none;
            }
        }
    }
    @media screen and (max-width: 767px) {
        .related_asset_c {
            :deep(.info_card__primary) {
                height: 450px;
                flex-direction: column;
            }
            &__value,
            &__fee {
                border-right: none;
                margin: 16px 0 10px 0;
                &__title {
                }
                &__chart_warp {
                    &__chart {
                    }
                    .two_legend {
                    }
                }
            }
            &__fee {
                margin: 0 0 10px 0;
            }
        }
    }
</style>
