<template>
    <p class="tip popover_c">
        <span class="tip__label">{{ label }}</span>
        <span class="tip__value">{{ value }}</span>
    </p>
</template>

<script setup lang="ts">
    interface IProps {
        label: string;
        value: string;
    }
    withDefaults(defineProps<IProps>(), {
        value: '--'
    });
</script>

<style lang="less" scoped>
    .tip {
        &__label {
            font-family: GolosUI_Medium;
        }
        &__value {
            margin-left: 4px;
        }
    }
</style>
