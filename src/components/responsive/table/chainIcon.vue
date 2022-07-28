<template>
  <div class="flex items-center">
    <img :src="chainInfo.imgSrc" :class="['icon', 'mr-8', avatarCanClick ? 'hover-cursor' : '',
    iconSize === TableCellIconSize.SMALL ? 'small-icon' : '']" @click="avatarClick">
    <div class="flex flex-col justify-around"
      >
        <div :class="['title', 'leading-none', titleCanClick ? 'hover-cursor' : '']" @click="go">{{ computedTitle }}</div>

        <div v-if="chainInfo.subtitle !== '--'">
            <a-popover v-if="formatChainID(chainInfo.subtitle)?.length >= 18" placement="bottom">
                <template #content>
                  <div class="popover-c" >{{ formatChainID(chainInfo.subtitle)}}</div>
                </template>
                <div v-if="!noSubtitle" :class="['subtitle', 'leading-none', 'tag']">{{ formatChainID(chainInfo.subtitle) }}</div>
            </a-popover>
            <div v-else-if="!noSubtitle" :class="['subtitle', 'leading-none', 'tag']">{{ formatChainID(chainInfo.subtitle) }}</div>
        </div>
      <div v-else-if="!noSubtitle" :class="['subtitle', 'leading-none', 'tag']">--</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatLongTitleString, getRestString } from '@/helper/parseString';
import { TBaseChains } from '@/hooks/chainAndDenom.interface';
import { computed } from 'vue';
import { TableCellIconSize, TTableCellIconSize } from '../component.interface';
import ChainHelper from '@/helper/chainHepler';
import { UNKNOWN } from '../../../constants';

interface IProps {
  iconSize?: TTableCellIconSize
  chain_id: string
  chainsData: TBaseChains[]
  titleCanClick?: boolean
  title?: string
  noSubtitle?: boolean
  avatarCanClick?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  iconSize: TableCellIconSize.NORMAL,
  chainsData: JSON.parse(sessionStorage.getItem('allChains')!)?.all ?? []
})

const computedTitle = computed(() => {
  let title = ''
  if (typeof props.title !== 'undefined') {
    title = props.title === '' ? 'channel- --' : props.title
  } else {
    title = chainInfo.value.title
  }
  return title
})

const chainInfo = computed(() => {
  const filterData = props.chainsData.find(item => item.chain_id === props.chain_id)
  if (filterData) {
    return {
      title: filterData.chain_name,
      subtitle: filterData.chain_id,
      imgSrc: filterData.icon ? filterData.icon : new URL('../../../assets/chain-default.png', import.meta.url).href
    }
  } else {
    return {
      title: UNKNOWN,
      subtitle: '--',
      imgSrc: new URL('../../../assets/chain-default.png', import.meta.url).href
    }
  }
})

const formatChainID = (chainId: string) => {
  return ChainHelper.formatChainId(chainId);
}

const emits = defineEmits<{
  (e: 'clickTitle'): void
  (e: 'clickAvatar'): void
}>()

const go = () => {
  props.titleCanClick && emits('clickTitle')
}

const avatarClick = () => {
  props.avatarCanClick && emits('clickAvatar')
}

</script>

<style lang="less" scoped>
.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.small-icon {
  width: 32px;
  height: 32px;
}

.title {
    padding: 2px;
  font-size: var(--bj-font-size-sub-title);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
    padding: 2px;
  color: var(--bj-text-third);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}
</style>