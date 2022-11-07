<template>
    <div class="channel_pairs">
        <div v-for="(item, index) in channelPairsInfo" :key="index" class="channel_pairs__info">
            <span class="channel_pairs__index">{{ index + 1 }}</span>
            <div class="channel_pairs__pair">
                <ChannelPair
                    :chain="item.chain_a"
                    :channel="item.channel_a"
                    :chain-address-list="item.chain_a_addresses"
                    :height="pairAddressListHeight(item)"
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
                    :height="pairAddressListHeight(item)"
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
    const { pairAddressListHeight } = useChannelPairsAddressHeight();
</script>
<style lang="less" scoped>
    .channel_pairs {
        max-height: 416px;
        overflow-y: auto;
        &__info {
            .flex(row, nowrap, space-between, center);
            margin-top: 16px;
            margin-right: 8px;
            &:first-child {
                margin-top: 0;
            }
        }
        &__index {
            font-size: var(--bj-font-size-sub-title);
            font-weight: 400;
            color: var(--bj-text-normal);
            line-height: 22px;
        }
        &__pair {
            flex: 1;
            .flex(row, nowrap, space-between, flex-start);
            margin-left: 16px;
        }
        &__status_img {
            transform: translateY(33px);
        }
    }
</style>
