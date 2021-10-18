<template>
  <div class="transfer">
    <!-- <statistic-list type="horizontal" :msg="ibcStatisticsTxs" /> -->
    <div class="transfer__header__container">
      <div class="transfer__header">
        <div class="transfer__header__line">
          <p class="transfer__header__title">IBC Token Transfer List {{ tableCount.value }}</p>
        </div>
      </div>
    </div>

    <div class="transfer__middle__container">
      <dropdown
        :type="'token'"
        buttonTitle="REGEN"
        :options="ibcChains.value?.all"
        :iconKey="'icon'"
        :titleKey="'chain_name'"
      />
      <dropdown :type="'chain'" buttonTitle="All Chains" />
    </div>

    <!-- <a-select
      ref="select"
      class="chain__select"
      v-model:value="currentChain"
      style="width: 120px"
      @change="handleSelectChange"
    >
      <a-select-option
        v-for="item of ibcChains.value.all"
        :key="item.chain_id"
        :value="item.chain_id"
        >{{ item.chain_name }}</a-select-option
      >
    </a-select> -->

    <a-table
      style="width: 100%"
      bordered
      :rowKey="record => record.record_id"
      :columns="tableColumns"
      :loading="loading"
      :data-source="tableDatas.value"
      :pagination="false"
    >
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
        <a>{{ record.dc_channel }}</a>
        <a>{{ record.dc_port }}</a>
      </template>
      <template #time="{ record }">
        <a>{{ record.tx_time }}</a>
      </template>
    </a-table>

    <div class="transfer__bottom">
      <span class="status__tips" v-if="tableCount.value">
        Status:
        <span class="status__tip status__tip__success"></span> Success
        <span class="status__tip status__tip__warning"></span> Processing
        <span class="status__tip status__tip__error"></span> Failed
      </span>
      <a-pagination
        class="table__pagination"
        v-model:current="pagination.current"
        :total="pagination.total"
        @change="handleTableChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { GET_IBCTXS } from '../store/action-types';
import { transferTableColumn } from '../constant';
import Dropdown from '../components/Dropdown.vue';

export default {
  components: {
    Dropdown,
  },
  setup() {
    const store = useStore();
    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: 10,
    });

    store
      .dispatch(GET_IBCTXS, {
        use_count: true,
      })
      .then(() => {
        pagination.total = computed(() => store.state.ibcTxsCount).value?.value;
      });

    const loading = ref(false);

    store.dispatch(GET_IBCTXS, {
      page_num: 1,
      page_size: 10,
      use_count: false,
    });

    const handleTableChange = (page) => {
      pagination.current = page;
      loading.value = true;
      store
        .dispatch(GET_IBCTXS, {
          page_num: pagination.current,
          page_size: 10,
          use_count: false,
        })
        .then(() => {
          setTimeout(() => {
            loading.value = false;
          }, 1000);
        });
    };

    const tableColumns = reactive(transferTableColumn);

    const currentChain = ref('');

    const handleSelectChange = (currentSelected) => {
      console.log(currentSelected);
      console.log(currentChain);
      loading.value = true;
      store
        .dispatch(GET_IBCTXS, {
          page_num: pagination.current,
          page_size: 10,
          use_count: false,
          chain_id: currentChain.value,
          // token: '',
        })
        .then(() => {
          setTimeout(() => {
            loading.value = false;
          }, 1000);
        });
    };

    return {
      tableColumns,
      loading,
      pagination,
      handleTableChange,
      currentChain,
      handleSelectChange,
      ibcChains: computed(() => store.state.ibcChains)?.value,
      ibcDenoms: computed(() => store.state.ibcDenoms)?.value,
      ibcBaseDenoms: computed(() => store.state.ibcBaseDenoms)?.value,
      tableDatas: computed(() => store.state.ibcTxs)?.value,
      tableCount: computed(() => store.state.ibcTxsCount)?.value,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.transfer {
  width: 100%;
  max-width: 1200px;
  background-color: #ffffff;
  &__header__container {
    width: 100%;
    @include flex(row, nowrap, flex-start, center);
  }
  &__middle__container {
    width: 100%;
    @include flex(row, nowrap, flex-start, center);
  }
  &__middle {
    width: 100%;
    // height: 200px;
  }
  &__bottom {
    width: 100%;
    height: 55px;
    @include flex(row, nowrap, space-between, center);
    .status__tips {
      margin: 15px 24px;
      padding: 0 24px;
      height: 24px;
      background-color: #f8f9fc;
      border-radius: 8px;
      font-size: $font-size5;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
      color: $font-color3;
      .status__tip {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 16px 0 32px;
      }
      .status__tip__success {
        background-color: $success-color;
      }
      .status__tip__warning {
        background-color: $warning-color;
      }
      .status__tip__error {
        background-color: $error-color;
      }
    }
    .table__pagination {
      margin-right: 20px;
    }
  }
  &__header {
    margin-top: 20px;
    display: inline-block;
    &__title {
      color: #000000;
      display: inline-block;
      font-size: $font-size3;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: $nav-font-weight;
      margin-right: 10px;
      position: relative;
      top: -16px;
      z-index: 5;
    }
    &__line__dark {
      top: -16px;
      left: 5px;
      display: inline-block;
      width: 100%;
      height: 12px;
      background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, #3d50ff 100%);
      border-radius: 5px;
      position: relative;
      z-index: 1;
    }
    &__line {
      left: 5px;
      display: inline-block;
      width: 100%;
      height: 12px;
      background: linear-gradient(90deg, rgba(112, 136, 255, 0) 0%, rgba(61, 80, 255, 0.15) 100%);
      border-radius: 5px;
      position: relative;
    }
  }
}
</style>
