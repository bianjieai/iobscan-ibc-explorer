<template>
    <div class="chain_wrap">
        <div class="mr-8 ml-8" :class="showInputClass[0]">
            <img
                v-if="!hideIcon && doubleSelectItems[0]?.icon?.length"
                width="18"
                height="18"
                class="mr-4"
                :src="doubleSelectItems[0]?.icon"
            />
            {{ doubleSelectItems[0]?.title || placeholders?.[0] }}
        </div>
        <div>-</div>
        <div class="mr-8 ml-8" :class="showInputClass[1]">
            <img
                v-if="!hideIcon && doubleSelectItems[1]?.icon?.length"
                width="18"
                height="18"
                class="mr-4"
                :src="doubleSelectItems[1]?.icon"
            />
            {{ doubleSelectItems[1]?.title || placeholders?.[1] }}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { IDataItem, TDenom } from '../interface';
    interface TProps {
        visible: boolean;
        doubleSelectItems: any; // IDataItem[]
        placeholders?: [string, string];
        hideIcon?: boolean;
        defaultVal?: string | number | (string | number)[];
    }

    const props = withDefaults(defineProps<TProps>(), {
        doubleSelectItems: () => []
    });

    const { visible, placeholders, doubleSelectItems, defaultVal } = toRefs(props);

    const getClassStr = (selectVal: IDataItem, vals: TDenom[]) => {
        // 没有选择时，展开为 selected_color__third，关闭为 selected_color__default
        // 选择的时候，包含默认值时候 selected_color__default，非默认值高亮 selected_color

        if (!selectVal) {
            return visible.value ? 'selected_color__third' : 'selected_color__default';
        }

        const includeDefault = vals.includes(selectVal.id);
        return includeDefault ? 'selected_color__default' : 'selected_color';
    };

    const showInputClass = computed(() => {
        const res: string[] = [];
        const vals =
            defaultVal?.value !== undefined
                ? Array.isArray(defaultVal.value)
                    ? defaultVal.value
                    : [defaultVal.value]
                : [];

        res[0] = getClassStr(doubleSelectItems.value[0], vals);
        res[1] = getClassStr(doubleSelectItems.value[1], vals);

        return res;
    });
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
        &__third {
            color: var(--bj-text-third);
        }
    }
    .selectedInfo_title {
        max-width: 118px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
