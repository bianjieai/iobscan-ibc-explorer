<template>
    <div class="success_rate">
        <div ref="successRateDom" class="success_rate__chart"></div>
    </div>
</template>

<script setup lang="ts">
    import { useSuccessRateChart } from '../composable';
    interface ISucccessRate {
        successRatePercent: number;
    }
    const props = defineProps<ISucccessRate>();
    const { successRatePercent } = toRefs(props);
    const { successRateDom } = useSuccessRateChart(successRatePercent);
</script>

<style lang="less" scoped>
    .success_rate {
        .flex(row, nowrap, center, center);
        &__chart {
            min-width: 200px;
            height: 160px;
        }
    }
</style>
