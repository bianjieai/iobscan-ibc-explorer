<template>
    <PageContainer>
        <PageTitle
            title="IBC Chains"
            :subtitle="`${formatBigNumber(chainsList?.length, 0)} chains supported`"
        />

        <TableCommon
            :table-loading="loading"
            :data="chainsList"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
            no-pagination
            :scroll="{ y: 610 }"
        >
            <template #chain="{ record, column }">
                <ChainIcon :chain="record[column.key]" icon-size="small" />
            </template>

            <template #channels="{ record, column }">
                <div class="hover_cursor" @click="goChannels(`${record.chain},allchain`)">{{
                    record[column.key]
                }}</div>
            </template>

            <template #relayers="{ record, column }">
                <div class="hover_cursor" @click="goRelayers(`${record.chain},allchain`, 1)">{{
                    record[column.key]
                }}</div>
            </template>

            <template #ibc_tokens="{ record, column }">
                <div>{{ record[column.key] }}</div>
            </template>

            <template #ibc_tokens_value="{ record, column }">
                <div>{{ `$ ${formatAmount(record[column.key]).title}` }}</div>
            </template>

            <template #transfer_txs="{ record, column }">
                <TransferTxs
                    :title="record[column.key]"
                    :subtitle="record.transfer_txs_value"
                    :currency="record.currency"
                    @on-title-click="goTransfer(record.chain)"
                />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script lang="ts" setup>
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS } from '@/constants/chains';
    import { useLoading, useNeedCustomColumns } from '@/composables';
    import { useGetChainsList, useChainsColumnJump } from '@/views/chains/composable';
    import { formatAmount } from '@/helper/tableCellHelper';
    import { formatBigNumber } from '@/helper/parseStringHelper';

    const { loading } = useLoading();
    const { chainsList } = useGetChainsList(loading);
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.chains);
    const { goChannels, goRelayers, goTransfer } = useChainsColumnJump();
</script>

<style lang="less" scoped>
    .table_wrapper {
        margin-top: 32px;
    }
    :deep(.ant-table-tbody tr .ant-table-cell) {
        &:nth-of-type(1) {
            font-family: GolosUI_Medium;
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

        &:nth-of-type(4) {
            padding-right: 26px;
        }
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
        .table_wrapper {
            margin-top: 24px;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .table_wrapper {
            margin-top: 16px;
        }
    }
</style>
