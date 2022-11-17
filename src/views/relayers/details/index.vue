<template>
    <PageContainer class="relayer_details">
        <PageTitle
            :title="`${relayerName} Relayer Details`"
            :title-icon="'icon-a-chainsserved'"
            :subtitle="subTitle"
            :img-src="relayerIcon"
            relayer
            :relayer-img-src="relayerImgSrc(relayerIcon, relayerName)"
        />
        <layer-block class="relayer_details__statistic">
            <statistic-list type="horizontal" :msg="relayerInfo" />
        </layer-block>
        <InfoCard
            icon="icon-a-ChannelPairs"
            title="Channel Pairs"
            class="relayer_details__channel_pairs"
        >
            <loading-component
                v-if="ibcStatisticsChainsStore.isShowLoading"
                :type="LoadingType.container"
                :width="100"
                :width-unit="'%'"
                :height="364"
            />
            <no-datas
                v-else-if="!ibcStatisticsChainsStore.isShowLoading && !channelPairsInfo.length"
            />
            <ChannelPairsInfo v-else :channel-pairs-info="channelPairsInfo" />
        </InfoCard>
        <div class="relayer_details__charts_wrap">
            <div class="relayer_details__charts_wrap__left">
                <div class="relayer_details__charts_wrap__left__top">
                    <RelayedTrendChart />
                </div>
                <div class="relayer_details__charts_wrap__left__bottom">
                    <InfoCard
                        class="relayer_details__charts_wrap__left__bottom__transfer_type_wrap"
                        icon="icon-a-transfertype"
                        title="IBC Transfer Type"
                    >
                        <loading-component
                            v-if="transferTypeLoading"
                            :type="LoadingType.container"
                            :width="460"
                            :height="200"
                        />
                        <no-datas
                            v-else-if="isShowModal || (!transferTypeLoading && !totalTxsCount)"
                            class="relayer_details__charts_wrap__left__bottom__transfer_type_wrap__nodatas"
                        />
                        <div
                            v-else
                            class="relayer_details__charts_wrap__left__bottom__transfer_type"
                        >
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
                        <loading-component
                            v-if="ibcStatisticsChainsStore.isShowLoading"
                            :type="LoadingType.container"
                            :width="280"
                            :height="200"
                        />
                        <no-datas
                            v-else-if="
                                isShowModal ||
                                (!ibcStatisticsChainsStore.isShowLoading && !channelPairsInfo)
                            "
                            class="relayer_details__charts_wrap__left__bottom__success_rate__nodatas"
                        />
                        <SuccessRateChart v-else :success-rate-percent="successRatePercent" />
                    </InfoCard>
                </div>
            </div>
            <div class="relayer_details__charts_wrap__right">
                <RelatedAssets />
            </div>
        </div>
        <InfoCard icon="icon-transactions" title="Transactions">
            <RelayerTransfer :served-chains-info="servedChainsInfo" :is-show-modal="isShowModal" />
        </InfoCard>
    </PageContainer>
    <IbcDialog v-if="isShowModal" :show-modal="isShowModal" :opacity="0.15"></IbcDialog>
</template>

<script setup lang="ts">
    import RelayedTrendChart from './components/RelayedTrend.vue';
    import RelatedAssets from './components/RelatedAssets.vue';
    import ChannelPairsInfo from './components/ChannelPairsInfo.vue';
    import TransferTypeChart from './components/TransferTypeChart.vue';
    import SuccessRateChart from './components/SuccessRateChart.vue';
    import RelayerTransfer from './components/RelayerTransfer.vue';
    import { LoadingType, TRANSFER_TYPE } from '@/constants';
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
        servedChainsInfo,
        relayedTotalTxs,
        relayedSuccessTxs,
        relayerInfo,
        channelPairsInfo,
        isShowModal,
        subTitle,
        relayerImgSrc
    } = useGetRelayerDetailsInfo();
    const {
        recvPacketTxs,
        acknowledgePacketTxs,
        timeoutPacketTxs,
        totalTxsCount,
        recvPacketTxsPercent,
        acknowledgePacketTxsPercent,
        timeoutPacketTxsPercent,
        transferTypeLoading
    } = useGetTransferTypeData();
    const { successRatePercent } = useGetSuccessRatePercent(relayedSuccessTxs, relayedTotalTxs);
</script>

<style lang="less" scoped>
    .relayer_details {
        padding: 38px 32px 22px;
        &__statistic {
            margin-top: 24px;
        }
        &__channel_pairs {
            :deep(.info_card__primary) {
                padding-bottom: 12px !important;
            }
        }
        &__charts_wrap {
            .flex(row, nowrap, space-between, flex-start);
            .info_card {
                margin-top: 16px;
            }
            &__left {
                flex: 1;
                max-width: 756px;
                &__top {
                }
                &__bottom {
                    .flex(row, nowrap, space-between, flex-start);
                    &__transfer_type_wrap {
                        flex: 1;
                        &__nodatas {
                            margin: 1px 0;
                            min-width: 380px;
                        }
                    }
                    &__transfer_type {
                        .flex(row, nowrap, center, flex-start);
                    }
                    &__success_rate {
                        margin-left: 16px;
                        &__nodatas {
                            margin: 1px 0;
                            min-width: 200px;
                        }
                    }
                }
            }
            &__right {
                margin-left: 16px;
                flex: 1;
                max-width: 428px;
            }
        }
        :deep(.page_title__icon) {
            width: 40px;
            height: 40px;
        }
    }
    // 1247px
    @media screen and (max-width: 1200px) {
        .relayer_details {
            padding-left: 48px;
            padding-right: 48px;
            &__statistic {
            }
            &__charts_wrap {
                &__left {
                    &__top {
                    }
                    &__bottom {
                        &__transfer_type_wrap {
                            &__nodatas {
                            }
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                            &__nodatas {
                            }
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 1183px) {
        .relayer_details {
            &__statistic {
            }
            &__charts_wrap {
                flex-direction: column;
                &__left {
                    width: 100%;
                    max-width: 100%;
                    &__top {
                    }
                    &__bottom {
                        &__transfer_type_wrap {
                            &__nodatas {
                            }
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                            &__nodatas {
                            }
                        }
                    }
                }
                &__right {
                    margin-left: 0;
                    width: 100%;
                    max-width: 100%;
                }
            }
        }
    }
    @media screen and (max-width: 1120px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    .list_item__horizontal {
                        padding: 24px 0;
                        width: 100%;
                        border-bottom: 1px solid var(--bj-border-color);
                        border-right: 0;
                        &:nth-of-type(2n + 1) {
                            padding-left: 0;
                        }
                        &:nth-of-type(2n) {
                            padding-left: 24px;
                            .list_item {
                                border-right: 0;
                            }
                        }
                        &:first-child {
                            padding-top: 0;
                        }
                        &:nth-of-type(2) {
                            padding-top: 0;
                        }
                        &:last-child {
                            padding-bottom: 0;
                            border-bottom: 0;
                        }
                        &:nth-last-child(2) {
                            padding-bottom: 0;
                            border-bottom: 0;
                        }
                        .list_item {
                            width: 100%;
                            border-right: 1px solid var(--bj-border-color);
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        &__transfer_type_wrap {
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 792px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    .list_item__horizontal {
                        .list_item {
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        .flex(column, nowrap, center, flex-start);
                        &__transfer_type_wrap {
                            width: 100%;
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                            margin-left: 0;
                            width: 100%;
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 580px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    .list_item__horizontal {
                        .list_item {
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        .flex(column, nowrap, center, flex-start);
                        &__transfer_type_wrap {
                            width: 100%;
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                            margin-left: 0;
                            width: 100%;
                        }
                    }
                }
                &__right {
                }
            }
        }
        :deep(.page_title__icon_mobile) {
            width: 40px;
            height: 40px;
        }
    }
    @media screen and (max-width: 530px) {
        .relayer_details {
            padding: 24px 16px 60px;
            &__statistic {
                :deep(.horizontal_container) {
                    grid-template-columns: repeat(1, 1fr);
                    .list_item__horizontal {
                        &:nth-of-type(2n + 1) {
                            .list_item {
                                border-right: 0;
                            }
                        }
                        &:nth-of-type(2n) {
                            padding-left: 0;
                        }
                        &:nth-of-type(2) {
                            padding-top: 24px;
                        }
                        &:nth-last-child(2) {
                            padding-bottom: 24px;
                            border-bottom: 1px solid var(--bj-border-color);
                        }
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        &__transfer_type_wrap {
                        }
                        &__transfer_type {
                        }
                        &__success_rate {
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
    @media screen and (max-width: 460px) {
        .relayer_details {
            &__statistic {
                :deep(.horizontal_container) {
                    .list_item__horizontal {
                    }
                }
            }
            &__charts_wrap {
                &__left {
                    &__bottom {
                        &__transfer_type_wrap {
                        }
                        &__transfer_type {
                            .flex(column, nowrap, center, flex-start);
                        }
                        &__success_rate {
                        }
                    }
                }
                &__right {
                }
            }
        }
    }
</style>
