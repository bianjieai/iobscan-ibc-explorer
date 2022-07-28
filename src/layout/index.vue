<template>
    <loading v-show="ibcStatisticsChainsStore.isShowLoading"></loading>
    <a-config-provider class="bj-root">
        <template #renderEmpty>
            <no-datas />
        </template>
        <a-layout ref="layout" class="layout">
            <a-layout-header class="header">
                <div class="header_content">
                    <div class="logo cursor" @click="onClickLogo">
                        <div class="logo_icon_wrap">
                            <img class="logo_icon" :src="logoIcon" alt="logo" />
                        </div>
                        <div class="logo_text_wrap">
                            <img class="logo_text" :src="logoName" alt="" />
                        </div>
                    </div>
                    <navigation
                        :menus="headerMenus"
                        :current-menu="currentMenu"
                        :is-show-nav="isShowNav"
                        @click-menu="clickMenu"
                    />
                    <div class="header_input_wrapper">
                        <header-input
                            class="header_input_layout"
                            disabled
                            @pressed-enter="onPressEnter"
                        />
                        <div class="header_input_icon_wrapper">
                            <a
                                href="https://www.iobscan.io/#/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <img
                                    class="header_input_icon"
                                    src="/src/assets/nav/iob_link.png"
                                    alt="icon"
                                />
                            </a>
                            <div class="header_btn_mobile cursor">
                                <img
                                    src="../assets/nav/menu_mobile.png"
                                    alt="menu icon"
                                    class="header_btn_img"
                                    @click="changeShowNav"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </a-layout-header>

            <a-layout-content class="content">
                <router-view />
            </a-layout-content>
            <a-layout-footer class="footer">
                <ibc-footer />
            </a-layout-footer>
        </a-layout>
    </a-config-provider>
</template>

<script setup>
    import { onMounted, onUnmounted, reactive, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import Navigation from '../components/Navigation.vue';
    // import HeaderInput from '../components/HeaderInput.vue';
    import IbcFooter from '../components/IbcFooter.vue';
    import { menus } from '@/constants/index';
    import { useOnPressEnter } from '../composables/useStarAnimation';
    import { useIbcStatisticsChains } from '@/store/index';
    const logoIcon = new URL(import.meta.env.VITE_LOGO_ICON, import.meta.url).href;
    const logoName = new URL(import.meta.env.VITE_LOGO_NAME, import.meta.url).href;
    const isShowNav = ref(false);
    let timer1, timer2;

    const headerMenus = reactive(menus);
    const currentMenu = ref([]);
    const router = useRouter();
    const route = useRoute();
    const layout = ref();

    // const { setStar1, setStar2 } = useStarAnimation(layout);
    const { onPressEnter } = useOnPressEnter(layout);
    const ibcStatisticsChainsStore = useIbcStatisticsChains();

    onMounted(() => {
        // timer1 = setInterval(() => {
        //   setStar1()
        // }, 3200)
        // timer2 = setInterval(() => {
        //   setStar2()
        // }, 4200)

        // currentMenu.value = [route.name];
        currentMenu.value = getCurrentRouterNames(route);
        document.addEventListener('click', (e) => {
            if (
                e.target.className !== 'header_btn_img' &&
                e.target.className !==
                    'ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light header_menu'
            ) {
                //不是该选择器的class
                isShowNav.value = false;
            }
        });
    });

    const onClickLogo = () => {
        router.push({
            name: 'Home'
        });
    };

    const clickMenu = (val) => {
        // currentMenu.value = [val]
        router.push({
            name: val
        });
    };

    const changeShowNav = () => {
        isShowNav.value = !isShowNav.value;
    };

    // watch(() => route.path, (newVal, oldVal) => {
    //   // if (!oldVal) { // 页面刚加载
    //   const temp = newVal.replace(/\//, '')
    //   currentMenu.value = [temp[0].toUpperCase() + temp.substr(1)]
    //   // }
    //   console.log('temptemp:',temp);
    // }, {
    //   immediate: true
    // })

    router.beforeEach((r) => {
        // currentMenu.value = [r.name];
        currentMenu.value = getCurrentRouterNames(r);
    });

    const getCurrentRouterNames = (r) => {
        if (r) {
            return r?.matched[0].children.map((item) => item.name) || [];
        }
        return [];
    };

    onUnmounted(() => {
        if (timer1) clearInterval(timer1);
        if (timer2) clearInterval(timer2);
    });
</script>

<style lang="less" scoped>
    .bj-root {
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
        background-image: url('../assets/iobscan_home_bg.png');
        background-repeat: no-repeat;
        background-size: 1920px 396px;
        background-position: top center;
        background-color: #f5f7fc;
        flex: 1;
        position: relative;
        & .header {
            box-sizing: border-box;
            padding: 0;
            width: 100%;
            height: 80px;
            line-height: 80px;
            background: transparent;
            z-index: 10;
            &_content {
                .flex(row, nowrap, space-between, center);
                margin: 0 auto;
                width: 100%;
                max-width: 1200px;
                height: 100%;
                .logo {
                    .flex(row, nowrap, center, center);
                    .logo_icon {
                        width: 32px;
                        height: 34px;
                        img {
                            height: 100%;
                        }
                    }
                    .logo_text {
                        margin-left: 9px;
                        width: 100px;
                        height: 34px;
                        img {
                            height: 100%;
                        }
                    }
                }
            }
            &_input_wrapper {
                .flex(row, nowrap, space-between, center);
            }
            &_input_icon_wrapper {
                .flex(row, nowrap, space-between, center);
                margin-left: 12px;
                a {
                    .flex(row, nowrap, center, center);
                }
            }
            &_input_icon {
                width: 32px;
                height: 32px;
            }
            &_btn_mobile {
                .flex(row, nowrap, center, center);
                margin-left: 12px;
                display: none;
                img {
                    width: 32px;
                    height: 32px;
                }
            }
        }
        & .content {
            box-sizing: border-box;
            .flex(column, nowrap, flex-start, center);
            flex: 1;
            // z-index: 10;
        }
        & .footer {
            .flex(column, nowrap, space-between, center);
            padding: 0;
            width: 100%;
            background-color: #eef0f6;
            z-index: 10;
        }
    }
    @media screen and (max-width: 1200px) {
        .layout {
            & .header {
                box-sizing: border-box;
                &_content {
                    .logo {
                        margin-left: 32px;
                        .logo_icon {
                        }
                    }
                    .header_input_wrapper {
                        margin-right: 32px;
                    }
                }
                &_input_wrapper {
                }
                &_input_icon_wrapper {
                    a {
                    }
                }
                &_input_icon {
                }
                &_btn_mobile {
                    img {
                    }
                }
            }
            & .content {
            }
            & .footer {
            }
        }
    }
    @media screen and (max-width: 1030px) {
        .layout {
            & .header {
                &_content {
                    position: relative;
                    .logo {
                        .logo_icon {
                        }
                    }
                }
                &_input_wrapper {
                }
                &_input_icon_wrapper {
                    a {
                    }
                }
                &_input_icon {
                }
                &_btn_mobile {
                    display: inline-block;
                    img {
                    }
                }
            }
            & .content {
            }
            & .footer {
            }
        }
    }
    @media screen and (max-width: 768px) {
        .layout {
            & .header {
                &_content {
                    .logo {
                        margin-left: 16px;
                        width: 136px;
                        .logo_icon {
                        }
                    }
                    .header_input_wrapper {
                        margin-right: 16px;
                    }
                }
                &_input_wrapper {
                }
                &_input_icon_wrapper {
                    a {
                    }
                }
                &_input_icon {
                }
                &_btn_mobile {
                    display: inline-block;
                    img {
                    }
                }
            }
            & .content {
            }
            & .footer {
            }
        }
    }
    @media screen and (max-width: 530px) {
        .layout {
            & .header {
                &_content {
                    .logo {
                        .logo_icon {
                        }
                    }
                }
                &_input_wrapper {
                }
                &_input_layout {
                    display: none;
                }
                &_input_icon_wrapper {
                    a {
                    }
                }
                &_input_icon {
                }
                &_btn_mobile {
                    img {
                    }
                }
            }
            & .content {
            }
            & .footer {
            }
        }
    }
</style>
