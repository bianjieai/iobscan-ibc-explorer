<template>
    <div class="chain_info">
        <TitleCard title="From"></TitleCard>
        <div class="chain_info__details">
            <div class="chain_info__address">
                <span class="chain_info__label">{{ chainAddress.label }}</span>
                <span class="chain_info__value">{{ chainAddress.value }}</span>
            </div>
            <div class="chain_info__chain_id">
                <span class="chain_info__label">{{ chainInfoList.label }}</span>
                <span class="chain_info__value">
                    <span class="chain_info__icon">
                        <img src="" alt="" />
                    </span>
                    <span>{{ chainInfoList.value }}</span>
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
        &__details {
            margin-top: 16px;
            padding: 16px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
    }
</style>
