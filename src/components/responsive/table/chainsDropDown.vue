<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']">
    <div
      :class="['inline-flex', 'items-center', 'default_color', 'dropdown-container', visible ? 'visible_border' : '']">
      <div :class="['mr-8', 'ml-8']">{{ chain_a }}</div> - <div :class="['mr-8', 'ml-8']">{{ chain_b }}</div>
      <span class="button__icon flex justify-between items-center">
        <svg :style="{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }" focusable="false" data-icon="down"
          width="12px" height="12px" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"
          :class="[visible ? 'visible_color' : '']">
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
          </path>
        </svg>
      </span>
    </div>

    <template #overlay>
      <div class="overlay">
        <div></div>
      </div>
    </template>
  </a-dropdown>


</template>

<script lang="ts" setup>
// todo clippers => chains 获取
// todo clippers => 完成overlay
import { ref } from 'vue';

const visible = ref(false)
const chain_a = ref('All Chains')
const chain_b = ref('All Chains')

</script>

<style lang="less" scoped>
.dropdown-container {
  height: 36px;
  border: 1px solid var(--bj-border-color);
  border-radius: 4px;
  background-color: #fff;
  cursor: url("../../../assets/mouse/shiftlight_mouse.png"), default !important;
}

.button__icon {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 0 6px;
  border-left: 1px solid var(--bj-border-color);
  height: 36px;

  &>svg {
    color: var(--bj-text-third);
  }
}

.visible_border {
  border: 1px solid var(--bj-primary-color);
}

.visible_color {
  color: var(--bj-primary-color) !important;
}

.default_color {
  color: var(--bj-text-third);
}

.overlay {
  width: 870px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px 0px #D9DEEC;
  border-radius: 4px;
  height: 278px; // todo clippers => 高度可变
  border: 1px solid var(--bj-border-color);
}
</style>