<template>
    <div class="status_container">
        <p class="status_container__status_type">
            <span v-if="type" class="status_container__type">{{ type }}</span>
            <span>Status:</span>
        </p>
        <div class="status_container__status_data">
            <span v-for="(item, index) in statusData" :key="index" class="status_container__item">
                <img
                    class="status_container__img"
                    :src="getDiffStatusImg(item.statusImg)"
                    alt=""
                    :style="{ height: `${height}px` }"
                />
                <span>{{ item.status }}</span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { IBottomStatus } from '@/types/interface/index.interface';

    interface IProps {
        type?: string;
        statusData: IBottomStatus[];
        height: number;
    }
    defineProps<IProps>();
    const getDiffStatusImg = (img: string) => {
        return new URL(`../../../assets/status/${img}`, import.meta.url).href;
    };
</script>

<style lang="less" scoped>
    .status_container {
        .flex(row, nowrap, flex-start, center);
        padding: 0 8px;
        font-size: var(--bj-font-size-normal);
        font-weight: 400;
        color: var(--bj-text-third);
        line-height: 28px;
        background: #f8f9fc;
        border-radius: 14px;
        &__status_type {
            margin-right: 20px;
        }
        &__type {
            margin-right: 4px;
        }
        &__status_data {
            .flex(row, nowrap, flex-start, center);
        }
        &__item {
            .flex(row, nowrap, flex-start, center);
            margin-left: 24px;
            &:first-child {
                margin-left: 0;
            }
        }
        &__img {
            display: inline-block;
            margin-right: 4px;
        }
    }
    @media screen and (max-width: 420px) {
        .status_container {
            .flex(column, nowrap, flex-start, flex-start);
            padding: 4px 8px;
            width: 100%;
            line-height: 20px;
            &__status_type {
            }
            &__type {
            }
            &__status_data {
                width: 100%;
            }
            &__item {
                &:first-child {
                }
            }
            &__img {
            }
        }
    }
    @media screen and (max-width: 360px) {
        .status_container {
            &__status_type {
            }
            &__type {
            }
            &__status_data {
                .flex(row, wrap, flex-start, center);
            }
            &__item {
                margin-left: 0;
                width: 50%;
                &:first-child {
                }
            }
            &__img {
            }
        }
    }
</style>
