<template>
    <div class="card ibc_selected_title">
        <img class="card_img" :src="msg.statistics_name.indexOf(dayTime) !== -1
          ? chains24hrImg
          : chainsAllImg" alt="chains_all">
        <div class="card_content">
            <span class="card_content_name">
                {{statisticsName[msg.statistics_name]}}
                <span v-if="msg.statistics_name.indexOf(dayTime) !== -1" class="card_content_tip">24hr</span>
            </span>
            <span class="card_content_value">{{ `${formatBigNumber(msg.count)}` }}</span>
        </div>
    </div>
</template>

<script setup>
import chains24hrImg from '../../../assets/chains_24hr.png';
import chainsAllImg from '../../../assets/chains_all.png';
import {statisticsName} from '../../../constants/index';
import {formatBigNumber} from '../../../helper/parseString';
import {dayTime} from '../../../constants';

const props = defineProps({
    msg: Object
})
</script>

<style lang="less" scoped>
.card {
  .flex(row, nowrap, flex-start, center);
  width: 360px;
  height: 108px;
  background-image: url("../../../assets/card.png");
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  cursor: pointer;
  &_img {
    margin: 23px 29px;
    width: 60px;
  }
  &_content {
    .flex(column, nowrap, flex-start, flex-start);
    &_name {
      font-size: @font-size4;
      font-family: Montserrat-Regular, Montserrat;
      color: @font-color2;
      line-height: @font-size4;
      margin-bottom: 16px;
    }
    &_value {
      font-size: @font-size2;
      font-family: Montserrat-Regular, Montserrat;
      color: @font-color1;
      line-height: @font-size2;
      transition: color 0.3s ease;
    }
    &_tip {
      margin-left: 8px;
      padding: 0 4px;
      font-size: @font-size6;
      font-family: Montserrat-Regular, Montserrat;
      color: #3d50ff;
      line-height: @font-size6;
      background: rgba(61, 80, 255, 0.15);
      border-radius: 7px;
    }
  }
}
</style>