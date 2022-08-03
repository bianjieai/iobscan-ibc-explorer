<template>
    <a-dropdown
        v-model:visible="visible"
        :trigger="['click']"
        :overlay-style="{ zIndex: 1020 }"
        @visibleChange="visibleChange"
    >
        <div
            class="flex items-center default__color dropdown__container cursor"
            :class="[{ visible__border: visible }]"
        >
            <!--            多选单选的展示 start-->
            <template v-if="props.mode !== MODES.double">
                <show-base
                    :visible="visible"
                    :select-items="selectItems"
                    :input-items="inputItems"
                    :placeholder="placeholder"
                    :hide-icon="hideIcon"
                    :mode="props.mode"
                />
            </template>
            <!--            多选单选的展示 end-->
            <span class="button__icon flex justify-between items-center">
                <svg
                    :style="{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }"
                    focusable="false"
                    data-icon="down"
                    width="12px"
                    height="12px"
                    fill="currentColor"
                    aria-hidden="true"
                    viewBox="64 64 896 896"
                    :class="[visible ? 'visible__color' : '']"
                >
                    <path
                        d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                    ></path>
                </svg>
            </span>
        </div>

        <template #overlay>
            <div class="overlay">
                <div v-for="group in props.data" :key="group.groupName" class="mb-20">
                    <div v-if="!group.hideGroupName" class="flex items-center">
                        <div class="title">{{ group.groupName }}</div>
                        <a-popover
                            v-if="group.tooltips"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="confirm__button">
                                    {{ group.tooltips }}
                                </p>
                            </template>
                            <img
                                class="tip cursor"
                                style="margin-left: 8px"
                                src="/src/assets/tip.png"
                            />
                        </a-popover>
                    </div>
                    <div class="chains__wrap">
                        <div
                            v-for="item in group?.children"
                            :key="item.id"
                            :class="[
                                'chains__tag',
                                'cursor',
                                {
                                    'visible__color visible__border selected': isSelected(item.id),
                                    disabled: item.disabled || group.disabled
                                }
                            ]"
                            @click="onSelected(item)"
                        >
                            <img
                                v-if="!item.hideIcon"
                                :src="item.icon || defaultImg"
                                width="24"
                                height="24"
                                class="mr-8"
                            />
                            <span class="symbol">{{ item.title }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="inputCtn" class="mt-24">
                    <div v-if="inputCtn?.title" class="flex items-center">
                        <div class="leading-none">{{ inputCtn?.title }}</div>
                        <a-popover
                            v-if="inputCtn.toolTip"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="tip__color">
                                    {{ inputCtn.toolTip }}
                                </p>
                            </template>
                            <img
                                class="tip cursor"
                                style="margin-left: 8px"
                                src="/src/assets/tip.png"
                            />
                        </a-popover>
                    </div>
                    <div class="flex items-center mt-12 flex-wrap">
                        <a-input
                            v-model:value="tokenInput"
                            allow-clear
                            class="token__input"
                            :placeholder="inputCtn.placeholder"
                        />
                        <a-button
                            type="primary"
                            class="confirm__button ml-12"
                            @click="confirmChains"
                            >{{ inputCtn.btnTxt }}
                        </a-button>
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
    import { IDataItem, TDenom } from './interface';
    import { useInit } from './composable';
    import { getValByMode, closeByMode, inputItemsByMode } from './helper';
    import { MODES } from './constants';

    /**
     * defineProps 使用外部引入的interface或者type会报错
     */
    interface TProps {
        data: {
            groupName?: string;
            hideGroupName?: boolean;
            icon?: string;
            tooltips?: string;
            children?: {
                id: number | string;
                title: string;
                disabled?: boolean;
                hideIcon?: boolean;
                icon?: string;
                tooltips?: string;
            }[];
        }[];
        value: string | number | (string | number)[];
        mode?: 'multiple';
        placeholder?: string;
        defaultImg?: string;
        hideIcon?: boolean;
        inputCtn?: {
            title?: string;
            toolTip?: string;
            placeholder?: string;
            btnTxt: string;
        };
    }

    const props = withDefaults(defineProps<TProps>(), {
        data: () => [],
        defaultImg: './images/token-default.png'
    });

    const { inputCtn, placeholder, defaultImg, hideIcon } = { ...props };

    const { visible, selectItems, tokenInput, inputItems, resetVal } = useInit(props);

    // 是否选中
    const isSelected = (val: TDenom) => selectItems.value.some((v) => v.id === val);

    defineExpose({
        selectItems,
        tokenInput
    });

    const emit = defineEmits<{
        (e: 'onChange', res: IDataItem | IDataItem[]): void;
    }>();

    /**
     * @param selectData 选中的数据
     * @param close 是否收起关闭，默认不关闭，通过closeByMode函数判断
     */
    const sumbitTokens = (selectData: IDataItem[], close = false) => {
        let res = getValByMode(selectData, props.mode);

        emit('onChange', res);
        if (close || closeByMode(selectData, props.mode)) {
            visible.value = false;
        }
    };

    const confirmChains = () => {
        switch (props.mode) {
            case MODES.multiple:
                break;
            default:
                // 单选时候，
                selectItems.value = [];
                break;
        }

        inputItems.value = inputItemsByMode(tokenInput.value, props);
        sumbitTokens([...inputItems.value, ...selectItems.value], true);
    };

    // 收起展开时候都重新赋值
    const visibleChange = () => {
        resetVal(props.value);
    };

    const onSelected = (item: IDataItem) => {
        if (item.disabled) {
            return;
        }

        selectByMode();

        sumbitTokens([...inputItems.value, ...selectItems.value]);

        // 写成内联函数形式，只是为了减少onSelected主体代码。
        function selectByMode() {
            switch (props.mode) {
                case MODES.multiple:
                    // 多选时候，有取消操作
                    const index = selectItems.value.findIndex((v) => v.id === item.id);
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
    .dropdown__container {
        height: 36px;
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        background-color: #fff;
        min-width: 124px;
    }

    .button__icon {
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

    .visible__color {
        color: var(--bj-primary-color) !important;
    }

    .default__color {
        color: var(--bj-text-second);
    }

    .multiple {
        border: 1px solid var(--bj-primary-color);
        margin: 2px;
        padding: 0 10px;
        border-radius: 4px;
    }

    .selected__color {
        color: var(--bj-primary-color);
        //overflow: hidden;
        //text-overflow: ellipsis;
        padding-left: 8px;
        //max-width: 118px;
        &__default {
            color: var(--bj-text-second);
        }
    }
    .selectedInfo__title {
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

    .chains__tag {
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-align: left;
        background-image: none;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        padding: 5px 8px 5px 8px;
        border-radius: 4px;
        color: var(--bj-text-second);
        background: var(--bj-background-color);
        width: 158px;
        box-sizing: border-box;

        &.selected {
            background: #fff;
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

    .token__input {
        width: 240px;
    }

    .confirm__button {
        color: #fff;
    }

    .tip {
        width: 20px;

        &__color {
            color: var(--bj-text-second);
            text-align: center;
            margin: -2px -2px;
            word-break: break-word;
            max-width: 230px;
        }
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

        .confirm__button {
            margin: 12px 0 0;
        }

        .token__input {
            width: 245px;
        }
    }
</style>
