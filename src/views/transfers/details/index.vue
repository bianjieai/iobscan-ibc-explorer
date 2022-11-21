<template>
    <PageContainer>
        <div class="title_container">
            <PageTitle title="IBC Token Transfer Details" />
            <TxStatus :status="ibcTxStatus"></TxStatus>
        </div>
        <TxTip :status="ibcTxStatus" :error-log="errorLog"></TxTip>
        <div class="info_container">
            <InfoCard icon="icon-a-baseinfo" title="Base Info">
                <TokenBaseInfo :token-info="tokenInfo"></TokenBaseInfo>
                <div class="info_container__bottom">
                    <ChainBaseInfo
                        title="From"
                        :chain-info="scInfo"
                        :is-flex-column="isFlexColumn"
                        @update-is-flex-column="updateIsFlexColumn"
                    ></ChainBaseInfo>
                    <ChainProgress
                        :ibc-tx-status="ibcTxStatus"
                        :ibc-tx-info="ibcTxInfo"
                        :tx-img="leftTxImg"
                    ></ChainProgress>
                    <div class="info_container__center">
                        <ChainRelayer
                            title="Relayer"
                            :relayer-info="relayerInfo"
                            :sc-info="scInfo"
                            :dc-info="dcInfo"
                            :is-flex-column="isFlexColumn"
                            @update-is-flex-column="updateIsFlexColumn"
                        ></ChainRelayer>
                        <ChainSequence
                            title="Packet Sequence"
                            :sequence="sequence"
                            :is-flex-column="isFlexColumn"
                            @update-is-flex-column="updateIsFlexColumn"
                        ></ChainSequence>
                    </div>
                    <ChainProgress
                        :ibc-tx-status="ibcTxStatus"
                        :ibc-tx-info="ibcTxInfo"
                        :tx-img="rightTxImg"
                    ></ChainProgress>
                    <ChainBaseInfo
                        title="To"
                        :chain-info="dcInfo"
                        :is-flex-column="isFlexColumn"
                        @update-is-flex-column="updateIsFlexColumn"
                    ></ChainBaseInfo>
                </div>
            </InfoCard>
            <InfoCard icon="icon-Message" title="Messages">
                <TxProgress
                    :ibc-tx-status="ibcTxStatus"
                    :ibc-tx-info="ibcTxInfo"
                    :sc-info="scInfo"
                    :dc-info="dcInfo"
                ></TxProgress>
            </InfoCard>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import TxStatus from './components/TxStatus.vue';
    import TxTip from './components/TxTip.vue';
    import TokenBaseInfo from './components/TokenBaseInfo.vue';
    import ChainBaseInfo from './components/ChainBaseInfo.vue';
    import ChainProgress from './components/ChainProgress.vue';
    import ChainRelayer from './components/ChainRelayer.vue';
    import ChainSequence from './components/ChainSequence.vue';
    import TxProgress from './components/TxProgress.vue';
    import { useIbcTxInfo, useTransfersDetailsInfo } from './composable';
    const {
        ibcTxStatus,
        errorLog,
        tokenInfo,
        scInfo,
        dcInfo,
        relayerInfo,
        sequence,
        ibcTxInfo,
        isFlexColumn,
        updateIsFlexColumn
    } = useTransfersDetailsInfo();
    const { leftTxImg, rightTxImg } = useIbcTxInfo(ibcTxStatus, ibcTxInfo);
</script>

<style scoped lang="less">
    .title_container {
        .flex(row, nowrap, flex-start, center);
    }
    .info_container {
        margin-top: 6px;
        &__bottom {
            .flex(row, nowrap, space-between, flex-start);
            margin-top: 24px;
        }
    }
    @media screen and (max-width: 1160px) {
        .title_container {
        }
        .info_container {
            &__bottom {
                .flex(column, nowrap, space-between, flex-start);
                margin-top: 24px;
            }
            &__center {
                width: 100%;
            }
        }
    }
    @media screen and (max-width: 450px) {
        .title_container {
            .flex(column, nowrap, flex-start, flex-start);
        }
    }
</style>
