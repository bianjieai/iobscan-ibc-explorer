<template>
    <div class="chain_wrap">
        <div
            class="mr-8 ml-8"
            :class="[
                {
                    selected_color__default: doubleSelectItems.length === 0,
                    selected_color: doubleSelectItems.length > 0,
                    visible_color: doubleSelectItems.length > 0 && visible
                }
            ]"
        >
            <img
                v-if="!hideIcon && doubleSelectItems[0]?.icon?.length"
                width="18"
                height="18"
                class="mr-4"
                :src="doubleSelectItems[0]?.icon"
            />
            {{ doubleSelectItems[0]?.title || placeholders[0] }}
        </div>
        <div>-</div>
        <div
            class="mr-8 ml-8"
            :class="[
                {
                    selected_color__default: doubleSelectItems.length === 0,
                    selected_color: doubleSelectItems.length > 1,
                    visible_color: doubleSelectItems.length > 1 && visible
                }
            ]"
        >
            <img
                v-if="!hideIcon && doubleSelectItems[1]?.icon?.length"
                width="18"
                height="18"
                class="mr-4"
                :src="doubleSelectItems[1]?.icon"
            />
            {{ doubleSelectItems[1]?.title || placeholders[1] }}
        </div>
    </div>
</template>

<script lang="ts" setup>
    interface TProps {
        visible: boolean;
        doubleSelectItems: any; // IDataItem[]
        placeholders?: [string, string];
        hideIcon?: boolean;
    }

    const props = withDefaults(defineProps<TProps>(), {
        doubleSelectItems: () => []
    });

    const { visible, placeholders, doubleSelectItems } = toRefs(props);
</script>

<style lang="less" scoped>
    .chain_wrap {
        .flex(row, nowrap, center, center);
        flex: 1;
    }
    .selected_color {
        color: var(--bj-primary-color);
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 8px;
        max-width: 118px;
        &__default {
            color: var(--bj-text-second);
        }
    }
    .visible_color {
        color: var(--bj-primary-color) !important;
    }
    .selectedInfo_title {
        max-width: 118px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
