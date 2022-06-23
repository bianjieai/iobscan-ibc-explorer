<template>
  <div class="status-container">
    <div class="flex justify-between items-center flex-wrap">
      <div>{{ type }} Status: </div>
      <div class="flex">
        <div class="flex items-center">
          <div class="icon"></div>
          <div>{{ type === BottomStatusType.CHANNEL ? 'Open' : 'Running' }}</div>
        </div>
        <div class="flex items-center">
          <div class="icon"></div>
          <div>{{ type === BottomStatusType.CHANNEL ? 'Closed' : 'Stopped' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BottomStatusType } from '../component.interface';

// TODO clippers => icon替换
interface IProps {
  type: BottomStatusType // 目前支持 channels 和 relayers
}

defineProps<IProps>()

</script>

<style lang="less" scoped>
.status-container {
  background: #F8F9FC;
  border-radius: 14px;
  line-height: 28px;
  color: var(--bj-text-third);
  padding: 0 16px 0 8px;
  display: inline-block;

  .icon {
    height: 20px;
    width: 20px;
    margin: 0 5px 0 24px;
    background: salmon;
    border-radius: 50%;
  }
}

@media screen and (min-width: 768px) {}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {}

// mobile
@media screen and (max-width: 414px) {
  .status-container {
    line-height: 20px;
    padding: 8px 16px 8px 8px;
  }
}
</style>