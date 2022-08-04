<template>
    <div class="nodatas">
        <img class="nodatas__icon" src="../assets/no_datas.png" />
        <p class="nodatas__title">No Data</p>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .nodatas {
        .flex(column, nowrap, center, center);
        // min-height: 210px; // 适应table min-height: 300px
        &__icon {
            width: 120px;
        }
        &__title {
            margin-top: 16px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
        }
    }
</style>
