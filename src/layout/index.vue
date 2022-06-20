<template>
  <a-config-provider class="bj-root">
    <template #renderEmpty>
      <no-datas />
    </template>
    <a-layout class="layout" ref="layout">
      <a-layout-header class="header">
        <a-row class="header__content" type="flex">
          <a-col flex="160px" class="col__layout">
            <div class="logo" @click="onClickLogo">
              <img class="logo__icon" src="../assets/HeaderIcon.png" alt="logo" />
              <img class="logo__text" src="../assets/iobscan.png" alt="title" />
            </div>
          </a-col>
          <a-col flex="auto">
            <navigation :menus="headerMenus" @clickMenu="clickMenu" :currentMenu="currentMenu" />
          </a-col>
          <a-col flex="auto" class="col__layout">
            <!-- disabled can remove if have tx details -->
            <header-input @pressedEnter="onPressEnter" disabled />
            <a href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
              <img class="header__input__icon" src="/src/assets/ioblink.png" alt="icon" />
            </a>
          </a-col>
        </a-row>
      </a-layout-header>

      <a-layout-content class="content" :class="isShowBackground ? 'show__background' : ''">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <ibc-footer />
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted, reactive, Ref, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { menus } from '../constants/index.js';
import Navigation from '../components/Navigation.vue';
import HeaderInput from '../components/HeaderInput.vue';
import IbcFooter from '../components/IbcFooter.vue';
import { useStarAnimation } from './hooks/useStarAnimation'

const isShowBackground = ref(false)
const headerMenus = reactive(menus);
const currentMenu = ref<string[]>([])
const router = useRouter()
const route = useRoute();
const layout = ref<Ref>()

const { setStar1, setStar2 } = useStarAnimation(layout)

onMounted(() => {
  // TODO shan => 定时器回收 

  // setInterval(() => {
  //   setStar1()
  // }, 3200)
  // setInterval(() => {
  //   setStar2()
  // }, 4200)
})

const onClickLogo = () => {
  router.push({
    name: 'Home',
  });
}

const clickMenu = (val: string) => {
  currentMenu.value = [val]
  router.push({
    name: val
  })
}

const onPressEnter = (val: string) => {
//   console.log(val);
};

watch(() => route.path, (newVal, oldVal) => {
  if (!oldVal) { // 页面刚加载
    const temp = newVal.replace(/\//, '')
    currentMenu.value = [temp[0].toUpperCase() + temp.substr(1)]
  }
}, {
  immediate: true
})
</script>

<style lang="less" scoped>
.bj-root {
  flex: 1;
  display: flex;
}

a {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.ant-tooltip {
  max-width: 400px !important;

  .ant-tooltip-content {
    .ant-tooltip-arrow {
      .ant-tooltip-arrow-content {
        background: rgba(255, 255, 255, 1) !important;
      }
    }

    .ant-tooltip-inner {
      background: rgba(255, 255, 255, 1) !important;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}

.layout {
  width: 100%;
  background-image: url("../assets/Summer_bg.png");
  background-repeat: no-repeat;
  background-size: 1920px 396px;
  background-position: top center;
  background-color: #F5F7FC;
  flex: 1;
  position: relative;

  & .header {
    width: 100%;
    .flex(column, nowrap, center, center);
    text-align: center;
    height: 80px;
    background-color: transparent;
    z-index: 10;

    //position: fixed;
    //top: 0;
    //left: 0;
    //z-index: 100;
    & .header__content {
      width: 100%;
      max-width: 1200px;
      height: 100%;
      .flex(row, nowrap, center, center);
    }

    .logo {
      // height: 30px;
      cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;

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
      cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
    }
  }

  & .content {
    .flex(column, nowrap, flex-start, center);
    flex: 1;
    z-index: 10;

    .home {
      margin-bottom: 80px;
    }
  }

  & .footer {
    .flex(column, nowrap, flex-start, center);
    padding: 0;
    width: 100%;
    background-color: #eef0f6;
    z-index: 10;
    //position: absolute;
    //bottom: 0;
  }
}

.col__layout {
    .flex(row, nowrap, flex-start, center);
}

</style>