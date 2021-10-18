<template>
  <a-dropdown :trigger="['click']" :placement="'bottomLeft'">
    <a-button>{{ buttonTitle }}</a-button>
    <template #overlay>
      <div class="overlay">
        <div class="overlay__item">
          <h2 class="overlay__item__title" v-if="type === 'token'">Authed IBC Tokens</h2>
          <div class="overlay__item__content">
            <div
              class="content__item"
              v-for="item of options"
              :key="item"
              style="margin: 0 16px 16px 0"
            >
              <img class="content__item__icon" :src="item[iconKey] || '../assets/placeHoder.png'" />
              <span class="content__item__title">{{ item[titleKey] }}</span>
            </div>
          </div>
        </div>
        <div class="overlay__item" v-if="type === 'token'">
          <h2 class="overlay__item__title">Other IBC Tokens</h2>
          <div class="overlay__item__content">
            <div class="content__item" style="margin: 0 16px 16px 0">
              <img class="content__item__icon" src="../assets/placeHoder.png" />
              <span class="content__item__title">Others</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script>
export default {
  props: {
    type: String,
    buttonTitle: String,
    options: {
      type: Array,
      default: () => [],
    },
    iconKey: String,
    titleKey: String,
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.overlay {
  width: 828px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px #d9deec;
  border-radius: 4px;
  border: 1px solid #d9dfee;
  &__item {
    width: 100%;
    padding: 16px;
    &__title {
      font-size: 14px;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
      color: #000000;
      margin-bottom: 14px;
    }
    &__content {
      width: 100%;
      @include flex(row, wrap, flex-start, center);
      .content__item {
        background: #f5f7fc;
        border-radius: 4px;
        padding: 6px 12px;
        &__icon {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        &__title {
          font-size: 14px;
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
</style>
