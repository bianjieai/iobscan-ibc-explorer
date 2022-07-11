import { Ref, ref } from 'vue';
import { HttpHelper } from '../helper/httpHelpers.js';
import { baseParams } from './tokens';
const urlPrefix = import.meta.env.VITE_BASE_GO_API

const getChainListUrl = `${urlPrefix}/ibc/chainList`

export const useGetChainsList = () => {
  const list = ref([])

  const getList = async (loading?: Ref<boolean>) => {
    if (loading) {
      loading.value = true;
    }
    const result = await HttpHelper.get(getChainListUrl, {
      params: baseParams
    }).catch(() => {
      loading && (loading.value = false);
    })
    loading && (loading.value = false);
    const { code, data, message } = result;
    if (code === 0) {
      const { items } = data
      list.value = items
    } else {
      console.error(message)
    }
  }

  return {
    list,
    getList
  }
}