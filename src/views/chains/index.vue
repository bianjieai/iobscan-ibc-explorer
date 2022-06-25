<template>
  <PageContainer>
    <PageTitle title="IBC Chains" subtitle="xxx chains supported" />

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count no-pagination
      :scroll="{ y: 610 }">
      <template #chain_id="{ record, column }">
        <IconAndTitle :title="useBaseChainsInfo(record[column.key]).title"
          :subtitle="useBaseChainsInfo(record[column.key]).subtitle"
          :img-src="useBaseChainsInfo(record[column.key]).imgSrc" />
      </template>

      <template #channels="{ record, column }">
        <div class="hover-cursor">{{ record[column.key] }}</div>
      </template>

      <template #relayers="{ record, column }">
        <div class="hover-cursor">{{ record[column.key] }}</div>
      </template>

      <template #ibc_tokens="{ record, column }">
        <div class="hover-cursor">{{ record[column.key] }}</div>
      </template>

      <template #ibc_tokens_value="{ record, column }">
        <div>{{ `$ ${record[column.key]}` }}</div>
      </template>

      <template #ibc_transfer_txs="{ record, column }">
        <TransferTxs :title="record[column.key]" :subtitle="record.ibc_transfer_txs_value" />
      </template>
    </BjTable>
  </PageContainer>
</template>


<script lang="ts" setup>
// todo clippers => subtitle
// todo clippers => 请求
// todo clippers => 跳转
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { useBaseChainsInfo } from '@/hooks/useChain';
import { COLUMNS } from './constants'
import TransferTxs from '@/components/responsive/table/transferTxs.vue';


const data: any = [
  {
    chain_id: 'irishub-1',
    connected_chains: 10,
    channels: 20,
    relayers: 158,
    ibc_tokens: 20,
    ibc_tokens_value: 20,
    ibc_transfer_txs: 1000,
    ibc_transfer_txs_value: 10000000
  }
]




const needCustomColumns = ['chain_id', 'channels', 'relayers', 'ibc_tokens', 'ibc_tokens_value', 'ibc_transfer_txs']


</script>

<style lang="less" scoped>
.table-warpper {
  margin-top: 32px;
}

// pc
@media screen and (min-width: 768px) {}

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