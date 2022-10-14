<template>
    <div
        class="loading_container"
        :class="{ page_loading: props.isPageLoading }"
        :style="{
            height: props.height + props.heightUnit,
            width: props.width + props.heightUnit
        }"
    >
        <a-spin></a-spin>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        isPageLoading?: boolean;
        height?: number;
        heightUnit?: string;
        width?: number;
        widthUnit?: string;
    }
    const props = withDefaults(defineProps<IProps>(), {
        isPageLoading: true,
        heightUnit: 'px',
        widthUnit: 'px'
    });
</script>

<style scoped lang="less">
    .loading_container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page_loading {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.6);
        z-index: 10;
    }
</style>
