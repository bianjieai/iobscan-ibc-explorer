<template>
    <PageContainer>
        <div class="title_container">
            <PageTitle title="IBC Token Transfer Details" />
            <TxStatus :status="ibcTxStatus"></TxStatus>
        </div>
        <TxTip :status="ibcTxStatus" :error-log="errorLog"></TxTip>
        <div class="info_container">
            <TxCard icon="icon-a-baseinfo" title="Base Info">
                <TokenBaseInfo :token-info="tokenInfo"></TokenBaseInfo>
            </TxCard>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import TxStatus from './components/TxStatus.vue';
    import TxTip from './components/TxTip.vue';
    import TxCard from './components/TxCard.vue';
    import TokenBaseInfo from './components/TokenBaseInfo.vue';
    import { useTransfersDetailsInfo } from './composable';
    const { ibcTxStatus, errorLog, tokenInfo } = useTransfersDetailsInfo();
</script>

<style scoped lang="less">
    .title_container {
        .flex(row, nowrap, flex-start, center);
    }
    .info_container {
        margin-top: 6px;
    }
    @media screen and (max-width: 414px) {
        .title_container {
            .flex(column, nowrap, flex-start, flex-start);
        }
    }
</style>
