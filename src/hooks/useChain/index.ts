import { TBaseChains } from "@/hooks/chainAndDenom.interface";
import { computed } from "vue";

// todo clippers => 数据获取
const chainsData = JSON.parse(localStorage.getItem('allChains')!).all as TBaseChains[]

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