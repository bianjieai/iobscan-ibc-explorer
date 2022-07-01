<template>
  <div class="flex items-center">
    <div>
      <img v-if="!relayer" :src="imgSrc"
        :class="['icon', 'mr-8', iconSize === TableCellIconSize.SMALL ? 'small-icon' : '']">
      <div v-else>
        <img :src="relayerImageSrc" alt="" v-if="relayerImageSrc" class="icon mr-8 small-icon">
        <div v-else class="bg-text-c flex items-center justify-center mr-8">
          <div class="bg-text leading-none">{{ title.substring(0, 1) }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-around"
      :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }">
      <div :class="['title', 'leading-none', titleCanClick ? 'hover-cursor' : '']" @click="go">{{ relayer ? relayerName
          :
          title
      }}</div>
      <div :class="['subtitle', 'leading-none', subtitleIsTag ? 'tag' : '']" v-if="subtitle">{{ subtitle }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getRestString } from '@/helper/parseString';
import { computed } from 'vue';
import { TableCellIconSize, TTableCellIconSize } from '../component.interface';

// 说明 现已将 token chain 拆除。 仅剩relayer
interface IProps {
  iconSize?: TTableCellIconSize
  title: string
  subtitle?: string
  subtitleIsTag?: boolean
  imgSrc?: string
  titleCanClick?: boolean
  relayer?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  iconSize: TableCellIconSize.NORMAL
})



// relayer 处理
const relayerName = computed(() => props.title ? props.title : 'Unknown')

const relayerImageSrc = computed(() => {
  if (props.imgSrc) {
    return props.imgSrc
  } else if (relayerName.value === 'Unknown') {
    return new URL('../../../assets/default.png', import.meta.url).href
  } else {
    return ''
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
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

.bg-text-c {
  width: 32px;
  height: 32px;
  background: url('../../../assets/relayer-default.png') no-repeat center center;
  border-radius: 50%;
}

.bg-text {
  font-size: 22px;
  background: linear-gradient(to right, #B3BBFF, #8594ff);
  background-size: cover;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
</style>