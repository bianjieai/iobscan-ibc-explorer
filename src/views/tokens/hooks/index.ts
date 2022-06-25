import { ref } from "vue"
import { getIbcBaseDenoms } from '../../../service/api.js'
import { TBaseDenoms } from "../../../hooks/chainAndDenom.interface"

export const useGetBaseDenom = async () => {
  const denoms = ref<TBaseDenoms[]>([])

  const result = await getIbcBaseDenoms()

  if(result) {
    denoms.value = result
  }

  // todo clippers => 缓存
}



