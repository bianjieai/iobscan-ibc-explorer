<template>
    <div
        class="loading_container"
        :class="{
            page_loading: props.type === LoadingType.page,
            position_loading: props.type === LoadingType.position
        }"
        :style="{
            height: props.height + props.heightUnit,
            width: props.width + props.widthUnit
        }"
    >
        <a-spin></a-spin>
    </div>
</template>

<script setup lang="ts">
    import { LoadingType } from '@/constants';
    interface IProps {
        type?: LoadingType;
        height?: number;
        heightUnit?: string;
        width?: number;
        widthUnit?: string;
    }
    const props = withDefaults(defineProps<IProps>(), {
        type: LoadingType.page,
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
    .position_loading {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 0.6);
        z-index: 10;
    }
</style>
