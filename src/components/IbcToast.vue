<template>
    <div
        v-show="showToast"
        :style="{ left: clientX + 'px', top: clientY + 'px' }"
        class="ibc_toast"
    >
        {{ text }}
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        showToast?: boolean;
        clientX?: string | number;
        clientY?: string | number;
        text?: string;
    }
    withDefaults(defineProps<IProps>(), {
        text: 'Copied'
    });
</script>

<style lang="less" scoped>
    .ibc_toast {
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -120%);
        width: 50px;
        height: 20px;
        background-color: black;
        border-radius: 8px;
        color: white;
        line-height: 20px;
        text-align: center;
    }
</style>
