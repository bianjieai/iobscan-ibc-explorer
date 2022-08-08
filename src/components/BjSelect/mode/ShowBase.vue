<template>
    <div
        class="flex flex-1 overflow-auto flex-wrap text-center mr-8 ml-8 justify-center items-center"
        :class="[
            {
                selected_color__default: selectItems.length === 0 && inputItems.length === 0,
                selected_color: selectItems.length > 0 || inputItems.length > 0,
                visible_color: (selectItems.length > 0 || inputItems.length > 0) && visible
            }
        ]"
    >
        <!--        输入的渲染-->
        <div
            v-for="item in inputItems"
            :key="item.id"
            class="flex items-center"
            :class="{ multiple: props.mode === MODES.multiple }"
        >
            <span class="selected_info_title" :title="item.title">{{
                getRestString(item.title, 4, 4)
            }}</span>
        </div>
        <!--        选择的渲染-->
        <div
            v-for="item in selectItems"
            :key="item.id"
            class="flex items-center"
            :class="{ multiple: props.mode === MODES.multiple }"
        >
            <img
                v-if="!hideIcon && item.icon?.length"
                width="18"
                height="18"
                class="mr-4"
                :src="item.icon"
            />
            <span class="selected_info_title" :title="item.title">{{ item.title }}</span>
        </div>
        <!--        都没有选的时候展示，类似placeholder-->
        <div v-if="!inputItems.length && !selectItems.length" class="selected__color_default">
            <span class="selected_info_title">{{ placeholder }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { getRestString } from '@/helper/parseStringHelper';
    import {
        // IDataItem,
        ModeType
    } from '../interface';
    import { MODES } from '../constants';

    /**
     * defineProps 使用外部引入的interface或者type会报错
     */
    interface TProps {
        visible: boolean;
        selectItems: any; // IDataItem[]
        inputItems: any; // IDataItem[]
        placeholder?: string;
        mode: ModeType;
        hideIcon?: boolean;
    }

    const props = withDefaults(defineProps<TProps>(), {
        selectItems: () => [],
        inputItems: () => []
    });

    const { visible, selectItems, inputItems, placeholder, hideIcon } = toRefs(props);
</script>

<style lang="less" scoped>
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
        &__default {
            color: var(--bj-text-second);
        }
    }
    .visible_color {
        color: var(--bj-primary-color) !important;
    }
    .selected_info_title {
        max-width: 118px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
