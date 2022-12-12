<template>
    <InfoCard class="address_allocation" icon="icon-a-relayedassets" title="Allocation">
        <loading-component v-if="addressAllocationLoading" :type="LoadingType.container" />
        <no-datas v-else-if="addressAllocationType" :type="addressAllocationType" />
        <div v-show="isShowAddressAllocationChart" class="address_allocation__chart_c">
            <div class="address_allocation__chart_c__title"
                >Total Value&nbsp;&nbsp;{{ UNIT_SIGNS }} {{ totalValue }}
            </div>
            <div class="address_allocation__chart_c__content_c">
                <div
                    ref="addressAllocationChartDom"
                    class="address_allocation__chart_c__content_c__chart"
                ></div>
                <div class="address_allocation__chart_c__content_c__legend">
                    <div class="address_allocation__chart_c__content_c__legend__left">
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
                    <div class="address_allocation__chart_c__content_c__legend__right">
                        <PieLegend
                            v-for="legend in secondColumnLegendData"
                            :key="legend.key"
                            class="allocation_pie_legend cursor"
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
    </InfoCard>
</template>

<script setup lang="ts">
    import PieLegend from './PieLegend.vue';
    import { LoadingType, NoDataType } from '@/constants';
    import { ITokenList } from '@/types/interface/address.interface';
    import { UNIT_SIGNS } from '@/constants/relayers';
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
        highlightFn
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
