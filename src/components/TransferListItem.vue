<template>
  <div class="list__item">
    <span class="list__item__number">{{ prefixInteger(index + 1, 3) }}</span>
      <router-link :to="`/tokens/details?token=${item.denoms.sc_denom}`">
          <img class="list__item__icon" :src="item.symbolIcon || placeHoderImg" alt="icon" />
      </router-link>
    <div
      class="list__subItem"
      :style="{ borderBottom: isFinal ? '' : '1px solid rgba(0, 0, 0, 0.2)' }"
    >
      <div class="list__subItem__title__container">
        <span class="list__subItem__value">{{ formatNum(item.symbolNum) || 0 }}</span>
        <span class="list__subItem__title">{{ item.symbolDenom || "" }}</span>
      </div>

      <div class="list__subItem__adress__container">
          <router-link :to="`/network/details?chain_id=${item.sc_chain_id}`">
              <img class="list__subItem__adress__icon" :src="findIbcChainIcon(item.sc_chain_id)" />
          </router-link>

        <div class="hash__container">
          <span class="hash__value">
            <img class="hash__icon" :src="require(`../assets/tx.png`)" alt="icon" />
            <a-popover destroyTooltipOnHide>
              <template #content>
                <div>
                  <p class="tip__color">{{ item.sc_tx_info.hash }}</p>
                </div>
              </template>
                <router-link :to="`/transfers/details?hash=${item.sc_tx_info.hash}`">
                    <span class="hover">{{ getRestString(item.sc_tx_info.hash, 6, 5) }}</span>
                </router-link>
            </a-popover>
          </span>
          <span class="hash__value" style="margin-top: 14px;">
            <img class="hash__icon" :src="require(`../assets/adress.png`)" alt="icon" />
            <a-popover destroyTooltipOnHide>
              <template #content>
                <div>
                  <p class="tip__color">{{ item.sc_addr }}</p>
                </div>
              </template>
                <router-link :to="`/address/details?address=${item.sc_addr}`">
                    <span class="hover">{{ getRestString(item.sc_addr, 6, 5) }}</span>
                </router-link>
            </a-popover>
          </span>
        </div>

        <img
          class="status__icon"
          :src="require(`../assets/status${item.status}.png`)"
          alt="status"
        />
        <router-link :to="`/network/details?chain_id=${item.dc_chain_id}`">
            <img class="list__subItem__adress__icon" :src="findIbcChainIcon(item.dc_chain_id)" />
        </router-link>

        <div class="hash__container">
          <span class="hash__value">
            <img class="hash__icon" :src="require(`../assets/tx.png`)" alt="icon" />
            <a-popover destroyTooltipOnHide>
              <template #content>
                <div>
                  <p class="tip__color">{{ item?.dc_tx_info?.hash || "" }}</p>
                </div>
              </template>
                <router-link v-if="item?.dc_tx_info?.hash" :to="`/transfers/details?hash=${item.dc_tx_info.hash}`">
                     <span class="hover">{{ getRestString(item?.dc_tx_info?.hash || "", 6, 6) }}</span>
                </router-link>
                <span v-else></span>
            </a-popover>
          </span>
          <span class="hash__value" style="margin-top: 14px;">
            <img class="hash__icon" :src="require(`../assets/adress.png`)" alt="icon" />
            <a-popover destroyTooltipOnHide>
              <template #content>
                <div>
                  <p class="tip__color">{{ item.dc_addr }}</p>
                </div>
              </template>
                <router-link :to="`/address/details?address=${item.dc_addr}`">
                      <span class="hover">{{ getRestString(item.dc_addr, 6, 6) }}</span>
                </router-link>
            </a-popover>
          </span>
        </div>

        <p class="list__item__ago">{{ item.parseTime }} ago</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import {
  getRestString, getLasttyString, prefixInteger, formatNum,
} from '../helper/parseString';
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

    const findIbcChainIcon = computed(() => (chainId) => {
      if (ibcChains.value && ibcChains.value.all) {
        const result = ibcChains.value.all.find((item) => item.chain_id === chainId);
        if (result) {
          return result.icon || placeHoderImg;
        }
      }
      return placeHoderImg;
    });

    const clickListItem = () => {
      context.emit('clickItem', props.item);
    };

    return {
      getRestString,
      getLasttyString,
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
      @include flex(column, nowrap, flex-start, flex-start);
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
      // width: 100%;
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
.hover {
  cursor: pointer;
}
.tip {
  &__color {
    color: $font-color2;
  }
}
</style>
