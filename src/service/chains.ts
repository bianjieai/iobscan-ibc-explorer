import { ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';

const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChainListUrl = `${urlPrefix}/ibc/chainList`

export const useGetChainsList = () => {
  const data = ref([])

  const getList = async () => {
    const result = await HttpHelper.get(getChainListUrl, {
      params: baseParams
    })

    const { code, data, message } = result

    if (code === 0) {
      const { items } = data
      data.value = items
    } else {
      console.error(message)
    }
  }

  return {
    data,
    getList
  }
}