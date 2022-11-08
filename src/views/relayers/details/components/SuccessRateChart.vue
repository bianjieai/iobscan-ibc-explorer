<template>
    <div class="success_rate">
        <div ref="successRateDom" style="width: 232px; height: 160px"></div>
    </div>
</template>

<script setup lang="ts">
    import { Ref } from 'vue';
    import { useSuccessRateChart } from '../composable';
    interface ISucccessRate {
        successRatePercent: number;
    }
    const props = defineProps<ISucccessRate>();
    const { successRatePercent } = toRefs(props);
    const successRateDom = ref<HTMLElement>() as Ref<HTMLElement>;
    useSuccessRateChart(successRateDom, successRatePercent);
</script>

<style lang="less" scoped></style>
