<template>
    <a-dropdown
        v-model:visible="visible"
        :trigger="['click']"
        :overlay-style="{ zIndex: 1020 }"
        :destroy-popup-on-hide="true"
        :get-popup-container="dropdownProps?.getPopupContainer"
        @visible-change="visibleChange"
    >
        <div
            class="flex items-center default_color dropdown_container cursor"
            :class="[{ visible_border: visible }]"
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
                    :default-val="defaultVal"
                />
            </template>
            <!--            多选单选的展示 end-->
            <!--            多选单选的展示 start-->
            <template v-else>
                <show-double
                    :visible="visible"
                    :double-select-items="doubleSelectItems"
                    :placeholders="props.placeholders"
                    :hide-icon="hideIcon"
                    :default-val="defaultVal"
                />
            </template>
            <!--            多选单选的展示 end-->
            <span class="button_icon flex justify-between items-center">
                <i
                    :class="[visible ? 'visible_color' : '']"
                    class="iconfont icon-zhankai-copy-icon"
                    :style="{
                        transform: visible ? 'rotate(180deg)' : 'rotate(0)'
                    }"
                ></i>
            </span>
        </div>

        <template #overlay>
            <div class="overlay">
                <div
                    v-for="(group, ind) in props.data"
                    :key="group.groupName"
                    class="relative"
                    :class="[group.groupName ? 'mb-20' : 'mb-12']"
                >
                    <div v-if="group.groupName" class="flex items-center">
                        <div class="title">{{ group.groupName }}</div>
                        <a-popover
                            v-if="group.tooltips"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="confirm_button">
                                    {{ group.tooltips }}
                                </p>
                            </template>
                            <img
                                v-if="group.icon"
                                class="tip cursor"
                                style="margin-left: 8px"
                                :src="group.icon"
                            />
                        </a-popover>
                    </div>
                    <div
                        :class="{
                            top_shadow: !isBoundary[ind]?.top
                        }"
                    ></div>
                    <div class="chains_wrap">
                        <div
                            v-for="item in group?.children"
                            :key="item.id"
                            :class="[
                                'chains_tag',
                                'cursor',
                                {
                                    'visible_color visible_border selected': isSelected(item.id),
                                    disabled: item.disabled
                                }
                            ]"
                            @click="onSelected(item)"
                        >
                            <img
                                v-if="item?.icon"
                                :src="item.icon"
                                width="24"
                                height="24"
                                class="mr-8"
                            />
                            <span class="symbol">{{ item.title }}</span>
                            <div v-if="badges && getBadgeStr(item.id)" class="chains_tag__badge">
                                {{ getBadgeStr(item.id) }}
                            </div>
                        </div>
                    </div>
                    <div
                        :class="{
                            bottom_shadow: !isBoundary[ind]?.bottom
                        }"
                    ></div>
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
                                v-if="inputCtn.icon"
                                class="tip cursor"
                                style="margin-left: 8px"
                                :src="inputCtn.icon"
                            />
                        </a-popover>
                    </div>
                    <div class="flex items-center mt-12 flex-wrap">
                        <a-input
                            v-model:value="tokenInput"
                            allow-clear
                            class="token_input"
                            :placeholder="inputCtn.placeholder"
                            @input="onInputChange"
                        />
                        <a-button type="primary" class="confirm_button ml-12" @click="confirmChains"
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
    export interface TProps {
        data: {
            groupName?: string;
            icon?: string;
            tooltips?: string;
            children?: {
                id: number | string;
                title: string;
                icon?: string;
                disabled?: boolean;
                tooltips?: string;
                doubleTime?: boolean;
                metaData?: any;
            }[];
        }[];
        defaultVal?: string | number | (string | number)[];
        value?: string | number | (string | number)[];
        mode?: MODES.multiple | MODES.double;
        placeholder?: string;
        hideIcon?: boolean;
        editModel?: boolean; // 修改时候是否展示框变化，默认false
        associateId?: string | number; // 双选时候，input输入时候一个值时候，另外展示的值
        badges?: [string, string];
        placeholders?: [string, string];
        inputCtn?: {
            title?: string;
            icon?: string;
            toolTip?: string;
            placeholder?: string;
            btnTxt: string;
        };
        dropdownProps?: {};
    }

    const props = withDefaults(defineProps<TProps>(), {
        data: () => [],
        editModel: false
    });

    const { inputCtn, placeholder, hideIcon, badges, defaultVal, dropdownProps } = { ...props };

    const { visible, selectItems, tokenInput, inputItems, flatData, resetVal } = useInit(props);

    // 是否选中
    const isSelected = (val: TDenom) => selectItems.value.some((v) => v.id === val);

    // 获取badges
    const getBadgeStr = (val: TDenom) => {
        const isDouble = doubleSelectItems.value.filter((v) => v.id === val)?.length === 2;

        if (isDouble) {
            return props.badges!.join('-');
        }

        const index = doubleSelectItems.value.findIndex((v) => v.id === val);
        if (index !== -1) {
            return props.badges![index];
        }
    };

    // 目前多选和输入互斥，只选择其中一个
    const doubleSelectItems = computed(() => {
        return [...inputItems.value, ...selectItems.value];
    });

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

        if (
            props.mode !== MODES.double ||
            (props.mode === MODES.double && selectData.length === 2)
        ) {
            emit('onChange', res);
            if (close || closeByMode(selectData, props.mode)) {
                visible.value = false;
            }
        }
    };

    // 确认confirm时候
    const confirmChains = () => {
        let res: IDataItem[] = [];
        inputItems.value = inputItemsByMode(tokenInput.value, props);

        switch (props.mode) {
            // 多选时候都输出
            case MODES.multiple:
                res = [...inputItems.value, ...selectItems.value];
                break;
            // 只选择两个时候
            case MODES.double:
                res = [...inputItems.value, ...selectItems.value];
                break;
            default:
                // 单选时候，清空选择框
                selectItems.value = [];
                res = [...inputItems.value];
                break;
        }

        sumbitTokens(res, true);
    };

    // 监听滚动
    const isBoundary = ref<
        {
            top?: boolean;
            bottom?: boolean;
        }[]
    >([]);
    const eleRef = ref();
    const scrollFn = (visible: boolean) => {
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
                        if (ele.scrollHeight === ele.scrollTop + ele.offsetHeight) {
                            isBoundary.value[ind].bottom = true;
                        } else {
                            isBoundary.value[ind].bottom = false;
                        }
                    });
                });
                console.log(isBoundary.value);
            });
        } else {
            Array.prototype.forEach.call(eleRef.value, (ele: HTMLElement) => {
                ele.removeEventListener('scroll', () => {});
            });
        }
    };

    const visibleChange = (visible: boolean) => {
        // 收起展开时候都重新赋值
        resetVal(props.value);

        // 监听一些滚动，只是为了加阴影
        scrollFn(visible);
    };

    const onInputChange = () => {
        // 选两个时候，清空选择框
        if (props.mode === MODES.double) {
            selectItems.value = [];
        }
        // 修改时候是否展示框变化
        if (props.editModel) {
            inputItems.value = inputItemsByMode(tokenInput.value, props);
            // 如果输入的只有一个值，选中all，这里作为配置项传进来。
            if (inputItems.value.length === 1) {
                const matchItem = flatData.value.find((v) => v.id === props.associateId);

                if (matchItem) {
                    selectItems.value = [matchItem as IDataItem];
                }
            }
        }
    };

    const onSelected = (item: IDataItem) => {
        if (item.disabled) {
            return;
        }

        selectByMode();

        sumbitTokens([...inputItems.value, ...selectItems.value]);

        // 写成内联函数形式，只是为了减少onSelected主体代码。
        function selectByMode() {
            let index;
            switch (props.mode) {
                case MODES.multiple:
                    // 多选时候，有取消操作
                    index = selectItems.value.findIndex((v) => v.id === item.id);
                    if (index === -1) {
                        selectItems.value.push(item);
                    } else {
                        selectItems.value = [
                            ...selectItems.value.slice(0, index),
                            ...selectItems.value.slice(index + 1)
                        ];
                    }
                    return;
                // 只选择两个时候, 清空input, 超过两个重选
                case MODES.double:
                    if (inputItems.value.length + selectItems.value.length === 2) {
                        selectItems.value = [item];
                        inputItems.value = [];
                        tokenInput.value = '';
                    } else {
                        index = selectItems.value.findIndex((v) => v.id === item.id);
                        // 可以选择自己两次的，比如all选项
                        if (index === -1 || item.doubleTime) {
                            selectItems.value.push(item);
                        }
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
    .top_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        box-shadow: inset 0 10px 8px -8px #00000026;
    }
    .bottom_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        box-shadow: 0 -10px 8px -8px #00000026;
    }
    .dropdown_container {
        height: 36px;
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        background-color: #fff;
        min-width: 124px;
    }

    .button_icon {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        padding: 0 2px;
        border-left: 1px solid var(--bj-border-color);
        height: 36px;

        .iconfont {
            font-size: 18px;
            color: var(--bj-text-third);
        }
    }

    .visible_border {
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

    .chains_wrap {
        //display: grid;
        //grid-template-columns: repeat(auto-fill, 158px);
        display: flex;
        flex-wrap: wrap;
        grid-gap: 12px;
        max-height: 210px;
        overflow-y: auto;
        position: relative;
    }

    .chains_tag {
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
        &__badge {
            position: absolute;
            top: 0;
            right: 36px;
            transform: translate(50%, -50%);
            border-radius: 16px;
            line-height: 14px;
            color: #fff;
            background-color: var(--bj-primary-color);
            font-size: 10px;
            padding: 1px 8px;
            white-space: nowrap;
            z-index: 1;
        }
    }

    .token_input {
        width: 280px;
    }

    .confirm_button {
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

        .confirm_button {
            margin: 12px 0 0;
        }

        .token_input {
            width: 245px;
        }
    }
</style>
