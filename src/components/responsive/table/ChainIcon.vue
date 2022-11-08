<template>
    <div class="flex items-center">
        <img
            :src="chainInfo.imgSrc"
            class="icon mr-8"
            :class="{
                hover_cursor: avatarCanClick,
                small_icon: iconSize === TableCellIconSize.SMALL
            }"
            @click="avatarClick"
        />
        <div class="flex flex-col justify-around">
            <a-popover v-if="computedTitle.length > 16" destroy-tooltip-on-hide>
                <template #content>
                    {{ computedTitle }}
                </template>
                <div
                    class="title leading_none"
                    :class="{ hover_cursor: titleCanClick }"
                    @click="go"
                    >{{ computedTitle }}</div
                >
            </a-popover>
            <div
                v-else
                class="title leading_none"
                :class="{ hover_cursor: titleCanClick }"
                @click="go"
                >{{ computedTitle }}</div
            >

            <div v-if="chainInfo.subtitle !== '--'">
                <a-popover
                    v-if="formatChainID(chainInfo.subtitle)?.length >= 20"
                    placement="bottom"
                >
                    <template #content>
                        <div class="popover_c">{{ formatChainID(chainInfo.subtitle) }}</div>
                    </template>
                    <div v-if="!noSubtitle" class="subtitle leading_none tag">{{
                        formatChainID(chainInfo.subtitle)
                    }}</div>
                </a-popover>
                <div v-else-if="!noSubtitle" class="subtitle leading_none tag">{{
                    formatChainID(chainInfo.subtitle)
                }}</div>
            </div>
            <div v-else-if="!noSubtitle" class="subtitle leading_none tag">--</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { IIbcchain } from '@/types/interface/index.interface';
    import { computed } from 'vue';
    import {
        TableCellIconSize,
        TTableCellIconSize
    } from '@/types/interface/components/table.interface';
    import ChainHelper from '@/helper/chainHelper';
    import { CHAIN_DEFAULT_ICON, UNKNOWN } from '@/constants';

    interface IProps {
        iconSize?: TTableCellIconSize;
        chainId: string;
        chainsData: IIbcchain[];
        titleCanClick?: boolean;
        title?: string;
        noSubtitle?: boolean;
        avatarCanClick?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        iconSize: TableCellIconSize.NORMAL
    });

    const computedTitle = computed(() => {
        let title = '';
        if (typeof props.title !== 'undefined') {
            title = props.title === '' ? 'channel- --' : props.title;
        } else {
            title = chainInfo.value.title;
        }
        return title;
    });

    const chainInfo = computed(() => {
        const filterData = props.chainsData.find((item) => item.chain_id === props.chainId);
        if (filterData) {
            return {
                title: filterData.chain_name,
                subtitle: filterData.chain_id,
                imgSrc: filterData.icon ? filterData.icon : CHAIN_DEFAULT_ICON
            };
        } else {
            return {
                title: UNKNOWN,
                subtitle: '--',
                imgSrc: CHAIN_DEFAULT_ICON
            };
        }
    });

    const formatChainID = (chainId: string) => {
        return ChainHelper.formatChainId(chainId);
    };

    const emits = defineEmits<{
        (e: 'clickTitle'): void;
        (e: 'clickAvatar'): void;
    }>();

    const go = () => {
        props.titleCanClick && emits('clickTitle');
    };

    const avatarClick = () => {
        props.avatarCanClick && emits('clickAvatar');
    };
</script>

<style lang="less" scoped>
    .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .small_icon {
        width: 32px;
        height: 32px;
    }

    .title {
        padding: 2px;
        font-size: var(--bj-font-size-sub-title);
        font-family: GolosUI_Medium;
        color: var(--bj-text-second);
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .subtitle {
        padding: 2px;
        font-family: GolosUI_Medium;
        color: var(--bj-text-third);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
    }
</style>
