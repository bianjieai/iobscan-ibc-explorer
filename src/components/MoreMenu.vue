<template>
    <div class="submenu">
        <div v-for="item in MORE_MENU" :key="item.value" class="submenu__item">
            <div class="submenu__item_wrap">
                <a v-if="item.link" class="submenu__item_link" :href="item.link" target="_blank">
                    <span>{{ item.label }}</span>
                </a>
                <span
                    v-else
                    class="submenu__item_link"
                    :class="{ submenu__item_link_active: currentMoreIndex !== undefined }"
                    @click="changeExpandFn"
                >
                    <span>{{ item.label }}</span>
                    <i
                        v-if="item.subMenus"
                        class="submenu__item_icon iconfont icon-zhankai-copy-icon"
                        :style="{
                            transform: expand ? 'rotate(180deg)' : 'rotate(0)'
                        }"
                    ></i>
                </span>
            </div>
            <div v-show="expand" class="submenu__item_submenu_wrap">
                <div
                    v-for="(subMenu, index) in item.subMenus"
                    :key="subMenu.value"
                    class="submenu__item_submenu"
                    :class="{ submenu__item_submenu_active: currentMoreIndex === index }"
                    @click="clickSubMenuFn(subMenu.value, index)"
                >
                    {{ subMenu.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { MORE_MENU } from '@/constants';
    interface IMoreSubMenu {
        expand: boolean;
        currentMoreIndex?: number;
    }
    const props = defineProps<IMoreSubMenu>();
    const emits = defineEmits<{
        (e: 'changeExpand', expand: boolean): void;
        (e: 'clickSubMenu', subMenu: string): void;
        (e: 'closeShowNav', showNav: boolean): void;
        (e: 'changeMoreIndex', moreIndex?: number): void;
    }>();
    const changeExpandFn = () => {
        emits('changeExpand', !props.expand);
    };
    const clickSubMenuFn = (subMenu: string, index: number) => {
        emits('clickSubMenu', subMenu);
        emits('closeShowNav', false);
        emits('changeMoreIndex', index);
    };
</script>

<style lang="less" scoped>
    .submenu {
        &__item {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 16px;
            cursor: pointer;
            &:hover {
                color: var(--bj-primary-color);
                background: rgba(61, 80, 255, 0.04);
                .submenu__item_link {
                    color: var(--bj-primary-color);
                }
            }
        }
        &__item_wrap {
            min-width: 204px;
        }
        &__item_link {
            .flex(row, nowrap, space-between, center);
            padding: 12px;
            width: 100%;
            color: rgba(0, 0, 0, 0.65);
        }
        &__item_link_active {
            color: var(--bj-primary-color);
        }
        &__item_submenu_wrap {
            background: #eef0f6;
        }
        &__item_submenu {
            padding: 8px 8px 8px 24px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 16px;
            &:hover {
                color: var(--bj-primary-color);
            }
        }
        &__item_submenu_active {
            color: var(--bj-primary-color);
        }
    }
    @media screen and (max-width: 1150px) {
        .submenu {
            position: relative;
            left: 0;
            padding: 0;
            background: #0c1033;
            border: 0;
            box-shadow: none;
            &__item {
                padding: 12px 32px 12px 54px;
                &:hover {
                    background: none;
                    .submenu__item_link {
                        color: #fff;
                    }
                }
            }
            &__item_wrap {
            }
            &__item_link {
                padding: 0;
                color: rgba(255, 255, 255, 0.65);
            }
            &__item_link_active {
                color: #fff;
            }
            &__item_submenu_wrap {
                position: absolute;
                top: 80px;
                left: 0;
                width: 100%;
                background: #12184b;
            }
            &__item_submenu {
                padding: 12px 32px 10px 66px;
                color: rgba(255, 255, 255, 0.65);
                text-align: left;
                &:hover {
                    color: #fff;
                }
            }
            &__item_submenu_active {
                color: #fff;
            }
        }
    }
    @media screen and (max-width: 530px) {
        .submenu {
            &__item {
                padding: 12px 16px 12px 42px;
            }
            &__item_wrap {
            }
            &__item_link {
            }
            &__item_link_active {
            }
            &__item_submenu_wrap {
            }
            &__item_submenu {
                padding: 12px 32px 10px 54px;
            }
            &__item_submenu_active {
            }
        }
    }
</style>
