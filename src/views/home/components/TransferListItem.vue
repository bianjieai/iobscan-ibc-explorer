<template>
    <div class="list_item">
        <div class="list_item__wrap" :class="{ list_item__line_hidden: item.expanded }">
            <div class="list_item__expand_btn" @click="onClickExpandBtn">
                <img :src="!item.expanded ? expandImg : packUpImg" alt="" />
            </div>
            <router-link
                class="list_item__info"
                :class="{ list_item__line: !item.expanded }"
                :to="`/transfers/details?hash=${item.sc_tx_info.hash}`"
            >
                <span class="list_item__number">{{ prefixInteger(index + 1, 3) }}</span>
                <div class="list_item_link">
                    <img
                        class="list_item_icon"
                        :src="item.symbolIcon || tokenDefaultImg"
                        alt="icon"
                    />
                </div>
                <div
                    class="list_subItem"
                    :style="{ borderBottom: isFinal ? '' : '1px solid var(--bj-border-color)' }"
                >
                    <div class="list_subItem__title_container">
                        <span class="list_subItem__value">{{
                            formatNum(item.symbolNum) || 0
                        }}</span>
                        <a-tooltip v-if="item.symbolDenom?.length > 22" placement="topLeft">
                            <template #title>{{ item.symbolDenom || '' }}</template>
                            <span class="list_subItem__title">{{ item.symbolDenom || '' }}</span>
                        </a-tooltip>
                        <span v-else class="list_subItem__title">{{ item.symbolDenom || '' }}</span>
                    </div>

                    <div class="list_subItem__adress_container">
                        <hash-addr-icon :item="item" :ibc-chains="ibcChains"></hash-addr-icon>
                        <p class="list_item__ago">{{ item.parseTime }} ago</p>
                    </div>
                </div>
            </router-link>
        </div>
        <router-link
            v-if="item.expanded"
            class="list_item__out_hash_wrap"
            :to="`/transfers/details?hash=${item.sc_tx_info.hash}`"
        >
            <hash-addr-icon :item="item" :ibc-chains="ibcChains"></hash-addr-icon>
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import HashAddrIcon from './HashAddrIcon.vue';
    import { prefixInteger, formatNum } from '@/helper/parseStringHelper';
    import tokenDefaultImg from '@/assets/token-default.png';
    import expandImg from '@/assets/expand.png';
    import packUpImg from '@/assets/pack_up.png';
    import { useIsExpand } from '../composable/useTransferList';

    const props = defineProps({
        isFinal: Boolean,
        index: {
            type: Number,
            required: true
        },
        item: {
            type: Object,
            required: true
        },
        ibcChains: {
            type: Object,
            required: true
        }
    });
    const emits = defineEmits(['clickItem', 'clickViewAll', 'itemDidExpand']);

    const { onClickExpandBtn } = useIsExpand(emits, props.index);
</script>

<style lang="less" scoped>
    .list_item {
        .flex(row, nowrap, space-between, center);
        padding: 0 16px 0 0;
        height: 78px;
        &__wrap {
            width: 100%;
        }
        &__line_hidden {
            border-bottom: none;
        }
        &__expand_btn {
            display: none;
        }
        &__info {
            .flex(row, nowrap, space-between, center);
            height: 100%;
            .list_subItem {
                .flex(row, nowrap, space-between, center);
                padding: 14px 0;
                width: 100%;
                &__adress_container {
                    flex: 1;
                    .flex(row, nowrap, space-between, center);
                    margin-left: 8px;
                }
                &__title_container {
                    .flex(column, nowrap, space-between, flex-start);
                    width: 100%;
                    max-width: 180px;
                }
                &__value {
                    width: 100%;
                    text-align: left;
                    font-size: var(--bj-font-size-sub-title);
                    color: var(--bj-text-normal);
                    line-height: var(--bj-font-size-normal);
                }

                &__title {
                    text-align: left;
                    margin-top: 4px;
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    color: var(--bj-text-third);
                    line-height: 18px;
                    width: 180px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        &__line {
        }
        &__ago {
            width: 150px;
            text-align: right;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-normal);
        }
        &__number {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-third);
            line-height: var(--bj-font-size-normal);
            margin: 0 0 0 8px;
        }
        &_icon {
            width: 40px;
            border-radius: 50%;
            margin: 0 24px 0 12px;
        }
        &__out_hash_wrap {
            display: none;
        }
    }
    @media screen and (max-width: 970px) {
        .list_item {
            .flex(column, nowrap, space-between, center);
            height: auto;
            &__wrap {
                .flex(row, nowrap, space-between, center);
            }
            &__line_hidden {
                border-bottom: none;
            }
            &__expand_btn {
                display: block;
                img {
                    width: 16px;
                    height: 16px;
                }
            }
            &__info {
                width: 100%;
                .list_subItem {
                    border-bottom: 0 !important;
                    &__adress_container {
                        .flex(row, nowrap, flex-end, center);
                        .out_hash {
                            display: none;
                        }
                    }
                    &__title_container {
                        overflow: auto;
                        text-overflow: ellipsis;
                    }
                    &__value {
                    }

                    &__title {
                        width: 100%;
                    }
                }
            }
            &__line {
                border-bottom: 1px solid var(--bj-border-color);
            }
            &__ago {
            }
            &__number {
            }

            &__icon {
            }
            &__out_hash_wrap {
                .flex(row, nowrap, center, center);
                padding: 12px 0;
                width: 100%;
                background: #f5f7fc;
            }
        }
    }
    @media screen and (max-width: 600px) {
        .list_item {
            width: 100%;
            &__wrap {
                border-bottom: 1px solid var(--bj-border-color);
            }
            &__line_hidden {
                border-bottom: none;
            }
            &__expand_btn {
                img {
                }
            }
            &__info {
                border-bottom: 0;
                & a {
                    img {
                        margin: 0 8px;
                        width: 32px;
                    }
                }
                .list_subItem {
                    &__adress_container {
                        .out_hash {
                        }
                    }
                    &__title_container {
                        margin-left: 0;
                        margin-right: 0;
                    }
                    &__value {
                    }
                    &__title {
                    }
                }
            }
            &__line {
            }
            &__ago {
                max-width: 70px;
            }
            &__number {
                margin-left: 4px;
            }

            &__icon {
            }
            &__out_hash_wrap {
                .out_hash {
                    .flex(column, nowrap, flex-start, flex-start);
                }
            }
        }
    }
</style>
