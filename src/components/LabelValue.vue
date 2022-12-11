<template>
    <div class="info flex">
        <span class="info__label" :style="{ width: `${width}px` }">{{ label }}</span>
        <span class="info__value">
            <span>{{ value }}</span>
            <CopyComponent v-if="allowCopy" :copy-text="value"></CopyComponent>
        </span>
    </div>
</template>

<script setup lang="ts">
    interface ILabelValue {
        label: string;
        value: string;
        allowCopy?: boolean;
        width?: number;
    }
    withDefaults(defineProps<ILabelValue>(), {
        allowCopy: false,
        width: 128
    });
</script>

<style lang="less" scoped>
    .info {
        margin-top: 16px;
        line-height: 18px;
        &:first-child {
            margin-top: 0;
        }
        &__label {
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            white-space: nowrap;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            width: 100%;
            font-size: var(--bj-font-size-normal);
            color: var(--bj-text-second);
            word-break: break-all;
        }
    }
    @media screen and (max-width: 500px) {
        .info {
            flex-direction: column;
            &__label {
                width: 100%;
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
            }
        }
    }
</style>
