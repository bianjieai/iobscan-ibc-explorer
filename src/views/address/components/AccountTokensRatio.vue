<template>
    <InfoCard
        class="address_account_token_ratio"
        :class="{ failed: isFailed }"
        icon="icon-Ratio"
        title="Account Tokens Ratio"
    >
        <loading-component v-if="addressRatioLoading" :type="LoadingType.container" />
        <no-datas v-else-if="addressRatioType" :type="addressRatioType" />
        <div
            v-show="isShowAddressAccountTokenRatioChart"
            class="address_account_token_ratio__chart_c"
        >
            <div class="address_account_token_ratio__chart_c__title"
                >Total Value&nbsp;&nbsp;{{ totalValue }}
            </div>
            <div class="address_account_token_ratio__chart_c__content_c">
                <div class="address_account_token_ratio__chart_c__content_c__wrap">
                    <div
                        ref="addressAccountTokenRatioChartDom"
                        class="address_account_token_ratio__chart_c__content_c__wrap__chart"
                    ></div>
                    <div
                        v-show="firstColumnLegendData.length"
                        class="address_account_token_ratio__chart_c__content_c__wrap__line_c"
                    >
                        <div
                            class="address_account_token_ratio__chart_c__content_c__wrap__line_c__line"
                        >
                        </div>
                    </div>
                    <div class="address_account_token_ratio__chart_c__content_c__wrap__legend">
                        <div
                            class="address_account_token_ratio__chart_c__content_c__wrap__legend__left"
                            :class="{
                                address_account_token_ratio__chart_c__content_c__wrap__legend__no_marin_right:
                                    secondColumnLegendData.length <= 0
                            }"
                        >
                            <PieLegend
                                v-for="legend in firstColumnLegendData"
                                :key="legend.key"
                                class="token_ratio_pie_legend"
                                :lenged-color="legend.lengedColor"
                                :legend-name="legend.legendName"
                                :percentage="legend.percentage"
                                @mouseover="highlightFn(legend.key)"
                                @mouseleave="highlightFn(legend.key)"
                            />
                        </div>
                        <div
                            class="address_account_token_ratio__chart_c__content_c__wrap__legend__right"
                        >
                            <PieLegend
                                v-for="legend in secondColumnLegendData"
                                :key="legend.key"
                                class="token_ratio_pie_legend cursor"
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
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import PieLegend from './PieLegend.vue';
    import { LoadingType, NoDataType } from '@/constants';
    import { IAccountData } from '@/types/interface/address.interface';
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
        highlightFn,
        isFailed
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
                &__wrap {
                    .flex(column,nowrap,center,center);
                    &__chart {
                        width: 100%;
                        height: 283px;
                    }
                    &__line_c {
                        display: none;
                        &__line {
                        }
                    }
                    &__legend {
                        .flex(row);
                        padding: 24px 24px 0 24px;
                        &__left {
                            flex: 1;
                            margin-right: 32px;
                            .token_ratio_pie_legend {
                                justify-content: flex-end;
                                margin-bottom: 8px;
                                &:last-child {
                                    margin-bottom: 0;
                                }
                            }
                        }
                        &__right {
                            flex: 1;
                            .token_ratio_pie_legend {
                                margin-bottom: 8px;
                                &:last-child {
                                    margin-bottom: 0;
                                }
                            }
                        }
                        &__no_marin_right {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
    .failed {
        :deep(.info_card__primary) {
            height: 280px !important;
        }
    }
    @media screen and (max-width: 1247px) {
        .address_account_token_ratio {
            max-width: none;
            min-width: auto;
            :deep(.info_card__primary) {
                height: 322px;
                & > div {
                }
            }
            &__chart_c {
                padding-bottom: 16px;
                &__title {
                    &__key {
                    }
                }
                &__content_c {
                    &__wrap {
                        .flex(row,nowrap,center,center);
                        &__chart {
                            height: 268px;
                            width: 245px;
                        }
                        &__line_c {
                            display: block;
                            width: 80px;
                            .flex(row,nowrap,center,center);
                            &__line {
                                width: 1px;
                                height: 221px;
                                background-color: #eaeaea;
                            }
                        }
                        &__legend {
                            .flex(row);
                            padding: 24px 24px 0 8px;
                            &__left {
                                .flex(column,nowrap,center,flex-start);
                                .token_ratio_pie_legend {
                                    margin-bottom: 16px;
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .flex(column,nowrap,flex-start,flex-start);
                                .token_ratio_pie_legend {
                                    margin-bottom: 16px;
                                    &:last-child {
                                        margin-bottom: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 780px) {
        .address_account_token_ratio {
            :deep(.info_card__primary) {
                & > div {
                }
            }
            &__chart_c {
                &__title {
                    &__key {
                    }
                }
                &__content_c {
                    &__wrap {
                        &__chart {
                        }
                        &__line_c {
                            width: 50px;
                            &__line {
                            }
                        }
                        &__legend {
                            &__left {
                                .token_ratio_pie_legend {
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .token_ratio_pie_legend {
                                    &:last-child {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width: 709px) {
        .address_account_token_ratio {
            :deep(.info_card__primary) {
                height: 430px;
                & > div {
                }
            }
            &__chart_c {
                &__title {
                    &__key {
                    }
                }
                &__content_c {
                    &__wrap {
                        .flex(column,nowrap,center,center);
                        &__chart {
                        }
                        &__line_c {
                            display: none;
                            &__line {
                            }
                        }
                        &__legend {
                            padding: 5px 0 0 0;
                            &__left {
                                .token_ratio_pie_legend {
                                    margin-bottom: 8px;
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .token_ratio_pie_legend {
                                    margin-bottom: 8px;
                                    &:last-child {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
