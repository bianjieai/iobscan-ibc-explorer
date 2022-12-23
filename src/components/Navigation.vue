<template>
    <a-menu
        :class="isShowNav ? 'header_menu' : 'header_menu_hide header_menu'"
        :selected-keys="currentMenu"
        mode="horizontal"
        @click="clickMenuItem"
    >
        <a-menu-item v-for="item of menus" :key="item.value" class="header_menu__item">
            <img
                v-show="isShowNav"
                src="../assets/nav/tips_icon.png"
                alt=""
                class="header_menu__item__img"
            />
            {{ item.label }}
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts" setup>
    import { MenuClickEventHandler } from 'ant-design-vue/lib/menu/src/interface.js';
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
        (e: 'clickMenu', key: string): MenuClickEventHandler;
    }>();
    const clickMenuItem = (e: { key: string }): MenuClickEventHandler => {
        return emits('clickMenu', e.key);
    };
</script>

<style lang="less">
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

    @media screen and (max-width: 1200px) {
        .header_menu {
            &__item {
                width: 90px;
            }
        }
    }
    @media screen and (max-width: 1090px) {
        .header_menu_hide {
            visibility: hidden;
        }
        .header_menu {
            position: absolute;
            top: 80px;
            background-color: #0e1232;
            width: 100%;
            height: 245px;
            border-top: 4px solid #3d50ff;
            flex-direction: column;
            align-items: baseline;
            justify-content: space-around;
            padding: 20px 0 0 2px;
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
    }
    @media screen and (max-width: 768px) {
        .header_menu {
            &__item {
                margin-left: 16px;
            }
        }
    }
</style>
