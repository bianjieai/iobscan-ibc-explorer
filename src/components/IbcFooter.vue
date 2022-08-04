<template>
    <div class="footer_content">
        <div class="footer_content__left">
            <span
                v-for="(item, index) in ICON_LINK"
                :key="index"
                class="footer_content__left__icon cursor"
                @click="onClickIcon(item.iconLink)"
            >
                <i class="iconfont" :class="item.iconName"></i>
            </span>
            Contact us !
        </div>
        <div class="footer_content__right">
            {{ COPYRIGHT }}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { COPYRIGHT, ICON_LINK } from '@/constants';

    const onClickIcon = (item: string) => {
        window.open(item);
    };
</script>

<style lang="less" scoped>
    .footer_content {
        box-sizing: border-box;
        padding: 16px 0;
        width: 100%;
        max-width: 1200px;
        .flex(row, nowrap, space-between, center);

        &__left {
            .flex(row, nowrap, flex-start, center);
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);

            &__icon {
                .flex(row, nowrap, center, center);
                margin-right: 8px;
                width: 28px;
                height: 28px;
                padding: 6px;
                background-color: rgba(61, 80, 255, 0.1);
                border-radius: var(--border-radius-normal);

                &:first-child {
                    .iconfont {
                        font-size: 19px;
                    }
                }

                &:last-child {
                    .iconfont {
                        font-size: 15px;
                    }
                }

                &:hover {
                    background-color: var(--bj-primary-color);

                    .iconfont {
                        color: #fff;
                    }
                }
            }

            .iconfont {
                font-size: var(--bj-font-size-sub-title);
                color: var(--bj-primary-color);
            }
        }

        &__right {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
            line-height: 14px;
        }
    }

    @media screen and (max-width: 1200px) {
        .footer_content {
            &__left {
                &__icon {
                }
            }

            &__right {
            }
        }
    }

    @media screen and (max-width: 768px) {
        .footer_content {
            .flex(column, nowrap, center, center);

            &__left {
                &__icon {
                }
            }

            &__right {
                margin-top: 16px;
                line-height: 18px;
            }
        }
    }
</style>
