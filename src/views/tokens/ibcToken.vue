<template>
  <PageContainer>
    <PageTitle :title="`${baseDenomInfo.symbol} IBC Tokens`" :subtitle="subtitle" has-icon
      :img-src="baseDenomInfo.imgSrc" />
    <div class="select flex items-center flex-wrap">
      <ChainsDropdown :chain_id="chainIdQuery" :dropdown-data="ibcChains?.all ?? []"
        @on-selected-chain="onSelectedChain" ref="chainDropdown" />
      <BaseDropdown :status="statusQuery" :options="IBC_STATUS_OPTIONS" ref="statusDropdown"
        @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="list" :need-custom-columns="needCustomColumns" :columns="IBC_COLUMNS" need-count>
      <template #denom="{ record, column }">
        <a-popover v-if="record.token_type !== 'Genesis'" placement="topLeft">
          <template #content>
            <div class="notice-text">
              <div>Path: {{ record.denom_path }}</div>
              <div>Token Hash: {{ record[column.key] }}</div>
            </div>
          </template>
          <div>{{ getRestString(rmIbcPrefix(record[column.key]), 3, 8) }}</div>
        </a-popover>
        <div v-else>
          <a-popover placement="topLeft" v-if="record[column.key].length > 11">
            <template #content >
             <div class="popover-c">{{ record[column.key] }}</div>
            </template>
            <div>{{ getRestString(record[column.key], 3, 8) }}</div>
          </a-popover>
          <div v-else>{{ record[column.key] }}</div>
        </div>
      </template>
      <template #chain_id="{ record, column }">
        <ChainIcon title-can-click @click-title="goChains" :chain_id="record[column.key]"
          :chains-data="ibcChains?.all ?? []" icon-size="small" />
      </template>
      <template #amount="{ record, column }">
        <a-popover>
          <template #content>
            <div class="popover-c">{{ `${formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms.value).popover}`
            }}</div>
          </template>
          <div>{{ `${formatAmount(record[column.key], baseDenomQuery, ibcBaseDenoms.value).title}` }}</div>
        </a-popover>
      </template>

      <template #receive_txs="{ record, column }">
        <div class="hover-cursor" @click="goTransfer(`allchain,${record.chain_id}`)">{{
            formatBigNumber(record[column.key], 0)
        }}
        </div>
      </template>
    </BjTable>
  </PageContainer>
</template>

<script lang="ts" setup>
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
import { TIbcTokenType, useGetIbcTokenList } from '@/service/tokens';
import { useGetIbcDenoms, useIbcChains } from '../home/composable';
import { getRestString, rmIbcPrefix, formatBigNumber } from '@/helper/parseString'
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { formatAmount } from '@/helper/tablecell-helper';
import { isNullOrEmpty } from '@/helper/object-helper';
import { urlHelper } from '@/helper/url-helper';

let pageUrl = `/tokens/details`

const router = useRouter()

const { ibcChains, getIbcChains } = useIbcChains();
const { ibcBaseDenoms, getIbcBaseDenom } = useGetIbcDenoms()

const route = useRoute()
const baseDenomQuery = route.query.denom as string
const chainIdQuery = route.query.chain as string
const statusQuery = route.query.status as TIbcTokenType

const { list, total, getList } = useGetIbcTokenList(baseDenomQuery)

const baseDenomInfo = computed(() => {
  const filterData = ibcBaseDenoms.value.filter((item: any) => item.denom === baseDenomQuery) as any // todo clippers => 补上类型
  let symbol = ''
  const filterSymbol = filterData[0]?.symbol

  if (filterData.length === 0 || isNullOrEmpty(filterSymbol)) {
    symbol = getRestString(baseDenomQuery, 3, 8)
  } else {
    if (filterSymbol.includes('ibc')) {
      symbol = getRestString(filterSymbol.replace(/ibc\//, ''), 3, 8)
    } else {
      symbol = filterSymbol
    }
  }

  return {
    symbol,
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

const searchChain = ref<string | undefined>(chainIdQuery ?? undefined)
const searchStatus = ref<TIbcTokenType | undefined>(statusQuery)

const subtitle = computed(() => {
  if (!searchChain.value && !searchStatus.value) {
    return `${formatBigNumber(total.value, 0)} tokens found`
  } else {
    return `${formatBigNumber(list.value.length, 0)} of the ${formatBigNumber(total.value, 0)} tokens found`
  }
})

onMounted(() => {
  !sessionStorage.getItem('allChains') && getIbcChains();
  getIbcBaseDenom()

  refreshList()
})

const refreshList = () => {
  getList({
    chain: searchChain.value,
    token_type: searchStatus.value
  })
}


const onSelectedChain = (chain?: string | number) => {
  searchChain.value = chain as string
  pageUrl = urlHelper(pageUrl, {
    key: 'chain',
    value: chain as string
  })
  history.pushState(null, '', pageUrl)
  refreshList()
}

const onSelectedStatus = (status?: string | number) => {
  searchStatus.value = status as TIbcTokenType
  console.log(status)
  pageUrl = urlHelper(pageUrl, {
    key: 'status',
    value: status as TIbcTokenType
  })
  history.pushState(null, '', pageUrl)
  refreshList()
}

const resetSearchCondition = () => {
  location.href = `/tokens/details?denom=${baseDenomQuery}`
}

const goChains = () => {
  router.push('/chains')
}


const goTransfer = (chain_id: string) => {
  router.push({
    path: '/transfers',
    query: {
      denom: baseDenomQuery,
      chain: chain_id
    }
  })
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