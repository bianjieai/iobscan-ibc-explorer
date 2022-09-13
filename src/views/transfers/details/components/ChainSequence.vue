<template>
    <div class="sequence_info">
        <TitleCard :title="title"></TitleCard>
        <div class="sequence_info__content">
            <span class="sequence_info__label">{{ sequenceInfo.label }}</span>
            <span class="sequence_info__value">{{ sequenceInfo.value }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useSequenceInfo } from '../composable';
    import TitleCard from './TitleCard.vue';
    interface IProps {
        title: string;
        sequence: string;
    }
    const props = defineProps<IProps>();
    const { sequenceInfo } = useSequenceInfo(props);
</script>

<style lang="less" scoped>
    .sequence_info {
        margin-top: 16px;
        &__content {
            .flex(row, nowrap, flex-start, center);
            margin-top: 12px;
            padding: 16px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
        &__label {
            width: 92px;
            font-size: var(--bj-font-size-normal);
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 24px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
    }
    @media screen and (max-width: 1160px) {
        .sequence_info {
            &__content {
            }
            &__label {
                width: 140px;
            }
            &__value {
            }
        }
    }
</style>
