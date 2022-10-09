<template>
    <a-dropdown v-model:visible="visible" :trigger="['click']">
        <div
            class="dropdown_container cursor inline-flex items-center default_color"
            :class="{ visible_border: visible }"
        >
            <div
                class="flex-1 ml-8 mr-8 text-center"
                :class="{
                    selected_color: selectOption.length > 0,
                    selected_color_default:
                        selectedText === DEFAULT_TITLE.defaultStatus ||
                        selectedText === options[0].key,
                    visible_color: selectOption.length > 0 && visible
                }"
            >
                {{ selectedText }}</div
            >
            <span class="button_icon flex justify-between items-center">
                <i
                    :class="{ visible_color: visible }"
                    class="iconfont icon-zhankai-copy-icon"
                    :style="{
                        transform: visible ? 'rotate(180deg)' : 'rotate(0)'
                    }"
                ></i>
            </span>
        </div>
        <template #overlay>
            <div class="overlay_container">
                <div
                    v-for="item in options"
                    :key="item.value"
                    class="item cursor"
                    :class="{ selected_option: item.key === selectOption[0]?.key }"
                    @click="onSelect(item.key, item.value)"
                    >{{ item.key }}</div
                >
            </div>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
    import { DEFAULT_TITLE } from '@/constants';
    import { computed, ref } from 'vue';
    type TKey = string;
    type TValue = number | undefined | string;

    type TOption = {
        key: TKey;
        value: TValue;
    };

    interface IProps {
        options: TOption[];
        status?: string;
    }

    const props = defineProps<IProps>();

    const visible = ref(false);
    const selectOption = ref<TOption[]>([]);

    const selectedText = computed(() => {
        if (selectOption.value.length > 0) {
            return selectOption.value[0].key;
        } else {
            return props.options[0]?.key ?? DEFAULT_TITLE.defaultStatus;
        }
    });

    watch(
        () => props.status,
        () => {
            const { options } = props;
            const filterData = options.filter((item) => item.value == props.status);
            if (filterData.length > 0) {
                selectOption.value = filterData;
            }
        }
    );

    // onMounted(() => {
    //     if (props.status) {
    //         const { options } = props;
    //         const filterData = options.filter((item) => item.value == props.status);
    //         if (filterData.length > 0) {
    //             selectOption.value = filterData;
    //         }
    //     }
    // });

    defineExpose({
        selectOption
    });

    const emit = defineEmits<{
        (e: 'onSelectedChange', value: TValue): void;
    }>();

    const onSelect = (key: TKey, value: TValue) => {
        selectOption.value = [];
        selectOption.value.push({
            key,
            value
        });

        emit('onSelectedChange', value);
        visible.value = false;
    };
</script>

<style lang="less" scoped>
    .dropdown_container {
        height: 36px;
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        background-color: #fff;
        min-width: 126px;
        &:hover {
            border-color: var(--bj-primary-color);
        }
    }

    .button_icon {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        padding: 0 6px;
        border-left: 1px solid var(--bj-border-color);
        height: 34px;
        .iconfont {
            font-size: 18px;
            color: var(--bj-text-third);
        }
    }

    .overlay_container {
        background: #fff;
        color: var(--bj-text-second);
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;

        .item {
            padding: 9px 12px;

            &:hover {
                color: var(--bj-primary-color);
            }
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

    .selected_color {
        color: var(--bj-primary-color);
    }
    .selected_color_default {
        color: var(--bj-text-second);
    }

    .selected_option {
        background: rgba(61, 80, 255, 0.04);
        color: var(--bj-primary-color);
    }
</style>
