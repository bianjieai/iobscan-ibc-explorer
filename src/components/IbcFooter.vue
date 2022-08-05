<template>
    <div class="footer_container">
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
                <span :class="{ dark: isDark }"> Contact us ! </span>
            </div>
            <div class="footer_content__right" :class="{ dark: isDark }">
                {{ COPYRIGHT }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { COPYRIGHT, ICON_LINK } from '@/constants';
    import { FooterMode } from '@/types/interface/index.interface';
    interface IProps {
        type?: FooterMode;
    }
    const props = withDefaults(defineProps<IProps>(), {
        type: FooterMode.light
    });
    const isDark = computed(() => {
        return props.type === FooterMode.dark;
    });
    const onClickIcon = (item: string) => {
        window.open(item);
    };
</script>

<style lang="less" scoped>
    .footer_container {
        .flex(column, nowrap, space-between, center);
        padding: 0;
        width: 100%;
        background-color: #eef0f6;
        .footer_content {
            box-sizing: border-box;
            padding: 16px 0;
            width: 100%;
            max-width: 1200px;
            .flex(row, nowrap, space-between, center);

            &__left {
                .flex(row, nowrap, flex-start, center);
                font-size: @font-size5;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: @font-color2;

                &__icon {
                    .flex(row, nowrap, center, center);
                    margin-right: 8px;
                    width: 28px;
                    height: 28px;
                    padding: 6px;
                    background-color: rgba(61, 80, 255, 0.1);
                    border-radius: @card-radio;

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
                font-size: @font-size5;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
                color: @font-color2;
            }
        }
        .dark {
            color: @font-color6;
        }
    }

    @media screen and (max-width: 1200px) {
        .footer_container {
            .footer_content {
                padding: 16px 32px;

                &__left {
                    &__icon {
                    }
                }

                &__right {
                }
            }
            .dark {
            }
        }
    }

    @media screen and (max-width: 768px) {
        .footer_container {
            .footer_content {
                .flex(column, nowrap, center, center);

                &__left {
                    &__icon {
                    }
                }

                &__right {
                    margin-top: 16px;
                }
            }
            .dark {
            }
        }
    }
</style>
