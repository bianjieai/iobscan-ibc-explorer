<template>
  <PageContainer>
    <PageTitle title="IBC Chains" :subtitle="`${list.length} chains supported`" />

    <BjTable :data="list" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count no-pagination
      :scroll="{ y: 610 }">
      <template #chain_id="{ record, column }">
        <ChainIcon :chain_id="record[column.key]" :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>

      <template #channels="{ record, column }">
        <div class="hover-cursor" @click="goChannels(record.chain_id)">{{ record[column.key] }}</div>
      </template>

      <template #relayers="{ record, column }">
        <div class="hover-cursor" @click="goRelayers(record.chain_id)">{{ record[column.key] }}</div>
      </template>

      <template #ibc_tokens="{ record, column }">
        <div class="hover-cursor" @click="goTokens(record.chain_id)">{{ record[column.key] }}</div>
      </template>

      <template #ibc_tokens_value="{ record, column }">
        <div>{{ `$ ${formatAmount(record[column.key])}` }}</div>
      </template>

      <template #transfer_txs="{ record, column }">
        <TransferTxs @on-title-click="goTransfer" :title="record[column.key]" :subtitle="record.transfer_txs_value"
          :currency="record.currency" />
      </template>
    </BjTable>
  </PageContainer>
</template>


<script lang="ts" setup>
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS } from './constants'
import TransferTxs from '@/components/responsive/table/transferTxs.vue';
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useIbcChains } from '../home/composable';
import { onMounted } from 'vue';
import { useGetChainsList } from '@/service/chains'
import { useRouter } from 'vue-router';
import { formatAmount } from '@/helper/tablecell-helper'; 

const router = useRouter()

const { ibcChains, getIbcChains } = useIbcChains();
const { list, getList } = useGetChainsList()

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
  'transfer_txs'
]

const goChannels = (chain_id: string) => {
  router.push({
    path: '/channels',
    query: {
      chain_id
    }
  })
}

const goRelayers = (chain_id: string) => {
  router.push({
    path: '/relayers',
    query: {
      chain_id
    }
  })
}

const goTokens = (chain_id: string) => {
  router.push({
    path: '/tokens',
    query: {
      chain_id
    }
  })
}

// todo clippers => 跳转的参数
const goTransfer = () => {
  // router.push({

  // })
}

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