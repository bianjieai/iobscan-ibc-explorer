<template>
    <div class="header_container">
        <div class="header_content">
            <div class="logo cursor" @click="onClickLogo">
                <div class="logo__icon">
                    <img :src="logoIcon" alt="logo" />
                </div>
                <div class="logo__text">
                    <img :src="logoName" alt="" />
                </div>
            </div>
            <navigation
                class="header_navigation"
                :menus="headerMenus"
                :current-menu="currentMenu"
                :is-show-nav="isShowNav"
                @click-menu="clickMenu"
            />
            <div class="header_input_wrapper">
                <header-input class="header_input_layout" disabled />
                <div class="header_input_icon_wrapper">
                    <a href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
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
    </div>
</template>

<script setup lang="ts">
    import { menus } from '@/constants/index';
    import { RouteLocationNormalized } from 'vue-router';
    type Key = string | number;
    const logoIcon = new URL(import.meta.env.VITE_LOGO_ICON, import.meta.url).href;
    const logoName = new URL(import.meta.env.VITE_LOGO_NAME, import.meta.url).href;
    const headerMenus = reactive(menus);
    const currentMenu = ref<Key[]>([]);
    const isShowNav = ref(false);
    const router = useRouter();
    const route = useRoute();

    const clickMenu = (val: string) => {
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
        height: 80px;
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
            .logo {
                .flex(row, nowrap, center, center);
                &__icon {
                    img {
                        width: 32px;
                        height: 34px;
                    }
                }
                &__text {
                    margin-left: 9px;
                    img {
                        width: 100px;
                        height: 34px;
                    }
                }
            }
            .header_navigation {
                z-index: 1;
            }
            .header_content {
            }
            .header_input_wrapper {
                .flex(row, nowrap, space-between, center);
                .header_input_icon_wrapper {
                    .flex(row, nowrap, space-between, center);
                    margin-left: 12px;
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
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .header_container {
            .header_content {
                .logo {
                    margin-left: 48px;
                    &__icon {
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
                }
            }
        }
    }
    @media screen and (max-width: 1030px) {
        .header_container {
            .header_content {
                position: relative;
                .logo {
                    &__icon {
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
                            display: inline-block;
                            img {
                            }
                        }
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
                    width: 136px;
                    &__icon {
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
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .header_container {
            .header_content {
                .logo {
                    margin-left: 16px;
                    &__icon {
                    }
                }
                .header_navigation {
                }
                .header_input_wrapper {
                    margin-right: 16px;
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
                }
            }
        }
    }
</style>
