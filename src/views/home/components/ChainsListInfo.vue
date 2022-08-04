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
        <div id="chainList_content" class="chainlist__bottom">
            <a-list
                v-show="isHaveData"
                id="card_list"
                ref="scrollListRef"
                class="card_list ibc_scrollbar"
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
                :data-source="chainList[currentMenu[0]]"
            >
                <template #renderItem="{ item }">
                    <a-list-item
                        :id="`list${findClassName(item.chain_name)}`"
                        :class="findClassName(item.chain_name)"
                        class="ibc_selected_border card_list_item"
                    >
                        <!-- <router-link :to="`/chains/details?chain_id=${item.chain_id}`">-->
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
            <!-- todo duanjie 样式待调整 -->
            <div v-show="isHaveData" ref="linkListRef" class="list_anchor">
                <div
                    v-for="item of anchors"
                    :id="`a-link${item.title}`"
                    :key="item.title"
                    class="list_anchor_item"
                    @click="onClickAnchor(item.title)"
                >
                    <div class="custom_title">
                        <span class="custom_title_left">{{ item.title.split('')[0] }}</span>
                        <span>{{ item.title.split('')[1] }}</span>
                        <span class="custom_title_right">{{ item.title.split('')[2] }}</span>
                    </div>
                </div>
            </div>
            <no-datas
                v-if="!chainList[currentMenu[0]] || !chainList[currentMenu[0]].length"
                class="card_list"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useAnchors } from '../composable/useChainsListInfo';
    import ChainHelper from '@/helper/chainHelper';
    import { IIbcChains } from '@/types/interface/index.interface';
    import { Ref } from 'vue';
    const chainDefaultImg = new URL('../../../assets/home/chain-default.png', import.meta.url).href;
    interface IProps {
        chainList: IIbcChains;
    }
    const prop = defineProps<IProps>();
    const { chainList } = toRefs(prop);
    const emits = defineEmits(['onMenuSelected', 'clickItem']);
    const {
        menus,
        currentMenu,
        anchors,
        scrollListRef,
        linkListRef,
        findClassName,
        onClickAnchor,
        onSelectedMenu
    } = useAnchors(chainList, emits);
    const formatChainID = (chainId: string) => {
        return ChainHelper.formatChainId(chainId);
    };
    const isHaveData: Ref<boolean> = computed(() => {
        return Boolean(
            chainList.value[currentMenu.value[0]] && chainList.value[currentMenu.value[0]].length
        );
    });
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
            padding-right: 20px;
            height: 182px;
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
            width: 28px;
            margin-left: 18px;
            &_item {
                width: 100%;
                margin: 7px 0;
                text-align: justify;
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: var(--bj-text-third);
            }
            .self_link_active {
                color: #ffffff;
                width: 32px;
                background-color: #3d50ff;
                border-radius: var(--border-radius-normal);
                padding: 0px 2px;
                .custom_title {
                    color: #fff;
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
