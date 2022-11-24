<template>
    <div class="flex items-center">
        <div>
            <img
                v-if="!relayer"
                :src="imgSrc"
                class="icon mr-8"
                :class="{ small_icon: iconSize === TableCellIconSize.SMALL }"
            />
            <ImageLoadStatus v-else :success-img="imgSrc" :default-img="defaultImg">
                <RLoadErrorImage :img-text="title" />
            </ImageLoadStatus>
        </div>
        <div
            class="flex flex-col justify-around"
            :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }"
        >
            <a-popover v-if="props.titlePopover" placement="topLeft">
                <template #content>
                    <div class="popover_c">
                        <div>
                            {{ relayerName }}
                        </div>
                    </div>
                </template>
                <div
                    class="title leading_none"
                    :class="{ hover_cursor: titleCanClick }"
                    @click="go"
                    >{{ relayerName }}</div
                >
            </a-popover>
            <div
                v-else
                class="title leading_none"
                :class="{ hover_cursor: titleCanClick }"
                @click="go"
                >{{ relayerName }}</div
            >
        </div>
    </div>
</template>

<script setup lang="ts">
    import RLoadErrorImage from '@/views/relayers/details/components/RLoadErrorImage.vue';
    import { computed } from 'vue';
    import {
        TableCellIconSize,
        TTableCellIconSize
    } from '@/types/interface/components/table.interface';
    import { RELAYER_DEFAULT_ICON, UNKNOWN } from '@/constants';

    // 说明 现已将 token chain 拆除。 仅剩relayer
    interface IProps {
        iconSize?: TTableCellIconSize;
        titlePopover?: boolean;
        title: string;
        imgSrc?: string;
        titleCanClick?: boolean;
        relayer?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        subtitle: '',
        imgSrc: '',
        iconSize: TableCellIconSize.NORMAL
    });
    const { imgSrc } = toRefs(props);

    // relayer 处理
    const relayerName = computed(() => props.title || UNKNOWN);
    const defaultImg = ref<string>('');
    if (relayerName.value === UNKNOWN) {
        defaultImg.value = RELAYER_DEFAULT_ICON;
    }
    const emit = defineEmits<{
        (e: 'clickTitle'): void;
    }>();

    const go = () => {
        emit('clickTitle');
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
        font-size: var(--bj-font-size-sub-title);
        color: var(--bj-text-second);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80px;
    }
</style>
