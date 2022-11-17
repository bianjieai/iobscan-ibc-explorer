<template>
    <div class="page_title">
        <div v-if="!relayer">
            <img v-if="imgSrc" class="page_title__icon" :src="imgSrc" alt="" />
        </div>
        <div v-else>
            <img v-if="relayerImgSrc" class="page_title__icon" :src="relayerImgSrc" alt="" />
            <div
                v-else
                class="page_title__icon page_title__icon_wrap flex items-center justify-center"
            >
                <span class="page_title__icon_text">{{
                    (title.substring(0, 1) || '').toUpperCase()
                }}</span>
            </div>
        </div>
        <div class="page_title__wrap" :class="{ page_title__wrap_diff: title.length > 60 }">
            <div class="page_title__text">
                <div v-if="!relayer">
                    <img v-if="imgSrc" class="page_title__icon_mobile" :src="imgSrc" alt="" />
                </div>
                <div v-else>
                    <img
                        v-if="relayerImgSrc"
                        class="page_title__icon_mobile"
                        :src="relayerImgSrc"
                        alt=""
                    />
                    <div v-else class="page_title__icon_mobile page_title__icon_wrap">
                        <span class="page_title__icon_text">{{
                            (title.substring(0, 1) || '').toUpperCase()
                        }}</span>
                    </div>
                </div>
                <a-popover v-if="title.length > 60" destroy-tooltip-on-hide>
                    <template #content>
                        <span>{{ title }}</span>
                    </template>
                    <span class="page_title__title">{{ title }}</span>
                </a-popover>
                <span v-else class="page_title__title">{{ title }}</span>
                <span v-if="subtitle" class="page_title__sub_title_wrap">
                    <i class="iconfont" :class="titleIcon"></i>
                    <span class="page_title__sub_title">{{ subtitle }}</span>
                </span>
            </div>
            <div class="page_title__background"></div>
        </div>
        <span v-if="subtitle" class="page_title__sub_title_mobile">
            <i class="iconfont" :class="titleIcon"></i>
            <span class="page_title__sub_title">{{ subtitle }}</span>
        </span>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        titleIcon?: string;
        title: string;
        subtitle?: string;
        imgSrc?: string;
        relayer?: boolean;
        relayerImgSrc?: string;
    }

    withDefaults(defineProps<IProps>(), {
        titleIcon: 'icon-shujuliebiao'
    });
</script>

<style lang="less" scoped>
    .page_title {
        .flex(row, nowrap, flex-start, center);
        &__icon {
            margin-right: 8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        &__icon_wrap {
            background: url('../../assets/relayers/default_bg.png') no-repeat center center;
            border-radius: 50%;
        }
        &__icon_text {
            font-size: 22px;
            background: linear-gradient(to right, #b3bbff, #8594ff);
            background-size: cover;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        &__icon_mobile {
            display: none;
        }
        &__wrap {
            position: relative;
        }
        &__wrap_diff {
            width: calc(100% - 48px);
        }
        &__text {
            .flex(row, nowrap, flex-start, center);
        }
        &__title {
            display: inline-block;
            margin-right: 12px;
            width: 100%;
            font-size: var(--bj-font-size-title);
            font-family: Eurocine-regular;
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 24px;
            -webkit-text-stroke: 0px var(--bj-text-normal);
            overflow: hidden;
            text-overflow: ellipsis;
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
    @media screen and(max-width: 580px) {
        .page_title {
            .flex(column, nowrap, flex-start, flex-start);
            &__icon {
                display: none;
            }
            &__icon_mobile {
                .flex(row, nowrap, center, center);
                margin-right: 8px;
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
            &__wrap {
            }
            &__text {
            }
            &__title {
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
            }
        }
    }
</style>
