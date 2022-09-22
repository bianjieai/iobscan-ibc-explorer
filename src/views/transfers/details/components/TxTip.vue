<template>
    <p v-if="status === IBC_TX_STATUS.failed || status === IBC_TX_STATUS.refund" class="tx_tip">
        {{ errorLog }}
    </p>
</template>

<script setup lang="ts">
    import { IBC_TX_STATUS } from '@/constants/transfers';

    interface IProps {
        status: number;
        errorLog: string;
    }
    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .tx_tip {
        margin-top: 16px;
        padding: 8px;
        color: var(--bj-failed);
        background: rgba(255, 90, 90, 0.1);
        border-radius: 8px;
        word-break: break-all;
    }
</style>
