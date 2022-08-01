<template>
    <PageContainer>
        <PageTitle
            title="IBC Chains"
            :subtitle="`${formatBigNumber(list?.length, 0)} chains supported`"
        />

        <TableCommon
            :loading="loading"
            :data="list"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
            no-pagination
            :scroll="{ y: 610 }"
        >
            <template #chain_id="{ record, column }">
                <ChainIcon
                    :chain-id="record[column.key]"
                    :chains-data="ibcChains?.all ?? []"
                    icon-size="small"
                />
            </template>

            <template #channels="{ record, column }">
                <div class="hover_cursor" @click="goChannels(`${record.chain_id},allchain`)">{{
                    record[column.key]
                }}</div>
            </template>

            <template #relayers="{ record, column }">
                <div class="hover_cursor" @click="goRelayers(`${record.chain_id},allchain`, 1)">{{
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
                    @on-title-click="goTransfer(record.chain_id)"
                />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script lang="ts" setup>
    import { PAGE_PARAMETERS } from '@/constants';
    import { COLUMNS } from '@/constants/chains';
    import { useIbcChains, useLoading, useNeedCustomColumns } from '@/composables';
    import { onMounted } from 'vue';
    import { useGetChainsList, useJump } from '@/views/chains/composable';
    import { formatAmount } from '@/helper/tableCellHelper';
    import { formatBigNumber } from '@/helper/parseStringHelper';

    const { ibcChains, getIbcChains } = useIbcChains();
    const { list, getList } = useGetChainsList();
    const { needCustomColumns } = useNeedCustomColumns(PAGE_PARAMETERS.chains);
    const { loading } = useLoading();
    const { goChannels, goRelayers, goTransfer } = useJump();

    onMounted(() => {
        !sessionStorage.getItem('allChains') && getIbcChains();
        getList(loading);
    });
</script>

<style lang="less" scoped>
    .table-warpper {
        margin-top: 32px;
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

    // pc
    @media screen and (min-width: 768px) {
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
        .table-warpper {
            margin-top: 24px;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .table-warpper {
            margin-top: 16px;
        }
    }
</style>
