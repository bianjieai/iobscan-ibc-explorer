<template>
  <PageContainer>
    <PageTitle :title="`${baseDenomInfo.symbol} IBC Tokens`" :subtitle="`${data.length} tokens found`" has-icon
      :img-src="baseDenomInfo.imgSrc" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown :dropdown-data="ibcChains.all" @on-selected-chain="onSelectedChain" ref="chainDropdown" />
      <BaseDropdown :options="IBC_STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />
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
          <div>{{ getRestString(record[column.key], 3, 8) }}</div>
        </a-popover>
      </template>

      <template #chain_id="{ record, column }">
        <ChainIcon title-can-click @click-title="goChains" :chain_id="record[column.key]" :chains-data="ibcChains.all"
          icon-size="small" />
      </template>

      <template #amount="{ record, column }">
        <div>{{ `${formatBigNumber(record[column.key], 2)}` }}</div>
      </template>

      <template #receive_txs="{ record, column }">
        <div class="hover-cursor" @click="goTransfer">{{ formatBigNumber(record[column.key], 0) }}</div>
      </template>
    </BjTable>
  </PageContainer>
</template>

<script lang="ts" setup>
// TODO clippers => subtitle完善 （数量 / chains跳转过来）
// todo clippers => 确认提示Name单元格Token Hash:的字段
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { IBC_COLUMNS, IBC_STATUS_OPTIONS } from './constants'
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useGetIbcTokenList } from '@/service/tokens';
import { useGetIbcDenoms, useIbcChains } from '../home/composable';
import { getRestString, formatBigNumber } from '@/helper/parseString'
import ChainIcon from '@/components/responsive/table/chainIcon.vue';

const router = useRouter()

const { ibcChains, getIbcChains } = useIbcChains();
const { ibcBaseDenoms, getIbcBaseDenom } = useGetIbcDenoms()

const route = useRoute()
const base_denom = route.params.name as string

const { data, getList } = useGetIbcTokenList(base_denom)

const baseDenomInfo = computed(() => {
  const filterData = ibcBaseDenoms.value.value.filter((item: any) => item.denom === base_denom) as any // todo clippers => 补上类型
  return {
    symbol: filterData[0]?.symbol ?? 'Unknown',
    imgSrc: filterData[0]?.icon ?? new URL('../../assets/token-default.png', import.meta.url).href
  }
})

const needCustomColumns = [
  'denom',
  'chain_id',
  'amount',
  'receive_txs'
]

const chainDropdown = ref()
const statusDropdown = ref()

const searchChain = ref()
const searchStatus = ref()


onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();
  getIbcBaseDenom()

  getList()
})

const refreshList = () => {
  getList({
    chain: searchChain.value,
    token_type: searchStatus.value
  })
}


const onSelectedChain = (chain?: string | number) => {
  searchChain.value = chain
  refreshList()
}

const onSelectedStatus = (status?: string | number) => {
  searchStatus.value = status
  refreshList()
}

const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []
  // reset list
  getList()
}

const goChains = () => {
  router.push('/chains')
}

// todo clippers => 确认参数
const goTransfer = () => {

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