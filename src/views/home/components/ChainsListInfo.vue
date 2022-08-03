<template>
    <div class="chainlist">
        <a-menu
            v-model:selectedKeys="currentMenu"
            class="chainlist__menu"
            mode="horizontal"
            @select="onSelectedMenu"
        >
            <a-menu-item v-for="item of menus" :key="item.value" class="chainlist__item">
                {{ item.label }}
            </a-menu-item>
        </a-menu>
        <div class="chainlist__bottom">
            <a-list
                v-show="chainList[currentMenu as any] && chainList[currentMenu as any].length"
                id="card_list"
                ref="listRef"
                class="card_list ibc_scrollbar"
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
                :data-source="chainList[currentMenu as any]"
            >
                <template #renderItem="{ item }">
                    <a-list-item
                        :id="`list${findClassName(item.chain_name)}`"
                        :class="findClassName(item.chain_name)"
                        class="ibc_selected_border card_list_item"
                    >
                        <router-link :to="`/chains`">
                            <a-card class="menu_card">
                                <img
                                    class="menu_card__img"
                                    :src="item.icon ? item.icon : chainDefaultImg"
                                />
                                <p class="menu_card__title">{{ item.chain_name }}</p>
                                <p class="menu_card__value">{{ formatChainID(item.chain_id) }}</p>
                            </a-card>
                        </router-link>
                    </a-list-item>
                </template>
            </a-list>
            <a-anchor
                v-show="chainList[currentMenu as any] && chainList[currentMenu as any].length"
                class="list_anchor"
                :affix="false"
                :get-container="getBindElement"
                @change="onChangeAnchor"
            >
                <a-anchor-link
                    v-for="item of anchors"
                    :key="item.title"
                    class="list_anchor__item"
                    :href="`#list${item.title}`"
                    @click.prevent.stop="() => {}"
                >
                    <template #title>
                        <div class="custom_title">
                            <span class="custom_title__left">{{ item.title.split('')[0] }}</span>
                            <span>{{ item.title.split('')[1] }}</span>
                            <span class="custom_title__right">{{ item.title.split('')[2] }}</span>
                        </div>
                    </template>
                </a-anchor-link>
            </a-anchor>

            <no-datas
                v-if="!chainList[currentMenu as any] || !chainList[currentMenu as any].length"
                class="card_list"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        useMenus,
        useInterfaceActive,
        useAnchors,
        useGetBindElement
    } from '../composable/useChainsListInfo';
    import ChainHelper from '@/helper/chainHelper';
    const chainDefaultImg = new URL('../../../assets/home/chain-default.png', import.meta.url).href;
    defineProps({
        chainList: {
            type: Object,
            required: true
        }
    });
    const emits = defineEmits(['onMenuSelected', 'clickItem']);
    const { menus, currentMenu } = useMenus();
    const { onSelectedMenu } = useInterfaceActive(emits);
    const { anchors, listRef, findClassName, onChangeAnchor } = useAnchors();
    const { getBindElement } = useGetBindElement();

    const formatChainID = (chainId: string) => {
        return ChainHelper.formatChainId(chainId);
    };
</script>

<style lang="less" scoped>
    .chainlist {
        width: 100%;
        &__menu {
            width: 100%;
            border: 0;
            :deep(.ant-menu-title-content) {
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
            }
            .ant-menu-item-active {
                .ant-menu-title-content {
                    color: var(--bj-text-third);
                }
            }
            .ant-menu-item-selected {
                .ant-menu-title-content {
                    color: var(--bj-text-normal);
                }
            }
        }
        &__bottom {
            margin-top: 8px;
            width: 100%;
            .flex(row, nowrap, flex-start, flex-start);
            :deep(.ant-anchor-wrapper) {
                overflow: visible;
                .ant-anchor {
                    .ant-anchor-ink::before {
                        width: 0;
                    }
                }
            }
        }
        &__item {
            font-size: var(--bj-font-size-normal);
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            color: var(--bj-text-third);
        }
        .card_list {
            width: 100%;
            // width: calc(100% - 50px);
            height: 182px;
            padding-right: 20px;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .menu_card {
            border-radius: var(--border-radius-normal);
            :deep(.ant-card-body) {
                padding: 12px;
                height: 126px;
            }
            &__img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            &__title {
                margin: 6px auto 0;
                max-width: 152px;
                font-size: var(--bj-font-size-sub-title);
                line-height: 20px;
                font-family: Montserrat-SemiBold, Montserrat;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--bj-text-second);
                vertical-align: middle;
            }
            &__value {
                margin: 4px 0 6px;
                font-size: var(--bj-font-size-normal);
                line-height: 16px;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: var(--bj-font-color-65);
                word-break: break-all;
            }
        }
        .list_anchor {
            width: 50px;

            &__item {
                width: 100%;
            }
        }
        .nodatas_icon {
            width: 120px;
            margin-top: 24px;
        }

        .nodatas_title {
            margin-top: 16px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: var(--bj-font-color-65);
        }
    }
    .custom_title {
        .flex(row, nowrap, space-between, center);
        color: var(--bj-text-third);
        &__left {
            width: 10px;
            text-align: left;
        }
        &__right {
            width: 12px;
            text-align: center;
        }
    }
</style>
