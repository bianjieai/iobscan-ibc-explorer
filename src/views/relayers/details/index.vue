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
    </PageContainer>
</template>

<script setup lang="ts">
    import { useGetRelayerDetailsInfo } from './composable';
    const { relayerIcon, relayerName, servedChains, relayerInfo } = useGetRelayerDetailsInfo();
</script>

<style lang="less" scoped>
    .relayer_details {
        &__statistic {
            margin-top: 24px;
        }
    }
</style>
