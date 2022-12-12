<template>
    <div class="pie_legend">
        <ibcToast :show-toast="showToast" :client-x="clientX" :client-y="clientY" />
        <div class="pie_legend__content cursor" @click="copyAndClickEventFn(legendName, $event)">
            <div class="pie_legend__content__color_block" :style="{ color: lengedColor }"></div>
            <div class="pie_legend__content__legend_name">{{ legendName }}</div>
        </div>
        <div class="pie_legend__line"></div>
        <div class="pie_legend__percentage">{{ percentage }}</div>
    </div>
</template>

<script setup lang="ts">
    import { useCopyToast } from '@/helper/copyHelper';
    interface IProps {
        lengedColor: string;
        legendName: string;
        percentage: string;
    }
    defineProps<IProps>();
    const { showToast, clientX, clientY, copyAndClickEventFn } = useCopyToast();
</script>

<style lang="less" scoped>
    .pie_legend {
        .flex(row,nowrap,flex-start,center);
        &__content {
            .flex(row,nowrap,center,center);
            &__color_block {
                background-color: blue;
                border-radius: 2px;
                width: 12px;
                height: 12px;
                margin-right: 4px;
            }
            &__legend_name {
                width: 68px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.7);
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        &__line {
            margin-right: 4px;
            height: 8px;
            width: 1px;
            background-color: var(--bj-background-color-third);
        }
        &__percentage {
            width: 50px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.5);
            line-height: 18px;
        }
    }
</style>
