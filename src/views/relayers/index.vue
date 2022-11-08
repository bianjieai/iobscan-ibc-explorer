<template>
    <!-- <IbcDialog v-model:show-modal="showmodal1"/> -->
    <BulletinBoard />
    <PageContainer>
        <PageTitle title="IBC Relayers" :subtitle="subtitle" />
        <TableCommon
            :loading="loading"
            :data="relayersList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            :real-time-key="[
                {
                    scKey: RelayersListKey.relayersLastUpdated,
                    dcKey: 'relayers_last_updated_format'
                }
            ]"
            need-count
            row-key="relayer_id"
        >
            <template #relayers_relayer_name="{ record, column }">
                <IconAndTitle
                    :title="record[column.key]"
                    :img-src="record.relayer_icon"
                    relayer
                    icon-size="small"
                />
            </template>

            <template #relayers_served_chains="{ record, column }">
                <!-- todo dj 悬浮区域待调整 -->
                <ChainPopover
                    :relayer-id="record.relayer_id"
                    :served-chains-num="record[column.key]"
                    :chain-list="record.served_chains_infos"
                />
            </template>

            <template #relayers_success_rate="{ record, column }">
                <div>{{ `${record[column.key]}%` }}</div>
            </template>

            <template #relayers_ibc_transfer_txs="{ record, column }">
                <div>{{ formatBigNumber(record[column.key], 0) }}</div>
            </template>

            <template #relayers_total_relayed_value="{ record, column }">
                <div class="value_container"
                    >{{ formatBigNumber(record[column.key], 0) }}
                    <span class="symbol"> $</span></div
                >
            </template>

            <template #relayers_total_fee_cost="{ record, column }">
                <div class="value_container"
                    >{{ formatBigNumber(record[column.key], 0) }}
                    <span class="symbol"> $</span></div
                >
            </template>

            <template #relayers_last_updated="{ record }">
                <div>{{ record.relayers_last_updated_format }}</div>
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script setup lang="ts">
    import BulletinBoard from './components/BulletinBoard.vue';
    import ChainPopover from './components/ChainPopover.vue';
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS, RelayersListKey } from '@/constants/relayers';
    import { useNeedCustomColumns, useLoading } from '@/composables';
    import { useGetRelayersList } from './composable';
    import { formatBigNumber } from '@/helper/parseStringHelper';

    const { loading } = useLoading();
    const { relayersList, subtitle } = useGetRelayersList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.relayers);
</script>

<style lang="less" scoped>
    :deep(.value_container .symbol) {
        font-size: var(--bj-font-size-normal);
        font-weight: 400;
        color: var(--bj-text-third);
    }
</style>
