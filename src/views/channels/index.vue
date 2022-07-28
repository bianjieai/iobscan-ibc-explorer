<template>
    <PageContainer>
        <PageTitle title="IBC Channels" :subtitle="subtitle" />
        <div class="select flex items-center flex-wrap">
            <ChainsDropdown
                ref="chainDropdown"
                :dropdown-data="ibcChains?.all ?? []"
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
            :data="list"
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
                    :chains-data="ibcChains?.all ?? []"
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
                    :chains-data="ibcChains?.all ?? []"
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

            <template v-if="list.length !== 0" #table_bottom_status>
                <BottomStatus :type="BottomStatusType.CHANNEL" />
            </template>
        </TableCommon>
    </PageContainer>
</template>

<script setup lang="ts">
    import PageContainer from '@/components/responsive/PageContainer.vue';
    import PageTitle from '@/components/responsive/PageTitle.vue';
    import TableCommon from '@/components/responsive/table/TableCommon.vue';
    import ChainsDropdown from '@/components/responsive/dropdown/DropDownChains.vue';
    import BaseDropdown from '@/components/responsive/dropdown/DropDownBase.vue';
    import ResetButton from '@/components/responsive/ResetButton.vue';
    import BottomStatus from '@/components/responsive/table/BottomStatus.vue';
    import TransferTxs from '@/components/responsive/table/TransferTxs.vue';
    import StatusImg from '@/components/responsive/table/StatusImg.vue';
    import ChainIcon from '@/components/responsive/table/ChainIcon.vue';
    import { COLUMNS, STATUS_OPTIONS } from './constants';
    import { computed, onMounted, ref } from 'vue';
    import { formatLastUpdated, formatOperatingPeriod } from '@/utils/timeTools';
    import { TChannelStatus, BottomStatusType } from '@/components/responsive/component.interface';
    import { useGetChannelsList } from '@/service/channels';
    import { useIbcChains } from '../home/composable';
    import { useRoute, useRouter } from 'vue-router';
    import { formatBigNumber } from '@/helper/parseStringHelpers';
    import { urlHelper } from '@/utils/urlTools';

    let pageUrl = '/channels';

    const route = useRoute();
    const router = useRouter();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TChannelStatus;

    const { ibcChains, getIbcChains } = useIbcChains();
    const { list, total, getList } = useGetChannelsList();

    const needCustomColumns = ['chain_a', 'status', 'chain_b', 'operating_period', 'last_updated', 'ibc_transfer_txs'];

    const chainDropdown = ref();
    const statusDropdown = ref();

    const searchChain = ref(chainIdQuery ? chainIdQuery : undefined);
    const searchStatus = ref(statusQuery ? statusQuery : undefined);

    onMounted(() => {
        !sessionStorage.getItem('allChains') && getIbcChains();

        refreshList();
    });

    const subtitle = computed(() => {
        if (!searchChain.value && !searchStatus.value) {
            return `${formatBigNumber(total.value, 0)} channels found`;
        } else {
            return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(total.value, 0)} channels found`;
        }
    });
    const loading = ref(false);
    const refreshList = () => {
        getList({
            chain: searchChain.value,
            status: searchStatus.value,
            loading: loading
        });
    };

    const onSelectedChain = (chain_id?: string) => {
        searchChain.value = chain_id !== 'allchain,allchain' ? chain_id : '';
        pageUrl = urlHelper(pageUrl, {
            key: 'chain',
            value: searchChain.value as string
        });
        router.replace(pageUrl);
        refreshList();
    };

    const onSelectedStatus = (value?: number | string) => {
        searchStatus.value = value as TChannelStatus;
        pageUrl = urlHelper(pageUrl, {
            key: 'status',
            value: value as TChannelStatus
        });
        router.replace(pageUrl);
        refreshList();
    };

    // reset
    const resetSearchCondition = () => {
        location.href = '/channels';
    };

    const goChains = () => {
        router.push('/chains');
    };
</script>

<style lang="less" scoped>
    .select {
        margin-top: 32px;
        margin-bottom: 16px;

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
