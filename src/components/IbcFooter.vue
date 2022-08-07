<template>
    <div class="footer_container" :class="{ footer_dark_container: isDark }">
        <div class="content">
            <div class="content__left">
                <span
                    v-for="(item, index) in ICON_LINK"
                    :key="index"
                    class="content__left__icon cursor"
                    @click="onClickIcon(item.iconLink)"
                >
                    <i class="iconfont content__left__iconfont" :class="item.iconName"></i>
                </span>
                <span :class="{ dark: isDark, light: isLight }"> Contact us ! </span>
            </div>
            <div class="content__right" :class="{ dark: isDark, light: isLight }">
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
    const isLight = computed(() => {
        return props.type === FooterMode.light;
    });
    const onClickIcon = (item: string) => {
        window.open(item);
    };
</script>

<style lang="less" scoped>
    .dark {
        color: @font-color6;
    }
    .light {
        color: @font-color2;
    }
    .footer_container {
        .flex(column, nowrap, space-between, center);
        padding: 0;
        width: 100%;
        background-color: #eef0f6;
        .content {
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

                &__icon {
                    .flex(row, nowrap, center, center);
                    margin-right: 8px;
                    width: 28px;
                    height: 28px;
                    padding: 6px;
                    background-color: rgba(61, 80, 255, 0.1);
                    border-radius: @card-radio;

                    &:first-child {
                        .content__left__iconfont {
                            font-size: 19px;
                        }
                    }

                    &:last-child {
                        .content__left__iconfont {
                            font-size: 15px;
                        }
                    }

                    &:hover {
                        background-color: var(--bj-primary-color);

                        .content__left__iconfont {
                            color: #fff;
                        }
                    }
                }

                &__iconfont {
                    font-size: var(--bj-font-size-sub-title);
                    color: var(--bj-primary-color);
                }
            }

            &__right {
                font-size: @font-size5;
                font-family: Montserrat-Regular, Montserrat;
                font-weight: 400;
            }
        }
    }
    .footer_dark_container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(238, 240, 246, 0.1);
    }

    @media screen and (max-width: 1200px) {
        .dark {
        }
        .light {
        }
        .footer_container {
            .content {
                padding: 16px 32px;
                &__left {
                    &__icon {
                    }

                    &__iconfont {
                    }
                }

                &__right {
                }
            }
        }
        .footer_dark_container {
        }
    }

    @media screen and (max-width: 768px) {
        .dark {
        }
        .light {
        }
        .footer_container {
            .content {
                .flex(column, nowrap, center, center);
                &__left {
                    &__icon {
                    }

                    &__iconfont {
                    }
                }

                &__right {
                    margin-top: 16px;
                }
            }
        }
        .footer_dark_container {
        }
    }
</style>
