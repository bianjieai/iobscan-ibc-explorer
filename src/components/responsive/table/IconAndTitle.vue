<template>
    <div class="flex items-center">
        <div>
            <img
                v-if="!relayer"
                :src="imgSrc"
                class="icon mr-8"
                :class="{ small_icon: iconSize === TableCellIconSize.SMALL }"
            />
            <div v-else>
                <img
                    v-if="relayerImageSrc"
                    :src="displayRelayerImageSrc"
                    alt=""
                    class="icon mr-8 small_icon"
                />
                <div v-else class="bg_text_c flex items-center justify-center mr-8">
                    <div class="bg_text leading_none">{{
                        (title.substring(0, 1) || '').toUpperCase()
                    }}</div>
                </div>
            </div>
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
    import { computed } from 'vue';
    import {
        TableCellIconSize,
        TTableCellIconSize
    } from '@/types/interface/components/table.interface';
    import { RELAYER_DEFAULT_ICON, UNKNOWN } from '@/constants';
    import { handleImgLoadingSussess } from '@/utils/imageTools';

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

    // relayer 处理
    const relayerName = computed(() => props.title || UNKNOWN);

    const successLoadingImg = ref(false);

    const relayerImageSrc = computed(() => {
        if (props.imgSrc) {
            return props.imgSrc;
        } else if (relayerName.value === UNKNOWN) {
            return RELAYER_DEFAULT_ICON;
        } else {
            return '';
        }
    });

    watch(
        () => relayerImageSrc,
        (newValue) => {
            handleImgLoadingSussess(newValue.value, successLoadingImg);
        },
        {
            immediate: true
        }
    );

    const displayRelayerImageSrc = computed(() => {
        return successLoadingImg.value ? relayerImageSrc.value : RELAYER_DEFAULT_ICON;
    });

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

    .bg_text_c {
        width: 32px;
        height: 32px;
        background: url('../../../assets/relayers/default_bg.png') no-repeat center center;
        border-radius: 50%;
    }

    .bg_text {
        font-size: 22px;
        background: linear-gradient(to right, #b3bbff, #8594ff);
        background-size: cover;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    }
</style>
