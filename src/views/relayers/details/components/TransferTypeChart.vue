<template>
    <div class="transfer_type">
        <div ref="transferTypeDom" style="width: 100px; height: 100px"></div>
        <span class="transfer_type__type">{{ type }}</span>
    </div>
</template>

<script setup lang="ts">
    import { useTransferTypeChart } from '../composable';

    interface ITransferType {
        type: string;
        txsCount: number;
        txsPercent: number;
        totalTxsCount: number;
        processColor?: string;
    }
    const props = withDefaults(defineProps<ITransferType>(), {
        processColor: '#3D50FF'
    });
    const { type, txsCount, txsPercent, totalTxsCount, processColor } = toRefs(props);

    const { transferTypeDom } = useTransferTypeChart(
        type,
        txsCount,
        txsPercent,
        totalTxsCount,
        processColor
    );
</script>

<style lang="less" scoped>
    .transfer_type {
        .flex(column, nowrap, flex-start, center);
        padding: 16px 16px 12px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
        &__type {
            margin-top: 12px;
            font-size: var(--bj-font-size-sub-title);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 20px;
        }
    }
    @media screen and (max-width: 460px) {
        .transfer_type {
            width: 100%;
            &:first-child {
                padding-left: 16px;
            }
            &:last-child {
                padding-right: 16px;
            }
            &__type {
            }
        }
    }
</style>
