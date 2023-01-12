<template>
    <ul class="header_menu">
        <li
            v-for="(item, index) in menus"
            :key="item.value"
            class="header_menu__item cursor"
            :class="{ header_menu__active_item: currentIndex === index }"
            @click="clickMenuItemFn(item.value, index)"
        >
            <img
                v-show="isShowNav"
                src="../assets/nav/tips_icon.png"
                alt=""
                class="header_menu__item__img"
                :class="{ header_menu__item__img_active: currentIndex === index }"
            />
            {{ item.label }}
        </li>
    </ul>
</template>

<script setup lang="ts">
    import { NAV_ITEM_WIDTH } from '@/constants';
    interface IMenu {
        label: string;
        value: string;
    }
    interface INavProps {
        menus: IMenu[];
        currentIndex?: number;
        isShowNav: boolean;
    }
    defineProps<INavProps>();
    const emits = defineEmits<{
        (e: 'clickMenuItem', key: string, index: number): void;
        (e: 'closeShowNav', showNav: boolean): void;
    }>();
    const clickMenuItemFn = (key: string, index: number) => {
        emits('clickMenuItem', key, index);
        emits('closeShowNav', false);
    };
</script>

<style lang="less" scoped>
    .header_menu {
        .flex(row, nowrap, center, center);
        color: rgba(255, 255, 255, 0.65);
        line-height: var(--bj-nav-height);
        list-style: none;
        &__item {
            width: v-bind('NAV_ITEM_WIDTH.pc');
            font-size: var(--bj-font-size-sub-title);
            &:hover {
                color: #fff;
                background-image: url('../assets/nav/innovation_bar_bg.png');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: 50% 90%;
            }
            &__img {
                display: none;
            }
            &__img_active {
            }
        }
        &__active_item {
            color: #fff;
            font-family: GolosUI_Medium;
            background-image: url('../assets/nav/selected.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 90%;
            &:hover {
                background-image: url('../assets/nav/selected.png');
            }
        }
    }
    @media screen and (max-width: 1200px) {
        .header_menu {
            &__item {
                width: v-bind('NAV_ITEM_WIDTH.pc_1200');
                &__img {
                }
                &__img_active {
                }
            }
            &__active_item {
            }
        }
    }
    @media screen and (max-width: 1150px) {
        .header_menu {
            flex-direction: column;
            background-color: var(--bj-text-normal);
            &__item {
                padding: 10px 32px;
                width: 100%;
                text-align: left;
                line-height: 16px;
                &:hover {
                    background-image: none;
                }
                &__img {
                    display: inline-block;
                    visibility: hidden;
                    height: 8px;
                }
                &__img_active {
                    visibility: visible;
                }
            }
            &__active_item {
                color: #fff;
                background-image: none;
                &:hover {
                    background-image: none;
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .header_menu {
            &__item {
                padding: 10px 16px;
                &__img {
                }
                &__img_active {
                }
            }
            &__active_item {
            }
        }
    }
</style>
