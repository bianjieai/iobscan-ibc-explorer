<template>
    <div class="tx_status">
        <span v-show="status === IBC_TX_STATUS.success" class="tx_status__icon tx_status__success">
            <i class="iconfont icon-chenggong"></i>
            Success
        </span>
        <span
            v-show="status === IBC_TX_STATUS.failed || status === IBC_TX_STATUS.refund"
            class="tx_status__icon tx_status__failed"
        >
            <i class="iconfont icon-shibai"></i>
            Failed
        </span>
        <span
            v-show="status === IBC_TX_STATUS.processing"
            class="tx_status__icon tx_status__processing"
        >
            <i class="iconfont icon-dengdai"></i>
            Processing
        </span>
    </div>
</template>

<script setup lang="ts">
    import { IBC_TX_STATUS } from '@/constants/transfers';

    interface IProps {
        status: number;
    }
    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .tx_status {
        &__icon {
            margin-left: 12px;
            padding: 4px 8px;
            border-radius: 14px;
        }
        &__success {
            color: var(--bj-success);
            background: rgba(0, 200, 83, 0.1);
        }
        &__processing {
            color: var(--bj-processing);
            background: rgba(255, 196, 0, 0.1);
        }
        &__failed {
            color: var(--bj-failed);
            background: rgba(255, 90, 90, 0.1);
        }
    }
    @media screen and (max-width: 414px) {
        .tx_status {
            &__icon {
                margin-top: 8px;
                margin-left: 0;
            }
        }
    }
</style>
