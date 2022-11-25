<template>
    <div class="channel_pairs">
        <div v-for="(item, index) in channelPairsInfo" :key="index" class="channel_pairs__info">
            <span class="channel_pairs__index">{{ index + 1 }}</span>
            <div class="channel_pairs__pair">
                <ChannelPair
                    :chain="item.chain_a"
                    :channel="item.channel_a"
                    :chain-address-list="item.chain_a_addresses"
                    :height="getPairAddressListHeight(item)"
                ></ChannelPair>
                <div class="channel_pairs__status_img">
                    <StatusImg
                        :type="BottomStatusType.RELAYER"
                        :status="(String(item.channel_pair_status) as TRelayerStatus)"
                        :height="28"
                        :width="28"
                    />
                </div>
                <ChannelPair
                    :chain="item.chain_b"
                    :channel="item.channel_b"
                    :chain-address-list="item.chain_b_addresses"
                    :height="getPairAddressListHeight(item)"
                ></ChannelPair>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ChannelPair from './ChannelPair.vue';
    import { TRelayerStatus, BottomStatusType } from '@/types/interface/components/table.interface';
    import { IChannelChain } from '@/types/interface/relayers.interface';
    import { useChannelPairsAddressHeight } from '../composable';

    interface IChannelPairsInfo {
        channelPairsInfo: IChannelChain[] | undefined;
    }
    defineProps<IChannelPairsInfo>();
    const { getPairAddressListHeight } = useChannelPairsAddressHeight();
</script>
<style lang="less" scoped>
    .channel_pairs {
        padding-bottom: 12px;
        max-height: 416px;
        overflow: auto;
        &__info {
            .flex(row, nowrap, space-between, center);
            margin-top: 16px;
            margin-right: 8px;
            &:first-child {
                margin-top: 0;
            }
        }
        &__index {
            width: 24px;
            min-width: 24px;
            font-size: var(--bj-font-size-sub-title);
            font-weight: 400;
            color: var(--bj-text-normal);
            line-height: 22px;
            text-align: right;
        }
        &__pair {
            flex: 1;
            .flex(row, nowrap, space-between, flex-start);
            margin-left: 16px;
        }
        &__status_img {
            margin: 0 20px;
            transform: translateY(33px);
        }
    }
    @media screen and (max-width: 1130px) {
        .channel_pairs {
            &__info {
                &:first-child {
                }
            }
            &__index {
            }
            &__pair {
            }
            &__status_img {
                margin: 0 16px;
            }
        }
    }
</style>
