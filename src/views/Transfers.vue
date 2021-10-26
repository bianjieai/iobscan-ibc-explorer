<template>
  <div class="transfer">
    <!-- <statistic-list type="horizontal" :msg="ibcStatisticsTxs" /> -->
    <div class="transfer__header__container">
      <div class="transfer__header">
        <div class="transfer__header__line">
          <p class="transfer__header__title">
            IBC Token Transfer List
            <span class="transfer__header__num"> ( {{ tableCount.value }} transfers found )</span>
          </p>
        </div>
      </div>
    </div>

    <div class="transfer__middle__container">
      <dropdown
        class="dropdown__token"
        :type="'token'"
        :ibcBaseDenoms="ibcBaseDenoms"
        buttonTitle="REGEN"
        :options="tokens"
        :selectedToken="selectedToken.value"
        @clickItem="onClickDropdownItem"
        @clickSearch="onClickDropdownItem"
      />

      <dropdown
        class="dropdown__token"
        :type="'chain'"
        buttonTitle="All Chains"
        :options="ibcChains.value?.all"
        :selectedChain="selectedChain.value"
        :itemKey="'chain_id'"
        :iconKey="'icon'"
        :titleKey="'chain_name'"
        @clickItem="onClickDropdownItem"
        @clickSearch="onClickDropdownItem"
      />

      <a-select
        class="status__select"
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

      <a-range-picker class="date__range hover" :allowClear="false" @change="onChangeRangePicker" />

      <a-popover destroyTooltipOnHide>
        <template #content>
          <div>
            <p>Date selection range from the first IBC Transfer to the latest IBC Transfer</p>
          </div>
        </template>
        <img class="tip hover" style="margin-right: 16px;" src="../assets/tip.png" />
      </a-popover>
      <a-button type="primary" @click="onClickReset">
        <template #icon>
          <img style="width: 20px;" src="../assets/reset.png" />
        </template>
      </a-button>
    </div>

    <a-table
      class="transfer__table"
      style="width: 100%"
      :rowKey="record => record.record_id"
      :columns="tableColumns"
      :loading="loading"
      :data-source="tableDatas.value"
      :pagination="false"
    >
      <template #customTitle>
        <p>
          Token
          <a-popover destroyTooltipOnHide>
            <template #content>
              <div>
                <p>Sended Token</p>
              </div>
            </template>
            <img class="tip hover" style="margin-left: 8px;" src="../assets/tip.png" />
          </a-popover>
        </p>
      </template>
      <template class="token" #token="{ record }">
        <a-popover placement="right" destroyTooltipOnHide>
          <template #content>
            <div>
              <p>Sended Token: {{ record.symbolDenom || "--" }}</p>
              <p>Recived Token: {{ record.denoms.dc_denom || "--" }}</p>
            </div>
          </template>
          <img class="token__icon hover" :src="record.symbolIcon || placeHoderImg" />
          <span class="token__num hover">{{ formatNum(record.symbolNum) }}</span>
          <span class="token__denom hover">{{ record.symbolDenom }}</span>
        </a-popover>
      </template>
      <template #hashOut="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p>{{ record.sc_tx_info.hash }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.sc_tx_info.hash, 4, 4) }}</span>
        </a-popover>
      </template>
      <template #out="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p>{{ record.sc_addr }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.sc_addr, 3, 8) }}</span>
        </a-popover>
      </template>
      <template #status="{ record }">
        <!-- <span>{{ record.status }}</span> -->
        <a-popover placement="right" destroyTooltipOnHide>
          <template #content>
            <div>
              <p>Chain ID：{{ record.sc_chain_id || "--" }}</p>
              <p>Channel ID: {{ record.sc_channel || "--" }}</p>
              <p>Sequence: {{ record.sequence || "--" }}</p>
            </div>
          </template>
          <img class="status__icon hover" :src="findIbcChainIcon(record.sc_chain_id)" />
        </a-popover>
        <img
          class="status__icon"
          style="margin: 0 24px;"
          :src="require(`../assets/status${record.status}.png`)"
        />
        <a-popover placement="right" destroyTooltipOnHide>
          <template #content>
            <div>
              <p>Chain ID：{{ record.dc_chain_id || "--" }}</p>
              <p>Channel ID: {{ record.dc_channel || "--" }}</p>
              <p>Sequence: {{ record.sequence || "--" }}</p>
            </div>
          </template>
          <img class="status__icon hover" :src="findIbcChainIcon(record.dc_chain_id)" />
        </a-popover>
      </template>
      <template #hashIn="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p>{{ record.dc_tx_info.hash || "--" }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.dc_tx_info.hash, 4, 4) || "--" }}</span>
        </a-popover>
      </template>
      <template #in="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p>{{ record.dc_addr || "--" }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.dc_addr, 3, 8) || "--" }}</span>
        </a-popover>
      </template>
      <template #time="{ record }">
        <span>{{ record.tx_time }}</span>
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
import { JSONparse, getRestString, formatNum } from '../helper/parseString';
import placeHoderImg from '../assets/placeHoder.png';

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
      if (loading.value) return;
      pagination.current = page;
      queryDatas();
    };

    const tableColumns = reactive(transferTableColumn);

    const selectedToken = reactive({ value: 'REGEN' });
    const selectedChain = reactive({ value: 'All Chains' });
    const onClickDropdownItem = (type, item) => {
      pagination.current = 1;
      switch (type) {
        case 'chain':
          selectedChain.value = item || 'All Chains';
          queryParam.chain_id = item;
          queryDatas();
          break;
        case 'token':
          selectedToken.value = item || 'REGEN';
          if (item === unAuthed) {
            queryParam.token = computed(() => store.state.ibcDenoms)
              .value.value.filter((subItem) => !subItem.auth)
              .map((subItem) => subItem.denom);
          } else if (tokens[item]) {
            queryParam.token = tokens[item].map((subItem) => subItem.denom);
          } else if (item) {
            queryParam.token = [item];
          } else {
            queryParam.token = undefined;
          }
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

    const onClickReset = () => {
      queryParam.date_range = [0, Math.floor(new Date().getTime() / 1000)];
      queryParam.status = [1, 2, 3, 4];
      queryParam.chain_id = undefined;
      queryParam.token = undefined;
      pagination.current = 1;
      queryDatas();
    };

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

    onBeforeUnmount(() => {
      clearInterval(computed(() => store.state.ibcTxTimer)?.value);
    });

    return {
      tableColumns,
      loading,
      pagination,
      onPaginationChange,
      onClickDropdownItem,
      selectedToken,
      selectedChain,
      ibcTxStatusSelectOptions,
      handleSelectChange,
      onChangeRangePicker,
      onClickReset,
      queryParam,
      ibcChains,
      tokens,
      ibcDenoms: computed(() => store.state.ibcDenoms)?.value,
      ibcBaseDenoms: computed(() => store.state.ibcBaseDenoms)?.value,
      tableDatas: computed(() => store.state.ibcTxs)?.value,
      tableCount: computed(() => store.state.ibcTxsCount)?.value,
      moment,
      findIbcChainIcon,
      placeHoderImg,
      getRestString,
      formatNum,
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
  background-color: #F5F7FC;
  padding-top: 40px;
  &__header__container {
    width: 100%;
    @include flex(row, nowrap, flex-start, center);
  }
  &__middle__container {
    width: 100%;
    @include flex(row, nowrap, flex-start, center);
    margin-bottom: 16px;
    .dropdown {
      &__token {
        margin-right: 16px;
      }
    }
  }
  &__middle {
    width: 100%;
    // height: 200px;
  }
  &__table {
    font-size: 14px;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    ::v-deep .ant-table-placeholder {
      min-height: 500px;
      @include flex(column, nowrap, center, center);
    }
    .token {
      &__icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin-right: 8px;
        cursor: pointer;
      }
      &__num {
        cursor: pointer;
        font-size: $font-size5;
        color: $font-color5;
        margin-right: 4px;
      }
      &__denom {
        cursor: pointer;
        font-size: $font-size5;
        color: $font-color3;
      }
    }
    .status__icon {
      width: 22px;
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
    background-color: #ffffff;
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
    &__num {
      margin-left: 12px;
      font-size: $font-size5;
      color: $font-color2;
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
  width: 124px;
  margin-right: 8px;
}
.date__range {
  font-family: Montserrat-Regular, Montserrat;
  margin-right: 8px;
}
.tip {
  width: 20px;
}
.hover {
  cursor: pointer;
}
p {
  font-family: Montserrat-Regular, Montserrat;
}
</style>
