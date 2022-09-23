<template>
    <div class="tx_card">
        <div class="tx_card__title">
            <svg-icon :icon-name="icon"></svg-icon>
            <span class="tx_card__text">{{ title }}</span>
        </div>
        <div class="tx_card__primary">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        icon: string;
        title: string;
    }
    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .tx_card {
        margin-top: 18px;
        background: #ffffff;
        border-radius: var(--border-radius-normal);
        &__title {
            .flex(row, nowrap, flex-start, center);
            padding: 12px 24px;
            border-bottom: 1px solid var(--bj-border-color);
        }
        &__text {
            margin-left: 8px;
            font-size: var(--bj-font-size-sub-title);
            font-weight: 500;
            color: var(--bj-text-normal);
        }
        &__primary {
            padding: 24px;
        }
    }
    @media screen and(max-width: 500px) {
        .tx_card {
            &__title {
                padding: 12px 16px;
            }
            &__text {
            }
            &__primary {
                padding: 16px;
            }
        }
    }
</style>
