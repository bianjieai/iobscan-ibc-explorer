<template>
  <PageContainer>
    <PageTitle title="IBC Tokens" subtitle="254 tokens found" />
    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS">
      <!-- <template #name="{ record, column }">
                <h1>{{ record[column.key] }}</h1>
            </template>

            <template #age="{ record, column }">
                <h1>{{ record[column.key] }}</h1>
            </template> -->
    </BjTable>
  </PageContainer>
</template>

<script lang="ts" setup>
// TODO clippers => subtitle完善 （数量 / chains跳转过来）
// todo clippers => 筛选
// todo clippers => 处理请求
// todo clippers => 各个插槽处理
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS } from './constants'

const needCustomColumns = [
  'base_denom', 'origional_chain'
]

const data: any = [{
  base_denom: 'aaa',
  price: 12321233,
  supply: 2020202032,
  ibc_transfer_amount: 23322123433,
  ibc_transfer_txs: 12323,
  chains_involved: 123,
  origional_chain: 'bbb'
}, ]


</script>