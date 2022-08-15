<!-- todo duanjie 此组件可能会被删除 和 全局组件功能相同 -->
<template>
    <a-dropdown
        :trigger="['click']"
        :placement="'bottomLeft'"
        :visible="isVisible"
        @visible-change="visibleChangeFn"
    >
        <a-button class="button">
            <div class="button__token_icon">
                <img
                    class="button__pre_icon"
                    :style="{ display: showIcon ? 'block' : 'none' }"
                    :src="findSymbolIcon()"
                />
                <span
                    :class="
                        selectedSymbol === defaultTitle.defaultTokens
                            ? 'button__title_default'
                            : 'button__title'
                    "
                    >{{ selectedSymbol }}</span
                >
            </div>
            <span class="button__icon">
                <svg
                    :style="{ transform: isVisible ? 'rotate(180deg)' : 'rotate(0)' }"
                    focusable="false"
                    data-icon="down"
                    width="12px"
                    height="12px"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="64 64 896 896"
                >
                    <path
                        d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                    ></path>
                </svg>
            </span>
        </a-button>
        <template #overlay>
            <div class="overlay">
                <div class="overlay__wrap">
                    <div class="overlay__title cursor" @click="onClickAll">
                        {{ 'All Tokens' }}
                    </div>

                    <div class="overlay__item relative">
                        <h2 class="overlay__item__title">Authed IBC Tokens</h2>
                        <div
                            :class="{
                                top_shadow: !isBoundary?.[0]?.top
                            }"
                        ></div>
                        <div class="overlay__item__content ibc_scrollbar chains_wrap">
                            <template v-for="item in ibcBaseDenoms" :key="item.denom">
                                <div
                                    class="content_item cursor"
                                    :title="item.symbol.length > 9 ? item.symbol : ''"
                                    :class="{
                                        content_item__selected:
                                            selectedSymbol && selectedSymbol === item.symbol
                                    }"
                                    @click="onClickItem(item.symbol)"
                                >
                                    <img
                                        class="content_item__icon"
                                        :src="item.icon || tokenDefaultImg"
                                    />
                                    <span class="content_item__title">{{ item?.symbol }}</span>
                                </div>
                            </template>
                        </div>
                        <div
                            :class="{
                                bottom_shadow: !isBoundary?.[0]?.bottom
                            }"
                        ></div>
                    </div>

                    <div class="overlay__item">
                        <h2 class="overlay__item__title">Other IBC Tokens</h2>
                        <div class="overlay__item__content">
                            <div class="content_item cursor" @click="onClickItem(unAuthed)">
                                <img class="content_item__icon" :src="tokenDefaultImg" />
                                <span class="content_item__title">Others</span>
                            </div>
                        </div>
                    </div>

                    <div class="overlay__item">
                        <h2 class="overlay__item__title">
                            Custom IBC Tokens
                            <a-popover destroy-tooltip-on-hide>
                                <template #content>
                                    <div>
                                        <p class="popover_c">
                                            Hash (in hex format) of the <br />
                                            denomination trace information.
                                        </p>
                                    </div>
                                </template>
                                <img
                                    class="tip cursor"
                                    style="margin-left: 8px"
                                    src="/src/assets/tip.png"
                                />
                            </a-popover>
                        </h2>
                        <div class="overlay__item__content">
                            <a-input
                                v-model:value="inputValue"
                                class="overlay__item__input"
                                allow-clear
                                :placeholder="'Search by ibc/hash'"
                            />
                            <a-button type="primary" @click="onClickSearch">Confirm</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
    import { rmIbcPrefix } from '@/helper/parseStringHelper';
    import { useFindIcon, useIsVisible } from '@/views/transfers/composable';
    import { ref, watch } from 'vue';
    import { defaultTitle, unAuthed } from '@/constants';
    import { IBaseDenom } from '@/types/interface/index.interface';
    const tokenDefaultImg = new URL('../../../assets/token-default.png', import.meta.url).href;
    const props = withDefaults(
        defineProps<{
            ibcBaseDenoms?: IBaseDenom[];
            selectedSymbol?: string;
            clearInput: number;
            showIcon?: boolean;
        }>(),
        {
            ibcBaseDenoms: () => [],
            selectedSymbol: ''
        }
    );
    // const props = defineProps({
    //     ibcBaseDenoms: {
    //         type: Array,
    //         default: () => []
    //     },
    //     selectedSymbol: {
    //         type: String,
    //         default: ''
    //     },
    //     clearInput: {
    //         type: Number,
    //         required: true
    //     },
    //     showIcon: Boolean
    // });
    const emits = defineEmits(['clickItem', 'clickSearch']);
    const { findSymbolIcon } = useFindIcon(props);
    const { isVisible, visibleChange } = useIsVisible();
    const inputValue = ref('');

    // 监听滚动
    const isBoundary = ref<
        {
            top?: boolean;
            bottom?: boolean;
        }[]
    >([]);
    const eleRef = ref<any>();
    const scrollFn = (visible: boolean): void => {
        if (visible) {
            setTimeout(() => {
                eleRef.value = document.querySelectorAll('.chains_wrap');
                isBoundary.value = [];
                Array.prototype.forEach.call(eleRef.value, (ele: HTMLElement, ind: number) => {
                    isBoundary.value[ind] = {
                        top: true,
                        bottom: true
                    };
                    ele.addEventListener('scroll', () => {
                        isBoundary.value[ind].top = ele.scrollTop === 0;
                        if (ele.scrollHeight === ele.scrollTop + ele.clientHeight) {
                            isBoundary.value[ind].bottom = true;
                        } else {
                            isBoundary.value[ind].bottom = false;
                        }
                    });
                });
            });
        } else {
            Array.prototype.forEach.call(eleRef.value, (ele: HTMLElement) => {
                ele.removeEventListener('scroll', () => {});
            });
        }
    };

    const visibleChangeFn = (visible: boolean): void => {
        // 收起展开时候都重新赋值
        visibleChange(visible);

        // 监听一些滚动，只是为了加阴影
        scrollFn(visible);
    };

    watch(
        () => props.clearInput,
        () => {
            inputValue.value = '';
        }
    );
    const onClickItem = (key: any) => {
        inputValue.value = '';
        emits('clickItem', key);
        isVisible.value = false;
    };
    const onClickSearch = () => {
        emits('clickSearch', rmIbcPrefix(inputValue.value.toLowerCase()));
        isVisible.value = false;
    };
    const onClickAll = () => {
        emits('clickSearch', undefined);
        isVisible.value = false;
    };
</script>

<style lang="less" scoped>
    .top_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        background: linear-gradient(180deg, rgba(17, 22, 77, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
        // box-shadow: inset 0 10px 8px -8px #00000026;
    }
    .bottom_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        background: linear-gradient(360deg, rgba(17, 22, 77, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
        transform: translateY(-100%);
        //box-shadow: inset 0 -10px 8px -8px #00000026;
    }
    .button {
        padding: 0 5px 0 5px;
        width: 146px;
        height: 36px;
        margin-right: 8px;
        .flex(row, wrap, space-between, center);
        font-weight: 400;
        height: 36px;
        border: 1px solid var(--bj-border-color);
        &:focus {
            box-shadow: 0 0 0 2px rgb(61 80 255 / 20%);
        }
        &:blur {
            box-shadow: none;
        }
        &__token_icon {
            flex: 1;
            .flex(row, nowrap, center, center);
            overflow: hidden;
        }
        &__title {
            // max-width: 86px;
            text-overflow: ellipsis;
            color: var(--bj-text-third);
            overflow: hidden;
            color: var(--bj-primary-color);
        }
        &__title_default {
            color: var(--bj-text-second);
        }
        &:hover {
            border-color: var(--bj-primary-color);
            .button__icon {
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
        }
        &__icon {
            height: 100%;
            padding-left: 6px;
            .flex(column, nowrap, center, center);
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            color: rgba(0, 0, 0, 0.35);
            border-left: 1px solid var(--bj-border-color);
        }
        &__pre_icon {
            width: 18px;
            margin-right: 5px;
        }
    }
    .overlay {
        max-width: 872px;
        background-color: #fff;
        box-shadow: 0px 2px 8px 0px #d9deec;
        border-radius: 4px;
        border: 1px solid #d9dfee;
        padding: 16px 4px 24px 16px;
        &__wrap {
        }
        &__title {
            display: inline-block;
            background: #f5f7fc;
            border-radius: 4px;
            padding: 6px 12px;
            border: 1px solid transparent;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-font-color-65);
            margin-bottom: 16px;
            width: 140px;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            &:hover {
                border: 1px solid var(--bj-primary-color);
                // color: var(--bj-primary-color);
                transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                // background-color: #ffffff;
            }
        }
        &__item {
            width: 100%;
            &__title {
                font-size: var(--bj-font-size-normal);
                font-weight: 400;
                color: #000000;
                margin-bottom: 14px;
            }
            &__content {
                width: 100%;
                max-height: 210px;
                overflow-y: auto;
                .flex(row, wrap, flex-start, center);
                .content_item {
                    width: 158px;
                    background: #f5f7fc;
                    border-radius: 4px;
                    border: 1px solid transparent;
                    margin: 0 8px 12px 0;
                    padding: 6px 6px;
                    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    .flex(row, nowrap, flex-start, center);
                    .content_item__title {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &:hover {
                        border: 1px solid var(--bj-primary-color);
                        color: var(--bj-primary-color);
                        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                    }
                    &__selected {
                        border: 1px solid var(--bj-primary-color);
                        color: var(--bj-primary-color);
                        background-color: #ffffff;
                        .content_item__title {
                            color: var(--bj-primary-color);
                        }
                    }
                    &__icon {
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }
                    &__title {
                        font-size: var(--bj-font-size-normal);
                        font-weight: 400;
                        overflow: hidden;
                        // text-overflow: ellipsis;
                        // white-space: nowrap;
                        color: var(--bj-font-color-65);
                    }
                }
            }
            &__input {
                width: 240px;
                margin-right: 12px;
            }
        }
    }
    .tip {
        width: 20px;
        z-index: 1;
    }
    .popover_c {
        text-align: center;
    }
    .ant-dropdown-open {
        border-color: var(--bj-primary-color);
        .button__icon {
            color: var(--bj-primary-color);
        }
        &__title {
            color: var(--bj-primary-color);
        }
    }

    @media screen and (max-width: 970px) {
        .button {
            &__title {
            }
            &:hover {
                .button__icon {
                }
            }
            &__icon {
            }
            &__pre_icon {
            }
        }
        .overlay {
            max-width: 680px;
            &__wrap {
                height: 454px;
                overflow: auto;
                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-track {
                    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
                    border-radius: 2px;
                    width: 8px;
                    background: rgba(61, 80, 255, 0.1);
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 4px;
                    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
                    background: rgba(61, 80, 255, 0.5);
                }

                &::-webkit-scrollbar-thumb:window-inactive {
                    background: rgba(61, 80, 255, 0.9);
                }
            }
            &__title {
                &:hover {
                }
            }
            &__item {
                &__title {
                }
                &__content {
                    .content_item {
                        max-width: 120px;
                        .content_item__title {
                        }
                        &:hover {
                        }
                        &__selected {
                        }
                        &__icon {
                        }
                        &__title {
                        }
                    }
                }
                &__input {
                }
            }
        }
        .tip {
        }
        .ant-dropdown-open {
            .button__icon {
            }
        }
    }
    @media screen and (max-width: 768px) {
        .button {
            &__title {
            }
            &:hover {
                .button__icon {
                }
            }
            &__icon {
            }
            &__pre_icon {
            }
        }
        .overlay {
            &__wrap {
            }
            &__title {
                width: 120px;
                &:hover {
                }
            }
            &__item {
                &__title {
                }
                &__content {
                    width: 95%;
                    .content_item {
                        max-width: 120px;
                        .content_item__title {
                        }
                        &:hover {
                        }
                        &__selected {
                        }
                        &__icon {
                        }
                        &__title {
                        }
                    }
                }
                &__input {
                    margin-right: 4px;
                }
            }
        }
        .tip {
        }
        .ant-dropdown-open {
            .button__icon {
            }
        }
    }
    @media screen and (max-width: 582px) {
        .button {
            &__title {
            }
            &:hover {
                .button__icon {
                }
            }
            &__icon {
            }
            &__pre_icon {
            }
        }
        .overlay {
            max-width: 450px;
            &__wrap {
            }
            &__title {
                &:hover {
                }
            }
            &__item {
                &__title {
                }
                &__content {
                    .content_item {
                        .content_item__title {
                        }
                        &:hover {
                        }
                        &__selected {
                        }
                        &__icon {
                        }
                        &__title {
                        }
                    }
                }
                &__input {
                }
            }
        }
        .tip {
        }
        .ant-dropdown-open {
            .button__icon {
            }
        }
    }
    @media screen and (max-width: 420px) {
        .button {
            &__title {
            }
            &:hover {
                .button__icon {
                }
            }
            &__icon {
            }
            &__pre_icon {
            }
        }
        .overlay {
            max-width: 288px;
            &__wrap {
            }
            &__title {
                &:hover {
                }
            }
            &__item {
                &:last-of-type {
                    .overlay__item__content {
                        .flex(column, wrap, flex-start, flex-start);
                        :deep(.ant-btn) {
                            margin-top: 12px;
                        }
                    }
                }
                &__title {
                }
                &__content {
                    width: 100%;

                    .content_item {
                        .content_item__title {
                        }
                        &:hover {
                        }
                        &__selected {
                        }
                        &__icon {
                        }
                        &__title {
                        }
                    }
                }
                &__input {
                }
            }
        }
        .tip {
        }
        .ant-dropdown-open {
            .button__icon {
            }
        }
        .dropdown_token {
            width: 210px;
        }
    }
</style>
