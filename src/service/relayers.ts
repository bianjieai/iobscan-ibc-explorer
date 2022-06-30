import { TRelayerStatus } from '@/components/responsive/component.interface.js';
import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';

type TRelayersListParams = {
  chain?: string
  status?: TRelayerStatus
}

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getRelayersListUrl = `${urlPrefix}/ibc/relayerList`

export const useGetRelayersList = () => {
  const list = ref([])
  const total = ref(0)

  const getList = async (params: TRelayersListParams = {}) => {
    const result = await HttpHelper.get(getRelayersListUrl, {
      params: {
        ...baseParams,
        ...params
      }
    })
    const { code, data, message } = result

    if (code === 0) {
      const { items } = data
      list.value = items ?? []
      if (!params.chain && !params.status) {
        total.value = items.length
      }
    } else {
      console.error(message)
    }
  }

  return {
    list,
    total,
    getList
  }
}