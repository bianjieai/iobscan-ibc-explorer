<template>
    <div class="list">
        <a-divider style="margin: 0px; margin-bottom: 0" />
        <div class="list__top">
            <span class="list__top__name">Latest 100 IBC Token Transfers</span>
            <router-link :to="'/transfers'">
                <span v-ga="'Home-点击View All'" class="list__top__button">View All</span>
            </router-link>
        </div>
        <div class="list__middle">
            <div v-if="transferList && transferList.length" class="transfer_list ibc_scrollbar">
                <transfer-list-item
                    v-for="(item, index) of transferList"
                    :key="(item as any).record_id"
                    :item="(item as any)"
                    :index="index"
                    :is-final="index >= transferList.length - 1"
                    :ibc-chains="ibcChains"
                    @click-item="clickListItem"
                    @item-did-expand="itemDidExpand"
                />
            </div>

            <no-datas v-if="!transferList || !transferList.length" class="transfer_list" />
        </div>
        <div class="list__bottom">
            <span class="list__bottom__status_tips">
                <span class="status_log">Status:</span>
                <span v-for="(item, index) in IBC_TX_STATUS_DESC" :key="index" class="status_tip">
                    <img :src="getImageUrl(item.status)" alt="" />
                    <span>{{ item.label }}</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import TransferListItem from './TransferListItem.vue';
    import { useInterfaceActive } from '../composable/useTransferList';
    import { IBC_TX_STATUS_DESC } from '@/constants';
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
    const getImageUrl = (status: string | number) => {
        return new URL(`../../../assets/home/status${status}.png`, import.meta.url).href;
    };
</script>

<style lang="less" scoped>
    .list {
        &__top {
            padding: 18px 24px 0;
            width: 100%;
            .flex(row, nowrap, space-between, center);
            &__name {
                font-size: var(--bj-font-size-normal);
                color: var(--bj-font-color-65);
                line-height: var(--bj-font-size-normal);
            }
            &__button {
                padding: 1px 12px;
                border: 0;
                border-radius: 16px;
                background-color: #3d50ff;
                color: #ffffff;
                font-size: var(--bj-font-size-normal);
                .flex(row, nowrap, center, center);
                &:hover {
                    color: #fff;
                    border-color: #667aff;
                    background: #667aff;
                }
            }
        }
        &__middle {
            margin-top: 10px;
            width: 100%;
            height: 487px;
            .transfer_list {
                width: calc(100% - 48px);
                height: 100%;
                border-bottom: 1px solid var(--bj-border-color);
                overflow-y: auto;
                overflow-x: hidden;
                margin: 0 24px;
            }
        }
        &__bottom {
            .flex(row, nowrap, space-between, center);
            margin: 0 auto;
            padding: 16px 24px;
            max-width: 1200px;
            background: #ffffff;
            border-radius: var(--border-radius-normal);
            &__status_tips {
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
    @media screen and (max-width: 768px) {
        .list {
            &__top {
                &__name {
                }
                &__button {
                }
            }
            &__middle {
            }
            &__bottom {
                &__status_tips {
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
            &__top {
                padding: 18px 16px 0;
                .flex(column, nowrap, flex-start, flex-start);
                &__name {
                }
                &__button {
                    margin-top: 12px;
                }
            }
            &__middle {
                .transfer_list {
                    width: calc(100% - 32px);
                    margin: 0 16px;
                }
            }
            &__bottom {
                padding: 16px;
                &__status_tips {
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
            &__top {
                &__name {
                }
                &__button {
                }
            }
            &__middle {
            }
            &__bottom {
                &__status_tips {
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
            &__top {
                &__name {
                }
                &__button {
                }
            }
            &__middle {
            }
            &__bottom {
                &__status_tips {
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
