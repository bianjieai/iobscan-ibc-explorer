<template>
  <div class="block">
    <div class="block__header">
      <p
        class="block__header__title"
        :style="{ color: type === 'dark' ? '#ffffff' : '#000000' }"
      >
        {{ title }}
      </p>
      <div :class="type === 'dark' ? 'block__header__line__dark' : 'block__header__line'"></div>
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
    }
    &__line {
      top: -16px;
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
}
</style>
