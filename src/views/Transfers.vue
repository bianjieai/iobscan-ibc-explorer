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
        :options="tokens"
        @clickItem="item => onClickDropdownItem('token', item)"
      />

      <dropdown
        :type="'chain'"
        buttonTitle="All Chains"
        :options="ibcChains.value?.all"
        :itemKey="'chain_id'"
        :iconKey="'icon'"
        :titleKey="'chain_name'"
        @clickItem="item => onClickDropdownItem('chain', item)"
      />

      <a-select
        class="status__select"
        style="width: 124px"
        defaultActiveFirstOption
        :value="JSON.stringify(queryParam.status)"
        @change="handleSelectChange"
      >
        <a-select-option
          v-for="item of ibcTxStatusSelectOptions"
          :key="item.title"
          :value="item.value"
          >{{ item.title }}</a-select-option
        >
      </a-select>
        <!-- :show-time="{
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
        }" -->
      <a-range-picker
        :allowClear="false"
        @change="onChangeRangePicker"
      />
    </div>

    <a-table
      class="transfer__table"
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
        @change="onPaginationChange"
      />
    </div>
  </div>
</template>

<script>
import {
  ref, reactive, computed, onBeforeUnmount,
} from 'vue';
import { useStore } from 'vuex';
import { groupBy } from 'lodash';
import moment from 'moment';
import { GET_IBCTXS } from '../store/action-types';
import { transferTableColumn, unAuthed, ibcTxStatusSelectOptions } from '../constant';
import Dropdown from '../components/Dropdown.vue';
import { JSONparse } from '../helper/parseString';

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
    const tokens = reactive(
      groupBy(
        computed(() => store.state.ibcDenoms).value.value.filter((item) => item.auth),
        'base_denom',
      ),
    );

    const queryParam = reactive({
      date_range: [0, Math.floor(new Date().getTime() / 1000)],
      status: [1, 2, 3, 4],
      chain_id: undefined,
      token: undefined,
    });

    const loading = ref(false);

    const queryDatas = () => {
      loading.value = true;
      store
        .dispatch(GET_IBCTXS, {
          use_count: true,
          ...queryParam,
        })
        .then(() => {
          pagination.total = computed(() => store.state.ibcTxsCount).value?.value;
        });
      store
        .dispatch(GET_IBCTXS, {
          page_num: pagination.current,
          page_size: pagination.pageSize,
          use_count: false,
          ...queryParam,
        })
        .then(() => {
          setTimeout(() => {
            loading.value = false;
          }, 1000);
        });
    };

    queryDatas();

    const onPaginationChange = (page) => {
      pagination.current = page;
      queryDatas();
    };

    const tableColumns = reactive(transferTableColumn);

    const onClickDropdownItem = (type, item) => {
      pagination.current = 1;
      switch (type) {
        case 'chain':
          queryParam.chain_id = item.chain_id;
          queryDatas();
          break;
        case 'token':
          queryParam.token = item === unAuthed
            ? computed(() => store.state.ibcDenoms)
              .value.value.filter((subItem) => !subItem.auth)
              .map((subItem) => subItem.denom)
            : tokens[item].map((subItem) => subItem.denom);

          queryDatas();
          break;
        default:
          break;
      }
    };

    const handleSelectChange = (item) => {
      queryParam.status = JSONparse(item);
      queryDatas();
    };

    const onChangeRangePicker = (dates) => {
      queryParam.date_range[0] = Math.floor(moment(dates[0]).valueOf() / 1000);
      queryParam.date_range[1] = Math.floor(moment(dates[1]).valueOf() / 1000);
      queryDatas();
    };

    onBeforeUnmount(() => {
      clearInterval(computed(() => store.state.ibcTxTimer)?.value);
    });

    return {
      tableColumns,
      loading,
      pagination,
      onPaginationChange,
      onClickDropdownItem,
      ibcTxStatusSelectOptions,
      handleSelectChange,
      onChangeRangePicker,
      queryParam,
      ibcChains: computed(() => store.state.ibcChains)?.value,
      tokens,
      ibcDenoms: computed(() => store.state.ibcDenoms)?.value,
      ibcBaseDenoms: computed(() => store.state.ibcBaseDenoms)?.value,
      tableDatas: computed(() => store.state.ibcTxs)?.value,
      tableCount: computed(() => store.state.ibcTxsCount)?.value,
      moment,
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
  &__table {
    ::v-deep .ant-table-placeholder {
      min-height: 500px;
      @include flex(column, nowrap, center, center);
    }
    // ::v-deep .ant-table-tbody {
    //   height: 500px;
    //   .ant-table-row {
    //     height: 55px !important;
    //   }
    // }
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
.status__select {
  font-family: Montserrat-Regular, Montserrat;
}
</style>
