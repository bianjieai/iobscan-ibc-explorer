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
                    @item-did-expand="itemDidExpand"
                />
            </div>

            <no-datas v-if="!transferList || !transferList.length" class="transfer_list" />
        </div>
        <div class="list__bottom">
            <BottomStatus :status-data="BOTTOM_STATUS_DATA.transferStatusData" :height="8" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import TransferListItem from './TransferListItem.vue';
    import { useInterfaceActive } from '../composable/useTransferList';
    import { BOTTOM_STATUS_DATA } from '@/constants';
    defineProps({
        transferList: {
            type: Array,
            required: true
        }
    });
    const emits = defineEmits(['itemDidExpand']);
    const { itemDidExpand } = useInterfaceActive(emits);
</script>

<style lang="less" scoped>
    .list {
        &__top {
            padding: 18px 24px 0;
            width: 100%;
            .flex(row, nowrap, space-between, center);
            &__name {
                font-size: var(--bj-font-size-normal);
                font-family: GolosUI_Medium;
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
                font-family: GolosUI_Medium;
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
            }
        }
    }
</style>
