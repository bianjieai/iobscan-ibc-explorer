<template>
    <div class="flex flex-col items-end">
        <div class="title" :class="noLink ? '' : 'hover-cursor'" @click="go">{{ formatBigNumber(title, 0) }}</div>
        <div class="subtitle mt-4">{{
            subtitle === '' ? `${currency} --` : `${currency} ${formatBigNumber(subtitle, 0)}`
        }}</div>
    </div>
</template>

<script lang="ts" setup>
    import { formatBigNumber } from '@/helper/parseStringHelpers';

    interface IProps {
        title?: string | number;
        subtitle?: string | number;
        currency?: string;
        noLink?: boolean;
    }

    defineProps<IProps>();

    const emit = defineEmits<{
        (e: 'onTitleClick'): void;
    }>();
    const go = () => {
        emit('onTitleClick');
    };
</script>

<style lang="less">
    .title {
        font-size: var(--bj-font-size-sub-title);
    }

    .subtitle {
        color: var(--bj-text-third);
    }
</style>
