<template>
  <div class="home">
    <!-- top -->
    <layer-block class="home__top" title="Networks" type="dark">
      <div class="home__top__slot">
        <div class="home__top__left">
            <card :msg="ibcStatisticsChains.chains_24hr"  @click="onClickViewAll('network')"/>
            <card
                :msg="ibcStatisticsChains.chain_all"
                style="margin-top: 18px;"
                @click="onClickViewAll('network')"
            />
<!--            <router-link :to="`/network`">
                <card :msg="ibcStatisticsChains.chains_24hr"/>
            </router-link>
            <router-link :to="`/network`">
                <card
                    :msg="ibcStatisticsChains.chain_all"
                    style="margin-top: 18px;"
                />
            </router-link>-->
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
          <statistic-list type="vertical" :msg="ibcStatisticsDenoms"  @clickItem="onClickViewAll"/>
        </layer-block>
      </div>

      <layer-block class="home__bottom__right" title="IBC Token Transfer">
        <statistic-list type="horizontal" :msg="ibcStatisticsTxs" @clickItem="onClickViewAll" />
        <transfer-list
          :transferList="ibcTxs.value"
          @clickViewAll="onClickViewAll('tx_all')"
          @clickItem="onClickViewAll"
        />
      </layer-block>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, h, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import LayerBlock from '../components/LayerBlock.vue';
import Card from '../components/Card.vue';
import CardList from '../components/CardList.vue';
import StatisticList from '../components/StatisticList.vue';
import TransferList from '../components/TransferList.vue';
import Message from '../components/Message.vue';
import { GET_IBCTXS } from '../store/action-types';

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
    store.dispatch(GET_IBCTXS, {
      page_num: 1,
      page_size: 100,
      use_count: false,
    });

    const ibcChains = computed(() => store.state.ibcChains)?.value;

    const ibcBaseDenoms = computed(() => store.state.ibcBaseDenoms)?.value;

    const ibcDenoms = computed(() => store.state.ibcDenoms)?.value;

    onBeforeUnmount(() => {
      clearInterval(computed(() => store.state.ibcTxTimer)?.value);
    });

    // eslint-disable-next-line no-unused-vars
    const onMenuSelected = (menuKey) => {
      // console.log(menuKey);
      // ibcChainsFilter
    };

    const router = useRouter();

    const onClickViewAll = (msg) => {
        if(msg && msg.includes && msg.includes('network')){
            router.push({
                name: 'NetWork'
            })
        }else if(msg && msg.includes && msg.includes('channel')){
            router.push({
                name: 'Channels'
            })
        } else if (msg && msg.includes && msg.includes('tx')) {
            if(msg === 'tx_all'){
                router.push({
                    name: 'Transfers',
                    query:{
                        status:'1,2,3,4'
                    }
                });
            }else if(msg === 'tx_24hr_all'){
                router.push({
                    name: 'Transfers',
                    query:{
                        status:'1,2,3,4'
                    }
                });
            }else if(msg === 'tx_success'){
                router.push({
                    name: 'Transfers',
                    query:{
                        status:'1'
                    }
                });
            }else if(msg === 'tx_failed'){
                router.push({
                    name: 'Transfers',
                    query:{
                        status:'2,4'
                    }
                });
            }

      } else if (msg && msg.includes && msg.includes('denom')) {
            router.push({
              name: 'Tokens',
            });
        } else {
        message.info({
          content: h(Message),
          icon: h('div'),
        });
      }
    };

    const tipMsg = 'Denom is the token denomination to be transferred, base denomination of the relayed fungible token.';
    return {
      ibcTxs: computed(() => store.state.ibcTxs)?.value,
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
