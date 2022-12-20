<template>
    <div class="time">
        <span>{{ columnName }}</span>
        <a-popover destroy-tooltip-on-hide>
            <template #content>
                <p class="popover_c time__tooltip">{{ tooltipText }}</p>
            </template>
            <svg-icon
                v-if="showUtcIcon"
                class="time__tip cursor"
                :icon-name="tipIcon"
                @click="changeShowUtcAgeBtn"
            ></svg-icon>
        </a-popover>
    </div>
</template>

<script setup lang="ts">
    interface ITimeUTCAge {
        tooltipText: string;
        showUtcIcon?: boolean;
        showUtc?: boolean;
        columnName?: string;
        tipIcon?: string;
    }
    const props = withDefaults(defineProps<ITimeUTCAge>(), {
        showUtcIcon: true,
        showUtc: true,
        columnName: 'Time',
        tipIcon: 'icon-time'
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
        &__tooltip {
            white-space: nowrap;
        }
        &__tip {
            margin-left: 4px;
        }
    }
</style>
