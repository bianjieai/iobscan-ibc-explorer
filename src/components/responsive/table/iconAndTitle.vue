<template>
  <div class="flex items-center">
    <div :class="['icon', 'mr-8', iconSize === 'small' ? 'small-icon' : '']"></div>
    <div class="flex flex-col justify-around" :style="{ height: iconSize === 'small' ? '32px' : '40px' }">
      <div class="title leading-none">{{ title }}</div>
      <div :class="['subtitle', 'leading-none', subtitleIsTag ? 'tag' : '']" v-if="subtitle">{{ subtitle }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
// TODO clippers => icon 替换img
interface IProps {
  iconSize?: 'small' | 'normal'
  title: string
  subtitle?: string
  subtitleIsTag?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  iconSize: 'normal'
})



</script>

<style lang="less" scoped>
.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: burlywood;
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