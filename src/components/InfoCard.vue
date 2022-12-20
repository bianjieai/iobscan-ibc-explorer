<template>
    <div class="info_card">
        <div class="info_card__title_wrap">
            <div class="flex justify-between">
                <div class="info_card__title">
                    <svg-icon :icon-name="icon"></svg-icon>
                    <span class="info_card__text">{{ title }}</span>
                    <a-tooltip destroy-tooltip-on-hide>
                        <template #title
                            ><span class="popover_c">{{ tipMsg }}</span></template
                        >
                        <img
                            v-if="tipMsg"
                            class="info_card__title__tip_icon cursor"
                            :src="TIP_ICON"
                        />
                    </a-tooltip>
                    <span v-if="subTitle" class="info_card__sub_title">
                        <i class="iconfont" :class="subIcon"></i>
                        {{ subTitle }}
                    </span>
                </div>
                <div v-if="isShowChooseBtn" class="info_card__choose_btn">
                    <value-txs
                        :default-choose-btn="defaultChooseBtn"
                        @change-choose-btn="changeChooseBtn"
                    />
                </div>
                <a
                    v-if="downloadTip"
                    class="info_card__download"
                    :href="downloadUrl"
                    download
                    @click="clickExportAddressTxs"
                >
                    <a-tooltip placement="topRight" arrow-point-at-center destroy-tooltip-on-hide>
                        <template #title>
                            <span class="popover_c">{{ downloadTip }}</span>
                        </template>
                        <a class="flex items-center">
                            <svg-icon icon-name="icon-download" />
                            <span class="info_card__download__text">CSV Export</span>
                        </a>
                    </a-tooltip>
                </a>
            </div>
            <span v-if="subTitle" class="info_card__sub_title_mobile">
                <i class="iconfont" :class="subIcon"></i>
                {{ subTitle }}
            </span>
        </div>
        <div class="info_card__primary">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { TIP_ICON } from '@/constants';
    interface IProps {
        icon: string;
        title: string;
        isShowChooseBtn?: boolean; // 右侧是否有按钮
        defaultChooseBtn?: number; // 默认按钮索引
        downloadTip?: string;
        tipMsg?: string;
        subTitle?: string;
        subIcon?: string;
        downloadUrl?: string;
    }
    withDefaults(defineProps<IProps>(), {
        subIcon: 'icon-shujuliebiao',
        isShowChooseBtn: false,
        defaultChooseBtn: 0,
        downloadUrl: ''
    });
    const emits = defineEmits<{
        (e: 'changeChooseBtn', index: number): void;
        (e: 'exportAddressTxs'): void;
    }>();
    const changeChooseBtn = (index: number) => {
        emits('changeChooseBtn', index);
    };
    const clickExportAddressTxs = () => {
        emits('exportAddressTxs');
    };
</script>

<style lang="less" scoped>
    .info_card {
        margin-top: 18px;
        background: #ffffff;
        border-radius: var(--border-radius-normal);
        &__title_wrap {
            padding: 12px 24px;
            border-bottom: 1px solid var(--bj-border-color);
        }
        &__title {
            .flex(row, nowrap, flex-start, center);
            &__tip_icon {
                margin-left: 8px;
                width: 20px;
            }
        }
        &__text {
            margin-left: 8px;
            font-size: var(--bj-font-size-sub-title);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            white-space: nowrap;
            line-height: 20px;
        }
        &__sub_title {
            .flex(row);
            line-height: 16px;
            margin-left: 8px;
            .iconfont {
                margin-right: 4px;
            }
        }
        &__sub_title_mobile {
            display: none;
        }
        &__choose_btn {
        }
        &__download {
            &__text {
                margin-left: 4px;
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: #3d50ff;
                line-height: 18px;
            }
        }
        &__primary {
            padding: 16px 24px 24px;
        }
    }

    @media screen and(max-width: 660px) {
        .info_card {
            &__title_wrap {
            }
            &__title {
                &__tip_icon {
                }
            }
            &__text {
            }
            &__sub_title {
                display: none;
                .iconfont {
                }
            }
            &__sub_title_mobile {
                margin-top: 12px;
                display: block;
            }
            &__choose_btn {
            }
            &__download {
                &__text {
                }
            }
            &__primary {
            }
        }
    }
    @media screen and(max-width: 500px) {
        .info_card {
            &__title_wrap {
                padding: 12px 16px;
            }
            &__title {
                &__tip_icon {
                }
            }
            &__text {
            }
            &__sub_title {
                display: none;
                .iconfont {
                }
            }
            &__sub_title_mobile {
                margin-top: 12px;
                display: block;
            }
            &__choose_btn {
            }
            &__download {
                &__text {
                    display: none;
                }
            }
            &__primary {
                padding: 16px;
            }
        }
    }
</style>
