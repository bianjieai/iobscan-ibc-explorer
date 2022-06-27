<template>
  <PageContainer>
    <PageTitle title="IBC Relayers" subtitle="xxx relayers found" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown :dropdown-data="ibcChains.all" :chain_id="chain_id" @on-selected-chain="onSelectedChain" selected-double ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />

      <ResetButton @on-reset="resetSearchCondition" />
    </div>
    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>
      <template #relayer_name="{ record, column }">
        <a-popover placement="topLeft">
          <template #content>
            <div class="popover-c">
              <div>Relayer Name: {{ record[column.key] }}</div>
              <div>RIS Hub Address: {{ record.chain_a_address }}</div>
              <div>Cosmos Hub Address: {{ record.chain_b_address }}</div>
            </div>
          </template>
          <IconAndTitle :title="record[column.key]" :img-src="record.relayer_icon" relayer icon-size="small" />
        </a-popover>
      </template>

      <template #chain_a="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_a" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains.all" icon-size="small" />
      </template>

      <template #status="{ record, column }">
        <StatusImg type="Relayer" :status="(String(record[column.key]) as TRelayerStatus)" :height="26" :width="26" />
      </template>

      <template #chain_b="{ record, column }">
        <ChainIcon avatar-can-click @click-avatar="goChains" :title="record.channel_b" no-subtitle
          :chain_id="record[column.key]" :chains-data="ibcChains.all" icon-size="small" />
      </template>

      <template #update_time="{ record, column }">
        <div>{{ formatLastUpdated(record[column.key]) }}</div>
      </template>

      <template #ibc_success_transfer_txs="{ record, column }">
        <div>{{ `${record[column.key]}%` }}</div>
      </template>

      <template #ibc_transfer_txs="{ record, column }">
        <TransferTxs :title="record[column.key]" :subtitle="record.ibc_transfer_txs_value"
          :currency="record.currency" />
      </template>

      <template #table_bottom_status v-if="data.length !== 0">
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
import { onMounted, ref } from 'vue';
import IconAndTitle from '@/components/responsive/table/iconAndTitle.vue';
import { formatLastUpdated } from '@/helper/time-helper';
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import StatusImg from '@/components/responsive/table/statusImg.vue';
import { TRelayerStatus } from '@/components/responsive/component.interface';
import { useIbcChains } from '../home/composable';
import { useGetRelayersList } from '@/service/relayers';
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const chain_id = route.query.chain_id as string

const { ibcChains, getIbcChains } = useIbcChains();
const { data, getList } = useGetRelayersList()


const needCustomColumns = [
  'relayer_name',
  'chain_a',
  'status',
  'chain_b',
  'update_time',
  'ibc_success_transfer_txs',
  'ibc_transfer_txs'
]

const chainDropdown = ref()
const statusDropdown = ref()

const searchChain = ref(`${chain_id},allChains`)
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

.popover-c {
  color: var(--bj-text-second);
  margin: -8px -4px;
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