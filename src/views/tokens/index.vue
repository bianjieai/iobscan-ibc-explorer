<template>
    <PageContainer>
        <PageTitle title="IBC Tokens" :subtitle="subtitle" />
        <div class="select flex items-center flex-wrap wrapRelative">
            <BjSelect
                ref="tokensDropdown"
                :data="tokenData"
                :value="searchDenom"
                placeholder="All Tokens"
                :input-ctn="{
                    title: 'Custom IBC Tokens',
                    toolTip: 'Hash (in hex format) of the denomination trace information.',
                    placeholder: 'Search by ibc/hash',
                    btnTxt: 'Confirm',
                    icon: TIP_ICON
                }"
                :select-color-default-val="TOKEN_DEFAULT_VALUE"
                :dropdown-props="{
                    getPopupContainer: getPopupContainer
                }"
                @on-change="onSelectedToken"
            />
            <BjSelect
                ref="chainDropdown"
                :data="chainData"
                :value="searchChain"
                placeholder="All Chains"
                :hide-icon="true"
                :input-ctn="{
                    placeholder: 'Search by Chain ID',
                    btnTxt: 'Confirm'
                }"
                :select-color-default-val="CHAIN_DEFAULT_VALUE"
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
            :data="tokensList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
        >
            <template #base_denom="{ record, column }">
                <TokenIcon
                    base-page
                    title-can-click
                    :token-type="record.token_type"
                    :denom="record[column.key]"
                    :chain-id="record.chain_id"
                    :denoms-data="ibcBaseDenoms"
                    @click-title="goIbcToken(record.base_denom)"
                />
            </template>
            <template #price="{ record, column }">
                <a-popover v-if="+record[column.key] !== -1">
                    <template #content>
                        <div class="popover_c">{{
                            `${record.currency} ${formatPrice(record[column.key], undefined)}`
                        }}</div>
                    </template>
                    <div v-if="record[column.key] < THOUSAND_DECIMAL">
                        {{ `< ${record.currency} ${THOUSAND_DECIMAL}` }}
                    </div>
                    <div v-else>
                        {{ `${record.currency} ${formatPrice(record[column.key])}` }}
                    </div>
                </a-popover>
                <div v-else>{{ `${record.currency} ${formatPrice(record[column.key])}` }}</div>
            </template>

            <template #supply="{ record, column }">
                <div>{{
                    `${formatSupply(record[column.key], record.base_denom, ibcBaseDenoms)}`
                }}</div>
            </template>

            <template #ibc_transfer_amount="{ record, column }">
                <a-popover>
                    <template #content>
                        <div class="popover_c"
                            >{{
                                `${
                                    formatAmount(
                                        record[column.key],
                                        record.base_denom,
                                        ibcBaseDenoms
                                    ).popover
                                }`
                            }}
                        </div>
                    </template>
                    <div>{{
                        `${
                            formatAmount(record[column.key], record.base_denom, ibcBaseDenoms).title
                        }`
                    }}</div>
                </a-popover>
            </template>

            <template #ibc_transfer_txs="{ record, column }">
                <div class="hover_cursor" @click="goTransfer(record.base_denom, record.chain_id)">{{
                    `${formatBigNumber(record[column.key], 0)}`
                }}</div>
            </template>

            <template #chains_involved="{ record, column }">
                <div class="hover_cursor" @click="goIbcToken(record.base_denom)">{{
                    record[column.key]
                }}</div>
            </template>

            <template #chain_id="{ record, column }">
                <ChainIcon
                    title-can-click
                    avatar-can-click
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains.all"
                    icon-size="small"
                    @click-avatar="goChains"
                    @click-title="goChains"
                />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script lang="ts" setup>
    import { THOUSAND_DECIMAL, PAGE_PARAMETERS, TIP_ICON } from '@/constants';
    import {
        COLUMNS,
        STATUS_OPTIONS,
        CHAIN_DEFAULT_VALUE,
        TOKEN_DEFAULT_VALUE
    } from '@/constants/tokens';
    import { useIbcChains, useNeedCustomColumns, useLoading } from '@/composables';
    import {
        useGetTokenList,
        useTokensSelected,
        useTokensColumnJump
    } from '@/views/tokens/composable';
    import { useGetIbcDenoms } from '../home/composable';
    import { formatBigNumber } from '@/helper/parseStringHelper';
    import { formatPrice, formatSupply, formatAmount } from '@/helper/tableCellHelper';

    const { loading } = useLoading();
    const { ibcChains } = useIbcChains();
    const { ibcBaseDenoms, ibcBaseDenomsSorted, getIbcBaseDenom, getBaseDenomInfoByDenom } =
        useGetIbcDenoms();
    const { tokensList, getTokensList, subtitle } = useGetTokenList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.tokens);
    const {
        chainDropdown,
        statusDropdown,
        tokensDropdown,
        onSelectedToken,
        onSelectedChain,
        onSelectedStatus,
        tokenData,
        chainData,
        searchDenom,
        searchChain,
        statusQuery
    } = useTokensSelected(ibcBaseDenomsSorted, ibcChains, getTokensList, getIbcBaseDenom, loading);
    const { goChains, goIbcToken, goTransfer, resetSearchCondition } =
        useTokensColumnJump(getBaseDenomInfoByDenom);

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
        &:nth-of-type(2) {
            .ant-table-column-sorters {
                justify-content: flex-start;
                .ant-table-column-title {
                    flex: 0;
                }
            }
        }
        &:nth-of-type(8) {
            padding-left: 16px;
            .ant-table-column-sorters {
                justify-content: flex-start;
                .ant-table-column-title {
                    flex: 0;
                }
            }
        }
    }

    // tablet
    @media screen and (max-width: 768px) {
        .select {
            margin-top: 24px;
        }
    }
    @media screen and (max-width: 477px) {
        .select {
            .ant-btn {
                margin-top: 8px;
            }
        }
    }
    @media screen and (max-width: 445px) {
        .select {
            :deep(.ant-dropdown-trigger) {
                &:nth-of-type(3) {
                    margin-top: 10px;
                }
            }
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .select {
            margin-top: 16px;
        }

        :deep(.ant-dropdown-trigger) {
            &:first-of-type {
                margin-top: 8px;
            }
            &:nth-of-type(2) {
                margin-right: 0;
            }

            margin-top: 8px;
        }

        :deep(.ant-btn-icon-only) {
            margin-top: 8px;
        }
    }
</style>
