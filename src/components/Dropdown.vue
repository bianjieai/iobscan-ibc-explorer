<template>
  <a-dropdown
    :trigger="['click']"
    :placement="'bottomLeft'"
    :visible="isVisible"
    @visibleChange="visibleChange"
  >
    <a-button class="button">
      {{ buttonTitle }}
      <!-- <span class="button__icon" /> -->
    </a-button>
    <template #overlay>
      <div class="overlay">
        <div class="overlay__item">
          <h2 class="overlay__item__title" v-if="type === 'token'">Authed IBC Tokens</h2>
          <div class="overlay__item__content">
            <div
              class="content__item"
              v-for="(item, key) of options"
              :key="item[itemKey] || item"
              :class="
                Array.isArray(options)
                  ? selectedItem.value &&
                    selectedItem.value[itemKey] === item[itemKey] &&
                    'content__item__selected'
                  : selectedItem.value && selectedItem.value === key && 'content__item__selected'
              "
              @click="onClickItem(item, key)"
            >
              <img
                class="content__item__icon"
                :src="item[iconKey] || require('../assets/placeHoder.png')"
              />
              <span class="content__item__title">{{ item[titleKey] || key }}</span>
            </div>
          </div>
        </div>
        <div class="overlay__item" v-if="type === 'token'">
          <h2 class="overlay__item__title">Other IBC Tokens</h2>
          <div class="overlay__item__content">
            <div class="content__item"  @click="onClickItem(undefined, unAuthed)">
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
import { ref, reactive } from 'vue';
import { unAuthed } from '../constant';

export default {
  props: {
    type: String,
    buttonTitle: String,
    options: {
      default: () => [],
    },
    itemKey: String,
    iconKey: String,
    titleKey: String,
  },
  setup(props, context) {
    const isVisible = ref(false);
    const selectedItem = reactive({ value: null });

    const visibleChange = (visible) => {
      isVisible.value = visible;
    };
    const onClickItem = (item, key) => {
      const selected = Array.isArray(props.options) ? item : key;
      selectedItem.value = selected;
      context.emit('clickItem', selected);
      isVisible.value = false;
    };
    return {
      isVisible,
      selectedItem,
      visibleChange,
      onClickItem,
      unAuthed,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";
.button {
  padding: 0 5px 0 15px;
  width: 124px;
  @include flex(row, wrap, space-between, center);
  font-family: Montserrat-Regular, Montserrat;
  font-weight: 400;
  &:hover {
    .button__icon {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      border-left: 1px solid $font-color4;
    }
  }
  &__icon {
    width: 14px;
    height: 100%;
    margin-left: 5px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    border-left: 1px solid #D9DFEE;
  }
}
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
        border: 1px solid transparent;
        margin: 0 16px 16px 0;
        padding: 6px 12px;
        cursor: pointer;
        &:hover {
          border: 1px solid $font-color4;
          color: $font-color4;
          background-color: #ffffff;
        }
        &__selected {
          border: 1px solid $font-color4;
          color: $font-color4;
          background-color: #ffffff;
        }
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
