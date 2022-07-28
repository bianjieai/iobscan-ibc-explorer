<template>
  <a-popover placement="topLeft">
    <template #content>
      <div class="popover-c">
        <div>Relayer Name: {{ relayer_name ? relayer_name : UNKNOWN }}</div>
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
import { formatLongTitleString, getRestString } from '@/helper/parseString';
import { RELAYER_STATUS } from '../constants';
import { UNKNOWN } from '../../../constants';
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

const findChainName = (chainId: string) => {
  if (Array.isArray(props.ibcChains)) {
    const ibcChain = props.ibcChains.find(item => item.chain_id === chainId);
    if (ibcChain) {
      return formatLongTitleString(ibcChain.chain_name)
    } else {
      return RELAYER_STATUS.UNKNOWN
    }
  } else {
    return RELAYER_STATUS.UNKNOWN
  }
}

const chain_a_name = computed(() => {
  return findChainName(props.chain_a)
})

const chain_b_name = computed(() => {
  return findChainName(props.chain_b)
})

</script>