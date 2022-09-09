<template>
    <div class="chain_info">
        <TitleCard title="From"></TitleCard>
        <div class="chain_info__details">
            <div class="chain_info__address">
                <span class="chain_info__label chain_info__address_label">
                    {{ chainAddress.label }}
                </span>
                <span class="chain_info__value chain_info__address_value">
                    <span>{{ chainAddress.value }}</span>
                    <CopyComponent :copy-text="chainAddress.value"></CopyComponent>
                </span>
            </div>
            <div class="chain_info__chain_id">
                <span class="chain_info__label">{{ chainInfoList.label }}</span>
                <span class="chain_info__value">
                    <span class="chain_info__icon">
                        <img src="" alt="" />
                    </span>
                    <span>{{ ChainHelper.formatChainId(chainInfoList.value) }}</span>
                </span>
            </div>
            <div class="chain_info__list">
                <div
                    v-for="(item, index) in chainInfoListExpand"
                    :key="index"
                    class="chain_info__list_expand__item"
                >
                    <span class="chain_info__label">{{ item.label }}</span>
                    <span class="chain_info__value">{{ item.value }}</span>
                </div>
            </div>
            <div v-if="isShowChainDetailsInfo" class="chain_info__list_expand">
                <div
                    v-for="(item, index) in chainInfoListExpand"
                    :key="index"
                    class="chain_info__list_expand__item"
                >
                    <span class="chain_info__label">{{ item.label }}</span>
                    <span class="chain_info__value">{{ item.value }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ITxInfo } from '@/types/interface/transfers.interface';
    import ChainHelper from '@/helper/chainHelper';
    import { useChainInfo } from '@/views/transfers/details/composable';
    import TitleCard from './TitleCard.vue';
    interface IProps {
        chainInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();

    const { chainAddress, chainInfoList, chainInfoListExpand, isShowChainDetailsInfo } =
        useChainInfo(props);
</script>

<style lang="less" scoped>
    .chain_info {
        width: 300px;
        &__details {
            margin-top: 16px;
            padding: 16px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
        &__address {
            .flex(column, nowrap, flex-start, flex-start);
        }
        &__chain_id {
            .flex(row, nowrap, flex-start, center);
            margin-top: 16px;
        }
        &__list {
            margin-top: 16px;
        }
        &__list_expand__item {
            .flex(row, nowrap, flex-start, center);
            margin-top: 16px;
        }
        &__label {
            width: 92px;
            font-size: var(--bj-font-size-normal);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__address_value {
            margin-top: 2px;
            margin-left: 0;
            word-break: break-all;
        }
    }
</style>
