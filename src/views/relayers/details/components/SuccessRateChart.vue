<template>
    <div class="success_rate">
        <div ref="successRateDom" class="success_rate__chart"></div>
    </div>
</template>

<script setup lang="ts">
    import { useSuccessRateChart } from '../composable';
    interface ISucccessRate {
        relayedSuccessTxs: number;
        relayedTotalTxs: number;
        successRatePercent: number;
    }
    const props = defineProps<ISucccessRate>();
    const { relayedSuccessTxs, relayedTotalTxs, successRatePercent } = toRefs(props);
    const { successRateDom } = useSuccessRateChart(
        relayedSuccessTxs,
        relayedTotalTxs,
        successRatePercent
    );
</script>

<style lang="less" scoped>
    .success_rate {
        .flex(row, nowrap, center, center);
        &__chart {
            min-width: 219px;
            height: 160px;
        }
    }
</style>
