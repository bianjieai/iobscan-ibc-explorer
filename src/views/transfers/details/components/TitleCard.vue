<template>
    <p class="title">{{ title }}</p>
</template>

<script setup lang="ts">
    interface IProps {
        title: string;
    }
    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .title {
        font-size: var(--bj-font-size-sub-title);
        font-weight: 600;
        color: var(--bj-text-normal);
        line-height: 16px;
    }
</style>
