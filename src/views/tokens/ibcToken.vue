<template>
  <PageContainer>
    <PageTitle :title="`${symbol} IBC Tokens`" subtitle="254 tokens found" has-icon />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown @on-selected-chain="onSelectedChain" ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="IBC_COLUMNS" need-count>
      <template #denom="{ record, column }">
        <a-popover>
          <template #content>
            <div class="notice-text">
              <div>Path: {{ record.denom_path }}</div>
              <div>Token Hash: {{ record[column.key] }}</div>
            </div>
          </template>
          <div>{{ record[column.key] }}</div>
        </a-popover>
      </template>

      <template #chain_id="{ record, column }">
        <IconAndTitle :title="useBaseChainsInfo(record[column.key]).title"
          :subtitle="useBaseChainsInfo(record[column.key]).subtitle"
          :img-src="useBaseChainsInfo(record[column.key]).imgSrc" />
      </template>

      <template #receive_txs="{ record, column }">
        <div class="hover-cursor">{{ record[column.key] }}</div>
      </template>
    </BjTable>
  </PageContainer>
</template>

<script lang="ts" setup>
// TODO clippers => subtitle完善 （数量 / chains跳转过来）
// todo clippers => 筛选
// todo clippers => 处理请求
// todo clippers => 各个插槽处理
// todo clippers => 确认提示Name单元格Token Hash:的字段
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { IBC_COLUMNS, STATUS_OPTIONS } from './constants'
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router'
import { useBaseChainsInfo } from '@/hooks/useChain';

const route = useRoute()

const symbol = ref<string>(route.query.symbol as string)
const denom = route.params.name

const needCustomColumns = [
  'denom', 'chain_id', 'receive_txs'
]

const data: any = [{
  denom: 'aaa',
  price: 12321233,
  token_type: 2020202032,
  ibc_hops: 23322123433,
  amount: 12323,
  receive_txs: 123,
  chain_id: 'irishub-1',
  path: 'sadd'
},]

const chainDropdown = ref()
const statusDropdown = ref()


const onSelectedChain = (chain?: string | number) => {
  console.log(chain, 'chain')
}

const onSelectedStatus = (status?: string | number) => {
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

.notice-text {
  color: var(--bj-text-second);
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