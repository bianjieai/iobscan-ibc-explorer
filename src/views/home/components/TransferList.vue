<template>
    <div class="list">
        <a-divider style="margin: 0px; margin-bottom: 0" />
        <div class="list_top">
            <span class="list_top_name">Latest 100 IBC Token Transfer List</span>
            <router-link :to="'/transfers'">
                <a-button class="list_top_button">View All</a-button>
            </router-link>
        </div>
        <div class="list_middle">
            <div v-if="transferList && transferList.length" class="transfer_list ibc_scrollbar">
                <transfer-list-item
                    v-for="(item, index) of transferList"
                    :key="item.record_id"
                    :item="item"
                    :index="index"
                    :is-final="index >= transferList.length - 1"
                    :ibc-chains="ibcChains"
                    @click-item="clickListItem"
                    @item-did-expand="itemDidExpand"
                />
            </div>

            <no-datas v-if="!transferList || !transferList.length" class="transfer_list" />
        </div>
        <div class="list_bottom">
            <span class="status_tips">
                <span class="status_log">Status:</span>
                <span v-for="(item, index) in ibcTxStatusDesc" :key="index" class="status_tip">
                    <img :src="getImageUrl(item.status)" alt="" />
                    <span>{{ item.label }}</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup>
    import TransferListItem from './TransferListItem.vue';
    import { useInterfaceActive } from '../composable/useTransferList';
    import { ibcTxStatusDesc } from '@/constants';
    defineProps({
        transferList: {
            type: Array,
            required: true
        },
        ibcChains: {
            type: Object,
            required: true
        }
    });
    const emits = defineEmits(['clickViewAll', 'clickItem', 'itemDidExpand']);
    const { clickListItem, itemDidExpand } = useInterfaceActive(emits);
    const getImageUrl = (status) => {
        return new URL(`../../../assets/status${status}.png`, import.meta.url).href;
    };
</script>

<style lang="less" scoped>
    .list {
        &_top {
            width: 100%;
            .flex(row, nowrap, space-between, center);
            &_name {
                font-size: var(--bj-font-size-normal);
                font-family: Montserrat-Regular, Montserrat;
                color: var(--bj-font-color-65);
                line-height: var(--bj-font-size-normal);
                margin: 24px;
            }
            &_button {
                margin: 24px;
                height: 24px;
                line-height: 24px;
                border: 0;
                border-radius: 12px;
                background-color: #3d50ff;
                color: #ffffff;
                font-size: var(--bj-font-size-normal);
                .flex(row, nowrap, center, center);
            }
        }
        &_middle {
            width: 100%;
            height: 473px;
        }
        &_bottom {
            .flex(row, nowrap, space-between, center);
            margin: 0 auto;
            padding: 16px 24px;
            max-width: 1200px;
            background: #ffffff;
            border-radius: var(--border-radius-normal);
            & .status_tips {
                .flex(row, nowrap, space-between, center);
                padding: 7px 9px;
                width: 396px;
                font-size: 14px;
                font-weight: 400;
                color: var(--bj-text-third);
                line-height: 14px;
                background: #f8f9fc;
                border-radius: 14px;
                .status_tip {
                    .flex(row, wrap, flex-start, center);
                    img {
                        margin-right: 8px;
                        height: 8px;
                    }
                }
                .status_img {
                    width: 22px;
                    margin: 0 16px;
                }
            }
        }
    }
    .transfer_list {
        width: calc(100% - 48px);
        height: 100%;
        border-bottom: 1px solid rgba(#979797, 0.2);
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0 24px;
    }
    @media screen and (max-width: 768px) {
        .list {
            &_top {
                &_name {
                }
                &_button {
                }
            }
            &_middle {
            }
            &_bottom {
                & .status_tips {
                    .status_tip {
                        img {
                        }
                    }
                    .status_img {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .list {
            &_top {
                &_name {
                }
                &_button {
                }
            }
            &_middle {
            }
            &_bottom {
                & .status_tips {
                    width: 100%;
                    .status_tip {
                        img {
                        }
                    }
                    .status_img {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 420px) {
        .list {
            &_top {
                &_name {
                }
                &_button {
                }
            }
            &_middle {
            }
            &_bottom {
                & .status_tips {
                    flex-wrap: wrap;
                    text-align: left;
                    .status_log {
                        margin-bottom: 8px;
                        width: 100%;
                    }
                    .status_tip {
                        img {
                        }
                    }
                    .status_img {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 360px) {
        .list {
            &_top {
                &_name {
                }
                &_button {
                }
            }
            &_middle {
            }
            &_bottom {
                & .status_tips {
                    .status_log {
                    }
                    .status_tip {
                        margin-bottom: 8px;
                        width: 50%;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        img {
                        }
                    }
                    .status_img {
                    }
                }
            }
        }
    }
</style>
