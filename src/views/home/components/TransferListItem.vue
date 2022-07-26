<template>
    <div class="list_item">
        <div class="list_item_wrap" :class="!item.expanded ? '' : 'list_item_line_hidden'">
            <div class="list_item_expand_btn" @click="onClickExpandBtn">
                <img :src="!item.expanded ? expandImg : packUpImg" alt="" />
            </div>
            <router-link
                class="list_item_info"
                :class="!item.expanded ? 'list_item_line' : ''"
                :to="`/transfers/details?hash=${item.sc_tx_info.hash}`"
            >
                <span class="list_item_number">{{ prefixInteger(index + 1, 3) }}</span>
                <div class="list_item_link">
                    <img class="list_item_icon" :src="item.symbolIcon || tokenDefaultImg" alt="icon" />
                </div>
                <div class="list_subItem" :style="{ borderBottom: isFinal ? '' : '1px solid rgba(0, 0, 0, 0.2)' }">
                    <div class="list_subItem_title_container">
                        <span class="list_subItem_value">{{ formatNum(item.symbolNum) || 0 }}</span>
                        <a-tooltip placement="topLeft">
                            <template #title>{{ item.symbolDenom || '' }}</template>
                            <span class="list_subItem_title">{{ item.symbolDenom || '' }}</span>
                        </a-tooltip>
                    </div>

                    <div class="list_subItem_adress_container">
                        <hash-addr-icon :item="item" :ibc-chains="ibcChains"></hash-addr-icon>
                        <p class="list_item_ago">{{ item.parseTime }} ago</p>
                    </div>
                </div>
            </router-link>
        </div>
        <router-link v-if="item.expanded" class="out_hash_wrap" :to="`/transfers/details?hash=${item.sc_tx_info.hash}`">
            <hash-addr-icon :item="item" :ibc-chains="ibcChains"></hash-addr-icon>
        </router-link>
    </div>
</template>

<script setup>
    import HashAddrIcon from './HashAddrIcon.vue';
    import { prefixInteger, formatNum } from '../../../helper/parseStringHelper';
    import tokenDefaultImg from '../../../assets/token-default.png';
    import expandImg from '../../../assets/expand.png';
    import packUpImg from '../../../assets/pack_up.png';
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
        &_wrap {
            width: 100%;
        }
        &_line_hidden {
            border-bottom: none;
        }
        &_expand_btn {
            display: none;
            cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
        }
        &_info {
            .flex(row, nowrap, space-between, center);
            height: 100%;
            cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
            .list_subItem {
                .flex(row, nowrap, space-between, center);
                padding: 14px 0;
                width: 100%;
                &_adress_container {
                    flex: 1;
                    .flex(row, nowrap, space-between, center);
                }
                &_title_container {
                    .flex(column, nowrap, space-between, flex-start);
                    width: 100%;
                    max-width: 150px;
                    // &:hover {
                    //     .list_subItem_value {
                    //         color: var(--bj-primary-color);
                    //     }
                    //     .list_subItem_title {
                    //         color: var(--bj-primary-color);
                    //     }
                    // }
                }
                &_value {
                    width: 100%;
                    text-align: left;
                    font-size: var(--bj-font-size-normal);
                    font-family: Montserrat-Regular, Montserrat;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.75);
                    line-height: var(--bj-font-size-normal);
                }

                &_title {
                    text-align: left;
                    margin-top: 4px;
                    font-size: var(--bj-font-size-normal);
                    font-family: Montserrat-Regular, Montserrat;
                    font-weight: 400;
                    color: var(--bj-text-third);
                    line-height: 18px;
                    width: 150px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        &_line {
            a {
                cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
            }
        }
        &_ago {
            width: 150px;
            text-align: right;
            font-size: var(--bj-font-size-normal);
            font-family: Montserrat-Regular, Montserrat;
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: var(--bj-font-size-normal);
        }
        &_number {
            font-size: var(--bj-font-size-normal);
            font-family: Montserrat-Regular, Montserrat;
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
        & .out_hash_wrap {
            display: none;
            cursor: url(../../../assets/mouse/shiftlight_mouse.png), default;
        }
    }
    @media screen and (max-width: 970px) {
        .list_item {
            .flex(column, nowrap, space-between, center);
            height: auto;
            &_wrap {
                .flex(row, nowrap, space-between, center);
            }
            &_line_hidden {
                border-bottom: none;
            }
            &_expand_btn {
                display: block;
                img {
                    width: 16px;
                    height: 16px;
                }
            }
            &_info {
                width: 100%;
                .list_subItem {
                    border-bottom: 0 !important;
                    &_adress_container {
                        .flex(row, nowrap, flex-end, center);
                        .out_hash {
                            display: none;
                        }
                    }
                    &_title_container {
                        overflow: auto;
                        text-overflow: ellipsis;
                    }
                    &_value {
                    }

                    &_title {
                        width: 100%;
                    }
                }
            }
            &_line {
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            &_ago {
            }
            &_number {
            }

            &_icon {
            }
            & .out_hash_wrap {
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
            &_wrap {
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            &_line_hidden {
                border-bottom: none;
            }
            &_expand_btn {
                img {
                }
            }
            &_info {
                border-bottom: 0;
                & a {
                    img {
                        margin: 0 8px;
                        width: 32px;
                    }
                }
                .list_subItem {
                    &_adress_container {
                        .out_hash {
                        }
                    }
                    &_title_container {
                        margin-left: 0;
                        margin-right: 0;
                    }
                    &_value {
                    }
                    &_title {
                    }
                }
            }
            &_line {
            }
            &_ago {
                max-width: 70px;
            }
            &_number {
                margin-left: 4px;
            }

            &_icon {
            }
            & .out_hash_wrap {
                .out_hash {
                    .flex(column, nowrap, flex-start, flex-start);
                }
            }
        }
    }
</style>
