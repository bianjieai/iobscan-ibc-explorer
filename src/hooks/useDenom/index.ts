import { TBaseDenoms } from "@/hooks/chainAndDenom.interface"
import { computed } from "vue"

// todo clippers => 这个数据获取
const demonsData = JSON.parse(localStorage.getItem('baseDenoms')!) as TBaseDenoms[]

export const useBaseDenomInfo = computed(() => (denom: string) => {
  console.log(111)
  const filterData = demonsData.filter(item => item.denom === denom)
  if (filterData.length > 0) {
    return {
      title: filterData[0].symbol,
      subtitle: 'Authed', // todo clippers => 状态处理
      imgSrc: filterData[0].icon
    }
  } else {
    return {
      title: denom,
      subtitle: 'Other',
      imgSrc: new URL('../../assets/default.png', import.meta.url).href
    }
  }
})