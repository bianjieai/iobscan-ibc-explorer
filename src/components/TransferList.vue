<template>
  <div class="list">
    <a-divider style="margin: 0px; margin-bottom: 0;" />
    <div class="list__top">
      <span class="list__top__name">Latest 100 IBC Token Transfer List</span>
      <a-button class="list__top__button" @click="onClickViewAll">View All</a-button>
    </div>
    <div class="list__middle" >
      <div class="transfer__list ibc__scrollbar" v-if="transferList && transferList.length">
        <transfer-list-item
          v-for="(item, index) of transferList"
          :key="item.record_id"
          :item="item"
          :index="index"
          :isFinal="index >= transferList.length - 1"
          @clickItem="clickListItem"
        />
      </div>

      <no-datas class="transfer__list" v-if="!transferList || !transferList.length" />
    </div>
    <div class="list__bottom" >
      <span class="status__tips" v-if="transferList && transferList.length">
        Status:
        <span class="status__tip status__tip__success"></span> Success
        <span class="status__tip status__tip__warning"></span> Processing
        <span class="status__tip status__tip__error"></span> Failed
      </span>
    </div>
  </div>
</template>

<script>
import TransferListItem from './TransferListItem.vue';
import NoDatas from './NoDatas.vue';

export default {
  components: {
    TransferListItem,
    NoDatas,
  },
  props: {
    transferList: Array,
  },
  setup(props, context) {
    const onClickViewAll = () => {
      context.emit('clickViewAll');
    };

    const clickListItem = (item) => {
      context.emit('clickItem', item);
    };

    return {
      onClickViewAll,
      clickListItem,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.list {
  &__top {
    width: 100%;
    @include flex(row, nowrap, space-between, center);
    &__name {
      font-size: $font-size5;
      font-family: Montserrat-Regular, Montserrat;
      color: $font-color2;
      line-height: $font-size5;
      margin: 24px;
    }
    &__button {
      margin: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 12px;
      background-color: #3d50ff;
      color: #ffffff;
      font-size: $font-size5;
      @include flex(row, nowrap, center, center);
    }
  }
  &__middle {
    width: 100%;
    height: 473px;
  }
  &__bottom {
    width: 100%;
    height: 55px;
    @include flex(row, nowrap, flex-start, center);
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
  }
}
.transfer__list {
  width: calc(100% - 48px);
  height: 100%;
  border-bottom: 1px solid rgba(#979797, 0.2);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 24px;
}
</style>
