import { computed, ref } from "vue";
import { TBaseChains } from "@/hooks/chainAndDenom.interface";
import { getIbcChains } from "@/service/api.js";

// todo clippers => 数据获取
const chainsData = JSON.parse(localStorage.getItem('allChains')!).all as TBaseChains[]

export const useGetAllChains = async () => {
  const chainsData = ref<TBaseChains[]>([])

  if (!sessionStorage.getItem('allChains')) {
    chainsData.value = await getIbcChains();
  } else {
    chainsData.value = JSON.parse(sessionStorage.getItem('allChains')!).all
  }

  return {
    chainsData
  }
}

export const useBaseChainsInfo = computed(() => (chain_id: string) => {
  const filterData = chainsData.filter(item => item.chain_id === chain_id)
  if (filterData.length > 0) {
    return {
      title: filterData[0].chain_name,
      subtitle: filterData[0].chain_id,
      imgSrc: filterData[0].icon
    }
  } else {
    return {
      title: 'Unknown',
      subtitle: '- -',
      imgSrc: new URL('../../assets/default.png', import.meta.url).href
    }
  }
})