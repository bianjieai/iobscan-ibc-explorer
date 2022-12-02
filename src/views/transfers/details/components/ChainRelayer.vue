<template>
    <div class="relayer_info">
        <TitleCard :title="title"></TitleCard>
        <div class="relayer_info__content" :class="{ relayer_info__cotent_column: isFlexColumn }">
            <div class="relayer_info__name" :class="{ relayer_info__column: isFlexColumn }">
                <span class="relayer_info__label">{{ relayerScInfoList.label }}</span>
                <router-link
                    v-if="relayerScInfoList.value !== DEFAULT_DISPLAY_TEXT"
                    :to="`/relayers?chain=${scInfo?.chain},${dcInfo?.chain}`"
                    class="relayer_info__value"
                >
                    <img :src="relayerScIcon" alt="" />
                    <span>{{ relayerScInfoList.value }}</span>
                </router-link>
                <span v-else class="relayer_info__value">
                    <span>{{ DEFAULT_DISPLAY_TEXT }}</span>
                </span>
            </div>
            <ChainAddress
                class="relayer_info__address"
                :chain-address="fromAddressInfo"
                :chain-info="scInfo"
            ></ChainAddress>
            <ChainAddress
                class="relayer_info__address"
                :chain-address="toAddressInfo"
                :chain-info="dcInfo"
            ></ChainAddress>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { IRelayerInfo, ITxInfo } from '@/types/interface/transfers.interface';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import { useRelayerInfo } from '../composable';
    import TitleCard from './TitleCard.vue';
    import ChainAddress from './ChainAddress.vue';
    interface IProps {
        title: string;
        relayerInfo: IRelayerInfo | undefined;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
        isFlexColumn: boolean;
    }
    const props = defineProps<IProps>();
    const emits = defineEmits<{
        (e: 'updateIsFlexColumn', newIsFlexColumn: boolean): void;
    }>();

    const { relayerScInfoList, relayerScIcon, fromAddressInfo, toAddressInfo } = useRelayerInfo(
        props,
        emits
    );
</script>

<style lang="less" scoped>
    .relayer_info {
        min-width: 300px;
        &__content {
            margin-top: 16px;
            padding: 16px;
            min-height: 192px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
        &__cotent_column {
            min-height: 228px;
        }
        &__name {
            .flex(row, nowrap, flex-start, center);
            &:nth-of-type(2) {
                margin-top: 8px;
            }
        }
        &__label {
            width: 92px;
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            .flex(row, nowrap, flex-start, flex-start);
            margin-left: 24px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
            img {
                margin-right: 4px;
                width: 24px;
                height: 24px;
            }
        }
        &__address {
            margin-top: 14px;
            &:first-child {
                margin-top: 11px;
            }
        }
        &__column {
            .flex(column, nowrap, flex-start, flex-start);
            .relayer_info__value {
                margin-top: 2px;
                margin-left: 0;
                word-break: break-all;
            }
        }
    }
    @media screen and (max-width: 1160px) {
        .relayer_info {
            &__content {
                width: 100%;
                min-height: auto;
            }
            &__name {
            }
            &__label {
                width: 140px;
            }
            &__value {
                img {
                }
            }
            &__address {
                &:first-child {
                }
            }
            &__column {
                .flex(row, nowrap, flex-start, center);
                .relayer_info__value {
                    margin-top: 0;
                    margin-left: 24px;
                }
            }
        }
    }
    @media screen and (max-width: 500px) {
        .relayer_info {
            &__content {
                width: 100%;
                min-height: auto;
            }
            &__name {
                .flex(column, nowrap, flex-start, flex-start);
            }
            &__label {
                width: 100%;
            }
            &__value {
                margin-top: 2px;
                margin-left: 0;
                img {
                }
            }
            &__address {
                &:first-child {
                }
            }
            &__column {
                .relayer_info__value {
                    margin-top: 2px;
                    margin-left: 0;
                }
            }
        }
    }
</style>
