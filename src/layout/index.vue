<template>
    <a-config-provider>
        <loading v-show="ibcStatisticsChainsStore.isShowLoading"></loading>
        <div ref="layout" class="layout">
            <div class="layout__header">
                <ibc-header />
            </div>
            <div class="layout__content">
                <div
                    v-if="!ibcStatisticsChainsStore.isShow500"
                    class="layout__content__router_container"
                >
                    <router-view />
                </div>
                <div v-else class="layout__content__error_container">
                    <error-500 />
                </div>
            </div>
            <div class="layout__footer">
                <ibc-footer :type="footerType" />
            </div>
        </div>
        <template #renderEmpty>
            <no-datas />
        </template>
    </a-config-provider>
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    import { FooterMode } from '@/types/interface/index.interface';
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const footerType = computed(() => {
        return ibcStatisticsChainsStore.isShow500 ? FooterMode.dark : FooterMode.light;
    });
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
    :deep(.ant-pagination-item) {
        cursor: pointer;
        &-link {
            cursor: pointer;
        }
    }
    .layout {
        width: 100%;
        padding-top: 80px;
        background-image: url('../assets/iobscan_home_bg.png');
        background-repeat: no-repeat;
        background-size: 1920px 396px;
        background-position: top center;
        background-color: #f5f7fc;
        position: relative;
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
            z-index: 1025; // 下拉框和
        }
        &__content {
            box-sizing: border-box;
            &__router_container {
                width: 100%;
            }
            &__error_container {
            }
        }
        &__footer {
            width: 100%;
        }
    }
</style>
