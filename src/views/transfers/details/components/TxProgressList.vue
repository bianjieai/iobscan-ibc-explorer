<template>
    <ul class="progress_list">
        <li v-for="(item, index) in progressListAll" :key="index" class="progress_list__item">
            <span class="progress_list__label">{{ item.label }}</span>
            <span
                v-if="item.isFormatStatus"
                class="progress_list__value"
                :class="changeColor(item.value)"
                >{{ item.value }}</span
            >
            <span v-else class="progress_list__value">{{ item.value }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
    import type { IIbcTxInfo, IProgress, ITxInfo } from '@/types/interface/transfers.interface';
    import { useProgressList } from '../composable';

    interface IProps {
        ibcTxInfo: IIbcTxInfo | undefined;
        mark: IProgress;
        ibcTxStatus: number;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();
    const { progressListAll, changeColor } = useProgressList(props);
</script>

<style lang="less" scoped>
    .progress_list {
        margin-top: 24px;
        &__item {
            .flex(row, nowrap, flex-start, flex-start);
            margin-top: 16px;
            list-style: none;
            &:first-child {
                margin-top: 0;
            }
        }
        &__label {
            width: 164px;
            font-size: var(--bj-font-size-normal);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 40px;
        }
        &__success {
            color: var(--bj-success);
        }
        &__failed {
            color: var(--bj-failed);
        }
    }
</style>
