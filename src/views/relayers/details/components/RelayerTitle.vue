<template>
    <div class="relayer_title">
        <ImageLoadStatus
            class="relayer_title__icon"
            :display-image-src="displayRelayerImgSrc"
            :is-display-special-img="true"
            :img-text="title"
            :width="40"
            :height="40"
        ></ImageLoadStatus>
        <div class="relayer_title__wrap">
            <div class="relayer_title__text">
                <ImageLoadStatus
                    class="relayer_title__icon"
                    :display-image-src="displayRelayerImgSrc"
                    :is-display-special-img="true"
                    :img-text="title"
                    :width="40"
                    :height="40"
                ></ImageLoadStatus>
                <a-popover v-if="displayAdaptor" destroy-tooltip-on-hide>
                    <template #content>
                        <span>{{ title }}</span>
                    </template>
                    <span class="relayer_title__title">
                        <span
                            class="relayer_title__title_left"
                            :class="{
                                relayer_title__title_left__adaptor: displayAdaptor
                            }"
                            >{{ title }}</span
                        >
                        <span v-if="titleSuffix" class="relayer_title__title_right">
                            {{ titleSuffix }}</span
                        >
                    </span>
                </a-popover>
                <span v-else class="relayer_title__title">
                    <span
                        class="relayer_title__title_left"
                        :class="{
                            relayer_title__title_left__adaptor: displayAdaptor
                        }"
                        >{{ title }}</span
                    >
                    <span v-if="titleSuffix" class="relayer_title__title_right">
                        {{ titleSuffix }}</span
                    >
                </span>
                <span v-if="subtitle" class="relayer_title__sub_title_wrap">
                    <i class="iconfont" :class="titleIcon"></i>
                    <span class="relayer_title__sub_title">{{ subtitle }}</span>
                </span>
            </div>
            <div class="relayer_title__background"></div>
        </div>
        <span v-if="subtitle" class="relayer_title__sub_title_mobile">
            <i class="iconfont" :class="titleIcon"></i>
            <span class="relayer_title__sub_title">{{ subtitle }}</span>
        </span>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        titleIcon?: string;
        title: string;
        titleSuffix?: string;
        subtitle?: string;
        displayRelayerImgSrc?: string;
        displayAdaptor?: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        titleIcon: 'icon-shujuliebiao'
    });
</script>

<style lang="less" scoped>
    .relayer_title {
        .flex(row, nowrap, flex-start, center);
        &__icon {
            margin-right: 8px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        &__icon_mobile {
            display: none;
        }
        &__wrap {
            position: relative;
        }
        &__text {
            .flex(row, nowrap, flex-start, center);
        }
        &__title {
            .flex(row, nowrap, flex-start, center);
            margin-right: 12px;
            font-size: var(--bj-font-size-title);
            font-family: Eurocine-regular;
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 24px;
            -webkit-text-stroke: 0px var(--bj-text-normal);
        }
        &__title_left {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &__adaptor {
                max-width: 690px;
            }
        }
        &__title_right {
            margin-left: 4px;
            white-space: nowrap;
        }
        &__sub_title_wrap {
            .iconfont {
                font-size: var(--bj-font-size-normal);
            }
        }
        &__sub_title_mobile {
            display: none;
        }
        &__sub_title {
            margin-left: 4px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 14px;
            white-space: nowrap;
        }
        &__background {
            position: absolute;
            left: 0;
            right: -8px;
            height: 12px;
            bottom: -3px;
            background: linear-gradient(
                90deg,
                rgba(112, 136, 255, 0) 0%,
                rgba(61, 80, 255, 0.15) 100%
            );
            border-radius: 5px;
        }
    }
    @media screen and(max-width: 1200px) {
        .relayer_title {
            &__icon {
            }
            &__icon_mobile {
            }
            &__wrap {
            }
            &__text {
            }
            &__title {
            }
            &__title_left {
                &__adaptor {
                    max-width: 459px;
                }
            }
            &__title_right {
            }
            &__sub_title_wrap {
                .iconfont {
                }
            }
            &__sub_title_mobile {
            }
            &__sub_title {
            }
            &__background {
            }
        }
    }
    @media screen and(max-width: 1000px) {
        .relayer_title {
            &__icon {
            }
            &__icon_mobile {
            }
            &__wrap {
            }
            &__text {
            }
            &__title {
            }
            &__title_left {
                &__adaptor {
                    max-width: 169px;
                }
            }
            &__title_right {
            }
            &__sub_title_wrap {
                .iconfont {
                }
            }
            &__sub_title_mobile {
            }
            &__sub_title {
            }
            &__background {
            }
        }
    }
    @media screen and(max-width: 768px) {
        .relayer_title {
            &__icon {
            }
            &__icon_mobile {
            }
            &__wrap {
            }
            &__text {
            }
            &__title {
            }
            &__title_left {
                &__adaptor {
                    max-width: 50px;
                }
            }
            &__title_right {
            }
            &__sub_title_wrap {
                .iconfont {
                }
            }
            &__sub_title_mobile {
            }
            &__sub_title {
            }
            &__background {
            }
        }
    }
    @media screen and(max-width: 580px) {
        .relayer_title {
            .flex(column, nowrap, flex-start, flex-start);
            &__icon {
                display: none;
            }
            &__icon_mobile {
                .flex(row, nowrap, center, center);
                margin-right: 8px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            &__wrap {
                width: 100%;
            }
            &__text {
                max-width: 480px;
            }
            &__title {
                width: calc(100% - 60px);
            }
            &__title_left {
                &__adaptor {
                    max-width: calc(100% - 48px);
                }
            }
            &__title_right {
            }
            &__sub_title_wrap {
                display: none;
                .iconfont {
                }
            }
            &__sub_title_mobile {
                display: block;
                margin-top: 8px;
            }
            &__sub_title {
            }
            &__background {
                right: 0;
                bottom: 3px;
            }
        }
    }
</style>
