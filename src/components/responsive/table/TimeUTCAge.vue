<template>
    <div class="time flex items-center">
        <span>{{ columnName }}</span>
        <a-popover destroy-tooltip-on-hide>
            <template #content>
                <p class="popover_c">{{ tooltipText }}</p>
            </template>
            <img class="time__tip cursor" :src="tipIcon" @click="changeShowUtcAgeBtn" />
        </a-popover>
    </div>
</template>

<script setup lang="ts">
    import { TIP_ICON } from '@/constants';

    interface ITimeUTCAge {
        tooltipText: string;
        showUtc?: boolean;
        columnName?: string;
        tipIcon?: string;
    }
    const props = withDefaults(defineProps<ITimeUTCAge>(), {
        showUtc: true,
        columnName: 'Time',
        tipIcon: TIP_ICON
    });
    const { showUtc } = toRefs(props);
    const emits = defineEmits<{
        (e: 'changeShowUtcAge', isShowUtc: boolean): void;
    }>();
    const changeShowUtcAgeBtn = () => {
        emits('changeShowUtcAge', !showUtc.value);
    };
</script>

<style lang="less" scoped>
    .time {
        .flex(row, nowrap, flex-end, center);
        padding-left: 16px;
        &__tip {
            margin-left: 8px;
            width: 20px;
            height: 20px;
        }
    }
</style>
