<template>
    <PageContainer>
        <PageTitle title="IBC Chains" :subtitle="`${formatBigNumber(list?.length, 0)} chains supported`" />

        <BjTable
            :loading="loading"
            :data="list"
            :need-custom-columns="needCustomColumns"
            :columns="COLUMNS"
            need-count
            no-pagination
            :scroll="{ y: 610 }"
        >
            <template #chain_id="{ record, column }">
                <ChainIcon :chain-id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
            </template>

            <template #channels="{ record, column }">
                <div class="hover-cursor" @click="goChannels(`${record.chain_id},allchain`)">{{
                    record[column.key]
                }}</div>
            </template>

            <template #relayers="{ record, column }">
                <div class="hover-cursor" @click="goRelayers(`${record.chain_id},allchain`, 1)">{{
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
        </BjTable>
    </PageContainer>
</template>

<script lang="ts" setup>
    import PageContainer from '@/components/responsive/pageContainer.vue';
    import PageTitle from '@/components/responsive/pageTitle.vue';
    import BjTable from '@/components/responsive/table/index.vue';
    import { COLUMNS } from './constants';
    import TransferTxs from '@/components/responsive/table/transferTxs.vue';
    import ChainIcon from '@/components/responsive/table/chainIcon.vue';
    import { useIbcChains } from '../home/composable';
    import { onMounted, ref } from 'vue';
    import { useGetChainsList } from '@/service/chains';
    import { useRouter } from 'vue-router';
    import { formatAmount } from '@/helper/tableCellHelper';
    import { formatBigNumber } from '@/helper/parseStringHelpers';

    const router = useRouter();

    const { ibcChains, getIbcChains } = useIbcChains();
    const { list, getList } = useGetChainsList();
    const loading = ref(false);

    onMounted(() => {
        !sessionStorage.getItem('allChains') && getIbcChains();
        getList(loading);
    });

    const needCustomColumns = ['chain_id', 'channels', 'relayers', 'ibc_tokens', 'ibc_tokens_value', 'transfer_txs'];

    const goChannels = (chain: string) => {
        router.push({
            path: '/channels',
            query: {
                chain
            }
        });
    };

    const goRelayers = (chain: string, status: number) => {
        router.push({
            path: '/relayers',
            query: {
                chain,
                status
            }
        });
    };

    // const goTokens = (chain_id: string) => {
    //   router.push({
    //     path: '/tokens',
    //     query: {
    //       chain_id
    //     }
    //   })
    // }

    const goTransfer = (chain_id: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain_id + ',allchain'
            }
        });
    };
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
