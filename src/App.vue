<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <a-row class="header__content" type="flex">
        <a-col flex="160px" class="col__layout">
          <div class="logo" @click="onClickLogo">
            <img class="logo__icon" src="./assets/HeaderIcon.png" alt="logo" />
            <img class="logo__text" src="./assets/iobscan.png" alt="title" />
          </div>
        </a-col>
        <a-col flex="auto">
          <navigation :menus="headerMenus" @clickMenu="clickMenu" />
        </a-col>
        <a-col flex="auto" class="col__layout">
          <header-input @pressedEnter="onPressEnter" />
          <img
            class="header__input__icon"
            :src="require('./assets/ioblink.png')"
            alt="icon"
            @click="onClickLogo"
          />
        </a-col>
      </a-row>
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="footer">
      <ibc-footer />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { menus } from './constant';
import Navigation from './components/Navigation.vue';
import HeaderInput from './components/HeaderInput.vue';
import IbcFooter from './components/IbcFooter.vue';

export default {
  components: {
    Navigation,
    HeaderInput,
    IbcFooter,
  },
  setup() {
    const headerMenus = reactive(menus);

    const onClickLogo = () => {
      window.open('https://www.iobscan.io');
    };
    const onPressEnter = (val) => {
      console.log(val);
    };
    const clickMenu = (val) => {
      if (val !== 'Home') {
        message.info('noData');
      }
    };
    return {
      headerMenus,
      onClickLogo,
      onPressEnter,
      clickMenu,
    };
  },
};
</script>

<style lang="scss">
@import "./style/index.css";
@import "./style/mixin.scss";
@import "./style/variable.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
}
.layout {
  width: 100%;
  background-image: url("./assets/banner.png");
  background-repeat: no-repeat;
  background-size: 1920px 396px;
  background-position: top center;
  & .header {
    @include flex(column, nowrap, center, center);
    text-align: center;
    height: 80px;
    background-color: transparent;
    & .header__content {
      width: 100%;
      max-width: 1200px;
      height: 100%;
    }
    .logo {
      // height: 30px;
      cursor: pointer;
      .logo__icon {
        width: 34px;
        margin-right: 10px;
      }
      .logo__text {
        width: 100px;
      }
    }
    &__input__icon {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-left: 24px;
      cursor: pointer;
    }
  }
  & .content {
    @include flex(column, nowrap, flex-start, center);
    padding-bottom: 80px;
  }
  & .footer {
    @include flex(column, nowrap, flex-start, center);
    padding: 0;
    background-color: #eef0f6;
  }
}
.col__layout {
  @include flex(row, nowrap, flex-start, center);
}
@media screen and (max-width: 1920px) {
}
</style>
