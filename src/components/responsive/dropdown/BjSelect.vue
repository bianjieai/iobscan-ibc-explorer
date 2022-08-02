<template>
    <a-dropdown
        v-model:visible="visible"
        :trigger="['click']"
        :overlay-style="{ zIndex: 1020 }"
        @visibleChange="visibleChange"
    >
        <div
            class="flex items-center default_color dropdown-container"
            :class="[{ visible__border: visible }]"
        >
            <div
                class="flex flex-1 overflow-auto flex-wrap text-center mr-8 ml-8 justify-center items-center selected_color_default"
                :class="[
                    {
                        selected_color: selectItems.length > 0 || inputItems.length > 0,
                        visible_color: (selectItems.length > 0 || inputItems.length > 0) && visible
                    }
                ]"
            >
                <!--        输入的渲染-->
                <div
                    v-for="item in inputItems"
                    :key="item.denom"
                    class="flex items-center"
                    :class="{ multiple: props.mode === 'multiple' }"
                >
                    <span class="selectedInfo_title" :title="item.symbol">{{
                        getRestString(item.symbol, 4, 4)
                    }}</span>
                </div>
                <!--        选择的渲染-->
                <div
                    v-for="item in selectItems"
                    :key="item.denom"
                    class="flex items-center"
                    :class="{ multiple: props.mode === 'multiple' }"
                >
                    <img
                        v-if="item.icon?.length"
                        width="18"
                        height="18"
                        class="mr-4"
                        :src="item.icon"
                    />
                    <span class="selectedInfo_title" :title="item.symbol">{{ item.symbol }}</span>
                </div>
                <!--        都没有选的时候展示，类似placeholder-->
                <div
                    v-if="!inputItems.length && !selectItems.length"
                    class="selected_color_default"
                >
                    <span class="selectedInfo_title">{{ props.placeholder }}</span>
                </div>
            </div>
            <span class="button_icon flex justify-between items-center">
                <svg
                    :style="{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }"
                    focusable="false"
                    data-icon="down"
                    width="12px"
                    height="12px"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="64 64 896 896"
                    :class="[visible ? 'visible_color' : '']"
                >
                    <path
                        d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                    ></path>
                </svg>
            </span>
        </div>

        <template #overlay>
            <div class="overlay">
                <div v-for="group in data" :key="group.groupName" class="mb-20">
                    <div v-if="!group.hideGroupName" class="flex items-center">
                        <div class="title">{{ group.groupName }}</div>
                        <a-popover
                            v-if="group.tooltips"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="tip_color">
                                    {{ group.tooltips }}
                                </p>
                            </template>
                            <img
                                class="tip hover"
                                style="margin-left: 8px"
                                src="/src/assets/tip.png"
                            />
                        </a-popover>
                    </div>
                    <div class="chains__wrap">
                        <div
                            v-for="item in group?.children"
                            :key="item.denom"
                            :class="[
                                'chains-tag',
                                {
                                    'visible_color visible__border selected': isSelected(
                                        item.denom
                                    ),
                                    disabled: item.disabled || group.disabled
                                }
                            ]"
                            @click="onSelected(item)"
                        >
                            <img
                                v-if="!item.hideIcon"
                                :src="item.icon || imgSrc"
                                width="24"
                                height="24"
                                class="mr-8"
                            />
                            <span class="symbol">{{ item.symbol }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="props.inputCtn" class="mt-24">
                    <div class="flex items-center">
                        <div class="leading-none">{{ props.inputCtn?.title }}</div>
                        <a-popover
                            v-if="props.inputCtn.toolTip"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="tip_color">
                                    {{ props.inputCtn.toolTip }}
                                </p>
                            </template>
                            <img
                                class="tip hover"
                                style="margin-left: 8px"
                                src="/src/assets/tip.png"
                            />
                        </a-popover>
                    </div>
                    <div class="flex items-center mt-12 flex-wrap">
                        <a-input
                            v-model:value="tokenInput"
                            allow-clear
                            class="token-input"
                            :placeholder="props.inputCtn.placeholder"
                        />
                        <a-button
                            type="primary"
                            class="confirm-button ml-12"
                            @click="confirmChains"
                            >{{ props.inputCtn.btnTxt }}</a-button
                        >
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup>
    import { getRestString } from '@/helper/parseStringHelper';
    const imgSrc = new URL('../../../assets/token-default.png', import.meta.url).href;
    import { DataItem, Data, TDenom } from './bjSelect/type';
    import { useInit } from './bjSelect/hooks';
    import { getValByMode, closeByMode, inputItemsByMode } from './bjSelect/common';

    /**
     * defineProps 使用外部引入的interface或者type会报错
     */
    interface IProps {
        data: Data;
        value?: string | string[];
        mode?: 'multiple';
        placeholder?: string;
        inputCtn?: {
            title?: string;
            toolTip?: string;
            placeholder?: string;
            btnTxt: string;
        };
    }

    const props = withDefaults(defineProps<IProps>(), {
        data: () => []
    });

    const { visible, selectItems, tokenInput, inputItems, resetVal } = useInit(props);

    // 是否选中
    const isSelected = (denom: TDenom) => selectItems.value.some((v) => v.denom === denom);

    defineExpose({
        selectItems,
        tokenInput
    });

    const emit = defineEmits<{
        (e: 'onChange', res: TDenom | TDenom[]): void;
    }>();

    /**
     * @param selectData 选中的数据
     * @param close 是否收起关闭，默认不关闭，通过closeByMode函数判断
     */
    const sumbitTokens = (selectData: DataItem[], close = false) => {
        let res = getValByMode(selectData, props.mode);

        emit('onChange', res);
        if (close || closeByMode(selectData, props.mode)) {
            visible.value = false;
        }
    };

    const confirmChains = () => {
        switch (props.mode) {
            case 'multiple':
                break;
            default:
                // 单选时候，
                selectItems.value = [];
                break;
        }

        inputItems.value = inputItemsByMode(tokenInput.value, props.mode);
        sumbitTokens([...inputItems.value, ...selectItems.value], true);
    };

    // 收起展开时候都重新赋值
    const visibleChange = () => {
        resetVal(props.value);
    };

    const onSelected = (item: DataItem) => {
        if (item.disabled) {
            return;
        }

        selectByMode();

        sumbitTokens([...inputItems.value, ...selectItems.value]);

        // 写成内联函数形式，只是为了减少onSelected主体代码。
        function selectByMode() {
            switch (props.mode) {
                case 'multiple':
                    // 多选时候，有取消操作
                    const index = selectItems.value.findIndex((v) => v.denom === item.denom);
                    if (index === -1) {
                        selectItems.value.push(item);
                    } else {
                        selectItems.value = [
                            ...selectItems.value.slice(0, index),
                            ...selectItems.value.slice(index + 1)
                        ];
                    }
                    return;
                default:
                    // 单选时候，选择和输入只能有一个，所以清除input输入
                    selectItems.value = [item];
                    inputItems.value = [];
            }
        }
    };
</script>

<style lang="less" scoped>
    .dropdown-container {
        height: 36px;
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        background-color: #fff;
        cursor: url('../../../assets/mouse/shiftlight_mouse.png'), default !important;
        min-width: 124px;
    }

    .button_icon {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        padding: 0 6px;
        border-left: 1px solid var(--bj-border-color);
        height: 36px;

        & > svg {
            color: var(--bj-text-third);
        }
    }

    .visible__border {
        border: 1px solid var(--bj-primary-color) !important;
        box-shadow: 0 0 0 2px rgb(61 80 255 / 20%);
    }

    .visible_color {
        color: var(--bj-primary-color) !important;
    }

    .default_color {
        color: var(--bj-text-second);
    }

    .multiple {
        border: 1px solid var(--bj-primary-color);
        margin: 2px;
        padding: 0 10px;
        border-radius: 4px;
    }

    .selected_color {
        color: var(--bj-primary-color);
        //overflow: hidden;
        //text-overflow: ellipsis;
        padding-left: 8px;
        //max-width: 118px;
        &_default {
            color: var(--bj-text-second);
        }
    }
    .selectedInfo_title {
        max-width: 118px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .overlay {
        max-width: 872px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px #d9deec;
        border-radius: 4px;
        min-height: 200px;
        border: 1px solid var(--bj-border-color);
        padding: 16px 4px 24px 16px;
        transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .title {
        margin-bottom: 7px;
    }

    .chains__wrap {
        //display: grid;
        //grid-template-columns: repeat(auto-fill, 158px);
        display: flex;
        flex-wrap: wrap;
        grid-gap: 12px;
    }

    .chains-tag {
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-align: left;
        background-image: none;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
        cursor: url('../../../assets/mouse/shiftlight_mouse.png'), default;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        padding: 5px 8px 5px 8px;
        border-radius: 4px;
        color: var(--bj-text-second);
        background: var(--bj-background-color);
        width: 158px;
        box-sizing: border-box;

        &.selected {
            background: hsl(223deg 54% 95%);
        }

        &.disabled {
            cursor: not-allowed;
            filter: grayscale(100%);

            &:hover {
                border-color: transparent;
            }
        }

        &:hover {
            border-color: var(--bj-primary-color);
        }
        .symbol {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .token-input {
        width: 240px;
    }

    .confirm_button {
        color: #fff;
    }

    .tip {
        width: 20px;

        &_color {
            color: var(--bj-text-second);
            text-align: center;
            margin: -2px -2px;
            word-break: break-word;
            max-width: 230px;
        }
    }

    .hover {
        cursor: url('../../../assets/mouse/shiftlight_mouse.png'), default !important;
    }

    // tablet
    @media screen and (max-width: 768px) {
        .overlay {
            max-width: 381px;
            height: 450px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 6px;
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
    }

    // mobile
    @media screen and (max-width: 414px) {
        .overlay {
            max-width: 284px;
            height: 450px;
        }

        .confirm-button {
            margin: 12px 0 0;
        }

        .token-input {
            width: 245px;
        }
    }
</style>
