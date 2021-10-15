<template>
  <div class="transfer">
    <statistic-list type="horizontal" :msg="ibcStatisticsTxs" />

    <div class="transfer__middle">
      <h2>IBC Token Transfer List {{ tableCount.value }}</h2>
    </div>

    <a-table rowKey="record_id" :columns="tableColumns" :data-source="tableDatas.value">
      <template #token="{ record }">
        <a>{{ record.symbolNum }}</a>
        <a>{{ record.symbolDenom }}</a>
        <a>{{ record.symbolIcon }}</a>
      </template>
      <template #sequence="{ record }">
        <a>{{ record.sequence }}</a>
      </template>
      <template #sourceChain="{ record }">
        <a>{{ record.sc_chain_id }}</a>
        <a>{{ record.sc_channel }}</a>
        <a>{{ record.sc_port }}</a>
      </template>
      <template #status="{ record }">
        <a>{{ record.status }}</a>
      </template>
      <template #destinationChain="{ record }">
        <a>{{ record.dc_chain_id }}</a>
      </template>
      <template #time="{ record }">
        <a>{{ record.tx_time }}</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { GET_IBCTXS } from '../store/action-types';
import StatisticList from '../components/StatisticList.vue';
import { transferTableColumn, ibcStatisticsTxsTest } from '../constant';

export default {
  components: {
    StatisticList,
  },
  setup() {
    const store = useStore();
    store.dispatch(GET_IBCTXS, {
      page_num: 1,
      page_size: 10,
      use_count: false,
    });
    store.dispatch(GET_IBCTXS, {
      use_count: true,
    });
    const ibcStatisticsTxs = reactive(ibcStatisticsTxsTest);

    const tableColumns = reactive(transferTableColumn);

    return {
      ibcStatisticsTxs,
      tableColumns,
      tableDatas: computed(() => store.state.ibcTxs)?.value,
      tableCount: computed(() => store.state.ibcTxsCount)?.value,
    };
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  &__middle {
    width: 100%;
    height: 200px;
  }
}
</style>
