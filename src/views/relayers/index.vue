<template>
    <IbcDialog v-model:show-modal="showModal" />
    <BulletinBoard />
    <PageContainer>
        <PageTitle title="IBC Relayers" :subtitle="subtitle" />
        <RelayerSearch class="relayer_search" @on-search="searchFn" />
        <TableCommon
            v-show="!searchNoResult"
            :table-loading="loading"
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
                    :title-can-click="true"
                    :style="{ cursor: 'pointer' }"
                    :title="record[column.key]"
                    :title-popover="record.show_popover"
                    :img-src="record.relayer_icon"
                    relayer
                    icon-size="small"
                    @click="goRelayersDetails(record.relayer_id)"
                />
            </template>

            <template #relayers_served_chains="{ record, column }">
                <ChainPopover
                    :change-modal="changeModal"
                    :relayer-id="record.relayer_id"
                    :is-registered="record.is_registered"
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
                <div class="value_container">
                    <span class="symbol"> {{ UNIT_SIGNS }}</span>
                    {{ formatBigNumber(record[column.key], 0) }}
                </div>
            </template>

            <template #relayers_total_fee_cost="{ record, column }">
                <div class="value_container">
                    <span class="symbol"> {{ UNIT_SIGNS }}</span>
                    {{ formatBigNumber(record[column.key], 0) }}
                </div>
            </template>

            <template #relayers_last_updated="{ record }">
                <div>{{ record.relayers_last_updated_format }}</div>
            </template>
        </TableCommon>
        <div v-show="searchNoResult" class="relayer_no_result_c">
            <loading-component
                v-show="loading"
                class="relayer_no_result_c__loading"
                :type="LoadingType.position"
            />
            <no-result
                tip-description="Try to search with relayer name or address."
                class="relayer_no_result_c__content"
            />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
    import { LoadingType } from '@/constants';
    import BulletinBoard from './components/BulletinBoard.vue';
    import ChainPopover from './components/ChainPopover.vue';
    import RelayerSearch from './components/RelayerSearch.vue';
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS, RelayersListKey, UNIT_SIGNS } from '@/constants/relayers';
    import { useNeedCustomColumns, useLoading } from '@/composables';
    import { useGetRelayersList, useGoRelayersDetails, useShowModal } from './composable';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    const { loading } = useLoading();
    const { showModal, changeModal } = useShowModal();
    const { relayersList, subtitle, searchFn, searchNoResult } = useGetRelayersList(loading);
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.relayers);
    const { goRelayersDetails } = useGoRelayersDetails();
</script>

<style lang="less" scoped>
    .relayer_search {
        margin-top: 26px;
    }
    .relayer_no_result_c {
        position: relative;
        &__loading {
            top: 45%;
        }
        &__content {
            margin-top: 16px;
            padding: 0 !important;
            :deep(.no_result__content) {
                padding: 0;
                .result_icon {
                    margin: 100px 0 224px 0;
                }
            }
        }
    }
</style>
