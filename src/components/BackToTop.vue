<template>
    <a-back-top :visibility-height="BACK_TOP_NUM">
        <div class="back_top">
            <i class="iconfont icon-zhiding"></i>
        </div>
    </a-back-top>
</template>

<script setup lang="ts">
    import { BACK_TOP_NUM } from '@/constants';
</script>

<style lang="less" scoped>
    .back_top {
        .flex(row, nowrap, center, center);
        width: 32px;
        height: 32px;
        font-size: var(--bj-font-size-title);
        color: #fff;
        background: var(--bj-primary-color);
        border-radius: var(--border-radius-normal);
        box-shadow: 0px 0px 8px 0px rgba(61, 80, 255, 0.1);
    }
    .ant-back-top {
        right: 40px;
        bottom: 40px;
        width: 32px;
        height: 32px;
        z-index: 1100;
    }
</style>
