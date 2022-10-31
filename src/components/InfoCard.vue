<template>
    <div class="info_card">
        <div class="info_card__title_wrap">
            <div class="info_card__title">
                <svg-icon :icon-name="icon"></svg-icon>
                <span class="info_card__text">{{ title }}</span>
            </div>
            <div v-if="isShowChooseBtn" class="info_card__choose_btn">
                <span
                    v-for="(item, index) in CHOOSE_BTN_TEXT"
                    :key="index"
                    class="info_card__item cursor"
                    :class="{ info_card__active_btn: defaultChooseBtn === index }"
                    @click="changeChooseBtn(index)"
                >
                    {{ item }}
                </span>
            </div>
        </div>
        <div class="info_card__primary">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { CHOOSE_BTN_TEXT } from '@/constants';
    interface IProps {
        icon: string;
        title: string;
        isShowChooseBtn?: boolean;
        defaultChooseBtn?: number;
    }
    withDefaults(defineProps<IProps>(), {
        isShowChooseBtn: true,
        defaultChooseBtn: 0
    });
    const emits = defineEmits<{
        (e: 'changeChooseBtn', index: number): void;
    }>();
    const changeChooseBtn = (index: number) => {
        emits('changeChooseBtn', index);
    };
</script>

<style lang="less" scoped>
    .info_card {
        margin-top: 18px;
        background: #ffffff;
        border-radius: var(--border-radius-normal);
        &__title_wrap {
            .flex(row, nowrap, space-between, center);
            padding: 12px 24px;
            border-bottom: 1px solid var(--bj-border-color);
        }
        &__title {
            .flex(row, nowrap, flex-start, center);
        }
        &__text {
            margin-left: 8px;
            font-size: var(--bj-font-size-sub-title);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
        }
        &__choose_btn {
            background: #ebedff;
            border-radius: var(--border-radius-normal);
        }
        &__item {
            display: inline-block;
            padding: 3px 0;
            width: 59px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: rgba(61, 80, 255, 0.5);
            line-height: 18px;
            text-align: center;
        }
        &__active_btn {
            color: var(--bj-primary-color);
            background: #ffffff;
            border: 1px solid rgba(61, 80, 255, 0.2);
            border-radius: var(--border-radius-normal);
        }
        &__primary {
            padding: 24px;
        }
    }
    @media screen and(max-width: 500px) {
        .info_card {
            &__title_wrap {
                padding: 12px 16px;
            }
            &__title {
            }
            &__text {
            }
            &__choose_btn {
            }
            &__item {
            }
            &__active_btn {
            }
            &__primary {
                padding: 16px;
            }
        }
    }
</style>
