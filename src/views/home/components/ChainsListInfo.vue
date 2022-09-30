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
                class="card_list"
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }"
                :data-source="sortChainList[currentMenu[0]]"
            >
                <template #renderItem="{ item }">
                    <a-list-item
                        :id="`list${findClassName(item.chain_name)}`"
                        :class="findClassName(item.chain_name)"
                        class="ibc_selected_border card_list_item"
                    >
                        <router-link :to="`/chains`">
                            <a-card class="menu_card" @click="buriedPoint(item)">
                                <img
                                    class="menu_card__img"
                                    :src="item.icon ? item.icon : CHAIN_DEFAULT_ICON"
                                />
                                <p class="menu_card__title">{{ item.chain_name }}</p>
                                <p class="menu_card__value">{{ formatChainID(item.chain_id) }}</p>
                                <!-- todo remove obscuration and Halted -->
                                <!-- <div v-if="item.isInActive" class="menu_card__inactive">
                                    <img
                                        class="menu_card__inactive__logo"
                                        :src="inActiveMask"
                                        alt=""
                                    />
                                </div> -->
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
                    class="list_anchor__item cursor"
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
    import { CHAIN_DEFAULT_ICON } from '@/constants';
    import ChainHelper from '@/helper/chainHelper';
    import { IIbcChains } from '@/types/interface/index.interface';
    import { Ref } from 'vue';
    //  todo remove obscuration and Halted
    // const inActiveMask = new URL('../../../assets/home/mask.png', import.meta.url).href;
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
        onSelectedMenu,
        sortChainList
    } = useAnchors(chainList, emits);
    watch(
        () => prop.chainList,
        () => {
            const id = document.querySelector('.self_link_active')?.id;
            let label: string;
            if (id) {
                label = id.replace('a-link', '');
                setTimeout(() => {
                    onClickAnchor(label);
                }, 0);
            }
        }
    );
    const formatChainID = (chainId: string) => {
        return ChainHelper.formatChainId(chainId);
    };
    const isHaveData: Ref<boolean> = computed(() => {
        return Boolean(
            chainList.value[currentMenu.value[0]] && chainList.value[currentMenu.value[0]].length
        );
    });
    const buriedPoint = (param: any) => {
        (window as any).gtag('event', 'Home-点击链接', {
            clickLink: `点击${currentMenu.value[0]}列表中的${param.chain_name}`
        });
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
            margin-top: 16px;
            width: 100%;
            .flex(row, nowrap, flex-start, flex-start);
        }
        &__item {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-third);
        }
        :deep(.ant-menu-item) {
            padding: 0 24px 0 0;
            &::after {
                left: 0;
                right: 24px;
            }
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
            position: relative;
            border-radius: var(--border-radius-normal);
            :deep(.ant-card-body) {
                padding: 12px;
                min-width: 160px;
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
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--bj-text-normal);
                vertical-align: middle;
            }
            &__value {
                margin: 4px 0 6px;
                font-size: var(--bj-font-size-normal);
                line-height: 17px;
                font-weight: 400;
                color: var(--bj-font-color-65);
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
            // todo remove obscuration and Halted
            // &__inactive {
            //     position: absolute;
            //     top: 0;
            //     right: 0;
            //     bottom: 0;
            //     left: 0;
            //     background: rgba(244, 244, 244, 0.5);
            //     &__logo {
            //         position: absolute;
            //         top: 0;
            //         right: 0;
            //         width: 50px;
            //         height: 50px;
            //     }
            // }
        }
        .list_anchor {
            width: 28px;
            margin-left: 18px;
            &__item {
                width: 100%;
                margin: 6px 0;
                text-align: justify;
                font-size: var(--bj-font-size-normal);
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
        .nodatas {
            margin: 0;
            padding-right: 0;
            &__icon {
                width: 120px;
                margin-top: 24px;
            }
            &__title {
                margin-top: 16px;
                font-size: 14px;
                font-weight: 400;
                color: var(--bj-font-color-65);
            }
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
