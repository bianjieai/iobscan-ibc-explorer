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
                <img v-if="relayerImageSrc" :src="relayerImageSrc" alt="" class="icon mr-8 small_icon" />
                <div v-else class="bg_text_c flex items-center justify-center mr-8">
                    <div class="bg_text leading_none">{{ (title.substring(0, 1) || '').toUpperCase() }}</div>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col justify-around"
            :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }"
        >
            <div class="title leading_none" :class="{ hover_cursor: titleCanClick }" @click="go">{{
                relayer ? relayerName : title
            }}</div>
            <div v-if="subtitle" class="subtitle leading_none" :class="{ tag: subtitleIsTag }">{{ subtitle }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { TableCellIconSize, TTableCellIconSize } from '../../../types/interface/table.interface';
    import { UNKNOWN } from '../../../constants';

    // 说明 现已将 token chain 拆除。 仅剩relayer
    interface IProps {
        iconSize?: TTableCellIconSize;
        title: string;
        subtitle?: string;
        subtitleIsTag?: boolean;
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
    const relayerName = computed(() => (props.title ? props.title : UNKNOWN));

    const relayerImageSrc = computed(() => {
        if (props.imgSrc) {
            return props.imgSrc;
        } else if (relayerName.value === UNKNOWN) {
            return new URL('../../../assets/relayers/default.png', import.meta.url).href;
        } else {
            return '';
        }
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 80px;
    }

    .subtitle {
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
