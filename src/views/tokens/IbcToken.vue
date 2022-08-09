<template>
    <PageContainer>
        <PageTitle
            :title="`${baseDenomInfo.symbol} IBC Token`"
            :subtitle="subtitle"
            has-icon
            :img-src="baseDenomInfo.imgSrc"
        />
        <div class="select flex items-center flex-wrap">
            <ChainsDropdown
                ref="chainDropdown"
                :chain-id="chainIdQuery"
                :dropdown-data="ibcChains.all"
                @on-selected-chain="onSelectedChain"
            />
            <BaseDropdown
                ref="statusDropdown"
                :status="statusQuery"
                :options="IBC_STATUS_OPTIONS"
                @on-selected-change="onSelectedStatus"
            />
            <ResetButton @on-reset="resetSearchCondition" />
        </div>

        <TableCommon
            :loading="loading"
            :data="ibcTokenList"
            :need-custom-columns="needCustomColumns"
            :columns="IBC_COLUMNS"
            need-count
        >
            <template #denom="{ record, column }">
                <a-popover
                    v-if="record.token_type !== SPECIAL_TOKEN_TYPE.GENESIS"
                    placement="topLeft"
                >
                    <template #content>
                        <div class="notice_text">
                            <div>Path: {{ record.denom_path }}</div>
                            <div>Token Hash: {{ record[column.key] }}</div>
                        </div>
                    </template>
                    <div>{{ getRestString(rmIbcPrefix(record[column.key]), 3, 8) }}</div>
                </a-popover>
                <div v-else>
                    <div
                        v-if="getBaseDenomInfoByDenom(record[column.key], record.chain_id)?.symbol"
                        >{{
                            getBaseDenomInfoByDenom(record[column.key], record.chain_id)?.symbol
                        }}</div
                    >
                    <div v-else>
                        <a-popover v-if="record[column.key].length > 11" placement="topLeft">
                            <template #content>
                                <div class="popover_c">{{ record[column.key] }}</div>
                            </template>
                            <div>{{ getRestString(record[column.key], 3, 8) }}</div>
                        </a-popover>
                        <div v-else>{{ record[column.key] }}</div>
                    </div>
                </div>
            </template>
            <template #chain_id="{ record, column }">
                <ChainIcon
                    avatar-can-click
                    title-can-click
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains.all"
                    icon-size="small"
                    @click-avatar="goChains"
                    @click-title="goChains"
                />
            </template>
            <template #ibc_hops="{ record, column }">
                <span>{{ formatBigNumber(record[column.key], 0) }}</span>
            </template>

            <template #amount="{ record, column }">
                <a-popover>
                    <template #content>
                        <div class="popover_c">{{
                            `${
                                formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms)
                                    .popover
                            }`
                        }}</div>
                    </template>
                    <div>{{
                        `${formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms).title}`
                    }}</div>
                </a-popover>
            </template>

            <template #receive_txs="{ record, column }">
                <div
                    class="hover_cursor"
                    @click="goTransfer(`allchain,${record.chain_id}`, record.denom)"
                    >{{ formatBigNumber(record[column.key], 0) }}
                </div>
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script lang="ts" setup>
    import { useIbcChains, useLoading, useNeedCustomColumns } from '@/composables';
    import { PAGE_PARAMETERS } from '@/constants';
    import { IBC_STATUS_OPTIONS, IBC_COLUMNS, SPECIAL_TOKEN_TYPE } from '@/constants/tokens';
    import { formatBigNumber, getRestString, rmIbcPrefix } from '@/helper/parseStringHelper';
    import { formatAmount } from '@/helper/tableCellHelper';
    import { useGetIbcDenoms } from '../home/composable';
    import {
        useGetIbcTokenList,
        useIbcTokenQuery,
        useIbcTokenSelected,
        useIbcTokenRef,
        useSubTitleComputed,
        useIbcTokenColumnJump,
        useBaseDenomInfoComputed
    } from './ibccomposable';

    const { loading } = useLoading();
    const { ibcChains } = useIbcChains();
    const { ibcBaseDenoms, getIbcBaseDenom, getBaseDenomInfoByDenom } = useGetIbcDenoms();
    const { baseDenomQuery, chainIdQuery, statusQuery } = useIbcTokenQuery();
    const { ibcTokenList, total, getIbcTokenList } = useGetIbcTokenList(baseDenomQuery);
    const { baseDenomInfo } = useBaseDenomInfoComputed(ibcBaseDenoms, baseDenomQuery);
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.ibcToken);
    const { searchChain, searchStatus, onSelectedChain, onSelectedStatus } = useIbcTokenSelected(
        chainIdQuery,
        statusQuery,
        getIbcTokenList,
        getIbcBaseDenom,
        loading
    );
    const { chainDropdown, statusDropdown } = useIbcTokenRef();
    const { subtitle } = useSubTitleComputed(searchChain, searchStatus, total, ibcTokenList);
    const { goChains, goTransfer, resetSearchCondition } = useIbcTokenColumnJump(baseDenomQuery);
</script>

<style lang="less" scoped>
    .select {
        margin-top: 26px;

        :deep(.ant-dropdown-trigger) {
            margin-right: 8px;
        }
    }
    :deep(.ant-table-cell) {
        &:nth-of-type(3) {
            .ant-table-column-sorters {
                justify-content: flex-start;
                .ant-table-column-title {
                    flex: 0;
                }
            }
        }
    }

    .notice_text {
        color: var(--bj-text-second);
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
    }

    @media screen and (max-width: 353px) {
        .select {
        }

        :deep(.ant-dropdown-trigger) {
            &:first-of-type {
                margin-right: 50px;
            }

            &:last-of-type {
                margin-top: 8px;
            }
        }

        :deep(.ant-btn-icon-only) {
            margin-top: 8px;
        }
    }
</style>
