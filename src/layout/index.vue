<template>
  <div class="bj-root">
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, VueElement } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { menus } from '../constants/index.js';
import Navigation from '../components/Navigation.vue';
import HeaderInput from '../components/HeaderInput.vue';
import IbcFooter from '../components/IbcFooter.vue';

// const iconIoblink = new URL('../assets/ioblink.png', import.meta.url).href // fix require is not defined

const isShowBackground = ref(false)
const headerMenus = reactive(menus);
const currentMenu = ref<string[]>([])
const router = useRouter()
const route = useRoute();
const layout = ref<any>(null)

onMounted(() => {
  // TODO 定时器回收

  // setInterval(() => {
  //   setStart()
  // }, 3200)
  // setInterval(() => {
  //   setStart2()
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

// TODO 部分watch逻辑


// TODO 两个setStart逻辑可以复用 / 重写
const setStart = () => {
  const removeStarContainerDom = document.getElementsByClassName('star_container')
  if (removeStarContainerDom?.length !== 0) {
    layout.value.$el.removeChild(removeStarContainerDom[0])
  }
  const starContainerDom = document.createElement('div')
  starContainerDom.className = 'star_container'
  layout.value.$el.appendChild(starContainerDom)
  const windowClientWidth = window.document.documentElement.clientWidth - 20
  const starNumber = 20
  for (let i = 0; i < starNumber; i++) {
    const createDom = document.createElement('div')
    createDom.className = 'star_content'
    const widthAndHeight = parseInt(String(Math.random() * 6))
    createDom.style.width = `${widthAndHeight}px`;
    createDom.style.height = `${widthAndHeight}px`;
    createDom.style.borderRadius = `${widthAndHeight / 2}px`;
    createDom.style.animationDelay = `1000`;
    // let leftNumber = `${parseInt(Math.random() * windowClientWidth)} px`
    createDom.style.left = `${parseInt(String(Math.random() * windowClientWidth))}px`
    createDom.style.top = `${parseInt(String(Math.random() * 320))}px`
    const appendChildStartContainerDom = document.getElementsByClassName('star_container')
    appendChildStartContainerDom[0].appendChild(createDom)

  }
};
const setStart2 = () => {
  const removeStarContainerDom = document.getElementsByClassName('star_container_2')
  if (removeStarContainerDom?.length !== 0) {
    layout.value.$el.removeChild(removeStarContainerDom[0])
  }
  const starContainerDom = document.createElement('div')
  starContainerDom.className = 'star_container_2'
  layout.value.$el.appendChild(starContainerDom)
  const windowClientWidth = window.document.documentElement.clientWidth - 20
  const starNumber = 10
  for (let i = 0; i < starNumber; i++) {
    const createDom = document.createElement('div')
    createDom.className = 'star_content_two'
    const widthAndHeight = parseInt(String(Math.random() * 10))
    createDom.style.width = `${widthAndHeight}px`;
    createDom.style.height = `${widthAndHeight}px`;
    createDom.style.borderRadius = `${widthAndHeight / 2}px`;
    createDom.style.animationDelay = `1000`;
    // let leftNumber = `${parseInt(String(Math.random() * windowClientWidth))} px`
    createDom.style.left = `${parseInt(String(Math.random() * windowClientWidth))}px`
    createDom.style.top = `${parseInt(String(Math.random() * 320))}px`
    const appendChildStartContainerDom = document.getElementsByClassName('star_container_2')
    appendChildStartContainerDom[0].appendChild(createDom)

  }
};

</script>

<style lang="less" scoped>
.bj-root {
  flex: 1;
  display: flex;
}

a {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.star_content {
  box-shadow: 0 0 0.1rem 0 rgba(229, 232, 153, 0.8);
  background: #FEFFA6;
  position: absolute;
  animation: flicker 3s ease-in-out infinite;
}

.star_content_two {
  box-shadow: 0 0 0.1rem 0 rgba(229, 232, 153, 0.8);
  background: #FEFFA6;
  position: absolute;
  animation: flicker 4s ease-in-out infinite;
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

  .star_container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    min-height: 100%;
    flex: 1;
    background: transparent;
  }

  .star_container_2 {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    min-height: 100%;
    flex: 1;
    background: transparent;
  }

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

.ant-btn {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.ant-select {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.ant-select-item {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.ant-calendar-date {
  cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
}

.col__layout {
  .flex(row, nowrap, flex-start, center);
}

.show__background {
  background-color: #F5F7FC !important;
  // background-color: transparent;
}

@media screen and (max-width: 1920px) {}

a {
  color: rgba(0, 0, 0, 0.7);

  &:hover {
    color: #3d50ff
  }
}

@keyframes flicker {
  0% {
    opacity: 0;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(2);
  }

  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>