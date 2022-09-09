<template>
    <div class="tx_status">
        <span v-show="isShowSuccess" class="tx_status__icon tx_status__success">
            <i class="iconfont icon-chenggong"></i>
            <span class="tx_status__text">Success</span>
        </span>
        <span v-show="isShowFailed" class="tx_status__icon tx_status__failed">
            <i class="iconfont icon-shibai"></i>
            <span class="tx_status__text">Failed</span>
        </span>
        <span v-show="isShowProcessing" class="tx_status__icon tx_status__processing">
            <i class="iconfont icon-dengdai"></i>
            <span class="tx_status__text">Processing</span>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { useJudgeStatus } from '../composable';

    interface IProps {
        status: number;
    }
    const props = defineProps<IProps>();
    const { isShowSuccess, isShowProcessing, isShowFailed } = useJudgeStatus(props);
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
        &__text {
            margin-left: 4px;
            font-size: var(--bj-font-size-normal);
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
