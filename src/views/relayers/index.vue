<template>
  <PageContainer>
    <PageTitle title="IBC Relayers" :subtitle="subtitle" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown :dropdown-data="ibcChains?.all ?? []" :chain_id="chainIdQuery"
        @on-selected-chain="onSelectedChain" selected-double ref="chainDropdown" />
      <BaseDropdown :status="statusQuery" :options="STATUS_OPTIONS" ref="statusDropdown"
        @on-selected-change="onSelectedStatus" />

      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable 
      :loading="loading" 
      :data="list" 
      :need-custom-columns="needCustomColumns" 
      :columns="COLUMNS"
      :real-time-key = "[{scKey:'update_time', dcKey:'last_updated'}]"
      need-count rowKey="relayer_id">
      <template #relayer_name="{ record, column }">
        <NamePopover :chain_a="record.chain_a" :chain_b="record.chain_b" :chain_a_address="record.chain_a_address"
          :chain_b_address="record.chain_b_address" :img-src="record.relayer_icon" :relayer_name="record[column.key]"
          :ibc-chains="ibcChains?.all" />
      </template>

      <template #chain_a="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_a" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>

      <template #status="{ record, column }">
        <StatusImg type="Relayer" :status="(String(record[column.key]) as TRelayerStatus)" :height="26" :width="26" />
      </template>

      <template #chain_b="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_b" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>

      <template #last_updated="{ record, column }">
        <div>{{ formatLastUpdated(record.last_updated) }}</div>
      </template>

      <template #txs_success_rate="{ record, column }">
        <div>{{  `${record[column.key]}%` }}</div>
      </template>

      <template #transfer_total_txs="{ record, column }">
        <TransferTxs :title="record[column.key]" :subtitle="record.transfer_total_txs_value"
          :currency="record.currency" no-link/>
      </template>

      <template #table_bottom_status v-if="list?.length !== 0">
        <BottomStatus type="Relayer" />
      </template>
    </BjTable>
  </PageContainer>
</template>

<script setup lang="ts">
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS, STATUS_OPTIONS } from './constants'
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, onMounted, ref } from 'vue';
import { formatLastUpdated } from '@/helper/time-helper';
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import StatusImg from '@/components/responsive/table/statusImg.vue';
import { TRelayerStatus } from '@/components/responsive/component.interface';
import { useIbcChains } from '../home/composable';
import { useGetRelayersList } from '@/service/relayers';
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useRoute, useRouter } from 'vue-router';
import { formatTransfer_success_txs } from '@/helper/tablecell-helper';
import NamePopover from './components/namePopover.vue';
import { formatBigNumber } from '@/helper/parseString';
import { urlHelper } from '@/helper/url-helper';

const loading = ref(false);
let pageUrl = '/relayers'

const route = useRoute()
const router = useRouter()

const chainIdQuery = route.query.chain as string
const statusQuery = route.query.status as TRelayerStatus

const { ibcChains, getIbcChains } = useIbcChains();
const { list, getList, total } = useGetRelayersList()

const needCustomColumns = [
  'relayer_name',
  'chain_a',
  'status',
  'chain_b',
  'update_time',
  'txs_success_rate',
  'transfer_total_txs'
]

const chainDropdown = ref()
const statusDropdown = ref()

const originalChainRef = () => {
  if (!chainIdQuery) return
  if (chainIdQuery.includes(',')) {
    return `${chainIdQuery}`
  } else {
    return `${chainIdQuery},allchain`
  }
}
const searchChain = ref(originalChainRef())
const searchStatus = ref(statusQuery ? statusQuery : undefined)

onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();

  refreshList()
})

const subtitle = computed(() => {
  if (!searchChain.value && !searchStatus.value) {
    return `${formatBigNumber(total.value, 0)} relayers found`
  } else {
    return `${formatBigNumber(list.value?.length, 0)} of the ${formatBigNumber(total.value, 0)} relayers found`
  }
})

const refreshList = () => {
  getList({
    chain: searchChain.value,
    status: searchStatus.value,
    loading: loading
  });
}

const onSelectedChain = (chain_id?: string) => {
  searchChain.value = chain_id !== "allchain,allchain" ? chain_id : "";
  pageUrl = urlHelper(pageUrl, {
    key: 'chain',
    value: searchChain.value as string
  })
  router.replace(pageUrl);
  refreshList()
}

const onSelectedStatus = (value?: number | string) => {
  searchStatus.value = value as TRelayerStatus
  pageUrl = urlHelper(pageUrl, {
    key: 'status',
    value: value as TRelayerStatus
  })
  router.replace(pageUrl);
  refreshList()
}

// reset
const resetSearchCondition = () => {
  location.href = '/relayers'
}

const goChains = () => {
  router.push('/chains')
}

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
    &:nth-of-type(4) {
        padding-right: 26px !important;
    }
}

// pc
@media screen and (min-width: 768px) {}

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