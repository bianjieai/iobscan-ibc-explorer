<template>
  <a-dropdown
    :trigger="['click']"
    :placement="'bottomLeft'"
    :visible="isVisible"
    @visibleChange="visibleChange"
  >
    <a-button class="button">
      <span class="button__title">{{ type === 'chain' ? selectedChain : selectedToken }}</span>
      <span class="button__icon">
        <svg
          focusable="false"
          data-icon="down"
          width="12px"
          height="12px"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
        >
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
          ></path>
        </svg>
      </span>
    </a-button>
    <template #overlay>
      <div class="overlay">
        <div class="overlay__title">{{type === 'token' ? 'All Token' : 'All Chains'}}</div>
        <div class="overlay__item">
          <h2 class="overlay__item__title" v-if="type === 'token'">Authed IBC Tokens</h2>
          <div class="overlay__item__content">
            <div
              class="content__item"
              v-for="(item, key) of options"
              :key="item[itemKey] || item"
              :class="
                type === 'chain'
                  ? selectedChain &&
                    selectedChain === item[itemKey] &&
                    'content__item__selected'
                  : selectedToken && selectedToken === key && 'content__item__selected'
              "
              @click="onClickItem(item, key)"
            >
              <img
                class="content__item__icon"
                :src="
                  item[iconKey] ||
                    isShowSymbol(key)?.symbolIcon ||
                    require('../assets/placeHoder.png')
                "
              />
              <span class="content__item__title">{{
                item[titleKey] || isShowSymbol(key)?.symbolDenom
              }}</span>
            </div>
          </div>
        </div>

        <div class="overlay__item" v-if="type === 'token'">
          <h2 class="overlay__item__title">Other IBC Tokens</h2>
          <div class="overlay__item__content">
            <div class="content__item" @click="onClickItem(undefined, unAuthed)">
              <img class="content__item__icon" src="../assets/placeHoder.png" />
              <span class="content__item__title">Others</span>
            </div>
          </div>
        </div>

        <div class="overlay__item">
          <h2 class="overlay__item__title" v-if="type === 'token'">Custom IBC Tokens</h2>
          <div class="overlay__item__content flex">
            <a-input
              class="overlay__item__input"
              v-model:value="inputValue"
              allowClear
              :placeholder="type === 'token' ? 'Intern the ibc/hash' : 'Inter the Chain ID'"
            />
            <a-button type="primary" @click="onClickSearch">Confirm</a-button>
          </div>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script>
/* eslint-disable max-len */

import { ref } from 'vue';
import { unAuthed } from '../constant';

export default {
  props: {
    type: String,
    buttonTitle: String,
    options: {
      default: () => [],
    },
    ibcBaseDenoms: {
      default: () => [],
    },
    selectedChain: {
      default: () => '',
    },
    selectedToken: {
      default: () => '',
    },
    itemKey: String,
    iconKey: String,
    titleKey: String,
  },
  setup(props, context) {
    const isVisible = ref(false);
    const inputValue = ref('');
    const visibleChange = (visible) => {
      isVisible.value = visible;
    };
    const onClickItem = (item, key) => {
      inputValue.value = '';
      const selected = props.type === 'chain' ? item[props.itemKey] : key;
      context.emit('clickItem', props.type, selected);
      isVisible.value = false;
    };
    const onClickSearch = () => {
      context.emit('clickSearch', props.type, inputValue.value);
    };
    const isShowSymbol = (key) => {
      const result = {
        symbolDenom: '',
        symbolIcon: '',
      };
      if (props.type === 'token' && Array.isArray(props.ibcBaseDenoms.value)) {
        const findSymbol = props.ibcBaseDenoms.value?.find((baseDenom) => baseDenom.denom === key);
        result.symbolDenom = findSymbol ? findSymbol.symbol : key;
        result.symbolIcon = findSymbol ? findSymbol.icon : '';
      }
      return result;
    };
    return {
      isVisible,
      visibleChange,
      onClickItem,
      inputValue,
      onClickSearch,
      unAuthed,
      isShowSymbol,
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
  margin-right: 8px;
  @include flex(row, wrap, space-between, center);
  font-family: Montserrat-Regular, Montserrat;
  font-weight: 400;
  &__title {
    max-width: 80px;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  &:hover {
    .button__icon {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      // border-left: 1px solid $font-color4;
    }
  }
  &__icon {
    height: 100%;
    margin-left: 5px;
    @include flex(column, nowrap, center, center);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    // border-left: 1px solid #d9dfee;
    color: rgba(0, 0, 0, 0.25);
  }
}
.overlay {
  width: 828px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px #d9deec;
  border-radius: 4px;
  border: 1px solid #d9dfee;
  padding: 16px;
  &__title {
    display: inline-block;
    background: #f5f7fc;
    border-radius: 4px;
    padding: 6px 12px;
    border: 1px solid transparent;
    font-size: 14px;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 16px;
    width: 97px;
  }
  &__item {
    width: 100%;
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
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        &:hover {
          border: 1px solid $font-color4;
          color: $font-color4;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
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
    &__input {
      font-family: Montserrat-Regular, Montserrat;
      width: 240px;
      margin-right: 12px;
    }
  }
}
.flex {
  @include flex(row, nowrap, flex-start, center);
}
</style>
