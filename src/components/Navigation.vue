<template>
    <div class="menu">
        <div class="menu__pc">
            <NavMenu
                :menus="menus"
                :current-index="currentIndex"
                :is-show-nav="isShowNav"
                @click-menu-item="clickMenuItem"
                @close-show-nav="closeShowNav"
            />
            <div
                class="menu__more"
                :class="{ menu__more_active: activeMenu }"
                @mouseenter="changeShowSubMenuFn"
                @mouseleave="changeHiddenSubMenuFn"
            >
                <span>More</span>
                <MoreMenu
                    v-show="showSubMenu"
                    class="menu__more__submenu"
                    :expand="expand"
                    :current-more-index="currentMoreIndex"
                    @change-expand="changeExpandFn"
                    @click-sub-menu="clickSubMenuFn"
                ></MoreMenu>
            </div>
        </div>
        <div v-show="isShowNav" class="menu__mobile">
            <NavMenu
                :menus="menus"
                :current-index="currentIndex"
                :is-show-nav="isShowNav"
                @click-menu-item="clickMenuItem"
                @close-show-nav="closeShowNav"
            />
            <div
                v-show="isShowNav"
                class="menu__mobile__more cursor"
                :class="{ menu__mobile__more_active: activeMenu }"
            >
                <span class="menu__mobile__text" @click="changeExpandMoreFn">
                    <span class="menu__mobile__left">
                        <img class="menu__mobile__img" src="../assets/nav/tips_icon.png" alt="" />
                        <span>More</span>
                    </span>
                    <i
                        class="menu__mobile__icon iconfont icon-zhankai-copy-icon"
                        :style="{
                            transform: expandMore ? 'rotate(180deg)' : 'rotate(0)'
                        }"
                    ></i>
                </span>
                <MoreMenu
                    v-show="expandMore"
                    class="menu__mobile__submenu"
                    :expand="expand"
                    :current-more-index="currentMoreIndex"
                    @change-expand="changeExpandFn"
                    @change-more-index="changeMoreIndexFn"
                    @click-sub-menu="clickSubMenuFn"
                    @close-show-nav="closeShowNav"
                ></MoreMenu>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { MORE_MENU, NAV_ITEM_WIDTH } from '@/constants';

    interface IMenu {
        label: string;
        value: string;
    }
    interface IProps {
        menus: IMenu[];
        currentIndex?: number;
        isShowNav: boolean;
        activeMenu: boolean;
        showSubMenu: boolean;
        expandMore: boolean;
        expand: boolean;
        currentMoreIndex?: number;
    }
    const props = defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'clickMenu', key: string): void;
        (e: 'closeShowNav', showNav: boolean): void;
        (e: 'changeCurrentIndex', index?: number): void;
        (e: 'changeExpandMore', expandMore: boolean): void;
        (e: 'changeExpand', expand: boolean): void;
        (e: 'changeShowSubMenu'): void;
        (e: 'changeHiddenSubMenu'): void;
        (e: 'clickSubMenu', subMenu: string): void;
        (e: 'changeActiveMenu', menuActive: boolean): void;
        (e: 'changeMoreIndex', moreIndex?: number): void;
    }>();
    const clickMenuItem = (key: string, index: number) => {
        emits('clickMenu', key);
        emits('changeCurrentIndex', index);
    };
    const closeShowNav = (showNav: boolean) => {
        emits('closeShowNav', showNav);
    };
    const changeShowSubMenuFn = () => {
        emits('changeShowSubMenu');
    };
    const changeHiddenSubMenuFn = () => {
        emits('changeHiddenSubMenu');
    };
    const changeExpandFn = () => {
        emits('changeExpand', !props.expand);
    };
    const changeExpandMoreFn = () => {
        emits('changeExpandMore', !props.expandMore);
    };
    const clickSubMenuFn = (subMenu: string) => {
        emits('clickSubMenu', subMenu);
    };
    const changeMoreIndexFn = (moreIndex?: number) => {
        emits('changeMoreIndex', moreIndex);
    };
    const route = useRoute();
    watch(
        route,
        (newRoute) => {
            if (newRoute.path.indexOf('overview') !== -1) {
                emits('changeActiveMenu', true);
                emits('changeCurrentIndex');
                MORE_MENU.forEach((item) => {
                    item.subMenus?.forEach((subMenu, subMenuIndex) => {
                        if (subMenu.label === newRoute.name) {
                            emits('changeMoreIndex', subMenuIndex);
                        }
                    });
                });
            } else {
                if (
                    newRoute.path.indexOf('home') !== -1 ||
                    newRoute.path.indexOf('address') !== -1
                ) {
                    emits('changeCurrentIndex');
                } else {
                    props.menus.forEach((item: IMenu, index: number) => {
                        if (newRoute.path.indexOf(item.label.toLowerCase()) !== -1) {
                            emits('changeCurrentIndex', index);
                        }
                    });
                }
                emits('changeActiveMenu', false);
                emits('changeMoreIndex');
                emits('changeExpand', false);
            }
        },
        { immediate: true }
    );
</script>

<style lang="less">
    .menu {
        &__pc {
            .flex(row, nowrap, center, center);
        }
        &__more {
            position: relative;
            width: v-bind('NAV_ITEM_WIDTH.pc');
            font-size: var(--bj-font-size-sub-title);
            color: rgba(255, 255, 255, 0.65);
            &:hover {
                color: #fff;
                background-image: url('../assets/nav/innovation_bar_bg.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 50% 90%;
            }
            &__submenu {
                position: absolute;
                .flex(column, nowrap);
                left: 32px;
                padding: 4px 0;
                text-align: left;
                background: #fff;
                box-shadow: 0px 2px 8px 0px #d9deec;
                border-radius: 4px;
                border: 1px solid #d9dfee;
            }
        }
        &__more_active {
            font-family: GolosUI_Medium;
            color: #fff;
            background-image: url('../assets/nav/selected.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 90%;
            &:hover {
                background-image: url('../assets/nav/selected.png');
            }
        }
        &__mobile {
            display: none;
            &__more {
            }
            &__more_active {
            }
            &__text {
            }
            &__left {
            }
            &__img {
            }
            &__icon {
            }
            &__submenu {
            }
        }
    }

    @media screen and (max-width: 1200px) {
        .menu {
            &__pc {
            }
            &__more {
                width: v-bind('NAV_ITEM_WIDTH.pc_1200');
                &__submenu {
                }
            }
            &__more_active {
            }
            &__mobile {
                &__more {
                }
                &__more_active {
                }
                &__text {
                }
                &__left {
                }
                &__img {
                }
                &__icon {
                }
                &__submenu {
                }
            }
        }
    }
    @media screen and (max-width: 1150px) {
        .menu {
            position: absolute;
            top: 80px;
            width: 100%;
            &__pc {
                display: none;
            }
            &__more {
                width: 100%;
                &__submenu {
                }
            }
            &__more_active {
            }
            &__mobile {
                display: block;
                &__more {
                }
                &__more_active {
                    .menu__mobile__text {
                        color: #fff;
                    }
                    .menu__mobile__img {
                        visibility: visible;
                    }
                }
                &__text {
                    .flex(row, nowrap, space-between, center);
                    padding: 10px 32px;
                    line-height: 16px;
                    color: rgba(255, 255, 255, 0.65);
                    background-color: #000;
                    &:hover {
                        color: #fff;
                    }
                }
                &__left {
                    font-size: var(--bj-font-size-sub-title);
                }
                &__img {
                    margin-right: 4px;
                    width: 8px;
                    height: 8px;
                    visibility: hidden;
                }
                &__icon {
                }
                &__submenu {
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .menu {
            &__pc {
            }
            &__more {
                &__submenu {
                }
            }
            &__more_active {
            }
            &__mobile {
                &__more {
                }
                &__more_active {
                }
                &__text {
                    padding: 10px 16px;
                }
                &__left {
                }
                &__img {
                }
                &__icon {
                }
                &__submenu {
                }
            }
        }
    }
</style>
