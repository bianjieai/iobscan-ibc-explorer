<template>
  <div class="card ibc__selected__title">
    <img
      class="card__img"
      :src="
        require(msg.statistics_name.indexOf('24') !== -1
          ? '../assets/chains_24hr.png'
          : '../assets/chains_all.png')
      "
      alt="chains_all"
    />
    <div class="card__content">
      <span class="card__content__name"
        >{{ statisticsName[msg.statistics_name]
        }}<span v-if="msg.statistics_name.indexOf('24') !== -1" class="card__content__tip"
          >24hr</span
        ></span
      >
      <span class="card__content__value">{{ msg.count }}</span>
    </div>
  </div>
</template>

<script>
import { statisticsName } from '../constant';

export default {
  props: {
    msg: Object,
  },
  setup() {
    return {
      statisticsName,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.card {
  @include flex(row, nowrap, flex-start, center);
  width: 360px;
  height: 108px;
  background-image: url("../assets/card.png");
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  cursor:pointer !important;
  &__img {
    margin: 23px 29px;
    width: 60px;
  }
  &__content {
    @include flex(column, nowrap, flex-start, flex-start);
    &__name {
      font-size: $font-size4;
      font-family: Montserrat-Regular, Montserrat;
      color: $font-color2;
      line-height: $font-size4;
      margin-bottom: 16px;
    }
    &__value {
      font-size: $font-size2;
      font-family: Montserrat-Regular, Montserrat;
      color: $font-color1;
      line-height: $font-size2;
      transition: color 0.3s;
      transition-timing-function: ease;
    }
    &__tip {
      margin-left: 8px;
      padding: 0 4px;
      font-size: $font-size6;
      font-family: Montserrat-Regular, Montserrat;
      color: #3d50ff;
      line-height: $font-size6;
      background: rgba(61, 80, 255, 0.15);
      border-radius: 7px;
    }
  }
}
</style>
