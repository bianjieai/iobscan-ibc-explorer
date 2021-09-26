<template>
  <div class="home">
    <!-- top -->
    <layer-block class="home__top" title="Networks" type="dark">
      <div class="home__top__slot">
        <div class="home__top__left">
          <card :msg="ibcStatisticsChains.chains_24hr" />
          <card :msg="ibcStatisticsChains.chain_all" style="margin-top: 18px;" />
        </div>
        <div class="home__top__right">
          <card-list :chainList="ibcChains.value" @onMenuSelected="onMenuSelected" />
        </div>
      </div>
    </layer-block>

    <!-- bottom -->
    <div class="home__bottom">
      <div class="home__bottom__left">
        <!-- Channels -->
        <layer-block title="Channels">
          <statistic-list type="vertical" :msg="ibcStatisticsChannels" />
        </layer-block>

        <!-- Tokens -->
        <layer-block title="IBC Tokens" style="margin-top: 24px">
          <statistic-list type="vertical" :msg="ibcStatisticsDenoms" />
        </layer-block>
      </div>

      <layer-block class="home__bottom__right" title="IBC Token Transfer">
        <statistic-list type="horizontal" :msg="ibcStatisticsTxs" />
        <transfer-list :transferList="ibcTxs.value" />
      </layer-block>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import LayerBlock from '../components/LayerBlock.vue';
import Card from '../components/Card.vue';
import CardList from '../components/CardList.vue';
import StatisticList from '../components/StatisticList.vue';
import TransferList from '../components/TransferList.vue';
import { findStatistics } from '../helper/findStatistics';
import Tools from '../util/Tools';
import {
  ibcStatisticsChainsDefault,
  ibcStatisticsChannelsDefault,
  ibcStatisticsDenomsDefault,
  ibcStatisticsTxsDefault,
} from '../constant';
import {
  getIbcChains, getIbcTxs, getIbcBaseDenoms, getIbcStatistics,
} from '../service/api';

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
    getIbcTxs({
      page_num: 1,
      page_size: 100,
    }).then((res) => {
      const result = res.data;
      ibcTxs.value = result.map((item) => ({
        ...item,
        update_at: Tools.formatAge(Tools.getTimestamp(), item.update_at * 1000, '', ''),
      }));
    });
    const ibcChains = reactive({ value: [] });
    getIbcChains().then((res) => {
      console.log(res);
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

    return {
      ibcTxs,
      ibcChains,
      ibcBaseDenoms,
      ibcStatisticsChains,
      ibcStatisticsChannels,
      ibcStatisticsDenoms,
      ibcStatisticsTxs,
      onMenuSelected,
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
      height: 234px;
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
