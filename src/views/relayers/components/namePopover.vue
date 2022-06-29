<template>
  <a-popover placement="topLeft">
    <template #content>
      <div class="popover-c">
        <div>Relayer Name: {{ relayer_name ? relayer_name : 'Unknown' }}</div>
        <div>{{ `${chain_a_name} Address` }}: {{ chain_a_address }}</div>
        <div>{{ `${chain_b_name} Address` }}: {{ chain_b_address }}</div>
      </div>
    </template>
    <IconAndTitle :title="relayer_name" :img-src="imgSrc" relayer icon-size="small" />
  </a-popover>
</template>

<script setup lang="ts">
import { TBaseChains } from '@/hooks/chainAndDenom.interface';
import { computed } from 'vue';
import IconAndTitle from '@/components/responsive/table/iconAndTitle.vue';
import { getRestString } from '@/helper/parseString';
interface IProps {
  relayer_name: string
  imgSrc: string
  chain_a_address: string
  chain_b_address: string
  chain_a: string // chain id
  chain_b: string
  ibcChains: TBaseChains[]
}


const props = defineProps<IProps>()

const filterChainName = (chainId: string) => {
  if (Array.isArray(props.ibcChains)) {
    const filterData = props.ibcChains.filter(item => item.chain_id === chainId)
    if (filterData.length > 0) {
      return filterData[0].chain_name.length > 15 ? getRestString(filterData[0].chain_name, 3, 8) : filterData[0].chain_name
    } else {
      return 'Unknown'
    }
  } else {
    return 'Unknown'
  }
}

const chain_a_name = computed(() => {
  return filterChainName(props.chain_a)
})

const chain_b_name = computed(() => {
  return filterChainName(props.chain_b)
})

</script>