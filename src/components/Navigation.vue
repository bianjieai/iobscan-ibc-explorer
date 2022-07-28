<template>
    <a-menu
        :class="isShowNav ? 'header_menu' : 'header_menu_hide header_menu'"
        :selected-keys="currentMenu"
        mode="horizontal"
        @click="clickMenuItem"
    >
        <a-menu-item v-for="item of menus" :key="item.value" class="header_menu_item">
            <img
                v-show="isShowNav"
                src="../assets/tips_icon.png"
                alt=""
                class="header_menu_item_img"
            />
            {{ item.label }}
        </a-menu-item>
    </a-menu>
</template>

<script>
    import { reactive, onBeforeUnmount } from 'vue';

    export default {
        props: {
            menus: {
                type: Array,
                required: true
            },
            currentMenu: {
                type: Array,
                required: true
            },
            isShowNav: Boolean
        },
        emits: ['clickMenu'],
        setup(props, context) {
            const timeOuter = reactive({ value: null });
            const clickMenuItem = ({ key }) => {
                context.emit('clickMenu', key);
            };
            onBeforeUnmount(() => {
                clearTimeout(timeOuter.value);
            });

            return {
                clickMenuItem
            };
        }
    };
</script>

<style lang="less">
    .header_menu {
        flex: 1;
        .flex(row, nowrap, center, center);
        height: @nav-height;
        line-height: @nav-height;
        background-color: transparent;
        border: 0;
        &_item {
            width: 110px;
            padding: 0 !important;
            text-align: center;
        }
        .ant-menu-item {
            line-height: @nav-height;
            &:hover {
                cursor: url('../assets/mouse/shiftlight_mouse.png'), default !important;
            }
        }
        .ant-menu-title-content {
            font-size: @font-size4;
            color: rgba(#ffffff, 0.65);
            font-weight: @nav-font-weight;
            font-family: Montserrat-Regular, Montserrat;
        }
        .ant-menu-item-selected {
            background-image: url('../assets/NavSelected.png');
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
        .ant-menu-item-active {
            background-image: url('../assets/NavSelected.png');
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
        .header_menu_item_img {
            display: none;
        }
    }

    @media screen and (max-width: 1200px) {
        .header_menu {
            &_item {
                width: 90px;
            }
        }
    }
    @media screen and (max-width: 1030px) {
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
            &_item {
                margin-left: 32px;
                width: 40px;
                height: 15px;
                line-height: 15px !important;
                text-align: left;
                margin-bottom: 24px !important;
                &_img {
                    visibility: hidden;
                    height: 8px;
                }
            }
            .header_menu_item_img {
                display: inline-block;
            }
        }
        .ant-menu-item-selected {
            background-image: none !important;
            .header_menu_item_img {
                visibility: visible;
            }
        }
        .ant-menu-item-active {
            background-image: none !important;
        }
    }
    @media screen and (max-width: 768px) {
        .header_menu_item {
            margin-left: 16px;
        }
    }
</style>
