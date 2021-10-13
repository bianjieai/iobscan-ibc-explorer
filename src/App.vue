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
            @click="onClickIcon"
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
import { reactive, h } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { menus, iobscanUrl } from './constant';
import Navigation from './components/Navigation.vue';
import HeaderInput from './components/HeaderInput.vue';
import IbcFooter from './components/IbcFooter.vue';
import Message from './components/Message.vue';
import {
  GET_IBCSTATISTICS,
  GET_IBCDENOMS,
  GET_IBCBASEDENOMS,
  GET_IBCCHAINS,
} from './store/action-types';

export default {
  components: {
    Navigation,
    HeaderInput,
    IbcFooter,
  },
  setup() {
    const store = useStore();
    store.dispatch(GET_IBCSTATISTICS);
    store.dispatch(GET_IBCDENOMS);
    store.dispatch(GET_IBCBASEDENOMS);
    store.dispatch(GET_IBCCHAINS);

    const router = useRouter();

    const headerMenus = reactive(menus);
    const onClickLogo = () => {
      router.push({
        name: 'Home',
      });
    };
    const onClickIcon = () => {
      window.open(iobscanUrl);
    };
    const onPressEnter = (val) => {
      console.log(val);
    };
    const clickMenu = (val) => {
      switch (val) {
        case 'Home':
          router.push({
            name: 'Home',
          });
          break;
        // case 'Transfers':
        //   router.push({
        //     name: 'Transfers',
        //   });
        //   break;
        default:
          message.info({
            content: h(Message),
            icon: h('div'),
          });
          break;
      }
    };
    return {
      headerMenus,
      onClickLogo,
      onClickIcon,
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
      @include flex(row, nowrap, center, center);
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
