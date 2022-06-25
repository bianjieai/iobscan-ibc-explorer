<template>
  <PageContainer>
    <PageTitle title="IBC Relayers" subtitle="xxx relayers found" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown @on-selected-chain="onSelectedChain" selected-double ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />

      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>
      <template #relayer_name="{ record, column }">
        <IconAndTitle :title="record[column.key]" :img-src="record.relayer_icon" relayer icon-size="small" />
      </template>

      <template #chain_a="{ record, column }">
        <IconAndTitle :title="record.channel_a" :img-src="useBaseChainsInfo(record[column.key]).imgSrc"
          icon-size="small" />
      </template>

      <template #status="{ record, column }">
        <StatusImg type="Relayer" :status="(String(record[column.key]) as TRelayerStatus)" :height="26"
          :width="26" />
      </template>

      <template #chain_b="{ record, column }">
        <IconAndTitle :title="record.channel_b" :img-src="useBaseChainsInfo(record[column.key]).imgSrc"
          icon-size="small" />
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

      <template #table_bottom_status>
        <BottomStatus type="Relayer" />
      </template>
    </BjTable>
  </PageContainer>
</template>

<script setup lang="ts">
// todo clippers => subtitle
// todo clippers => 请求
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS, STATUS_OPTIONS } from './constants'
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { ref } from 'vue';
import IconAndTitle from '@/components/responsive/table/iconAndTitle.vue';
import { useBaseChainsInfo } from '@/hooks/useChain'
import { formatLastUpdated } from '@/helper/time-helper';
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import StatusImg from '@/components/responsive/table/statusImg.vue';
import { TRelayerStatus } from '@/components/responsive/component.interface';


const data: any = [{
  relayer_name: 'ZA',
  // relayer_icon: 'https://iobscan.io/resources/xp-chains/irishub-1.png',
  relayer_icon: '',
  chain_a: 'irishub-1',
  channel_a: 'xxa',
  chain_b: 'irishub-1',
  channel_b: 'xxa',
  update_time: 1656147685957,
  ibc_success_transfer_txs: 90,
  ibc_transfer_txs: 1000,
  ibc_transfer_txs_value: 1000000000,
  currency: '$',
  status: 1
}, {
  relayer_name: 'ZA',
  relayer_icon: 'https://iobscan.io/resources/xp-chains/irishub-1.png',
  chain_a: 'irishub-1',
  channel_a: 'xxa',
  chain_b: 'irishub-1',
  channel_b: 'xxb',
  update_time: 1656147685957,
  ibc_success_transfer_txs: 9011,
  ibc_transfer_txs: 1000,
  ibc_transfer_txs_value: 10000000000,
  currency: '$',
  status: 2
}]
const needCustomColumns = ['relayer_name', 'chain_a', 'status', 'chain_b', 'update_time', 'ibc_success_transfer_txs', 'ibc_transfer_txs']

const chainDropdown = ref()
const statusDropdown = ref()


const onSelectedChain = (chain_id: string) => {
  console.log(chain_id, 'chain_id')
  // todo clippers => refresh list
}

const onSelectedStatus = (value?: number | string) => {
  console.log(value, 'value')
  // todo clippers => refresh list
}

// reset
const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []
  // todo clippers => refresh list
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