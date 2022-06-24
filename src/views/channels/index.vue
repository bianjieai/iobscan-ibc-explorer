<template>
  <PageContainer>
    <PageTitle title="IBC Channels" subtitle="xxx channels found" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown @on-selected-chain="onSelectedChain" selected-double ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />

      <ResetButton @on-reset="resetSearchCondition" />
    </div>
    <BjTable :data="data" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>

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

const data: any = []
const needCustomColumns = ['']

const chainDropdown = ref()
const statusDropdown = ref()


const onSelectedChain = (chain_id: string) => {
  console.log(chain_id, 'chain_id')
  // todo clippers => refresh list
}

const onSelectedStatus = (value?: number) => {
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