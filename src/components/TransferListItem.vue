<template>
  <div class="list__item" @click="clickListItem">
    <span class="list__item__number">{{ prefixInteger(index + 1, 3) }}</span>
    <img class="list__item__icon" :src="item.symbolIcon || placeHoderImg" alt="icon" />
    <div
      class="list__subItem"
      :style="{ borderBottom: isFinal ? '' : '1px solid rgba(0, 0, 0, 0.2)' }"
    >
      <div class="list__subItem__title__container">
        <span class="list__subItem__value">{{ formatNum(item.symbolNum) || 0 }}</span>
        <span class="list__subItem__title">{{ item.symbolDenom || "" }}</span>
      </div>

      <div class="list__subItem__adress__container">
        <img class="list__subItem__adress__icon" :src="findIbcChainIcon(item.sc_chain_id)" />

        <div class="hash__container">
          <span class="hash__value">
            <img class="hash__icon" :src="require(`../assets/tx.png`)" alt="icon" />
            {{ getRestString(item.sc_tx_info.hash, 6, 5) }}
          </span>
          <span class="hash__value" style="margin-top: 14px;">
            <img class="hash__icon" :src="require(`../assets/adress.png`)" alt="icon" />
            {{ getRestString(item.sc_addr, 6, 5) }}
          </span>
        </div>

        <img
          class="status__icon"
          :src="require(`../assets/status${item.status}.png`)"
          alt="status"
        />

        <img class="list__subItem__adress__icon" :src="findIbcChainIcon(item.dc_chain_id)" />

        <div class="hash__container">
          <span class="hash__value">
            <img class="hash__icon" :src="require(`../assets/tx.png`)" alt="icon" />
            {{ getRestString(item?.dc_tx_info?.hash || "", 6, 6) }}
          </span>
          <span class="hash__value" style="margin-top: 14px;">
            <img class="hash__icon" :src="require(`../assets/adress.png`)" alt="icon" />
            {{ getRestString(item.dc_addr, 6, 6) }}
          </span>
        </div>

        <p class="list__item__ago">{{ item.tx_time }} ago</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { getRestString, prefixInteger, formatNum } from '../helper/parseString';
import placeHoderImg from '../assets/placeHoder.png';

export default {
  props: {
    isFinal: Boolean,
    index: Number,
    item: Object,
  },
  setup(props, context) {
    const store = useStore();
    const ibcChains = computed(() => store.state.ibcChains)?.value;

    const findIbcChainIcon = (chainId) => {
      if (ibcChains.value && ibcChains.value.all) {
        const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
        if (result) {
          return result.icon;
        }
      }
      return placeHoderImg;
    };

    const clickListItem = () => {
      context.emit('clickItem', props.item);
    };

    return {
      getRestString,
      prefixInteger,
      findIbcChainIcon,
      placeHoderImg,
      ibcChains,
      clickListItem,
      formatNum,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.list__item {
  @include flex(row, nowrap, flex-start, center);
  padding: 0 16px 0 0;
  cursor: pointer;
  &__number {
    font-size: $font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color3;
    line-height: $font-size5;
    margin: 0 0 0 8px;
  }
  &__icon {
    width: 40px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    margin: 0 24px 0 18px;
  }
  .list__subItem {
    width: 100%;
    height: 95px;
    @include flex(row, nowrap, flex-start, center);
    &__title__container {
      width: 100%;
      max-width: 150px;
      margin: 8px;
      @include flex(column, nowrap, flex-start, center);
    }
    &__value {
      width: 100%;
      text-align: left;
      font-size: $font-size4;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.75);
      line-height: $font-size4;
    }
    &__title {
      width: 100%;
      text-align: left;
      margin-top: 4px;
      font-size: $font-size5;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
      color: $font-color3;
      line-height: $font-size5;
    }
    &__adress__container {
      width: 100%;
      @include flex(row, nowrap, flex-start, center);
    }
    &__adress__icon {
      width: 24px;
      height: 24px;
      margin: 0 10px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
  &__ago {
    // width: 100%;
    width: 150px;
    text-align: right;
    font-size: $font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color2;
    line-height: $font-size5;
  }
}
.hash {
  &__container {
    // width: 100%;
    @include flex(column, nowrap, flex-start, flex-start);
  }
  &__value {
    width: 100%;
    min-width: 150px;
    font-size: $font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color2;
    line-height: $font-size5;
    @include flex(row, nowrap, flex-start, center);
  }
  &__icon {
    width: 14px;
    margin-right: 10px;
  }
}
.status__icon {
  width: 22px;
  margin: 0 16px;
}
</style>
