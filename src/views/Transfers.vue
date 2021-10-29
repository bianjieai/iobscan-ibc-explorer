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
        :options="tokens"
        :selectedSymbol="selectedSymbol.value"
        :showIcon="selectedSymbol.value !== 'All Tokens'"
        @clickItem="onClickDropdownItem"
        @clickSearch="(type, item) => onClickDropdownItem(type, item, 'customToken')"
      />

      <dropdown
        class="dropdown__token"
        :type="'chain'"
        :options="ibcChains.value?.all"
        :selectedChain="selectedChain.value"
        :showIcon="!!selectedChain.value.chain_name"
        :iconKey="'icon'"
        :titleKey="'chain_name'"
        @clickItem="onClickDropdownItem"
        @clickSearch="(type, item) => onClickDropdownItem(type, item, 'customChain')"
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

      <a-range-picker
        :value="dateRange.value"
        :disabledDate="disabledDate"
        class="date__range hover"
        :allowClear="false"
        @change="onChangeRangePicker"
        separator="-"
      >
        <template #suffixIcon>
          <svg
            style="positon:absolute; left: 10px; top: 13px; width: 18px; height: 18px;"
            t="1635216291915"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1016"
            width="200"
            height="200"
          >
            <path
              d="M291.584 633.7024h438.0672c26.2144 0 47.2576-21.504 47.2576-47.9744a47.6672 47.6672 0 0 0-47.2576-48.0256H291.584a47.616 47.616 0 0 0-47.1552 48.0256 47.616 47.616 0 0 0 47.1552 48.0256z m438.0672 74.0864H291.584a45.568 45.568 0 0 0-33.1264 13.824 49.664 49.664 0 0 0-14.0288 34.304 47.616 47.616 0 0 0 47.1552 47.9744h438.0672a45.568 45.568 0 0 0 33.1776-13.7728 49.664 49.664 0 0 0 14.08-34.2016 49.664 49.664 0 0 0-14.08-34.304 45.568 45.568 0 0 0-33.1776-13.824z m-385.536-503.7568a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.136-20.5824-49.3568-45.9264-49.3568-25.3952 0-45.9776 22.2208-45.9776 49.3568V154.624a49.8176 49.8176 0 0 0 13.2096 34.6112c8.6016 9.2672 20.3776 14.592 32.768 14.7456z m333.312 0a45.6192 45.6192 0 0 0 32.768-14.7456 49.8176 49.8176 0 0 0 13.1584-34.6112V49.3568c0-27.1872-20.5824-49.3568-45.9776-49.3568-25.344 0-45.9264 22.2208-45.9264 49.3568V154.624a49.8176 49.8176 0 0 0 13.1584 34.6112c8.6016 9.2672 20.4288 14.592 32.768 14.7456zM475.4944 150.0672h70.1952a47.616 47.616 0 0 0 47.2576-47.9744 47.6672 47.6672 0 0 0-47.2576-48.0256H475.5456a47.616 47.616 0 0 0-47.2064 48.0256 47.616 47.616 0 0 0 47.2064 47.9744z"
              p-id="1017"
              fill="#A4ABC0"
            ></path>
            <path
              d="M970.3424 102.0928a47.2064 47.2064 0 0 0-11.5712-30.4128c-0.8704-1.0752-1.2288-2.4064-2.2528-3.3792-0.8704-0.9728-2.1504-1.4336-3.1232-2.304a43.7248 43.7248 0 0 0-29.1328-12.032l-0.6144 0.1024-0.7168-0.1024H806.912a47.5648 47.5648 0 0 0-47.2064 47.9744 47.616 47.616 0 0 0 47.2064 48.0256h71.3216v157.0304H143.1552V150.0672H214.528a47.616 47.616 0 0 0 47.2576-47.9744 47.616 47.616 0 0 0-47.2576-48.0256H98.5088l-0.8192 0.1536-0.6144-0.1536a43.1104 43.1104 0 0 0-29.0816 12.032c-0.7168 0.768-2.1504 1.3312-2.8672 2.2528-1.024 0.9728-1.536 2.304-2.4064 3.328A47.872 47.872 0 0 0 51.2 102.0928l0.1024 0.6144L51.2 103.424v871.1168l0.1024 0.768L51.2 975.872c0.2048 11.264 4.3008 22.016 11.52 30.4128 0.8704 1.1264 1.28 2.3552 2.2528 3.3792 0.8704 1.024 2.0992 1.3312 3.1232 2.3552A44.6464 44.6464 0 0 0 97.28 1024l0.6656-0.1536 0.6656 0.1536h824.32c0.3072 0 0.512-0.256 0.768-0.256 0.256 0 0.512 0.256 0.768 0.256a44.288 44.288 0 0 0 37.6832-22.8352c1.536-2.3552 3.328-4.352 4.4032-6.9632 1.3824-3.584 1.6384-7.68 2.2528-11.5712 0.3584-2.2016 1.28-4.1984 1.28-6.656v-0.256c0-0.3584 0.256-0.7168 0.256-1.1264V103.3728l-0.1024-0.6656c0-0.1536 0.1536-0.3584 0.1536-0.6144zM143.1552 403.0464h735.232v524.8H143.2064V403.0464z"
              p-id="1018"
              fill="#A4ABC0"
            ></path>
          </svg>
        </template>
      </a-range-picker>

      <a-popover destroyTooltipOnHide>
        <template #content>
          <div>
            <p class="tip__color">
              Date selection range from the first IBC Transfer to the latest IBC Transfer
            </p>
          </div>
        </template>
        <img class="tip hover" style="margin-right: 16px;" src="../assets/tip.png" />
      </a-popover>
      <a-button type="primary" @click="onClickReset">
        <template #icon>
          <svg
            t="1635235094959"
            class="icon"
            viewBox="0 0 1137 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1018"
            width="20"
            height="20"
            style="margin: 3px 0 0 0;"
          >
            <path
              d="M187.443357 408.766317a400.463607 400.463607 0 0 0 84.448801 365.489861 392.957046 392.957046 0 0 0 348.315761 132.274687 56.469804 56.469804 0 0 1 62.554667 49.020112 56.754144 56.754144 0 0 1-47.769018 63.692025 505.271108 505.271108 0 0 1-447.83455-169.978092 514.824912 514.824912 0 0 1-108.61765-469.842419l-67.331569-18.197721a15.240592 15.240592 0 0 1-7.392824-24.794396l187.038455-212.572133a14.956252 14.956252 0 0 1 25.988621 6.994749l56.469804 278.425138a15.240592 15.240592 0 0 1-4.435695 14.046366 14.956252 14.956252 0 0 1-14.103234 3.639544l-67.331569-18.197721z m762.484527 206.089195a400.463607 400.463607 0 0 0-84.448801-365.489861 392.957046 392.957046 0 0 0-348.315761-132.274687 56.185465 56.185465 0 0 1-52.716525-21.439191 57.265955 57.265955 0 0 1-7.392824-56.811011 56.469804 56.469804 0 0 1 45.380568-34.461935 505.271108 505.271108 0 0 1 447.777682 169.978091 514.824912 514.824912 0 0 1 108.61765 469.842419l67.331569 18.197722a15.240592 15.240592 0 0 1 7.392824 24.794395l-187.038455 212.572133a14.956252 14.956252 0 0 1-25.988621-6.994749l-56.469804-278.425137a15.240592 15.240592 0 0 1 4.435694-14.046366 14.956252 14.956252 0 0 1 14.103234-3.639545l67.33157 18.197722z"
              p-id="1019"
              fill="#ffffff"
            ></path>
          </svg>
          <!-- <img style="width: 20px;" src="../assets/reset.png" /> -->
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
      :customRow="onClickTableRow"
    >
      <template #customTitle>
        <p>
          Token
          <a-popover destroyTooltipOnHide>
            <template #content>
              <div>
                <p class="tip__color">Sended Token</p>
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
              <p class="tip__color">Sended Token: {{ record.symbolDenom || "--" }}</p>
              <p class="tip__color">Recived Token: {{ record.denoms.dc_denom || "--" }}</p>
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
              <p class="tip__color">{{ record.sc_tx_info.hash }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.sc_tx_info.hash, 4, 4) }}</span>
        </a-popover>
      </template>
      <template #out="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p class="tip__color">{{ record.sc_addr }}</p>
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
              <p class="tip__color">Chain ID：{{ record.sc_chain_id || "--" }}</p>
              <p class="tip__color">Channel ID: {{ record.sc_channel || "--" }}</p>
              <p class="tip__color">Sequence: {{ record.sequence || "--" }}</p>
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
              <p class="tip__color">Chain ID：{{ record.dc_chain_id || "--" }}</p>
              <p class="tip__color">Channel ID: {{ record.dc_channel || "--" }}</p>
              <p class="tip__color">Sequence: {{ record.sequence || "--" }}</p>
            </div>
          </template>
          <img class="status__icon hover" :src="findIbcChainIcon(record.dc_chain_id)" />
        </a-popover>
      </template>
      <template #hashIn="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p class="tip__color">{{ record.dc_tx_info.hash || "--" }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.dc_tx_info.hash, 4, 4) || "--" }}</span>
        </a-popover>
      </template>
      <template #in="{ record }">
        <a-popover destroyTooltipOnHide>
          <template #content>
            <div>
              <p class="tip__color">{{ record.dc_addr || "--" }}</p>
            </div>
          </template>
          <span class="hover">{{ getRestString(record.dc_addr, 3, 8) || "--" }}</span>
        </a-popover>
      </template>
      <template #time="{ record }">
        <span>{{ moment(record.tx_time * 1000).format("yyyy-MM-DD HH:mm:ss") }}</span>
      </template>
    </a-table>

    <div class="transfer__bottom" v-if="tableCount.value">
      <span class="status__tips">
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
import { message } from 'ant-design-vue';
import {
  ref, reactive, computed, onBeforeUnmount, h,
} from 'vue';
import { useStore } from 'vuex';
import { groupBy } from 'lodash';
import moment from 'moment';
import { GET_IBCTXS } from '../store/action-types';
import { transferTableColumn, ibcTxStatusSelectOptions } from '../constant';
import Dropdown from '../components/Dropdown.vue';
import Message from '../components/Message.vue';
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
    const tokens = reactive(groupBy(computed(() => store.state.ibcDenoms).value.value, 'symbol'));

    const queryParam = reactive({
      date_range: [0, Math.floor(new Date().getTime() / 1000)],
      status: [1, 2, 3, 4],
      chain_id: undefined,
      symbol: undefined,
      denom: undefined,
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

    const onClickTableRow = () => ({
      onClick: () => {
        message.info({
          content: h(Message),
          icon: h('div'),
        });
      },
    });

    const onPaginationChange = (page) => {
      if (loading.value) return;
      pagination.current = page;
      queryDatas();
    };

    const tableColumns = reactive(transferTableColumn);

    const selectedSymbol = reactive({ value: 'All Tokens' });
    const selectedChain = reactive({
      value: {
        chain_name: undefined,
      },
    });
    const onClickDropdownItem = (type, item, custom) => {
      pagination.current = 1;
      switch (type) {
        case 'chain':
          selectedChain.value = custom
            ? {
              chain_name: item.chain_id,
            }
            : {
              ...item,
              chain_name: item.chain_name || undefined,
            };
          queryParam.chain_id = item.chain_id;
          queryDatas();
          break;
        case 'token':
          selectedSymbol.value = item || 'All Tokens';
          if (item === 'All Tokens') {
            queryParam.symbol = undefined;
          } else if (custom) {
            if (item && item.length && item.length > 8) {
              selectedSymbol.value = getRestString(item, 4, 4);
            }
            queryParam.symbol = undefined;
            queryParam.denom = item ? `ibc/${item.toUpperCase()}` : undefined;
          } else {
            queryParam.symbol = item;
            queryParam.denom = undefined;
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

    const dateRange = reactive({ value: [] });
    const onChangeRangePicker = (dates) => {
      dateRange.value = dates;
      queryParam.date_range[0] = Math.floor(moment(dates[0]).valueOf() / 1000);
      queryParam.date_range[1] = Math.floor(moment(dates[1]).valueOf() / 1000);
      queryDatas();
    };
    const disabledDate = (current) => current && current > moment().endOf('day');

    const onClickReset = () => {
      selectedChain.value = {
        chain_name: undefined,
      };
      selectedSymbol.value = 'All Tokens';
      dateRange.value = [];
      queryParam.date_range = [0, Math.floor(new Date().getTime() / 1000)];
      queryParam.status = [1, 2, 3, 4];
      queryParam.chain_id = undefined;
      queryParam.symbol = undefined;
      queryParam.denom = undefined;
      pagination.current = 1;
      queryDatas();
    };

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

    onBeforeUnmount(() => {
      clearInterval(computed(() => store.state.ibcTxTimer)?.value);
    });

    return {
      tableColumns,
      loading,
      pagination,
      onPaginationChange,
      onClickDropdownItem,
      selectedSymbol,
      selectedChain,
      ibcTxStatusSelectOptions,
      handleSelectChange,
      onChangeRangePicker,
      dateRange,
      disabledDate,
      onClickReset,
      queryParam,
      ibcChains,
      tokens,
      onClickTableRow,
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
  background-color: #f5f7fc;
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
      font-size: $font-size3;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: $nav-font-weight;
      margin-right: 10px;
      position: relative;
      top: -16px;
      z-index: 5;
      @include flex(row, nowrap, flex-start, center);
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
  width: 140px;
  margin-right: 8px;
}
.date__range {
  font-family: Montserrat-Regular, Montserrat;
  margin-right: 8px;
  width: 250px;
}
.tip {
  width: 20px;
  &__color {
    color: $font-color2;
  }
}
.hover {
  cursor: pointer;
}
p {
  font-family: Montserrat-Regular, Montserrat;
}
</style>
