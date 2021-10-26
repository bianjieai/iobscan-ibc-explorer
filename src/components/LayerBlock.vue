<template>
  <div class="block">
    <div class="block__header">
      <div :class="type === 'dark' ? 'block__header__line__dark' : 'block__header__line'">
        <p class="block__header__title" :style="{ color: type === 'dark' ? '#ffffff' : '#000000' }">
          {{ title }}
        </p>
      </div>
      <a-tooltip>
        <template #title>{{ tipMsg }}</template>
        <img class="tip__icon" v-if="showTip" src="../assets/tip.png" />
      </a-tooltip>
    </div>
    <div class="block__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    title: String,
    showTip: Boolean,
    tipMsg: String,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
@import "../style/variable.scss";
@import "../style/mixin.scss";

.block {
  @include flex(column, nowrap, flex-start, flex-start);
  &__header {
    display: inline-block;
    &__title {
      display: inline-block;
      font-size: $font-size3;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: $nav-font-weight;
      margin-right: 10px;
      position: relative;
      top: -16px;
      z-index: 5;
    }
    &__line__dark {
      top: -16px;
      left: 5px;
      display: inline-block;
      width: 100%;
      height: 12px;
      background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, #3d50ff 100%);
      border-radius: 5px;
      position: relative;
      z-index: 1;
    }
    &__line {
      left: 5px;
      display: inline-block;
      width: 100%;
      height: 12px;
      background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
      border-radius: 5px;
      position: relative;
    }
  }
  &__content {
    width: 100%;
    background-color: #ffffff;
    border-radius: $card-radio;
  }
  .tip__icon {
    width: 24px;
    position: absolute;
    margin-left: 16px;
    margin-top: -10px;
    cursor: pointer;
  }
}
</style>
