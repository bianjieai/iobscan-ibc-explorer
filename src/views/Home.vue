<template>
  <div class="home">
    <!-- top -->
    <layer-block class="home__top" title="Networks" type="dark">
      <div class="home__top__slot">
        <div class="home__top__left">
          <card :msg="ibcStatisticsChains.chains_24hr" @click="onClickViewAll" />
          <card
            :msg="ibcStatisticsChains.chain_all"
            style="margin-top: 18px;"
            @click="onClickViewAll"
          />
        </div>
        <div class="home__top__right">
          <card-list
            :chainList="ibcChains.value"
            @onMenuSelected="onMenuSelected"
            @clickItem="onClickViewAll"
          />
        </div>
      </div>
    </layer-block>

    <!-- bottom -->
    <div class="home__bottom">
      <div class="home__bottom__left">
        <!-- Channels -->
        <layer-block title="Channels">
          <statistic-list
            type="vertical"
            :msg="ibcStatisticsChannels"
            @clickItem="onClickViewAll"
          />
        </layer-block>

        <!-- Tokens -->
        <layer-block title="IBC Tokens" style="margin-top: 47px" showTip :tipMsg="tipMsg">
          <statistic-list type="vertical" :msg="ibcStatisticsDenoms" @clickItem="onClickViewAll" />
        </layer-block>
      </div>

      <layer-block class="home__bottom__right" title="IBC Token Transfer">
        <statistic-list type="horizontal" :msg="ibcStatisticsTxs" @clickItem="onClickViewAll" />
        <transfer-list
          :transferList="ibcTxs.value"
          @clickViewAll="onClickViewAll"
          @clickItem="onClickViewAll"
        />
      </layer-block>
    </div>
  </div>
</template>

<script>
import {
  reactive, provide, onBeforeUnmount, h, computed,
} from 'vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import LayerBlock from '../components/LayerBlock.vue';
import Card from '../components/Card.vue';
import CardList from '../components/CardList.vue';
import StatisticList from '../components/StatisticList.vue';
import TransferList from '../components/TransferList.vue';
import Message from '../components/Message.vue';
import Tools from '../util/Tools';
import { ageTimerInterval } from '../constant';
import { getIbcTxs } from '../service/api';

export default {
  name: 'Home',
  components: {
    LayerBlock,
    Card,
    CardList,
    StatisticList,
    TransferList,
  },
  setup() {
    const store = useStore();

    const ibcChains = computed(() => store.state.ibcChains)?.value;
    provide('ibcChains', ibcChains);

    const ibcBaseDenoms = computed(() => store.state.ibcBaseDenoms)?.value;

    const ibcDenoms = computed(() => store.state.ibcDenoms)?.value;

    const ibcTxs = reactive({ value: [] });
    let txTimer = reactive(null);
    getIbcTxs({
      page_num: 1,
      page_size: 100,
    }).then((res) => {
      const result = res.data;
      clearInterval(txTimer);
      txTimer = setInterval(() => {
        ibcTxs.value = result.map((item) => {
          const auth = Tools.findDenomAuth(ibcDenoms.value, item.denoms.sc_denom, item.sc_chain_id);
          let symbolNum = item.sc_tx_info?.msg_amount?.amount || 0;
          let symbolDenom = item.base_denom || '';
          let symbolIcon = '';
          if (auth) {
            const findSymbol = Tools.findSymbol(
              ibcBaseDenoms.value,
              item.base_denom,
              item.sc_chain_id,
            );
            if (findSymbol) {
              symbolNum = Tools.parseSymbolNum(
                (item.sc_tx_info?.msg_amount?.amount || 0) * 10 ** -findSymbol.scale,
              );
              symbolDenom = findSymbol.symbol;
              symbolIcon = findSymbol.icon;
            }
          }
          return {
            ...item,
            symbolNum,
            symbolDenom,
            symbolIcon,
            tx_time: Tools.formatAge(Tools.getTimestamp(), item.tx_time * 1000, '', ''),
          };
        });
      }, ageTimerInterval);
    });

    onBeforeUnmount(() => {
      clearInterval(txTimer);
    });

    // eslint-disable-next-line no-unused-vars
    const onMenuSelected = (menuKey) => {
      // console.log(menuKey);
      // ibcChainsFilter
    };

    const onClickViewAll = () => {
      message.info({
        content: h(Message),
        icon: h('div'),
      });
    };

    const tipMsg = 'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';

    return {
      ibcTxs,
      ibcChains,
      ibcBaseDenoms,
      ibcDenoms,
      ibcStatisticsChains: computed(() => store.state.ibcStatisticsChains),
      ibcStatisticsChannels: computed(() => store.state.ibcStatisticsChannels),
      ibcStatisticsDenoms: computed(() => store.state.ibcStatisticsDenoms),
      ibcStatisticsTxs: computed(() => store.state.ibcStatisticsTxs),
      onMenuSelected,
      onClickViewAll,
      tipMsg,
    };
  },
};
</script>
<style lang="scss">
@import "../style/mixin.scss";

.home {
  width: 100%;
  max-width: 1200px;
  &__top {
    width: 100%;
    padding-top: 50px;
    &__slot {
      @include flex(row, nowrap, flex-start, center);
    }
    &__left {
      display: inline-block;
      margin: 24px;
    }
    &__right {
      margin: 24px 24px 24px 0;
      display: inline-block;
      width: 100%;
      background-color: #fff;
    }
  }
  &__bottom {
    width: 100%;
    @include flex(row, nowrap, flex-start, center);
    margin-top: 24px;
    &__left {
      width: 280px;
    }
    &__right {
      width: calc(100% - 24px);
      margin-left: 24px;
      @include flex(column, nowrap, flex-start, flex-start);
    }
  }
}
</style>
