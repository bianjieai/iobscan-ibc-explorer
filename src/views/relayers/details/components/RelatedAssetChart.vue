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
                @click="clickEventFn"
            ></div>
            <div
                v-show="showToast"
                :style="{ left: clientX + 'px', top: clientY + 'px' }"
                class="related_asset_chart__chart_wrap__toast"
                >Copied</div
            >
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
        relayedAssetsChooseBtnFn,
        clickEventFn,
        clientX,
        clientY,
        showToast
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
                align-self: flex-start;
                margin-top: 16px;
                width: 315px;
                height: 216px;
            }
            .two_legend {
                width: 100%;
                padding: 0 10px;
            }
            &__toast {
                position: fixed;
                top: 0;
                left: 0;
                transform: translate(-50%, -120%);
                width: 50px;
                height: 20px;
                background-color: black;
                border-radius: 8px;
                color: white;
                line-height: 20px;
                text-align: center;
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
                    width: 260px;
                    height: 166px;
                }
                .two_legend {
                    width: 355px;
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
