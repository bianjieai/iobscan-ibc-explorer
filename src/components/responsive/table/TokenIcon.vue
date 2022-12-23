<template>
    <BaseTokenIcon
        :icon-size="iconSize"
        :title-can-popover="titleCanPopover"
        :title-can-click="titleCanClick"
        :token-info="tokenInfo"
        :token-type="tokenType"
        @click-title="go"
    />
</template>

<script setup lang="ts">
    import { TOKEN_DEFAULT_ICON } from '@/constants';
    import { getRestString } from '@/helper/parseStringHelper';
    import { IBaseDenom } from '@/types/interface/index.interface';
    import {
        TableCellIconSize,
        TTableCellIconSize
    } from '@/types/interface/components/table.interface';

    interface IProps {
        iconSize?: TTableCellIconSize;
        denom: string;
        chain: string;
        denomsData: IBaseDenom[];
        titleCanClick?: boolean;
        tokenType?: string;
    }

    const props = withDefaults(defineProps<IProps>(), {
        tokenType: '',
        iconSize: TableCellIconSize.NORMAL
    });

    const tokenInfo = computed(() => {
        const filterData = props.denomsData.find(
            (item) => item.denom === props.denom && item.chain == props.chain
        );
        if (filterData) {
            return {
                defaultTitle: filterData.symbol,
                title: getRestString(filterData.symbol, 6, 0),
                subtitle: 'Authed',
                imgSrc: filterData.icon || TOKEN_DEFAULT_ICON
            };
        } else {
            return {
                defaultTitle: props.denom,
                title: getRestString(props.denom, 6, 0),
                subtitle: 'Other',
                imgSrc: TOKEN_DEFAULT_ICON
            };
        }
    });

    const titleCanPopover = computed(() => {
        return tokenInfo.value.title.length > 6;
    });

    const emit = defineEmits<{
        (e: 'clickTitle'): void;
    }>();

    const go = () => {
        emit('clickTitle');
    };
</script>

<style lang="less" scoped></style>
