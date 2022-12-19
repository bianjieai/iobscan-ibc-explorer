<template>
    <div class="flex items-center" :class="{ token_icon: titleCanClick }">
        <img
            :src="tokenInfo.imgSrc"
            class="icon mr-8"
            :class="{ small_icon: iconSize === TableCellIconSize.SMALL, cursor: titleCanClick }"
            @click="go"
        />
        <div
            class="flex flex-col justify-around"
            :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }"
        >
            <a-popover v-if="titleCanPopover" placement="right">
                <template #content>
                    <div class="popover_c">{{ tokenInfo.defaultTitle }}</div>
                </template>
                <div
                    class="title leading_none"
                    :class="{ hover_cursor: titleCanClick }"
                    @click="go"
                    >{{ tokenInfo.title }}</div
                >
            </a-popover>
            <div
                v-else
                class="title leading_none"
                :class="{ hover_cursor: titleCanClick }"
                @click="go"
                >{{ tokenInfo.title }}</div
            >
            <div class="subtitle leading_none tag">{{ tokenType || tokenInfo.subtitle }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        TableCellIconSize,
        TTableCellIconSize,
        ITableTokenInfo
    } from '@/types/interface/components/table.interface';

    interface IProps {
        iconSize?: TTableCellIconSize;
        titleCanClick?: boolean;
        tokenType?: string;
        tokenInfo: ITableTokenInfo;
        titleCanPopover?: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        tokenType: '',
        iconSize: TableCellIconSize.NORMAL
    });

    const emit = defineEmits<{
        (e: 'clickTitle'): void;
    }>();

    const go = () => {
        emit('clickTitle');
    };
</script>

<style lang="less" scoped>
    .token_icon {
        &:hover {
            .leading_none {
                color: var(--bj-primary-color);
            }
        }
    }
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
        font-size: var(--bj-font-size-sub-title);
        font-family: GolosUI_Medium;
        color: var(--bj-text-second);
    }

    .subtitle {
        font-family: GolosUI_Medium;
        color: var(--bj-text-third);
    }

    .tag {
        font-size: var(--bj-font-size-small);
        color: var(--bj-primary-color);
        padding: 2px 4px;
        width: 53px;
        border-radius: 8px;
        background: rgba(61, 80, 255, 0.1);
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
</style>
