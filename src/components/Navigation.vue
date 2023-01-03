<template>
    <div class="menu">
        <a-menu
            :class="isShowNav ? 'header_menu' : 'header_menu_hide header_menu'"
            :selected-keys="currentMenu"
            mode="horizontal"
            @click="clickMenuItem"
        >
            <a-menu-item
                v-for="item of menus"
                :key="item.value"
                class="header_menu__item"
                @click="closeShowNav"
            >
                <img
                    v-show="isShowNav"
                    src="../assets/nav/tips_icon.png"
                    alt=""
                    class="header_menu__item__img"
                />
                {{ item.label }}
            </a-menu-item>
        </a-menu>
        <div
            class="menu__more"
            :class="{ menu__more_active: activeMenu }"
            @mouseenter="changeShowSubMenu"
            @mouseleave="changeHiddenSubMenu"
        >
            <span>More</span>
            <MoreMenu
                v-if="showSubMenu"
                class="menu__more__submenu"
                :expand="expand"
                @change-expand="changeExpand"
                @click-sub-menu="clickSubMenu"
            ></MoreMenu>
        </div>
        <div
            v-if="isShowNav"
            class="menu__more_mobile"
            :class="{ menu__more_mobile_active: activeMenu }"
        >
            <span class="menu__more_mobile__text" @click="changeExpandMore">
                <span class="menu__more_mobile__left">
                    <img class="menu__more_mobile__img" src="../assets/nav/tips_icon.png" alt="" />
                    <span>More</span>
                </span>
                <i
                    class="menu__more_mobile__icon iconfont icon-zhankai-copy-icon"
                    :style="{
                        transform: expandMore ? 'rotate(180deg)' : 'rotate(0)'
                    }"
                ></i>
            </span>
            <MoreMenu
                v-if="expandMore"
                class="menu__more__submenu"
                :expand="expand"
                @change-expand="changeExpand"
                @click-sub-menu="clickSubMenu"
                @close-show-nav="closeShowNav"
            ></MoreMenu>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useMoreMenu } from '@/composables';
    type Key = string | number;
    interface IMenu {
        label: string;
        value: string;
    }
    interface IProps {
        menus: IMenu[];
        currentMenu: Key[];
        isShowNav: boolean;
    }
    defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'clickMenu', key: string): void;
        (e: 'closeShowNav', showNav: boolean): void;
    }>();
    const clickMenuItem = (e: { key: string }) => {
        emits('clickMenu', e.key);
    };
    const closeShowNav = (showNav: boolean) => {
        emits('closeShowNav', showNav);
    };
    const {
        activeMenu,
        showSubMenu,
        expandMore,
        expand,
        changeExpandMore,
        changeExpand,
        changeShowSubMenu,
        changeHiddenSubMenu,
        clickSubMenu
    } = useMoreMenu();
</script>

<style lang="less">
    .menu {
        .flex(row, nowrap, center, center);
        .header_menu {
            flex: 1;
            .flex(row, nowrap, center, center);
            height: var(--bj-nav-height);
            line-height: var(--bj-nav-height);
            background-color: transparent;
            border: 0;
            &__item {
                width: 110px;
                padding: 0 !important;
                text-align: center;
                &__img {
                    display: none;
                }
            }
            .ant-menu-item {
                line-height: var(--bj-nav-height);
                transition: border-color 0.3s linear;
            }
            .ant-menu-title-content {
                font-size: var(--bj-font-size-sub-title);
                color: rgba(255, 255, 255, 0.65);
                font-weight: var(--bj-font-weight-normal);
            }
            .ant-menu-item-active {
                background-image: url('../assets/nav/innovation_bar_bg.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 50% 90%;
                .ant-menu-title-content {
                    color: #ffffff !important;
                }
                &::after {
                    display: none;
                }
            }
            .ant-menu-item-selected {
                font-family: GolosUI_Medium;
                background-image: url('../assets/nav/selected.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 50% 90%;
                .ant-menu-title-content {
                    color: #ffffff !important;
                }
                &::after {
                    display: none;
                }
            }
        }
        &__more {
            position: relative;
            width: 110px;
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
                padding: 16px 0;
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
        }
        &__more_mobile {
            display: none;
        }
        &__more_mobile_active {
        }
    }

    @media screen and (max-width: 1200px) {
        .menu {
            .header_menu {
                &__item {
                    width: 90px;
                }
            }
            &__more {
                width: 90px;
                &__submenu {
                }
            }
            &__more_active {
            }
            &__more_mobile {
            }
            &__more_mobile_active {
            }
        }
    }
    @media screen and (max-width: 1150px) {
        .menu {
            position: absolute;
            top: 80px;
            .flex(column, nowrap, flex-start, flex-start);
            width: 100%;
            .header_menu_hide {
                visibility: hidden;
            }
            .header_menu {
                padding: 20px 0 0 2px;
                width: 100%;
                background-color: var(--bj-text-normal);
                border-top: 4px solid #3d50ff;
                flex-direction: column;
                align-items: baseline;
                justify-content: space-around;
                &__item {
                    margin-left: 32px;
                    width: 40px;
                    height: 15px;
                    line-height: 15px !important;
                    text-align: left;
                    margin-bottom: 24px !important;
                    &__img {
                        display: inline-block;
                        visibility: hidden;
                        height: 8px;
                    }
                }
            }
            .ant-menu-item-selected {
                background-image: none !important;
                .header_menu__item__img {
                    visibility: visible;
                }
            }
            .ant-menu-item-active {
                background-image: none !important;
            }
            &__more {
                display: none;
                &__submenu {
                }
            }
            &__more_active {
            }
            &__more_mobile {
                display: block;
                width: 100%;
                color: rgba(255, 255, 255, 0.65);
                background-color: var(--bj-text-normal);
                &__text {
                    .flex(row, nowrap, space-between, center);
                    padding: 0 34px 24px;
                    line-height: 16px;
                    &:hover {
                        color: #fff;
                    }
                }
                &__left {
                }
                &__img {
                    margin-right: 4px;
                    width: 8px;
                    height: 8px;
                    visibility: hidden;
                }
            }
            &__more_mobile_active {
                color: #fff;
                .menu__more_mobile__img {
                    visibility: visible;
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .menu {
            .header_menu_hide {
            }
            .header_menu {
                &__item {
                    margin-left: 16px;
                    &__img {
                    }
                }
            }
            &__more {
                &__submenu {
                }
            }
            &__more_active {
            }
            &__more_mobile {
                &__text {
                    padding: 0 20px 24px;
                }
                &__left {
                }
                &__img {
                }
            }
            &__more_mobile_active {
                .menu__more_mobile__img {
                }
            }
        }
    }
</style>
