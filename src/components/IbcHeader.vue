<template>
    <div class="header_container">
        <div class="header_content">
            <div class="header_content__left">
                <div v-ga="'导航栏-Logo'" class="logo cursor" @click="onClickLogo">
                    <div class="logo__img" :class="{ stage_logo__img: isStage }">
                        <img :src="logoIcon" alt="logo" />
                    </div>
                </div>
                <navigation
                    class="header_navigation"
                    :menus="headerMenus"
                    :current-menu="currentMenu"
                    :is-show-nav="isShowNav"
                    @click-menu="clickMenu"
                />
            </div>
            <div class="header_input_wrapper">
                <div class="flex items-center header_input_focus">
                    <header-input class="header_input_layout" />
                </div>
                <div class="header_input_icon_wrapper">
                    <a
                        v-ga="'导航栏-点击跨链门户'"
                        class="header_input__iobscan_io"
                        :href="homeUrl"
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
        <div class="header_container__input">
            <div class="flex items-center">
                <header-input :option-class="'auto_complete__mobile'" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { MENUS } from '@/constants';
    import { RouteLocationNormalized } from 'vue-router';
    type Key = string | number;
    const logoIcon = new URL(import.meta.env.VITE_LOGO_ICON, import.meta.url).href;
    const homeUrl = import.meta.env.VITE_HOME_URL;
    const isStage = import.meta.env.MODE === 'stage';
    const headerMenus = reactive(MENUS);
    const currentMenu = ref<Key[]>([]);
    const isShowNav = ref(false);
    const router = useRouter();
    const route = useRoute();
    const clickMenu = (val: string) => {
        (window as any).gtag('event', '导航栏-点击页面标签', {
            menuName: val
        });

        router.push({
            name: val
        });
    };

    const onClickLogo = () => {
        router.push({
            name: 'Home'
        });
    };

    const changeShowNav = () => {
        isShowNav.value = !isShowNav.value;
    };

    const getCurrentRouterNames = (r: RouteLocationNormalized): Key[] => {
        if (r) {
            const name = r?.matched[0].children.map((item) => item.name);
            if (name && name.length > 0) {
                return name as Key[];
            }
            return [];
        }
        return [];
    };
    const htmlClickFn = (e: MouseEvent) => {
        if (
            (e.target as Element)?.className !== 'header_btn_img' &&
            (e.target as Element)?.className !==
                'ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light header_menu header_navigation'
        ) {
            //不是该选择器的class
            isShowNav.value = false;
        }
    };
    onMounted(() => {
        currentMenu.value = getCurrentRouterNames(route) as Key[];
        document.addEventListener('click', htmlClickFn);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('click', htmlClickFn);
    });

    router.beforeEach((to: RouteLocationNormalized) => {
        currentMenu.value = getCurrentRouterNames(to) as Key[];
    });
</script>

<style lang="less" scoped>
    .header_container {
        box-sizing: border-box;
        padding: 0;
        width: 100%;
        line-height: 80px;
        background-image: url('../assets/iobscan_home_bg.png');
        background-repeat: no-repeat;
        background-size: 1920px 396px;
        background-position: top center;
        .header_content {
            .flex(row, nowrap, space-between, center);
            margin: 0 auto;
            width: 100%;
            max-width: 1200px;
            height: 100%;
            &__left {
                .flex(row, nowrap, flex-start, center);
            }
            .logo {
                .flex(row, nowrap, center, center);
                &__img {
                    img {
                        width: 148px;
                        height: 30px;
                    }
                }
                .stage_logo__img {
                    img {
                        width: 138px;
                        height: 30px;
                    }
                }
            }
            .header_navigation {
                margin-left: 37px;
                z-index: 1;
            }
            .header_content {
            }
            .header_input_wrapper {
                .flex(row, nowrap, space-between, center);
                .header_input_icon_wrapper {
                    .flex(row, nowrap, space-between, center);
                    margin-left: 24px;
                    a {
                        .flex(row, nowrap, center, center);
                        .header_input_icon {
                            width: 32px;
                            height: 32px;
                        }
                    }
                    .header_btn_mobile {
                        .flex(row, nowrap, center, center);
                        margin-left: 12px;
                        display: none;
                        img {
                            width: 32px;
                            height: 32px;
                        }
                    }
                }
                .header_input_focus {
                    position: relative;
                }
            }
        }
        &__input {
            display: none;
        }
    }
    @media screen and (min-width: 1920px) {
        .header_container {
            background-size: 100% 396px;
            .header_content {
                .logo {
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                }
                .header_input_focus {
                }
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .header_container {
            .header_content {
                .logo {
                    margin-left: 48px;
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    margin-right: 48px;
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                    .header_input_focus {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 1130px) {
        .header_container {
            .header_content {
                position: relative;
                .logo {
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                    margin-left: 0;
                }
                .header_input_wrapper {
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            display: inline-block;
                            img {
                            }
                        }
                    }
                    .header_input_focus {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .header_container {
            .header_content {
                .logo {
                    margin-left: 32px;
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    margin-right: 32px;
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                    .header_input_focus {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 670px) {
        .header_container {
            .header_content {
                .logo {
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    .header_input_layout {
                        display: none;
                    }
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                    .header_input_focus {
                    }
                }
            }
            &__input {
                display: block;
                padding: 16px 32px;
                line-height: 80px;
            }
        }
    }
    @media screen and (max-width: 530px) {
        .header_container {
            .header_content {
                .logo {
                    margin-left: 16px;
                    &__img {
                    }
                    .stage_logo__img {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    margin-right: 16px;
                    .header_input_layout {
                    }
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                }
                .header_input_focus {
                }
            }
            &__input {
                padding: 16px;
            }
        }
    }
</style>
