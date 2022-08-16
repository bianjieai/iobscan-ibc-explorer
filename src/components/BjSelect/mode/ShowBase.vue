<template>
    <div
        class="flex flex-1 overflow-auto flex-wrap text-center mr-8 ml-8 justify-center items-center"
        :class="showInputClass"
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
        <div v-if="!inputItems.length && !selectItems.length">
            <span class="selected_info_title">{{ placeholder }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { getRestString } from '@/helper/parseStringHelper';
    import { IDataItem, ModeType } from '../interface';
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
        defaultVal?: string | number | (string | number)[];
    }

    const props = withDefaults(defineProps<TProps>(), {
        selectItems: () => [],
        inputItems: () => []
    });

    const { visible, selectItems, inputItems, placeholder, hideIcon, defaultVal } = toRefs(props);

    const showInputClass = computed(() => {
        const vals =
            defaultVal?.value !== undefined
                ? Array.isArray(defaultVal.value)
                    ? defaultVal.value
                    : [defaultVal.value]
                : [];
        // 没有选择时，展开为 selected_color__third，关闭为 selected_color__default
        // 选择的时候，包含默认值时候 selected_color__default，非默认值高亮 selected_color
        if (!selectItems.value.length && !inputItems.value.length) {
            return visible.value ? 'selected_color__third' : 'selected_color__default';
        }

        // const selectData = [...selectItems.value, ...inputItems.value];
        const includeDefault =
            selectItems.value.some((v: IDataItem) => vals.includes(v.id)) ||
            inputItems.value.some((v: IDataItem) => vals.includes(v.id));

        return includeDefault ? 'selected_color__default' : 'selected_color';
    });
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 8px;
        //max-width: 118px;
        &__default {
            color: var(--bj-text-second);
        }
        &__third {
            color: var(--bj-text-third);
        }
    }
    .selected_info_title {
        max-width: 118px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
