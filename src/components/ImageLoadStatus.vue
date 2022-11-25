<template>
    <div class="image_status flex justify-center items-center mr-8">
        <img
            v-if="isLoadingImg"
            :style="{ width: width + 'px', height: height + 'px' }"
            :src="imgLoading"
            alt=""
        />
        <img
            v-else-if="!isLoadingImg && displayImageSrc"
            v-lazyload:[isLazyload]="displayImageSrc"
            class="image_status__img"
            :style="{ width: width + 'px', height: height + 'px' }"
            alt=""
        />
        <slot v-else></slot>
    </div>
</template>

<script setup lang="ts">
    import { useImageLoadStatus } from '@/composables';
    import { IMAGE_LOADING } from '@/constants';

    interface IImageLoadStatus {
        imgSrc: string;
        defaultImg: string;
        imgLoading?: string;
        isLazyload?: boolean;
        width?: number;
        height?: number;
    }
    const props = withDefaults(defineProps<IImageLoadStatus>(), {
        isLazyload: false,
        imgLoading: IMAGE_LOADING,
        width: 32,
        height: 32
    });
    const { imgSrc, defaultImg } = toRefs(props);
    const { isLoadingImg, displayImageSrc } = useImageLoadStatus(imgSrc, defaultImg);
</script>

<style lang="less" scoped>
    .image_status {
        &__img {
            border-radius: 50%;
        }
    }
</style>
