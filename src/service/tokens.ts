import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';

export type TIbcTokenType = 'Authed' | 'Other' | 'Genesis'

export type TTokenListParams = {
  base_denom?: string
  chain?: string
  token_type?: 'Authed' | 'Other'

}
export type TIbcTokenListParams = {
  chain?: string
  token_type?: TIbcTokenType
}

export type TBaseParams = {
  use_count: boolean,
  page_num: number
  page_size: number
}

export const baseParams: TBaseParams = {
  use_count: false,
  page_num: 1,
  page_size: 1000
}


const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getTokenListUrl = `${urlPrefix}/ibc/tokenList`
const getIbcTokenListUrl = (base_denom: string) => `${urlPrefix}/ibc/${base_denom.replace('ibc/', '')}/ibcTokenList`

export const useGetTokenList = () => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TTokenListParams = {}, totalCount: boolean = false) => {
    const result = await HttpHelper.get(getTokenListUrl, { params: { ...baseParams, ...(totalCount ? {} : params) } })

    const { code, data, message } = result

    if (code === 0) {
      const { items } = data
      if (!totalCount) {
        list.value = items ?? [];
      } else {
        total.value = items.length
      }
    } else {
      console.error(message)
    }
  }
  getList({}, true); // todo taishan 为了获取 total, 后期优化
  return {
    list,
    total,
    getList
  }
}

export const useGetIbcTokenList = (base_denom: string) => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TIbcTokenListParams = {}, totalCount: boolean = false) => {
    const result = await HttpHelper.get(getIbcTokenListUrl(base_denom), { params: { ...baseParams, ...(totalCount ? {} : params) } })

    const { code, data, message } = result
    if (code === 0) {
      const { items } = data
      if (!totalCount) {
        list.value = items ?? [];
      } else {
        total.value = items.length
      }
    } else {
      console.error(message)
    }
  }
  getList({}, true); // todo taishan 为了获取 total, 后期优化
  return {
    list,
    total,
    getList
  }
}
