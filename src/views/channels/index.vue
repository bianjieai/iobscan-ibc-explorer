<template>
    <PageContainer>
        <PageTitle title="IBC Channels" :subtitle="subtitle" />
        <div class="select flex items-center flex-wrap">
            <ChainsDropdown
                ref="chainDropdown"
                :dropdown-data="ibcChains.all"
                :chain-id="chainIdQuery"
                selected-double
                @on-selected-chain="onSelectedChain"
            />
            <BaseDropdown
                ref="statusDropdown"
                :status="statusQuery"
                :options="STATUS_OPTIONS"
                @on-selected-change="onSelectedStatus"
            />

            <ResetButton @on-reset="resetSearchCondition" />
        </div>
        <TableCommon
            :loading="loading"
            :data="channelsList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
        >
            <template #chain_a="{ record, column }">
                <ChainIcon
                    avatar-can-click
                    :title="record.channel_a"
                    no-subtitle
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains.all"
                    icon-size="small"
                    @click-avatar="goChains"
                />
            </template>

            <template #status="{ record, column }">
                <StatusImg
                    :type="BottomStatusType.CHANNEL"
                    :status="(String(record[column.key]) as TChannelStatus)"
                    :height="16"
                    :width="46"
                />
            </template>

            <template #chain_b="{ record, column }">
                <ChainIcon
                    avatar-can-click
                    :title="record.channel_b"
                    no-subtitle
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains.all"
                    icon-size="small"
                    @click-avatar="goChains"
                />
            </template>

            <template #last_updated="{ record, column }">
                <div>{{ formatLastUpdated(record[column.key]) }}</div>
            </template>

            <template #operating_period="{ record, column }">
                <div>{{ formatOperatingPeriod(record[column.key], record.status) }}</div>
            </template>

            <template #ibc_transfer_txs="{ record, column }">
                <TransferTxs
                    :title="record[column.key]"
                    :subtitle="record.ibc_transfer_txs_value"
                    :currency="record.currency"
                    no-link
                />
            </template>

            <template v-if="channelsList.length !== 0" #table_bottom_status>
                <BottomStatus :type="BottomStatusType.CHANNEL" />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script setup lang="ts">
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS, STATUS_OPTIONS } from '@/constants/channels';
    import { formatLastUpdated, formatOperatingPeriod } from '@/utils/timeTools';
    import { TChannelStatus, BottomStatusType } from '@/types/interface/components/table.interface';
    import { useIbcChains, useNeedCustomColumns, useLoading } from '@/composables';
    import {
        useGetChannelsList,
        useChannelsQuery,
        useChannelsSelected,
        useChannelsRef,
        useSubTitleComputed,
        useChannelsColumnJump
    } from '@/views/channels/composable';

    const { loading } = useLoading();
    const { ibcChains } = useIbcChains();
    const { chainIdQuery, statusQuery } = useChannelsQuery();
    const { channelsList, total, getChannelsList } = useGetChannelsList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.channels);
    const { searchChain, searchStatus, onSelectedChain, onSelectedStatus } = useChannelsSelected(
        chainIdQuery,
        statusQuery,
        getChannelsList,
        loading
    );
    const { chainDropdown, statusDropdown } = useChannelsRef();
    const { subtitle } = useSubTitleComputed(searchChain, searchStatus, total, channelsList);
    const { goChains, resetSearchCondition } = useChannelsColumnJump();
</script>

<style lang="less" scoped>
    .select {
        margin-top: 32px;

        :deep(.ant-dropdown-trigger) {
            margin-right: 8px;
        }
    }

    :deep(.ant-table-cell) {
        &:nth-of-type(3) {
            padding-right: 26px !important;
        }
        &:nth-of-type(4) {
            padding-left: 8px;
        }
    }
    // tablet
    @media screen and (max-width: 768px) {
        .select {
            margin-top: 24px;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .select {
            margin-top: 16px;
        }
        .selected_color {
            max-width: 72px !important;
        }

        :deep(.ant-dropdown-trigger) {
            &:last-of-type {
                margin-top: 8px;
            }
        }

        :deep(.ant-btn-icon-only) {
            margin-top: 8px;
        }
    }
</style>
