<template>
    <PageContainer class="heatmap">
        <PageTitle
            title="IBC Token Market Heatmap"
            :title-icon="'icon-assets'"
            :subtitle="`${heatmapTotalInfo.total_denom_number} Assets`"
        />
        <div class="heatmap__container">
            <div class="heatmap__left">
                <HeatmapInfo
                    :heatmap-total-info="heatmapTotalInfo"
                    @change-choose-legend="changeChooseLegend"
                />
            </div>
            <div class="heatmap__right">
                <loading-component
                    v-if="heatmapLoading"
                    class="heatmap__right__loading"
                    :type="LoadingType.container"
                />
                <no-datas
                    v-else-if="heatmapNoDataType"
                    :type="heatmapNoDataType"
                    class="heatmap__right__failed"
                />
                <div
                    v-show="!(heatmapLoading || heatmapNoDataType)"
                    class="heatmap__right__chart_c"
                >
                    <div ref="heatmapChartRefDom" class="heatmap__right__chart_c__chart"></div>
                </div>
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import HeatmapInfo from './components/HeatmapInfo.vue';
    import { useOverviewHeatmap } from './composable';
    import { LoadingType } from '@/constants';

    const {
        heatmapLoading,
        heatmapNoDataType,
        heatmapChartRefDom,
        heatmapTotalInfo,
        changeChooseLegend
    } = useOverviewHeatmap();
</script>

<style lang="less" scoped>
    .heatmap {
        padding: 48px 32px 100px !important;
        &__container {
            .flex(row, nowrap, space-between, center);
            margin-top: 28px;
            padding: 24px;
            min-height: 600px;
            background: #fff;
            border-radius: var(--border-radius-normal);
        }
        &__left {
            flex: 1;
            padding: 8px 0 16px;
        }
        &__right {
            margin-left: 16px;
            .flex(column,nowrap,center,center);
            width: 748px;
            height: 528px;
            padding: 12px;
            background: #f8fafd;
            &__loading {
                width: 100%;
                height: 100%;
            }
            &__failed {
            }
            &__chart_c {
                width: 100%;
                height: 100%;
                &__chart {
                    width: 100%;
                    height: 100%;
                    min-width: 634px;
                }
            }
        }
    }
    @media screen and (max-width: 1176px) {
        .heatmap {
            &__container {
                .flex(column, nowrap, flex-start center);
            }
            &__left {
            }
            &__right {
                margin-top: 16px;
                margin-left: 0;
                width: 100%;
                &__loading {
                }
                &__failed {
                }
                &__chart_c {
                    &__chart {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .heatmap {
            padding: 40px 32px 60px !important;
            &__container {
            }
            &__left {
            }
            &__right {
                overflow-x: auto;
                &__loading {
                }
                &__failed {
                }
                &__chart_c {
                    &__chart {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .heatmap {
            padding: 24px 16px 60px !important;
            &__container {
            }
            &__left {
            }
            &__right {
                &__loading {
                }
                &__failed {
                }
                &__chart_c {
                    &__chart {
                    }
                }
            }
        }
    }
</style>
