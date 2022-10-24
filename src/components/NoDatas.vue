<template>
    <div class="nodatas">
        <img class="nodatas__icon" src="../assets/no_datas.png" />
        <p class="nodatas__title">{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
    import { API_ERRPR_MESSAGE } from '@/constants/apiCode';
    interface IProps {
        text?: string;
    }
    withDefaults(defineProps<IProps>(), {
        text: API_ERRPR_MESSAGE.noData
    });
</script>

<style lang="less" scoped>
    .nodatas {
        .flex(column, nowrap, center, center);
        margin: 30px 0 20px;
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
