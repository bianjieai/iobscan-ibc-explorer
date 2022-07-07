<template>
  <PageContainer>
    <PageTitle title="IBC Tokens" :subtitle="subtitle" />
    <div class="select flex items-center flex-wrap">
      <TokensDropDown :base_denom="denomQuery" :dropdown-data="ibcBaseDenomsSorted"
        @on-tokens-selected="onSelectedToken" ref="tokensDropdown" />
      <ChainsDropdown :dropdown-data="ibcChains?.all" :chain_id="chainIdQuery" @on-selected-chain="onSelectedChain"
        ref="chainDropdown" />
      <BaseDropdown :status="statusQuery" :options="STATUS_OPTIONS" ref="statusDropdown"
        @on-selected-change="onSelectedStatus" />
      <ResetButton @on-reset="resetSearchCondition" />
    </div>

    <BjTable :data="list" :need-custom-columns="needCustomColumns" :columns="COLUMNS" need-count>

      <template #base_denom="{ record, column }">
        <TokenIcon 
          base-page 
          title-can-click 
          @click-title="goIbcToken(record.base_denom)"
          :token_type="record.token_type" 
          :denom="record[column.key]" 
          :chain-id="record.chain_id"
          :denoms-data="ibcBaseDenoms.value" />
      </template>
      <template #price="{ record, column }">
        <a-popover v-if="+record[column.key] !== -1">
            <template #content>
                <div class="popover-c">{{ `${record.currency} ${record[column.key]}` }}</div>
            </template>
            <div v-if="record[column.key] < thousandDecimal">
                {{`< ${record.currency} ${thousandDecimal}`}}
            </div>
            <div v-else>
                {{`${record.currency} ${formatPrice(record[column.key])}`}}
            </div>
        </a-popover>
        <div v-else>{{ `${record.currency} ${formatPrice(record[column.key])}` }}</div>
      </template>

      <template #supply="{ record, column }">
        <div>{{ `${formatSupply(record[column.key], record.base_denom, ibcBaseDenoms.value)}` }}</div>
      </template>

      <template #ibc_transfer_amount="{ record, column }">
        <a-popover>
          <template #content>
            <div class="popover-c">{{ `${formatAmount(record[column.key], record.base_denom,
                ibcBaseDenoms.value).popover}`
            }}
            </div>
          </template>
          <div>{{ `${formatAmount(record[column.key], record.base_denom, ibcBaseDenoms.value).title}` }}</div>
        </a-popover>
      </template>

      <template #ibc_transfer_txs="{ record, column }">
        <div class="hover-cursor" @click="goTransfer(record.base_denom, record.chain_id)">{{ `${formatBigNumber(record[column.key], 0)}`
        }}</div>
      </template>

      <template #chains_involved="{ record, column }">
        <div class="hover-cursor" @click="goIbcToken(record.base_denom)">{{ record[column.key] }}</div>
      </template>

      <template #chain_id="{ record, column }">
        <ChainIcon titleCanClick avatarCanClick @click-avatar="goChains" @click-title="goChains" :chain_id="record[column.key]" :chains-data="ibcChains.all"
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
import {thousandDecimal} from '../../constants';
import TokensDropDown from '@/components/responsive/dropdown/tokens.vue';
import ChainsDropdown from '@/components/responsive/dropdown/chains.vue';
import BaseDropdown from '@/components/responsive/dropdown/base.vue';
import ResetButton from '@/components/responsive/resetButton.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import TokenIcon from '@/components/responsive/table/tokenIcon.vue';
import { useGetIbcDenoms, useIbcChains } from '../home/composable';
import { formatBigNumber } from '@/helper/parseString'
import ChainIcon from '@/components/responsive/table/chainIcon.vue';
import { useGetTokenList } from '@/service/tokens';
import { formatPrice, formatSupply, formatAmount } from '@/helper/tablecell-helper';
import { urlHelper } from '@/helper/url-helper'

let pageUrl = '/tokens'

const router = useRouter()
const route = useRoute()
const chainIdQuery = route.query.chain as string
const denomQuery = route.query.denom as string
const statusQuery = route.query.status as 'Authed' | 'Other'

const { ibcChains, getIbcChains } = useIbcChains();
const { ibcBaseDenoms, ibcBaseDenomsSorted, getIbcBaseDenom, getBaseDenomInfoByDenom } = useGetIbcDenoms()
const { list, getList, total } = useGetTokenList()

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
const searchDenom = ref(denomQuery)
const searchChain = ref<string | undefined>(chainIdQuery)
const searchStatus = ref<'Authed' | 'Other'>(statusQuery)

const subtitle = computed(() => {
  if (!searchChain.value && !searchStatus.value && !searchDenom.value) {
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
    base_denom: searchDenom.value,
    chain: searchChain.value,
    token_type: searchStatus.value
  })
}

const onSelectedToken = (denom?: string | number) => {
    if(denom) {
        searchDenom.value = denom as string
    }
  pageUrl = urlHelper(pageUrl, {
    key: 'denom',
    value: denom as string
  })
  router.replace(pageUrl);
  refreshList()
}

const onSelectedChain = (chain?: string | number) => {
  searchChain.value = chain ? String(chain) : undefined;
  pageUrl = urlHelper(pageUrl, {
    key: 'chain',
    value: chain as string
  })
  router.replace(pageUrl);
  refreshList()
}

const onSelectedStatus = (status?: string | number) => {
  searchStatus.value = status as 'Authed' | 'Other'
  pageUrl = urlHelper(pageUrl, {
    key: 'status',
    value: status as string
  })
  router.replace(pageUrl);
  refreshList()
}

const resetSearchCondition = () => {
  // 重制所有, 包括默认的排序列
  location.href = '/tokens'
}

const goIbcToken = (denom: string) => {
  router.push({
    path: `/tokens/details`,
    query: {
      denom
    }
  })
}


const goTransfer = (denom: string, chainId: string) => {
  let baseDenomInfo = getBaseDenomInfoByDenom(denom, chainId);
  let query = baseDenomInfo? {symbol:baseDenomInfo.symbol} : {denom}
  router.push({
    path: '/transfers',
    query: query
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
:deep(.ant-table-cell) {
    &:nth-of-type(2) {
        .ant-table-column-sorters {
            justify-content: flex-start;
            .ant-table-column-title {
                flex: 0;
            }
        }
    }
    &:nth-of-type(8) {
        padding-left: 16px;
        .ant-table-column-sorters {
            justify-content: flex-start;
            .ant-table-column-title {
                flex: 0;
            }
        }
    }
}

// tablet
@media screen and (max-width: 768px) {
  .select {
    margin-top: 24px;
  }
}
@media screen and (max-width: 510px) {
    .select {
        .ant-btn {
            margin-top: 8px;
        }
    }
}
@media screen and (max-width: 478px) {
    .select {
        :deep(.ant-dropdown-trigger) {
            &:nth-of-type(3) {
                margin-top: 10px;
            }
        }
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
    &:nth-of-type(2) {
        margin-right: 0;
    }

    margin-top: 8px;
  }

  :deep(.ant-btn-icon-only) {
    margin-top: 8px;
  }
}
</style>