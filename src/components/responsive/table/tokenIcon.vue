<template>
  <div class="flex items-center">
    <img :src="tokenInfo.imgSrc" :class="['icon', 'mr-8', iconSize === TableCellIconSize.SMALL ? 'small-icon' : '']">
    <div class="flex flex-col justify-around"
      :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }">
      <div :class="['title', 'leading-none', 'hover-cursor']" @click="go">{{ tokenInfo.title }}</div>
      <div :class="['subtitle', 'leading-none', 'tag']">{{ tokenInfo.subtitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TBaseDenoms } from '@/hooks/chainAndDenom.interface';
import { computed } from 'vue';
import { TableCellIconSize, TTableCellIconSize } from '../component.interface';

interface IProps {
  iconSize?: TTableCellIconSize
  denom: string
  denomsData: TBaseDenoms[]
}

const props = withDefaults(defineProps<IProps>(), {
  iconSize: TableCellIconSize.NORMAL,
})

const tokenInfo = computed(() => {
  const filterData = props.denomsData.filter(item => item.denom === props.denom)
  if (filterData.length > 0) {
    return {
      title: filterData[0].symbol,
      subtitle: 'Authed', // todo clippers => 状态处理
      imgSrc: filterData[0].icon
    }
  } else {
    return {
      title: props.denom,
      subtitle: 'Other',
      imgSrc: new URL('../../../assets/token-default.png', import.meta.url).href
    }
  }
})

const emit = defineEmits<{
  (e: 'clickTitle'): void
}>()

const go = () => {
  emit('clickTitle')
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
  font-size: var(--bj-font-size-sub-title);
}

.subtitle {
  color: var(--bj-text-third);
}

.tag {
  font-size: var(--bj-font-size-small);
  color: var(--bj-primary-color);
  padding: 2px 4px;
  width: 53px;
  border-radius: 8px;
  background: rgba(61, 80, 255, 0.1);
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>