<template>
  <PageContainer>
    <PageTitle title="IBC Channels" :subtitle="`${list.length} channels found`" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown :dropdown-data="ibcChains?.all ?? []" :chain_id="chain_id" @on-selected-chain="onSelectedChain"
        selected-double ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />

      <ResetButton @on-reset="resetSearchCondition" />
    </div>
    <BjTable :data="list" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>
      <template #chain_a="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_a" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>

      <template #status="{ record, column }">
        <StatusImg type="Channel" :status="(String(record[column.key]) as TChannelStatus)" :height="16" :width="46" />
      </template>

      <template #chain_b="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_b" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>

      <template #last_updated="{ record, column }">
        <div>{{ formatLastUpdated(record[column.key]) }}</div>
      </template>

      <template #operating_period="{ record, column }">
        <div>{{ formatOperatingPeriod(record[column.key], record.status) }}</div>
      </template>

      <template #ibc_transfer_txs="{ record, column }">
        <TransferTxs :title="record[column.key]" :subtitle="record.ibc_transfer_txs_value"
          :currency="record.currency" />
      </template>

      <template #table_bottom_status v-if="list.length !== 0">
        <BottomStatus type="Channel" />
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
import { onMounted, ref } from 'vue';
import BottomStatus from '@/components/responsive/table/bottomStatus.vue';
import { formatLastUpdated, formatOperatingPeriod } from '@/helper/time-helper';
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import StatusImg from '@/components/responsive/table/statusImg.vue';
import { ChannelStatus, TChannelStatus } from '@/components/responsive/component.interface';
import { useGetChannelsList } from '@/service/channels'
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useIbcChains } from '../home/composable';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const chain_id = route.query.chain_id as string


const { ibcChains, getIbcChains } = useIbcChains();
const { list, getList } = useGetChannelsList()

const needCustomColumns = [
  'chain_a',
  'status',
  'chain_b',
  'operating_period',
  'last_updated',
  'ibc_transfer_txs'
]

const chainDropdown = ref()
const statusDropdown = ref()

const searchChain = ref(chain_id ? `${chain_id},allchain` : undefined)
const searchStatus = ref()

onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();

  refreshList()
})

const refreshList = () => {
  getList({
    chain: searchChain.value,
    status: searchStatus.value
  })
}

const onSelectedChain = (chain_id: string) => {
  searchChain.value = chain_id
  refreshList()
}

const onSelectedStatus = (value?: number | string) => {
  searchStatus.value = value
  refreshList()
}

// reset
const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []

  getList()
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