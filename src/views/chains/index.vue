<template>
  <PageContainer>
    <PageTitle title="IBC Chains" :subtitle="`${data.length} chains supported`" />

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count no-pagination
      :scroll="{ y: 610 }">
      <template #chain_id="{ record, column }">
        <ChainIcon :chain_id="record[column.key]" :chains-data="ibcChains.all" icon-size="small" />
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
        <TransferTxs :title="record[column.key]" :subtitle="record.ibc_transfer_txs_value"
          :currency="record.currency" />
      </template>
    </BjTable>
  </PageContainer>
</template>


<script lang="ts" setup>
// todo clippers => 跳转
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS } from './constants'
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useIbcChains } from '../home/composable';
import { onMounted } from 'vue';
import { useGetChainsList } from '@/service/chains'


const { ibcChains, getIbcChains } = useIbcChains();
const { data, getList } = useGetChainsList()

onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();

  getList()
})


const needCustomColumns = [
  'chain_id',
  'channels',
  'relayers',
  'ibc_tokens',
  'ibc_tokens_value',
  'ibc_transfer_txs'
]


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