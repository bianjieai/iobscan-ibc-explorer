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
        <layer-block title="IBC Tokens" style="margin-top: 47px">
          <statistic-list type="vertical" :msg="ibcStatisticsDenoms" @clickItem="onClickViewAll" />
        </layer-block>
      </div>

      <layer-block class="home__bottom__right" title="IBC Token Transfer">
        <statistic-list type="horizontal" :msg="ibcStatisticsTxs" />
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
  reactive, provide, onBeforeUnmount, h,
} from 'vue';
import { message } from 'ant-design-vue';
import LayerBlock from '../components/LayerBlock.vue';
import Card from '../components/Card.vue';
import CardList from '../components/CardList.vue';
import StatisticList from '../components/StatisticList.vue';
import TransferList from '../components/TransferList.vue';
import Message from '../components/Message.vue';
import { findStatistics } from '../helper/findStatistics';
import Tools from '../util/Tools';
import {
  ageTimerInterval,
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
} from '../constant';
import {
  getIbcChains, getIbcTxs, getIbcBaseDenoms, getIbcStatistics,
} from '../service/api';
// import commingsoonImg from '../assets/commingsoon.png';

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
    const ibcTxs = reactive({ value: [] });
    let txTimer = reactive(null);
    getIbcTxs({
      page_num: 1,
      page_size: 100,
    }).then((res) => {
      const result = res.data;
      clearInterval(txTimer);
      txTimer = setInterval(() => {
        ibcTxs.value = result.map((item) => ({
          ...item,
          tx_time: Tools.formatAge(Tools.getTimestamp(), item.tx_time * 1000, '', ''),
        }));
      }, ageTimerInterval);
    });

    onBeforeUnmount(() => {
      clearInterval(txTimer);
    });

    const ibcChains = reactive({ value: [] });
    provide('ibcChains', ibcChains);

    getIbcChains().then((res) => {
      ibcChains.value = res;
    });

    const ibcBaseDenoms = reactive({ value: [] });
    getIbcBaseDenoms().then((res) => {
      ibcBaseDenoms.value = res;
    });

    const ibcStatisticsChains = reactive(ibcStatisticsChainsDefault);

    const ibcStatisticsChannels = reactive(ibcStatisticsChannelsDefault);

    const ibcStatisticsDenoms = reactive(ibcStatisticsDenomsDefault);

    const ibcStatisticsTxs = reactive(ibcStatisticsTxsDefault);

    getIbcStatistics().then((res) => {
      ibcStatisticsChains.chains_24hr = findStatistics(res, 'chains_24hr');
      ibcStatisticsChains.chain_all = findStatistics(res, 'chain_all');
      ibcStatisticsChannels.channels_24hr = findStatistics(res, 'channels_24hr');
      ibcStatisticsChannels.channel_all = findStatistics(res, 'channel_all');
      ibcStatisticsChannels.channel_opened = findStatistics(res, 'channel_opened');
      ibcStatisticsChannels.channel_closed = findStatistics(res, 'channel_closed');
      ibcStatisticsDenoms.denom_all = findStatistics(res, 'denom_all');
      ibcStatisticsDenoms.base_denom_all = findStatistics(res, 'base_denom_all');
      ibcStatisticsTxs.tx_24hr_all = findStatistics(res, 'tx_24hr_all');
      ibcStatisticsTxs.tx_all = findStatistics(res, 'tx_all');
      ibcStatisticsTxs.tx_success = findStatistics(res, 'tx_success');
      ibcStatisticsTxs.tx_failed = findStatistics(res, 'tx_failed');
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

    return {
      ibcTxs,
      ibcChains,
      ibcBaseDenoms,
      ibcStatisticsChains,
      ibcStatisticsChannels,
      ibcStatisticsDenoms,
      ibcStatisticsTxs,
      onMenuSelected,
      onClickViewAll,
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
