<template>
    <InfoCard
        class="address_allocation"
        :class="{ failed: isFailed }"
        icon="icon-a-relayedassets"
        title="Allocation"
    >
        <loading-component v-if="addressAllocationLoading" :type="LoadingType.container" />
        <no-datas v-else-if="addressAllocationType" :type="addressAllocationType" />
        <div v-show="isShowAddressAllocationChart" class="address_allocation__chart_c">
            <div class="address_allocation__chart_c__title">
                Total Value&nbsp;&nbsp;{{ totalValue }}
            </div>
            <div class="address_allocation__chart_c__content_c">
                <div class="address_allocation__chart_c__content_c__wrap">
                    <div
                        ref="addressAllocationChartDom"
                        class="address_allocation__chart_c__content_c__wrap__chart"
                    ></div>
                    <div
                        v-show="firstColumnLegendData.length"
                        class="address_allocation__chart_c__content_c__wrap__line_c"
                    >
                        <div class="address_allocation__chart_c__content_c__wrap__line_c__line">
                        </div>
                    </div>
                    <div class="address_allocation__chart_c__content_c__wrap__legend">
                        <div
                            class="address_allocation__chart_c__content_c__wrap__legend__left"
                            :class="{
                                address_allocation__chart_c__content_c__wrap__legend__no_marin_right:
                                    secondColumnLegendData.length <= 0
                            }"
                        >
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
                        <div class="address_allocation__chart_c__content_c__wrap__legend__right">
                            <PieLegend
                                v-for="legend in secondColumnLegendData"
                                :key="legend.key"
                                class="allocation_pie_legend"
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
        </div>
    </InfoCard>
</template>

<script setup lang="ts">
    import PieLegend from './PieLegend.vue';
    import { LoadingType, NoDataType } from '@/constants';
    import { ITokenList } from '@/types/interface/address.interface';
    import { useAddressAllocation } from '../composable';

    interface IProps {
        data: ITokenList | undefined;
        addressAllocationLoading: boolean;
        addressAllocationType: NoDataType | undefined;
    }
    const props = defineProps<IProps>();
    const { data, addressAllocationLoading, addressAllocationType } = toRefs(props);
    const {
        addressAllocationChartDom,
        totalValue,
        firstColumnLegendData,
        secondColumnLegendData,
        isShowAddressAllocationChart,
        highlightFn,
        isFailed
    } = useAddressAllocation(data, addressAllocationLoading, addressAllocationType);
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
                            .allocation_pie_legend {
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
    @media screen and (max-width: 1091px) {
        .address_allocation {
            max-width: none;
            :deep(.info_card__primary) {
                height: 318px;
                & > div {
                }
                .nodatas {
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
                            padding: 24px 0 0 8px;
                            &__left {
                                .flex(column,nowrap,center,flex-start);
                                .allocation_pie_legend {
                                    margin-bottom: 16px;
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .flex(column,nowrap,flex-start,flex-start);
                                .allocation_pie_legend {
                                    margin-bottom: 16px;
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
    @media screen and (max-width: 780px) {
        .address_allocation {
            :deep(.info_card__primary) {
                & > div {
                }
                .nodatas {
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
                                .allocation_pie_legend {
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .allocation_pie_legend {
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
        .address_allocation {
            min-width: auto;
            :deep(.info_card__primary) {
                height: 430px;
                & > div {
                }
                .nodatas {
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
                                .allocation_pie_legend {
                                    margin-bottom: 8px;
                                    &:last-child {
                                    }
                                }
                            }
                            &__right {
                                .allocation_pie_legend {
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
