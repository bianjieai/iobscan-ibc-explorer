<template>
    <PageContainer class="heatmap">
        <!-- todo shan 更换 icon -->
        <!-- todo shan 更新 subtitle: -- 替换为接口中数值 -->
        <PageTitle
            title="IBC Token Market Heatmap"
            :title-icon="'icon-Sequence'"
            :subtitle="`${heatmapTotalInfo.total_denom_number} Assets`"
        />
        <div class="heatmap__container">
            <div class="heatmap__left">
                <HeatmapInfo
                    :heatmap-total-info="heatmapTotalInfo"
                    :current-choose-legend="currentChooseLegend"
                    @change-current-choose-legend="changeCurrentChooseLegend"
                />
            </div>
            <div class="heatmap__right">
                <!-- todo dj 待补充热力图及适配 -->
            </div>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import HeatmapInfo from './components/HeatmapInfo.vue';
    import { useGetOverviewHeatmapInfo, useHeatmapChart } from './composable';

    const { heatmapTotalInfo } = useGetOverviewHeatmapInfo();
    const { currentChooseLegend, changeCurrentChooseLegend } = useHeatmapChart();
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
            width: 748px;
            height: 528px;
            background: pink;
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
            }
        }
    }
</style>
