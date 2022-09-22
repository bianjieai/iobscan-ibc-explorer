<template>
    <div class="sequence_info" :class="{ sequence_info__container: isFlexColumn }">
        <TitleCard :title="title"></TitleCard>
        <div class="sequence_info__content" :class="{ sequence_info__column: isFlexColumn }">
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
        isFlexColumn: boolean;
    }
    const props = defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'updateIsFlexColumn', newIsFlexColumn: boolean): void;
    }>();
    const { sequenceInfo } = useSequenceInfo(props, emits);
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
        &__column {
            .flex(column, nowrap, flex-start, flex-start);
            .sequence_info__value {
                margin-top: 2px;
                margin-left: 0;
            }
        }
    }
    .sequence_info__container {
        margin-top: 28px;
        .sequence_info__content {
            margin-top: 24px;
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
            &__column {
                .flex(row, nowrap, flex-start, center);
                .sequence_info__value {
                    margin-top: 0;
                    margin-left: 24px;
                }
            }
        }
        .sequence_info__container {
            margin-top: 16px;
            .sequence_info__content {
                margin-top: 12px;
            }
        }
    }
    @media screen and (max-width: 500px) {
        .sequence_info {
            &__content {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__label {
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
            }
            &__column {
                .flex(column, nowrap, flex-start, flex-start);
                .sequence_info__value {
                    margin-top: 2px;
                    margin-left: 0;
                }
            }
        }
        .sequence_info__container {
            .sequence_info__content {
            }
        }
    }
</style>
