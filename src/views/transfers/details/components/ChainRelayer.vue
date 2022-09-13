<template>
    <div class="relayer_info">
        <TitleCard :title="title"></TitleCard>
        <div class="relayer_info__content">
            <div class="relayer_info__name">
                <span class="relayer_info__label">{{ relayerInfoList.label }}</span>
                <span class="relayer_info__value">
                    <img :src="relayerIcon" alt="" />
                    <span>{{ relayerInfoList.value }}</span>
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
    import { useRequenceInfo } from '../composable';
    import TitleCard from './TitleCard.vue';
    import ChainAddress from './ChainAddress.vue';
    interface IProps {
        title: string;
        relayerInfo: IRelayerInfo | undefined;
        scInfo: ITxInfo | undefined;
        dcInfo: ITxInfo | undefined;
    }
    const props = defineProps<IProps>();

    const { relayerInfoList, relayerIcon, fromAddressInfo, toAddressInfo } = useRequenceInfo(props);
</script>

<style lang="less" scoped>
    .relayer_info {
        &__content {
            margin-top: 16px;
            padding: 16px;
            width: 300px;
            min-height: 192px;
            background: #f8fafd;
            border-radius: var(--border-radius-normal);
        }
        &__name {
            .flex(row, nowrap, flex-start, center);
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
            margin-top: 16px;
            &:first-child {
                margin-top: 11px;
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
        }
    }
</style>
