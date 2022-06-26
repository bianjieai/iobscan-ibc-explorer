import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChainListUrl = `${urlPrefix}/ibc/chainList`

export const useGetChainsList = () => {
  const data = ref([])

  const getList = async() => {
    const result = await HttpHelper.get(getChainListUrl, {
      params: baseParams
    })

    if (result) {
      const { items } = result
      data.value = items
    }
  }

  data.value = [
    {
      chain_id: 'irishub-1',
      connected_chains: 10,
      channels: 20,
      relayers: 158,
      ibc_tokens: 20,
      ibc_tokens_value: 20,
      ibc_transfer_txs: 1000,
      ibc_transfer_txs_value: 10000000,
      currency:'$'
    }
  ]

  return {
    data,
    getList
  }
}