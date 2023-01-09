<template>
    <div class="header_container">
        <div ref="headerRef" class="header_content">
            <div class="header_content__left">
                <div v-ga="'导航栏-Logo'" class="logo cursor" @click="onClickLogo">
                    <div class="logo__img" :class="{ stage_logo__img: isStage }">
                        <img :src="logoIcon" alt="logo" />
                    </div>
                </div>
                <navigation
                    class="header_navigation"
                    :menus="headerMenus"
                    :current-index="currentIndex"
                    :is-show-nav="isShowNav"
                    :active-menu="activeMenu"
                    :show-sub-menu="showSubMenu"
                    :expand-more="expandMore"
                    :expand="expand"
                    :current-more-index="currentMoreIndex"
                    @change-expand-more="changeExpandMore"
                    @change-expand="changeExpand"
                    @change-show-sub-menu="changeShowSubMenu"
                    @change-hidden-sub-menu="changeHiddenSubMenu"
                    @click-sub-menu="clickSubMenu"
                    @click-menu="clickMenu"
                    @close-show-nav="closeShowNav"
                    @change-current-index="changeCurrentIndex"
                    @change-active-menu="changeActiveMenu"
                    @change-more-index="changeMoreIndex"
                />
            </div>
            <div class="header_input_wrapper">
                <div class="flex items-center header_input_focus">
                    <header-input />
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
    import { onClickOutside } from '@vueuse/core';
    import { useMoreMenu } from '@/composables';
    import { MENUS } from '@/constants';
    const logoIcon = new URL(import.meta.env.VITE_LOGO_ICON, import.meta.url).href;
    const homeUrl = import.meta.env.VITE_HOME_URL;
    const isStage = import.meta.env.MODE === 'stage';
    const headerMenus = reactive(MENUS);
    const currentIndex = ref<number>();
    const isShowNav = ref<boolean>(false);
    const router = useRouter();
    const headerRef = ref();
    const {
        activeMenu,
        showSubMenu,
        expandMore,
        expand,
        changeExpandMore,
        changeExpand,
        changeShowSubMenu,
        changeHiddenSubMenu,
        clickSubMenu,
        changeActiveMenu,
        currentMoreIndex,
        changeMoreIndex
    } = useMoreMenu();
    const clickMenu = (val: string) => {
        (window as any).gtag('event', '导航栏-点击页面标签', {
            menuName: val
        });

        router.push({
            name: val
        });
    };
    const changeCurrentIndex = (index?: number) => {
        currentIndex.value = index;
    };

    const onClickLogo = () => {
        router.push({
            name: 'Home'
        });
    };

    const changeShowNav = () => {
        isShowNav.value = !isShowNav.value;
        if (currentMoreIndex.value !== undefined) {
            expandMore.value = true;
            expand.value = true;
        } else {
            expandMore.value = false;
            expand.value = false;
        }
    };
    const closeShowNav = (showNav: boolean) => {
        isShowNav.value = showNav;
    };
    onClickOutside(headerRef, () => {
        isShowNav.value = false;
        expandMore.value = false;
        expand.value = false;
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
                z-index: 3;
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
                    justify-content: flex-end;
                    z-index: 4;
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
    @media screen and (max-width: 1150px) {
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
                        display: none;
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
