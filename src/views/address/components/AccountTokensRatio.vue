<template>
    <!-- todo dj UI icon -->
    <InfoCard
        class="address_account_token_ratio"
        icon="icon-a-relayedassets"
        title="Account Tokens Ratio"
    >
        <loading-component v-if="addressRatioLoading" :type="LoadingType.container" />
        <no-datas v-else-if="addressRatioType" :type="addressRatioType" />
        <div
            v-show="isShowAddressAccountTokenRatioChart"
            class="address_account_token_ratio__chart_c"
        >
            <div class="address_account_token_ratio__chart_c__title"
                >Total Value&nbsp;&nbsp;{{ UNIT_SIGNS }} {{ totalValue }}
            </div>
            <div class="address_account_token_ratio__chart_c__content_c">
                <div
                    ref="addressAccountTokenRatioChartDom"
                    class="address_account_token_ratio__chart_c__content_c__chart"
                ></div>
                <div class="address_account_token_ratio__chart_c__content_c__legend">
                    <div class="address_account_token_ratio__chart_c__content_c__legend__left">
                        <PieLegend
                            v-for="legend in firstColumnLegendData"
                            :key="legend.key"
                            class="allocation_pie_legend"
                            :lenged-color="legend.lengedColor"
                            :legend-name="legend.legendName"
                            :percentage="legend.percentage"
                            @mouseover="highlightFn(legend.key)"
                            @mouseleave="highlightFn(legend.key)"
                        />
                    </div>
                    <div class="address_account_token_ratio__chart_c__content_c__legend__right">
                        <PieLegend
                            v-for="legend in secondColumnLegendData"
                            :key="legend.key"
                            class="allocation_pie_legend cursor"
                            :lenged-color="legend.lengedColor"
                            :legend-name="legend.legendName"
                            :percentage="legend.percentage"
                            @mouseover="highlightFn(legend.key)"
                            @mouseleave="highlightFn(legend.key)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import PieLegend from './PieLegend.vue';
    import { LoadingType, NoDataType } from '@/constants';
    import { IAccountData } from '@/types/interface/address.interface';
    import { UNIT_SIGNS } from '@/constants/relayers';
    import { useAddressAccountTokensRatio } from '../composable';

    interface IProps {
        data: IAccountData | undefined;
        addressRatioLoading: boolean;
        addressRatioType: NoDataType | undefined;
    }
    const props = defineProps<IProps>();
    const { data, addressRatioLoading, addressRatioType } = toRefs(props);
    const {
        addressAccountTokenRatioChartDom,
        totalValue,
        firstColumnLegendData,
        secondColumnLegendData,
        isShowAddressAccountTokenRatioChart,
        highlightFn
    } = useAddressAccountTokensRatio(data, addressRatioLoading, addressRatioType);
</script>

<style lang="less" scoped>
    .address_account_token_ratio {
        max-width: 378px;
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
