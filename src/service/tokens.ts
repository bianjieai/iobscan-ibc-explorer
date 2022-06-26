import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';

export type TTokenListParams = {
  base_denom?: string
  chain?: string
  token_type?: 'Authed' | 'Other'

}
export type TIbcTokenListParams = {
  chain?: string
  token_type?: 'Authed' | 'Other' | 'Genesis'
}

export type TBaseParams = {
  use_count: boolean,
  page_num: number
  page_size: number
}

export const baseParams: TBaseParams = {
  use_count: false,
  page_num: 1,
  page_size: 1000 // todo clippers => 前端分页
}


const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getTokenListUrl = `${urlPrefix}/ibc/tokenList`
const getIbcTokenListUrl = (base_denom: string) => `${urlPrefix}/${base_denom}/ibcTokenList`

export const useGetTokenList = () => {
  const data = ref([])

  const getList = async (params: TTokenListParams = {}) => {
    const result = await HttpHelper.get(getTokenListUrl, { params: { ...baseParams, ...params } })

    if (result) {
      const { items } = result
      data.value = items
    }
  }

  data.value = [{
    base_denom: 'uiris',
  price: 12321233,
  supply: 2020202032,
  ibc_transfer_amount: 23322123433,
  ibc_transfer_txs: 12323,
  chains_involved: 123,
  chain_id: 'bbb',
  currency: '$'
  }]
  return {
    data,
    getList
  }
}

export const useGetIbcTokenList = (base_denom: string) => {
  const data = ref([])

  const getList = async (params: TIbcTokenListParams = {}) => {
    const result = await HttpHelper.get(getIbcTokenListUrl(base_denom), { params: { ...baseParams, ...params } })

    if (result) {
      const { items } = result
      data.value = items
    }
  }

  data.value = [{
    denom: 'xxx322',
    denom_path: 'sss',
    chain_id: 'irishub-1',
    token_type: 'Authed',
    ibc_hops: 10,
    amount: 2000,
    receive_txs: 11000
  }]

  return {
    data,
    getList
  }
}

// const data: any = [{
//   base_denom: 'aaa',
//   price: 12321233,
//   supply: 2020202032,
//   ibc_transfer_amount: 23322123433,
//   ibc_transfer_txs: 12323,
//   chains_involved: 123,
//   chain_id: 'irishub-1',
//   currency: '$'
// },
// {
//   base_denom: 'uiris',
//   price: 12321233,
//   supply: 2020202032,
//   ibc_transfer_amount: 23322123433,
//   ibc_transfer_txs: 12323,
//   chains_involved: 123,
//   chain_id: 'bbb',
//   currency: '$'
// }]

// for (let i = 0; i < 20; i++) {
//   data.push({
//     base_denom: 'uiris',
//     price: 12321233,
//     supply: 2020202032,
//     ibc_transfer_amount: 23322123433,
//     ibc_transfer_txs: 12323,
//     chains_involved: 123,
//     chain_id: 'bbb', currency: '$'
//   })
// }