<template>
    <div class="chainlist">
        <a-menu class="chainlist_menu" v-model:selectedKeys="currentMenu" mode="horizontal" @select="onSelectedMenu">
            <a-menu-item class="chainlist_item" v-for="item of menus" :key="item.value">
                {{ item.label }}
            </a-menu-item>
        </a-menu>
        <div class="chainlist_bottom">
            <a-list
                class="card_list ibc_scrollbar"
                id="card__list"
                v-show="chainList[currentMenu] && chainList[currentMenu].length"
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
                :data-source="chainList[currentMenu]"
                ref="listRef"
            >
                <template #renderItem="{ item }">
                    <a-list-item
                        :class="findClassName(item.chain_name)"
                        :id="`list${findClassName(item.chain_name)}`"
                        class="ibc_selected_border card_list_item"
                    >
                        <router-link :to="`/chains`">
                            <a-card class="menu_card">
                                <img
                                    class="card_img"
                                    :src="item.icon ? item.icon : tokenDefaultImg"
                                />
                                <p class="card_title">{{ item.chain_name }}</p>
                                <p class="card_value">{{ formatChainID(item.chain_id) }}</p>
                            </a-card>
                        </router-link>
                        <!-- <router-link :to="`/chains/details?chain_id=${item.chain_id}`">
                            <a-card class="menu_card">
                                <img
                                    class="card_img"
                                    :src="item.icon ? item.icon : tokenDefaultImg"
                                />
                                <p class="card_title">{{ item.chain_name }}</p>
                                <p class="card_value">{{ item.chain_id }}</p>
                            </a-card>
                        </router-link> -->
                    </a-list-item>
                </template>
            </a-list>
            <a-anchor
                class="list_anchor"
                :affix="false"
                :getContainer="getBindElement"
                @change="onChangeAnchor"
                v-show="chainList[currentMenu] && chainList[currentMenu].length"
            >
                <a-anchor-link
                    @click.prevent.stop="() => {}"
                    class="list_anchor_item"
                    v-for="item of anchors"
                    :key="item.title"
                    :href="`#list${item.title}`"
                >
                    <template #title>
                        <div class="custom_title">
                            <span class="custom_title_left">{{ item.title.split("")[0] }}</span>
                            <span>{{ item.title.split("")[1] }}</span>
                            <span class="custom_title_right">{{ item.title.split("")[2] }}</span>
                        </div>
                    </template>
                </a-anchor-link>
            </a-anchor>

            <no-datas
                class="card_list"
                v-if="!chainList[currentMenu] || !chainList[currentMenu].length"
            />
        </div>
    </div>
</template>

<script setup>
import NoDatas from '../../../components/NoDatas.vue';
import { useMenus, useInterfaceActive, useAnchors, useGetBindElement } from '../hooks/useChainsListInfo';
import ChainHelper from '@/helper/chainHepler';
const tokenDefaultImg = new URL('../../../assets/token-default.png', import.meta.url).href;
const props = defineProps({
    chainList: Object
})
const emits = defineEmits(['onMenuSelected','clickItem']);
const { menus, currentMenu } = useMenus();
const { onSelectedMenu, clickListItem } = useInterfaceActive(emits);
const { anchors, findClassName, onChangeAnchor } = useAnchors();
const { getBindElement } = useGetBindElement();

const formatChainID = (chainId)=>{
    return ChainHelper.formatChainId(chainId);
}
</script>

<style lang="less" scoped>
.chainlist {
    width: 100%;
    &_menu {
        width: 100%;
        border: 0;
        ::v-deep.ant-menu-overflow{
            .ant-menu-overflow-item{
                &:hover{
                    cursor: url("../../../assets/mouse/shiftlight_mouse.png"),default !important;
                }
            }
        }
        ::v-deep .ant-menu-title-content {
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
    &_bottom {
        margin-top: 8px;
        width: 100%;
        .flex(row, nowrap, flex-start, flex-start);
    }
    &_item {
        font-size: var(--bj-font-size-normal);
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color: var(--bj-text-third);
    }
    .card_list {
        width: calc(100% - 50px);
        height: 182px;
        padding-right: 20px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .menu_card {
        border-radius: var(--border-radius-normal);
        ::v-deep .ant-card-body {
            padding: 12px;
            height: 126px;
        }
    }
    .card_img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid rgba(#000000, 0.2);
    }
    .card_title {
        margin-top: 6px;
        font-size: var(--bj-font-size-sub-title);
        line-height: var(--bj-font-size-sub-title);
        font-family: Montserrat-SemiBold, Montserrat;
        font-weight: 600;
        color: var(--bj-text-second);
    }
    .card_value {
        margin: 6px 0;
        font-size: var(--bj-font-size-normal);
        line-height: 16px;
        font-family: Montserrat-Regular, Montserrat;
        font-weight: 400;
        color:var(--bj-font-color-65);
        word-break: break-all;
    }
    .list_anchor {
        width: 50px;

        &_item {
            width: 100%;
            ::v-deep .ant-anchor-link-title {
                cursor: url("/src/assets/mouse/shiftlight_mouse.png"), default;
            }
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
    &_left {
        width: 10px;
        text-align: left;
    }
    &_right {
        width: 12px;
        text-align: center;
    }
}
</style>