<template>
    <PageContainer>
        <PageTitle title="IBC Relayers" :subtitle="subtitle" />
        <div class="select flex items-center flex-wrap wrapRelative">
            <BjSelect
                ref="chainDropdown"
                :data="chainData"
                :value="chainIds"
                :placeholders="['All Chains', 'All Chains']"
                :hide-icon="true"
                :mode="MODES.double"
                associate-id="allchain"
                :edit-model="true"
                :input-ctn="{
                    placeholder: 'Search by Chain ID,Chain ID',
                    btnTxt: 'Confirm'
                }"
                :select-color-default-val="[CHAIN_DEFAULT_VALUE, CHAIN_DEFAULT_VALUE]"
                :dropdown-props="{
                    getPopupContainer: getPopupContainer
                }"
                @on-change="onSelectedChain"
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
            :data="relayersList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            :real-time-key="[{ scKey: 'update_time', dcKey: 'last_updated' }]"
            need-count
            row-key="relayer_id"
        >
            <template #relayer_name="{ record, column }">
                <NamePopover
                    :chain-a="record.chain_a"
                    :chain-b="record.chain_b"
                    :chain-a-address="record.chain_a_address"
                    :chain-b-address="record.chain_b_address"
                    :img-src="record.relayer_icon"
                    :relayer-name="record[column.key]"
                    :ibc-chains="ibcChains.all"
                />
            </template>

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
                    :type="BottomStatusType.RELAYER"
                    :status="(String(record[column.key]) as TRelayerStatus)"
                    :height="26"
                    :width="26"
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

            <template #last_updated="{ record }">
                <div>{{ formatLastUpdated(record.last_updated) }}</div>
            </template>

            <template #txs_success_rate="{ record, column }">
                <div>{{ `${record[column.key]}%` }}</div>
            </template>

            <template #transfer_total_txs="{ record, column }">
                <TransferTxs
                    :title="record[column.key]"
                    :subtitle="record.transfer_total_txs_value"
                    :currency="record.currency"
                    no-link
                />
            </template>

            <template v-if="relayersList?.length !== 0" #table_bottom_status>
                <BottomStatus :type="BottomStatusType.RELAYER" />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script setup lang="ts">
    import NamePopover from './components/NamePopover.vue';
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS, STATUS_OPTIONS } from '@/constants/relayers';
    import { formatLastUpdated } from '@/utils/timeTools';
    import { TRelayerStatus, BottomStatusType } from '@/types/interface/components/table.interface';
    import { useIbcChains, useNeedCustomColumns, useLoading } from '@/composables';
    import {
        useGetRelayersList,
        useRelayersQuery,
        useRelayersSelected,
        useRelayersRef,
        useSubTitleComputed,
        useRelayersColumnJump
    } from './composable';
    import { MODES } from '@/components/BjSelect/constants';
    import { CHAIN_DEFAULT_VALUE } from '@/constants/relayers';

    const { loading } = useLoading();
    const { ibcChains } = useIbcChains();
    const { relayersList, getRelayersList, total } = useGetRelayersList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.relayers);
    const { chainIdQuery, statusQuery } = useRelayersQuery();
    const { searchChain, searchStatus, onSelectedChain, onSelectedStatus, chainIds, chainData } =
        useRelayersSelected(chainIdQuery, statusQuery, getRelayersList, loading, ibcChains);
    const { chainDropdown, statusDropdown } = useRelayersRef();
    const { subtitle } = useSubTitleComputed(searchChain, searchStatus, total, relayersList);
    const { goChains, resetSearchCondition } = useRelayersColumnJump();

    const getPopupContainer = (): HTMLElement => document.querySelector('.wrapRelative')!;
</script>

<style lang="less" scoped>
    .wrapRelative {
        position: relative;
    }
    .select {
        margin-top: 32px;

        :deep(.ant-dropdown-trigger) {
            margin-right: 8px;
        }
    }

    :deep(.ant-table-cell) {
        &:nth-of-type(4) {
            padding-right: 26px !important;
        }
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
        .select {
            margin-top: 24px;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .select {
            margin-top: 16px;
        }
    }
    @media screen and (max-width: 394px) {
        :deep(.ant-btn-icon-only) {
            margin-top: 8px;
        }
    }
    @media screen and (max-width: 362px) {
        :deep(.ant-dropdown-trigger) {
            &:last-of-type {
                margin-top: 8px;
            }
        }
    }
</style>
