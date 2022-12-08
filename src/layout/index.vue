<template>
    <a-config-provider>
        <loading-component v-show="ibcStatisticsChainsStore.isShowLoading" />
        <div ref="layout" class="layout">
            <div class="layout__header">
                <ibc-header />
            </div>
            <div class="layout__content">
                <div
                    v-show="!ibcStatisticsChainsStore.isShow500"
                    class="layout__content__router_container"
                >
                    <router-view />
                </div>
                <div
                    v-show="ibcStatisticsChainsStore.isShow500"
                    class="layout__content__error_container"
                >
                    <error-500 />
                </div>
            </div>
            <div class="layout__footer">
                <ibc-footer :type="footerType" />
            </div>
            <back-to-top></back-to-top>
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
</script>

<style lang="less" scoped>
    .layout {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100vh;
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
            line-height: 80px;
            background-image: url('../assets/iobscan_home_bg.png');
            background-repeat: no-repeat;
            background-size: 1920px 396px;
            background-position: top center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1100; // 下拉框和
        }
        &__content {
            flex: 1;
            box-sizing: border-box;
            display: flex;
            &__router_container {
                flex: 1;
                width: 100%;
                display: flex;
                flex-direction: column;
            }
            &__error_container {
                flex: 1;
                display: flex;
            }
        }
        &__footer {
            width: 100%;
            z-index: 1100;
        }
    }
    @media screen and (min-width: 1920px) {
        .layout {
            background-size: 100% 396px;
            &__header {
                background-size: 100% 396px;
            }
            &__content {
                &__router_container {
                }
                &__error_container {
                }
            }
            &__footer {
            }
        }
    }
    @media screen and (max-width: 620px) {
        .layout {
            padding-top: 160px;
            &__header {
            }
            &__content {
                &__router_container {
                }
                &__error_container {
                }
            }
            &__footer {
            }
        }
    }
</style>
