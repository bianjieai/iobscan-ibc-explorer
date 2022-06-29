<template>
  <PageContainer>
    <PageTitle title="IBC Tokens" :subtitle="subtitle" />
    <div class="select flex items-center flex-wrap">
      <TokensDropDown :dropdown-data="ibcBaseDenoms.value" @on-tokens-selected="onSelectedToken" ref="tokensDropdown" />
      <ChainsDropdown :dropdown-data="ibcChains.all" :chain_id="chain_id" @on-selected-chain="onSelectedChain"
        ref="chainDropdown" />
      <BaseDropdown :options="STATUS_OPTIONS" ref="statusDropdown" @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="list" :need-custom-columns="needCustomColumns" :columns="COLUMNS">
      <template #base_denom="{ record, column }">
        <TokenIcon :token_type="record.token_type" :denom="record[column.key]" :denoms-data="ibcBaseDenoms.value" />
      </template>
      <template #price="{ record, column }">
        <a-popover>
          <template #content>
            <div class="popover-c">{{ `${record.currency} ${formatPrice(record[column.key])}` }}</div>
          </template>
          <div>{{ `${record.currency} ${formatPrice(record[column.key])}` }}</div>
        </a-popover>
      </template>

      <template #supply="{ record, column }">
        <div>{{ `${formatSupply(record[column.key], record.base_denom, ibcBaseDenoms.value)}` }}</div>
      </template>

      <template #ibc_transfer_amount="{ record, column }">
        <a-popover>
          <template #content>
            <div class="popover-c">{{ `${formatAmount(record[column.key], record.base_denom, ibcBaseDenoms.value)}` }}
            </div>
          </template>
          <div>{{ `${formatAmount(record[column.key], record.base_denom, ibcBaseDenoms.value)}` }}</div>
        </a-popover>
      </template>

      <template #ibc_transfer_txs="{ record, column }">
        <div class="hover-cursor" @click="goTransfer(record.base_denom)">{{ `${formatBigNumber(record[column.key], 0)}`
        }}</div>
      </template>

      <template #chains_involved="{ record, column }">
        <div class="hover-cursor" @click="goIbcToken(record.base_denom)">{{ record[column.key] }}</div>
      </template>

      <template #chain_id="{ record, column }">
        <ChainIcon titleCanClick @click-title="goChains" :chain_id="record[column.key]" :chains-data="ibcChains.all"
          icon-size="small" />
      </template>
    </BjTable>
  </PageContainer>
</template>

<script lang="ts" setup>
import PageContainer from '@/components/responsive/pageContainer.vue';
import PageTitle from '@/components/responsive/pageTitle.vue';
import BjTable from '@/components/responsive/table/index.vue'
import { COLUMNS, STATUS_OPTIONS } from './constants'
import TokensDropDown from '@/components/responsive/dropdown/tokens.vue';
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import TokenIcon from '@/components/responsive/table/tokenIcon.vue';
import { useGetIbcDenoms, useIbcChains } from '../home/composable';
import { formatBigNumber, formatNum } from '@/helper/parseString'
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useGetTokenList } from '@/service/tokens';
import { formatPrice, formatSupply, formatAmount } from '@/helper/tablecell-helper';


const router = useRouter()
const route = useRoute()
const chain_id = route.query.chain_id as string

const { ibcChains, getIbcChains } = useIbcChains();
const { ibcBaseDenoms, getIbcBaseDenom } = useGetIbcDenoms()
const { list, getList } = useGetTokenList()


const needCustomColumns = [
  'base_denom',
  'price',
  'chain_id',
  'supply',
  'ibc_transfer_amount',
  'ibc_transfer_txs',
  'chains_involved'
]


const chainDropdown = ref()
const statusDropdown = ref()
const tokensDropdown = ref()

// 缓存筛选条件
const searchDenom = ref()
const searchChain = ref<string | undefined>(chain_id)
const searchStatus = ref<'Authed' | 'Other'>()

const subtitle = computed(() => {
  if (Array.isArray(ibcChains.all)) {
    const chain_name = ibcChains.all.filter((item: any) => item.chain_id === chain_id)[0]?.chain_name ?? 'Unknown'
    if (chain_id) {
      return `${list.value.length} tokens found in ${chain_name}`
    } else {
      return `${list.value.length} tokens found`
    }
  } else {
    return ``
  }
})

onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();
  getIbcBaseDenom()

  refreshList()
})

const refreshList = () => {
  getList({
    base_denom: searchDenom.value,
    chain: searchChain.value,
    token_type: searchStatus.value
  })
}

const onSelectedToken = (denom?: string | number) => {
  searchDenom.value = denom
  refreshList()
}

const onSelectedChain = (chain?: string | number) => {
  searchChain.value = String(chain)
  refreshList()
}

const onSelectedStatus = (status?: string | number) => {
  searchStatus.value = status as 'Authed' | 'Other'
  refreshList()
}

const resetSearchCondition = () => {
  chainDropdown.value.selectedChain = []
  statusDropdown.value.selectOption = []
  tokensDropdown.value.selectToken = []
  // reset list
  getList()
}

const goIbcToken = (denom: string) => {
  router.push({
    path: `/tokens/details`,
    query: {
      denom
    }
  })
}


const goTransfer = (denom: string) => {
  router.push({
    path: '/transfers',
    query: {
      token: denom
    }
  })
}

const goChains = () => {
  router.push('/chains')
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