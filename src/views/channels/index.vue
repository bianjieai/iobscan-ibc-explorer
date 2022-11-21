<template>
    <PageContainer>
        <PageTitle title="IBC Channels" :subtitle="subtitle" />
        <div class="select flex items-center flex-wrap wrapRelative">
            <BjSelect
                ref="chainDropdown"
                :data="chainData"
                :value="chainIds"
                :placeholders="['All Chains', 'All Chains']"
                :hide-icon="true"
                :mode="MODES.double"
                associate-id="allchain"
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

            <TypeButton @on-reset="resetSearchCondition" />
        </div>
        <TableCommon
            :loading="loading"
            :data="channelsList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
        >
            <template #chain_a="{ record, column }">
                <a-popover placement="right" destroy-tooltip-on-hide>
                    <template #content>
                        <div>
                            <p class="popover_c">
                                <span class="tip_label">Chain Name:</span>
                                <span class="tip_value ml-8">{{
                                    useMatchChainInfo(record[column.key]).chainName
                                }}</span>
                            </p>
                            <p class="popover_c mt-8">
                                <span class="tip_label">Chain ID:</span>
                                <span class="tip_value ml-8">
                                    {{ ChainHelper.formatChainId(record[column.key]) }}
                                </span>
                            </p>
                        </div>
                    </template>
                    <ChainIcon
                        avatar-can-click
                        :title="record.channel_a"
                        no-subtitle
                        :chain-id="record[column.key]"
                        :chains-data="ibcChains.all"
                        icon-size="small"
                        @click-avatar="goChains"
                    />
                </a-popover>
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
                <a-popover placement="right" destroy-tooltip-on-hide>
                    <template #content>
                        <div>
                            <p class="popover_c">
                                <span class="tip_label">Chain Name:</span>
                                <span class="tip_value ml-8">{{
                                    useMatchChainInfo(record[column.key]).chainName
                                }}</span>
                            </p>
                            <p class="popover_c mt-8">
                                <span class="tip_label">Chain ID:</span>
                                <span class="tip_value ml-8">
                                    {{ ChainHelper.formatChainId(record[column.key]) }}
                                </span>
                            </p>
                        </div>
                    </template>
                    <ChainIcon
                        avatar-can-click
                        :title="record.channel_b"
                        no-subtitle
                        :chain-id="record[column.key]"
                        :chains-data="ibcChains.all"
                        icon-size="small"
                        @click-avatar="goChains"
                    />
                </a-popover>
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
                <BottomStatus
                    :type="BottomStatusType.CHANNEL"
                    :status-data="BOTTOM_STATUS_DATA.channelStatusData"
                    :height="16"
                />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script setup lang="ts">
    import { PAGE_PARAMETERS, CHAIN_DEFAULT_VALUE, BOTTOM_STATUS_DATA } from '@/constants';
    import { COLUMNS, STATUS_OPTIONS } from '@/constants/channels';
    import { formatLastUpdated, formatOperatingPeriod } from '@/utils/timeTools';
    import { TChannelStatus, BottomStatusType } from '@/types/interface/components/table.interface';
    import {
        useIbcChains,
        useNeedCustomColumns,
        useLoading,
        useMatchChainInfo
    } from '@/composables';
    import {
        useGetChannelsList,
        useChannelsSelected,
        useChannelsColumnJump
    } from '@/views/channels/composable';
    import { MODES } from '@/components/BjSelect/constants';
    import ChainHelper from '@/helper/chainHelper';

    const { loading } = useLoading();
    const { ibcChains } = useIbcChains();
    const { channelsList, getChannelsList, subtitle } = useGetChannelsList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.channels);
    const {
        chainDropdown,
        statusDropdown,
        statusQuery,
        chainIds,
        chainData,
        onSelectedChain,
        onSelectedStatus
    } = useChannelsSelected(ibcChains, getChannelsList, loading);
    const { goChains, resetSearchCondition } = useChannelsColumnJump();

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
    .tip_label {
        font-family: 'GolosUI_Medium';
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
    }
    .tip_value {
        color: rgba(0, 0, 0, 0.75);
    }
    :deep(.ant-table-tbody tr .ant-table-cell) {
        &:nth-of-type(1) {
            font-family: GolosUI_Medium;
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
