<template>
    <div
        class="rload_img flex items-center justify-center mr-8"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
        <div class="rload_img__text">
            {{ (imgText.substring(0, 1) || '').toUpperCase() }}
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IRLoadErrorImage {
        imgText: string;
        width?: number;
        height?: number;
    }
    withDefaults(defineProps<IRLoadErrorImage>(), {
        width: 32,
        height: 32
    });
</script>

<style lang="less" scoped>
    .rload_img {
        background: url('../../../../assets/relayers/default_bg.png') no-repeat center center;
        border-radius: 50%;
        &__text {
            font-size: 22px;
            background: linear-gradient(to right, #b3bbff, #8594ff);
            background-size: cover;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
</style>
