<template>
  <div class="transfer">
    <statistic-list type="horizontal" :msg="ibcStatisticsTxs" />
    <a-table rowKey="record_id" :columns="tableColumns" :data-source="tableDatas">
      <template #token="{ record }">
        <a>{{ record.record_id }}</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { reactive } from 'vue';
import StatisticList from '../components/StatisticList.vue';
import { transferTableColumn } from '../constant';

export default {
  components: {
    StatisticList,
  },
  setup() {
    const ibcStatisticsTxs = reactive({
      tx_all: { statistics_name: 'tx_all', count: 114 },
      tx_success: { statistics_name: 'tx_success', count: 74 },
      tx_process: { statistics_name: 'tx_process', count: 74 },
      tx_failed: { statistics_name: 'tx_failed', count: 12 },
    });

    const tableColumns = reactive(transferTableColumn);

    const tableDatas = reactive([]);
    return {
      ibcStatisticsTxs,
      tableColumns,
      tableDatas,
    };
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
}
</style>
