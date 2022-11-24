<template>
    <div class="image_status flex justify-center items-center mr-8">
        <img
            v-if="isLoadingImg"
            :style="{ width: width + 'px', height: height + 'px' }"
            :src="IMAGE_LOADING"
            alt=""
        />
        <img
            v-else-if="!isLoadingImg && displayImageSrc(successImg, defaultImg)"
            v-lazyload="displayImageSrc(successImg, defaultImg)"
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
        successImg: string;
        defaultImg: string;
        width?: number;
        height?: number;
    }
    const props = withDefaults(defineProps<IImageLoadStatus>(), {
        width: 32,
        height: 32
    });
    const { successImg } = toRefs(props);
    const { isLoadingImg, displayImageSrc } = useImageLoadStatus(successImg);
</script>

<style lang="less" scoped>
    .image_status {
        &__img {
            border-radius: 50%;
        }
    }
</style>
