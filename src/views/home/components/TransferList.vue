<template>
  <div class="list">
    <a-divider style="margin: 0px; margin-bottom: 0;" />
    <div class="list_top">
      <span class="list_top_name">Latest 100 IBC Token Transfer List</span>
        <router-link :to="'/transfers'">
            <a-button class="list_top_button">View All</a-button>
        </router-link>
    </div>
    <div class="list_middle" >
      <div class="transfer_list ibc_scrollbar" v-if="transferList && transferList.length">
        <transfer-list-item
          v-for="(item, index) of transferList"
          :key="item.record_id"
          :item="item"
          :index="index"
          :isFinal="index >= transferList.length - 1"
          :ibcChains="ibcChains"
          @clickItem="clickListItem"
          @itemDidExpand="itemDidExpand"
        />
      </div>

      <no-datas class="transfer_list" v-if="!transferList || !transferList.length" />
    </div>
    <div class="list_bottom" >
      <span class="status_tips" v-if="transferList && transferList.length">
        Status:
        <span class="status_tip status_tip_success"></span> Success
        <span class="status_tip status_tip_warning"></span> Processing
        <span class="status_tip status_tip_error"></span> Failed
      </span>
    </div>
  </div>
</template>

<script setup>
import TransferListItem from './TransferListItem.vue';
import NoDatas from '../../../components/NoDatas.vue';
import { useInterfaceActive } from '../hooks/useTransferList';
const props = defineProps({
    transferList: Array,
    ibcChains: Object
})
const emits = defineEmits(['clickViewAll', 'clickItem', 'itemDidExpand'])
const { onClickViewAll, clickListItem, itemDidExpand } = useInterfaceActive(emits);

</script>

<style lang="less" scoped>
.list {
  &_top {
    width: 100%;
    .flex(row, nowrap, space-between, center);
    &_name {
      font-size: var(--bj-font-size-normal);
      font-family: Montserrat-Regular, Montserrat;
      color: var(--bj-font-color-65);
      line-height: var(--bj-font-size-normal);
      margin: 24px;
    }
    &_button {
      margin: 24px;
      height: 24px;
      line-height: 24px;
      border: 0;
      border-radius: 12px;
      background-color: #3d50ff;
      color: #ffffff;
      font-size: var(--bj-font-size-normal);
      .flex(row, nowrap, center, center);
    }
  }
  &_middle {
    width: 100%;
    height: 473px;
  }
  &_bottom {
    width: 100%;
    height: 55px;
    .flex(row, nowrap, flex-start, center);
    .status_tips {
      margin: 15px 24px;
      padding: 0 24px;
      height: 24px;
      background-color: #f8f9fc;
      border-radius: 8px;
      font-size: var(--bj-font-size-normal);
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
      color: var(--bj-text-third);
      .status_tip {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 16px 0 32px;
      }
      .status_tip_success {
        background-color: var(--bj-success);
      }
      .status_tip_warning {
        background-color: var(--bj-processing);
      }
      .status_tip_error {
        background-color: var(--bj-failed);
      }
    }
  }
}
.transfer_list {
  width: calc(100% - 48px);
  height: 100%;
  border-bottom: 1px solid rgba(#979797, 0.2);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 24px;
}
@media screen and (max-width:768px) {
    .list {
        &_top {
            &_name {
            }
            &_button {
            }
        }
        &_middle {
        }
        &_bottom {
            .status_tips {
                padding: 0 4px;
                .status_tip {
                    margin: 0 4px 0 8px;
                }
                .status_tip_success {
                }
                .status_tip_warning {
                }
                .status_tip_error {
                }
            }
        }
    }
}
</style>
