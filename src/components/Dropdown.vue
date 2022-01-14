<template>
  <a-dropdown
    :trigger="['click']"
    :placement="'bottomLeft'"
    :visible="isVisible"
    @visibleChange="visibleChange"
  >
    <a-button class="button">
      <img
        class="button__pre__icon"
        :style="{ visibility: showIcon ? 'visible' : 'hidden' }"
        :src="type === 'chain' ? findChainIcon() : findSymbolIcon()"
      />
      <span class="button__title">{{
        type === "chain"
          ? getLasttyString(selectedChain.chain_name) || "All Chains"
          : isShowSymbol(selectedSymbol)?.symbolDenom
      }}</span>
      <span class="button__icon">
        <svg
          :style="{ transform: isVisible ? 'rotate(180deg)' : 'rotate(0)' }"
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
        <div class="overlay__title" @click="onClickAll">
          {{ type === "token" ? "All Tokens" : "All Chains" }}
        </div>
        <div class="overlay__item">
          <h2 class="overlay__item__title" v-if="type === 'token'">Authed IBC Tokens</h2>
          <div class="overlay__item__content">
            <template v-for="(item, key) of options" :key="type === 'chain' ? item.chain_id : key">
              <div
                class="content__item"
                v-if="key !== ''"
                :title="type === 'chain' ? item[titleKey] : key"
                :class="
                  type === 'chain'
                    ? selectedChain &&
                      selectedChain.chain_id &&
                      selectedChain.chain_id === item.chain_id &&
                      'content__item__selected'
                    : selectedSymbol && selectedSymbol === key && 'content__item__selected'
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
                  getLasttyString(item[titleKey]) || isShowSymbol(key)?.symbolDenom
                }}</span>
              </div>
            </template>
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
          <h2 class="overlay__item__title" v-if="type === 'token'">
            Custom IBC Tokens
            <a-popover destroyTooltipOnHide>
              <template #content>
                <div>
                  <p class="tip__color">
                    Hash (in hex format) of the denomination trace information.
                  </p>
                </div>
              </template>
              <img class="tip hover" style="margin-left: 8px;" src="../assets/tip.png" />
            </a-popover>
          </h2>
          <div class="overlay__item__content flex">
            <a-input
              class="overlay__item__input"
              v-model:value="inputValue"
              allowClear
              :placeholder="type === 'token' ? 'Search by ibc/hash' : 'Search by Chain ID'"
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

import { ref, watch } from 'vue';
import { unAuthed } from '../constant';
import placeHoderImg from '../assets/placeHoder.png';
import { getLasttyString } from '../helper/parseString';

export default {
  props: {
    type: String,
    options: {
      default: () => [],
    },
    ibcBaseDenoms: {
      default: () => [],
    },
    selectedChain: Object,
    selectedSymbol: {
      default: () => '',
    },
    clearInput: Number,
    showIcon: Boolean,
    iconKey: String,
    titleKey: String,
  },
  setup(props, context) {
    const isVisible = ref(false);
    const inputValue = ref('');
    const visibleChange = (visible) => {
      isVisible.value = visible;
    };
    watch(
      () => props.clearInput,
      () => {
        inputValue.value = '';
      },
    );

    const onClickItem = (item, key) => {
      inputValue.value = '';
      const selected = props.type === 'chain' ? item : key;
      context.emit('clickItem', props.type, selected);
      isVisible.value = false;
    };
    const onClickSearch = () => {
      context.emit(
        'clickSearch',
        props.type,
        props.type === 'chain' ? { chain_id: inputValue.value } : inputValue.value.toLowerCase().replace('ibc/', '').replace('IBC/', ''),
      );
      isVisible.value = false;
    };
    const onClickAll = () => {
      context.emit(
        'clickSearch',
        props.type,
        props.type === 'chain' ? { chain_id: undefined } : undefined,
      );
      isVisible.value = false;
    };
    const isShowSymbol = (key) => {
      const result = {
        symbolDenom: '',
        symbolIcon: '',
      };
      if (props.type === 'token' && Array.isArray(props.ibcBaseDenoms.value)) {
        const findSymbol = props.ibcBaseDenoms.value?.find((baseDenom) => baseDenom.symbol === key);
        result.symbolDenom = findSymbol ? findSymbol.symbol : key;
        result.symbolIcon = findSymbol ? findSymbol.icon : '';
      }
      return result;
    };
    const findChainIcon = () => {
      const findChainConfig = props?.options?.find(
        (item) => item.chain_id === props.selectedChain.chain_id,
      );
      if (findChainConfig) {
        return findChainConfig.icon || placeHoderImg;
      }
      return placeHoderImg;
    };
    const findSymbolIcon = () => {
      const findSymbolConfig = props.ibcBaseDenoms.value?.find(
        (baseDenom) => baseDenom.symbol === props.selectedSymbol,
      );
      if (findSymbolConfig) {
        return findSymbolConfig.icon || placeHoderImg;
      }
      return placeHoderImg;
    };

    return {
      isVisible,
      visibleChange,
      onClickItem,
      inputValue,
      onClickSearch,
      onClickAll,
      findChainIcon,
      findSymbolIcon,
      unAuthed,
      getLasttyString,
      isShowSymbol,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";
.button {
  padding: 0 5px 0 5px;
  width: 146px;
  margin-right: 8px;
  @include flex(row, wrap, space-between, center);
  font-family: Montserrat-Regular, Montserrat;
  font-weight: 400;
  &__title {
    max-width: 86px;
    // text-overflow: ellipsis;
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
    margin: 0 5px;
    @include flex(column, nowrap, center, center);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    // border-left: 1px solid #d9dfee;
    color: rgba(0, 0, 0, 0.25);
  }
  &__pre__icon {
    width: 18px;
    margin-right: 5px;
  }
}
.overlay {
  max-width: 870px;
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
    width: 140px;
    cursor:pointer !important;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      border: 1px solid $font-color4;
      color: $font-color4;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      background-color: #ffffff;
    }
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
        width: 158px;
        background: #f5f7fc;
        border-radius: 4px;
        border: 1px solid transparent;
        margin: 0 8px 12px 0;
        padding: 6px 6px;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        @include flex(row, nowrap, flex-start, center);
          .content__item__title{
                width: 112px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
          }
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
          overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
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
.tip {
  width: 20px;
  &__color {
    color: $font-color2;
  }
}
.hover {
  cursor: pointer !important;
}
</style>
