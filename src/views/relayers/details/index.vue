<template>
    <PageContainer class="relayer_details">
        <PageTitle
            :title="`${relayerName} Relayer Details`"
            :title-icon="'icon-a-chainsserved'"
            :subtitle="`A total of ${servedChains} blockchains served`"
            :img-src="relayerIcon"
        />
        <layer-block class="relayer_details__statistic">
            <statistic-list type="horizontal" :msg="relayerInfo" />
        </layer-block>
        <InfoCard icon="icon-a-ChannelPairs" title="Channel Pairs">
            <ChannelPairsInfo v-if="channelPairsInfo" :channel-pairs-info="channelPairsInfo" />
            <no-datas v-if="!ibcStatisticsChainsStore.isShowLoading && !channelPairsInfo" />
        </InfoCard>
        <div class="relayer_details__charts_wrap">
            <div class="relayer_details__charts_wrap__left">
                <div class="relayer_details__charts_wrap__left__top"></div>
                <div class="relayer_details__charts_wrap__left__bottom">
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__transfer_type_wrap"
                        icon="icon-a-transfertype"
                        title="IBC Transfer Type"
                    >
                        <div class="relayer_details__charts_wrap__left__bottom__transfer_type">
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.receive.label"
                                :txs-count="recvPacketTxs"
                                :txs-percent="recvPacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                            />
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.acknowledge.label"
                                :txs-count="acknowledgePacketTxs"
                                :txs-percent="acknowledgePacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                                :process-color="'#40A9FF'"
                            />
                            <TransferTypeChart
                                :type="TRANSFER_TYPE.timeout.label"
                                :txs-count="timeoutPacketTxs"
                                :txs-percent="timeoutPacketTxsPercent"
                                :total-txs-count="totalTxsCount"
                                :process-color="'#FAAD14'"
                            />
                        </div>
                    </InfoCard>
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__success_rate"
                        icon="icon-a-successrate"
                        title="Success Rate"
                    >
                        <SuccessRateChart :success-rate-percent="successRatePercent" />
                    </InfoCard>
                </div>
            </div>
            <div class="relayer_details__charts_wrap__right"></div>
        </div>
        <InfoCard icon="icon-transactions" title="Transactions">
            <div class="relayer_details__transfer">
                <div class="relayer_details__search">
                    <!-- <BjSelect
                        ref="relayerChainDropdown"
                        placeholder="All Chains"
                        :hide-icon="true"
                        :data="relayerChainData"
                        :input-ctn="{
                            placeholder: 'Search by Chain ID',
                            btnTxt: 'Confirm'
                        }"
                    /> -->
                    <!-- <ResetButton @on-reset="onClickReset" /> -->
                </div>
            </div>
        </InfoCard>
    </PageContainer>
</template>

<script setup lang="ts">
    import ChannelPairsInfo from './components/ChannelPairsInfo.vue';
    import TransferTypeChart from './components/TransferTypeChart.vue';
    import SuccessRateChart from './components/SuccessRateChart.vue';
    import { TRANSFER_TYPE } from '@/constants';
    import {
        useGetRelayerDetailsInfo,
        useGetSuccessRatePercent,
        useGetTransferTypeData
    } from './composable';
    import { useIbcStatisticsChains } from '@/store';
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    const {
        relayerIcon,
        relayerName,
        servedChains,
        relayedTotalTxs,
        relayedSuccessTxs,
        relayerInfo,
        channelPairsInfo
    } = useGetRelayerDetailsInfo();
    const {
        recvPacketTxs,
        acknowledgePacketTxs,
        timeoutPacketTxs,
        totalTxsCount,
        recvPacketTxsPercent,
        acknowledgePacketTxsPercent,
        timeoutPacketTxsPercent
    } = useGetTransferTypeData();
    const { successRatePercent } = useGetSuccessRatePercent(relayedSuccessTxs, relayedTotalTxs);
</script>

<style lang="less" scoped>
    .relayer_details {
        &__statistic {
            margin-top: 24px;
        }
        &__charts_wrap {
            .flex(row, nowrap, space-between, flex-start);
            &__left {
                flex: 1;
                &__bottom {
                    .flex(row, nowrap, space-between, flex-start);
                    &__transfer_type_wrap {
                        flex: 1;
                    }
                    &__transfer_type {
                        .flex(row, nowrap, space-between, flex-start);
                    }
                    &__success_rate {
                        margin-left: 16px;
                    }
                }
            }
            &__right {
                margin-left: 16px;
                flex: 1;
            }
        }
        &__transfer {
        }
        &__search {
            .flex(row, nowrap, flex-start, center);
        }
    }
</style>
