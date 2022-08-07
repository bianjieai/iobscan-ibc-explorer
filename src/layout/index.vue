<template>
    <a-config-provider class="bj_root">
        <loading v-show="ibcStatisticsChainsStore.isShowLoading"></loading>
        <div ref="layout" class="layout">
            <div class="layout__header">
                <ibc-header />
            </div>
            <div class="layout__content">
                <router-view />
            </div>
            <div class="layout__footer">
                <ibc-footer />
            </div>
        </div>
        <template #renderEmpty>
            <no-datas />
        </template>
    </a-config-provider>
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    let timer1: number, timer2: number;
    // const { setStar1, setStar2 } = useStarAnimation(layout);
    onMounted(() => {
        // timer1 = setInterval(() => {
        //   setStar1()
        // }, 3200)
        // timer2 = setInterval(() => {
        //   setStar2()
        // }, 4200)
    });
    onUnmounted(() => {
        if (timer1) clearInterval(timer1);
        if (timer2) clearInterval(timer2);
    });
</script>

<style lang="less" scoped>
    .bj_root {
        flex: 1;
        display: flex;
    }
    .ant-tooltip {
        max-width: 400px !important;
        .ant-tooltip-content {
            .ant-tooltip-arrow {
                .ant-tooltip-arrow-content {
                    background: rgba(255, 255, 255, 1) !important;
                }
            }
            .ant-tooltip-inner {
                background: rgba(255, 255, 255, 1) !important;
                color: var(--bj-font-color-65);
            }
        }
    }
    :deep(.ant-pagination-item) {
        cursor: pointer;
        &-link {
            cursor: pointer;
        }
    }
    .layout {
        width: 100%;
        height: 100%;
        background-image: url('../assets/iobscan_home_bg.png');
        background-repeat: no-repeat;
        background-size: 1920px 396px;
        background-position: top center;
        background-color: #f5f7fc;
        .flex(column, nowrap, flex-start, center);
        flex: 1;
        position: relative;
        min-height: auto;
        &__header {
            box-sizing: border-box;
            padding: 0;
            width: 100%;
            height: 80px;
            line-height: 80px;
            background-image: url('../assets/iobscan_home_bg.png');
            background-repeat: no-repeat;
            background-size: 1920px 396px;
            background-position: top center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 6;
        }
        &__content {
            margin-top: 80px;
            box-sizing: border-box;
            .flex(column, nowrap, flex-start, center);
            flex: 1;
            width: 100%;
        }
        &__footer {
            width: 100%;
        }
    }
</style>
