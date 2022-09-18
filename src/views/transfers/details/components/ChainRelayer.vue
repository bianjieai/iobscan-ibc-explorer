<template>
    <div class="relayer_info">
        <TitleCard :title="title"></TitleCard>
        <div class="relayer_info__content">
            <div class="relayer_info__name" :class="{ relayer_info__column: isFlexColumn }">
                <span class="relayer_info__label">{{ relayerScInfoList.label }}</span>
                <router-link
                    :to="`/relayers/chain=${scInfo?.chain_id},${dcInfo?.chain_id}`"
                    class="relayer_info__value"
                >
                    <img :src="relayerScIcon" alt="" />
                    <span>{{ relayerScInfoList.value }}</span>
                </router-link>
            </div>
            <div class="relayer_info__name" :class="{ relayer_info__column: isFlexColumn }">
                <span class="relayer_info__label">{{ relayerDcInfoList.label }}</span>
                <router-link
                    :to="`/relayers/chain=${scInfo?.chain_id},${dcInfo?.chain_id}`"
                    class="relayer_info__value"
                >
                    <img :src="relayerDcIcon" alt="" />
                    <span>{{ relayerDcInfoList.value }}</span>
                </router-link>
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

    const {
        relayerScInfoList,
        relayerDcInfoList,
        relayerScIcon,
        relayerDcIcon,
        fromAddressInfo,
        toAddressInfo
    } = useRelayerInfo(props, emits);
</script>

<style lang="less" scoped>
    .relayer_info {
        &__content {
            margin-top: 16px;
            padding: 16px;
            width: 300px;
            min-height: 228px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
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
            font-weight: 600;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            flex: 1;
            .flex(row, nowrap, flex-start, center);
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
            margin-top: 12px;
            &:first-child {
                margin-top: 11px;
            }
        }
        &__column {
            .flex(column, nowrap, flex-start, flex-start);
            .relayer_info__value {
                margin-top: 2px;
                margin-left: 0;
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
    @media screen and (max-width: 600px) {
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
