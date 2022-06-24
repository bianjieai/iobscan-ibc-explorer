<template>
  <PageContainer>
    <PageTitle title="xxx IBC Tokens" subtitle="254 tokens found" has-icon/>
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown @on-selected-chain="onSelectedChain" ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="IBC_COLUMNS" need-count>
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
import { IBC_COLUMNS, STATUS_OPTIONS } from './constants'
import TokensDropDown from '@/components/responsive/dropdown/tokens.vue';
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { ref } from 'vue';


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
},]

const chainDropdown = ref()
const statusDropdown = ref()


const onSelectedChain = (chain?: string | number) => {
  console.log(chain, 'chain')
}

const onSelectedStatus = (status?: string |number) => {
  console.log(status, 'status')
}

const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []
  // todo clippers => refresh list
}

</script>

<style lang="less" scoped>
.select {
  margin-top: 26px;
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