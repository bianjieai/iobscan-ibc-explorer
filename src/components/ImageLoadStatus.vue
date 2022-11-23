<template>
    <div class="image_status">
        <!-- 有明确要展示的图片 -->
        <img
            v-if="displayImageSrc"
            class="image_status__img mr-8"
            :style="{ width: width + 'px', height: height + 'px' }"
            :src="displayImageSrc"
            alt=""
        />
        <!-- 需要特殊展示的图片 -->
        <div
            v-else-if="!displayImageSrc && isDisplaySpecialImg"
            class="image_status__img image_status__special_img flex items-center justify-center mr-8"
            :style="{ width: width + 'px', height: height + 'px' }"
        >
            <div class="image_status__text">
                {{ (imgText.substring(0, 1) || '').toUpperCase() }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IImageLoadStatus {
        displayImageSrc?: string;
        isDisplaySpecialImg?: boolean; // 是否展示特殊的图片，默认不展示
        imgText?: string; // 需要特殊展示的文案
        width?: number;
        height?: number;
    }
    withDefaults(defineProps<IImageLoadStatus>(), {
        isDisplaySpecialImg: false,
        imgText: '',
        width: 32,
        height: 32
    });
</script>

<style lang="less" scoped>
    .image_status {
        &__img {
            border-radius: 50%;
        }
        &__special_img {
            background: url('../assets/relayers/default_bg.png') no-repeat center center;
            border-radius: 50%;
        }
        &__text {
            font-size: 22px;
            background: linear-gradient(to right, #b3bbff, #8594ff);
            background-size: cover;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
</style>
