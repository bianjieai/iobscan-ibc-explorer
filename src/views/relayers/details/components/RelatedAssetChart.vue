<template>
    <div class="related_asset_chart">
        <div class="related_asset_chart__title">{{ totalRelayedTitle }}</div>
        <div class="related_asset_chart__chart_wrap">
            <loading-component v-if="relayedValueLoading" :type="LoadingType.container" />
            <no-datas
                v-else-if="relayedValueNoData || relayedValueNetworkError"
                :text="relayedValueAbnormalText"
            />
            <div
                v-show="!relayedValueLoading && !(relayedValueNoData || relayedValueNetworkError)"
                ref="relayedValueDom"
                class="related_asset_chart__chart_wrap__chart"
                :class="{ two_legend: twoLegendRelayedValue }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { LoadingType } from '@/constants';
    import { useRelatedAssetChart } from '../composable';
    import { RelatedAssetsPieType } from '@/types/interface/relayers.interface';

    interface IRelayerAssetChart {
        relayedAssetsChoose: number;
        type: RelatedAssetsPieType;
    }
    const props = defineProps<IRelayerAssetChart>();
    const { relayedAssetsChoose, type } = toRefs(props);

    const {
        totalRelayedTitle,
        relayedValueLoading,
        relayedValueNoData,
        relayedValueNetworkError,
        relayedValueAbnormalText,
        twoLegendRelayedValue,
        relayedValueDom,
        relayedAssetsChooseBtnFn
    } = useRelatedAssetChart(relayedAssetsChoose, type);

    defineExpose({
        relayedAssetsChooseBtnFn
    });
</script>

<style lang="less" scoped>
    .related_asset_chart {
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
        &__chart_wrap {
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
    @media screen and (max-width: 1183px) {
        .related_asset_chart {
            flex: 1;
            padding: 0;
            margin: 16px 0 39px 0;
            border-right: 1px solid #eaeaea;
            &__title {
            }
            &__chart_wrap {
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
    }
    @media screen and (max-width: 767px) {
        .related_asset_chart {
            border-right: none;
            margin: 16px 0 10px 0;
            &__title {
            }
            &__chart_wrap {
                &__chart {
                }
                .two_legend {
                }
            }
        }
    }
</style>
