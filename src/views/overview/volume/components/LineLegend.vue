<template>
    <div class="line_legend">
        <div class="line_legend__color" :style="{ backgroundColor: color }"></div>
        <div class="line_legend__name">{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
    interface ILineLegend {
        color: string;
        name: string;
    }
    defineProps<ILineLegend>();
</script>

<style lang="less" scoped>
    .line_legend {
        .flex(row,nowrap);
        &__color {
            margin-right: 4px;
            width: 16px;
            height: 16px;
            border-radius: 4px;
        }
        &__name {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.75);
            line-height: 16px;
        }
    }
</style>
