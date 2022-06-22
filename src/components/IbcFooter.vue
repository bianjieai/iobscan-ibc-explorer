<template>
  <div class="footer_content">
    <div class="footer_content_left">
      <img class="footer_content_left_icon" v-for="item of 4" @click="onClickIcon(item)" :key="item"
        :src="`/src/assets/f${item}.png`" alt="icon" />
      Contact us !
    </div>
    <div class="footer_content_right">
      {{ copyright }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const copyright = ref('Copyright © 2022 IRIS Foundation Ltd. All Rights Reserved.');
const links = ['https://github.com/irisnet', 'https://t.me/irisnetwork', 'https://medium.com/irisnet-blog', 'https://twitter.com/irisnetwork'];
const onClickIcon = (item: number) => {
  window.open(links[item - 1]);
};

</script>

<style lang="less" scoped>
.footer_content {
    box-sizing: border-box;
    padding: 16px 0;
  width: 100%;
  max-width: 1200px;
  .flex(row, nowrap, space-between, center);

  &_left {
    font-size: @font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: @font-color2;

    &_icon {
      margin-left: 8px;
      width: 28px;
      height: 28px;
      padding: 6px;
      background-color: rgba(61, 80, 255, 0.1);
      border-radius: @card-radio;
      cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
    }
  }

  &_right {
    font-size: @font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: @font-color2;
  }
}

@media screen and (max-width: 1200px) {
    .footer_content {
        padding: 16px 32px;
        &_left {
            &_icon {
            }
        }

        &_right {
        }
    }
}
@media screen and (max-width: 768px) {
    .footer_content {
        .flex(column, nowrap, center, center);

        &_left {
            &_icon {
            }
        }

        &_right {
            margin-top: 16px;
        }
    }
}
</style>
