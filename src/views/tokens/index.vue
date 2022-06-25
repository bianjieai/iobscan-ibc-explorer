<template>
  <PageContainer>
    <PageTitle title="IBC Tokens" subtitle="254 tokens found" />
    <div class="select flex items-center flex-wrap">
      <TokensDropDown @on-tokens-selected="onSelectedToken" ref="tokensDropdown" />
      <ChainsDropdown @on-selected-chain="onSelectedChain" ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS">
      <template #base_denom="{ record, column }">
        <IconAndTitle title-can-click
          @click-title="goIbcToken(record[column.key], useBaseDenomInfo(record[column.key]).title)" subtitle-is-tag
          :title="useBaseDenomInfo(record[column.key]).title" :subtitle="useBaseDenomInfo(record[column.key]).subtitle"
          :img-src="useBaseDenomInfo(record[column.key]).imgSrc" />
      </template>
      <template #price="{ record, column }">
        <div>{{ `$ ${record[column.key]}` }}</div>
      </template>

      <template #chain_id="{ record, column }">
        <IconAndTitle :title="useBaseChainsInfo(record[column.key]).title"
          :subtitle="useBaseChainsInfo(record[column.key]).subtitle"
          :img-src="useBaseChainsInfo(record[column.key]).imgSrc" />
      </template>
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
import { COLUMNS, STATUS_OPTIONS } from './constants'
import TokensDropDown from '@/components/responsive/dropdown/tokens.vue';
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, ref } from 'vue';
import IconAndTitle from '@/components/responsive/table/iconAndTitle.vue';
import { useRouter } from 'vue-router'
import { useBaseChainsInfo } from '@/hooks/useChain'
import { useBaseDenomInfo } from '@/hooks/useDenom'

const router = useRouter()

const needCustomColumns = [
  'base_denom', 'price', 'chain_id'
]

const data: any = [{
  base_denom: 'aaa',
  price: 12321233,
  supply: 2020202032,
  ibc_transfer_amount: 23322123433,
  ibc_transfer_txs: 12323,
  chains_involved: 123,
  chain_id: 'irishub-1'
},
{
  base_denom: 'uiris',
  price: 12321233,
  supply: 2020202032,
  ibc_transfer_amount: 23322123433,
  ibc_transfer_txs: 12323,
  chains_involved: 123,
  chain_id: 'bbb'
}]

const chainDropdown = ref()
const statusDropdown = ref()
const tokensDropdown = ref()

const onSelectedToken = (denom?: string | number) => {
  console.log(denom, 'denom')
}

const onSelectedChain = (chain?: string | number) => {
  console.log(chain, 'chain')
}

const onSelectedStatus = (status?: string | number) => {
  console.log(status, 'status')
}

const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []
  tokensDropdown.value.selectToken = []
  // todo clippers => refresh list
}

const goIbcToken = (denom: string, symbol: string) => {
  router.push({
    path: `/tokens/ibc/${denom}`,
    query: {
      symbol
    }
  })
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
      margin-top: 8px;
    }

    margin-right: 150px;
    margin-top: 8px;
  }

  :deep(.ant-btn-icon-only) {
    margin-top: 8px;
  }
}
</style>