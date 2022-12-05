<template>
    <ul class="progress_list">
        <li v-for="(item, index) in progressListAll" :key="index" class="progress_list__item">
            <span class="progress_list__label">{{ item.label }}</span>
            <span
                v-if="item.isFormatStatus"
                class="progress_list__value"
                :class="changeColor(item.value)"
            >
                {{ item.value }}
            </span>
            <span
                v-else-if="item.isFormatSigner"
                class="progress_list__value"
                :class="{ cursor: judgeIsAddressCursor(item.value) }"
                @click="goAddressDetails(item.value)"
                >{{ item.value }}</span
            >
            <span v-else class="progress_list__value">{{ item.value }}</span>
        </li>
    </ul>
</template>

<script setup lang="ts">
    import type { IIbcTxInfo, IProgress, ITxInfo } from '@/types/interface/transfers.interface';
    import { changeColor } from '@/helper/tableCellHelper';
    import { useProgressList } from '../composable';
    import { useGoAddressDetail } from '@/composables';

    interface IProps {
        ibcTxInfo: IIbcTxInfo | undefined;
        mark: IProgress;
        ibcTxStatus: number;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();
    const { progressListAll } = useProgressList(props);
    const { goAddressDetails, judgeIsAddressCursor } = useGoAddressDetail();
</script>

<style lang="less" scoped>
    .progress_list {
        margin-top: 24px;
        &__item {
            .flex(row, nowrap, flex-start, flex-start);
            margin-top: 16px;
            list-style: none;
            &:first-child {
                margin-top: 0;
            }
        }
        &__label {
            width: 164px;
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            margin-left: 40px;
            color: var(--bj-text-second);
            word-break: break-word;
        }
    }
    .success_color {
        font-family: GolosUI_Medium;
        color: var(--bj-success);
    }
    .failed_color {
        font-family: GolosUI_Medium;
        color: var(--bj-failed);
    }
    @media screen and (max-width: 556px) {
        .progress_list {
            &__item {
                .flex(column, nowrap, flex-start, flex-start);
                &:first-child {
                }
            }
            &__label {
                width: 100%;
            }
            &__value {
                margin-top: 2;
                margin-left: 0;
            }
        }
    }
</style>
