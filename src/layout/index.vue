<template>
  <a-config-provider class="bj-root">
    <template #renderEmpty>
      <no-datas />
    </template>
    <a-layout class="layout" ref="layout">
      <a-layout-header class="header">
        <div class="header_content">
          <div class="logo" @click="onClickLogo">
            <img class="logo_icon" src="../assets/iobscan_logo.png" alt="logo" />
          </div>
          <navigation :menus="headerMenus" @clickMenu="clickMenu" :currentMenu="currentMenu" :isShowNav="isShowNav" />
          <div class="header_input_wrapper">
            <header-input class="header_input_layout" @pressedEnter="onPressEnter" disabled />
            <div class="header_input_icon_wrapper">
              <a href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
                <img class="header_input_icon" src="/src/assets/ioblink.png" alt="icon" />
              </a>
              <div class="header_btn_mobile" >
                <img src="../assets/menu_mobile.png" alt="menu icon" class="header_btn_img" @click="changeShowNav">
              </div>
            </div>
          </div>
        </div>
        <ul class="header_content_mobile" v-if="isShowNav">
            <li class="header_content_item" :class="currentIndex === index ? 'header_content_item_active': ''" v-for="(menuItem, index) in menus" @click="clickMenu(menuItem.value, index), changeShowNav()" :key="index">
                <img :style="{visibility: currentIndex === index ? 'visible' : ' hidden'}" src="../assets/tips_icon.png" alt="" class="header_menu_item_img">
                <span class="hader_content_item_label">{{menuItem.label}}</span>
            </li>
        </ul>
      </a-layout-header>

      <a-layout-content class="content" :class="isShowBackground ? 'show_background' : ''">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <ibc-footer />
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { menus } from '../constants/index.js';
import Navigation from '../components/Navigation.vue';
import HeaderInput from '../components/HeaderInput.vue';
import IbcFooter from '../components/IbcFooter.vue';
import { useStarAnimation, useOnPressEnter } from './hooks/useStarAnimation'

const isShowNav = ref(false)
const currentIndex = ref(0);
let timer1, timer2

const isShowBackground = ref(false)
const headerMenus = reactive(menus);
const currentMenu = ref([])
const router = useRouter()
const route = useRoute();
const layout = ref()

const { setStar1, setStar2 } = useStarAnimation(layout)
const { onPressEnter } = useOnPressEnter(layout)

onMounted(() => {
  // timer1 = setInterval(() => {
  //   setStar1()
  // }, 3200)
  // timer2 = setInterval(() => {
  //   setStar2()
  // }, 4200)

  currentMenu.value = [route.name];
//   currentMenu.value = getCurrentRouterNames(route);
//    document.addEventListener("click", (e) => {
//       if (e.target.className !== "header_btn_img" && e.target.className !== "ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light header_menu") {  //不是该选择器的class
//         isShowNav.value = false
//       }
//     });
  
})

const onClickLogo = () => {
  router.push({
    name: 'Home',
  });
}

const clickMenu = (val, index) => {
  // currentMenu.value = [val]
    currentIndex.value = index;
  router.push({
    name: val
  })
}

const changeShowNav = () => {
  isShowNav.value = !isShowNav.value
}

// watch(() => route.path, (newVal, oldVal) => {
//   // if (!oldVal) { // 页面刚加载
//   const temp = newVal.replace(/\//, '')
//   currentMenu.value = [temp[0].toUpperCase() + temp.substr(1)]
//   // }
//   console.log('temptemp:',temp);
// }, {
//   immediate: true
// })

router.beforeEach((r)=>{
    // currentMenu.value = [r.name];
    currentMenu.value = getCurrentRouterNames(r);
});

const getCurrentRouterNames = (r)=>{
  if (r) {
    return r?.matched[0].children.map((item)=>item.name) || [];
  }
  return [];
}

onUnmounted(() => {
  if (timer1) clearInterval(timer1)
  if (timer2) clearInterval(timer2)
})
watch(() => route.path, (newPath, oldRoute) => {
    if(newPath.includes('home')) {
        currentIndex.value = 0;
    } else if(newPath.includes('transfers')) {
        currentIndex.value = 1;
    } else if(newPath.includes('tokens')) {
        currentIndex.value = 2;
    } else if(newPath.includes('chains')) {
        currentIndex.value = 3;
    } else if(newPath.includes('channels')) {
        currentIndex.value = 4;
    } else if(newPath.includes('relayers')) {
        currentIndex.value = 5;
    }
}, {immediate: true})
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
      color: var(--bj-font-color-65);
    }
  }
}
::v-deep .ant-pagination-item {
  cursor: url(/src/assets/mouse/shiftlight_mouse.png), default;
  a{
    cursor: url("/src/assets/mouse/shiftlight_mouse.png"), default ;
  }
  &-link{
    cursor: url("/src/assets/mouse/shiftlight_mouse.png"), default ;   
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
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: transparent;
    z-index: 10;
    &_content {
        .flex(row, nowrap, space-between, center);
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
        height: 100%;
        .logo {
            width: 144px;
            .logo_icon {
                width: 100%;
                cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
            }
        }
    }
    &_input_wrapper {
        .flex(row, nowrap, space-between, center);
    }
    &_input_icon_wrapper {
        .flex(row, nowrap, space-between, center);
        margin-left: 12px;
        a {
            .flex(row, nowrap, center, center);
        }
    }
    &_input_icon {
        width: 32px;
        height: 32px;
    }
    &_btn_mobile {
        .flex(row, nowrap, center, center);
        margin-left: 12px;
        cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
        display: none;
        img {
            width: 32px;
            height: 32px;
        }
    }
    // mobile
    &_content_mobile {
        display: none;
    }
    &_content_item {
        .header_menu_item_img {
        }
    }
    &_content_item_active {
    }
  }
  & .content {
    box-sizing: border-box;
    .flex(column, nowrap, flex-start, center);
    flex: 1;
    // z-index: 10;
  }
  & .footer {
    .flex(column, nowrap, space-between, center);
    padding: 0;
    width: 100%;
    background-color: #eef0f6;
    z-index: 10;
  }
}
@media screen and (max-width: 1200px) {
    .layout {
        & .header {
            box-sizing: border-box;
            &_content {
                .logo {
                  margin-left: 32px;
                    .logo_icon {
                    }
                }
                .header_input_wrapper{
                  margin-right: 32px;
                }
            }
            &_input_wrapper {
            }
            &_input_icon_wrapper {
                a {}
            }
            &_input_icon {}
            &_btn_mobile {
                img {}
            }
            // mobile
            &_content_mobile {
                display: block;
                width: 100%;
                height: 254px;
                background-color:#0E1232;
                border-top: 4px solid #3D50FF;
                text-align: left;
            }
            &_content_item {
                padding: 0 32px;
                color: rgba(255, 255, 255, 0.65);
                font-weight: 400;
                line-height: 42px;
                .header_menu_item_img {
                    display: inline-block;
                    margin-right: 6px;
                    width: 8px;
                    height: 8px;
                }
            }
            &_content_item_active {
                color: #fff;
            }
        }
        & .content {}
        & .footer {}
    }
}
@media screen and (max-width: 1030px) {
    .layout {
        & .header {
            &_content {
              position: relative;
                .logo {
                    .logo_icon {}
                }
            }
            &_input_wrapper {
            }
            &_input_icon_wrapper {
                a {}
            }
            &_input_icon {}
            &_btn_mobile {
                display: inline-block;
                img {}
            }
            &_content_mobile {
            }
            &_content_item {
                .header_menu_item_img {
                }
            }
            &_content_item_active {
            }
        }
        & .content {}
        & .footer {}
    }
}
@media screen and (max-width: 768px) {
    .layout {
        & .header {
            &_content {
                .logo {
                  margin-left: 16px;
                    width: 136px;
                    .logo_icon {}
                }
                .header_input_wrapper{
                  margin-right: 16px;
                }
            }
            &_input_wrapper {
            }
            &_input_icon_wrapper {
                a {}
            }
            &_input_icon {}
            &_btn_mobile {
                display: inline-block;
                img {}
            }
            &_content_mobile {
            }
            &_content_item {
                padding: 0 16px;
                .header_menu_item_img {
                }
            }
            &_content_item_active {
            }
        }
        & .content {}
        & .footer {}
    }
}
@media screen and (max-width: 530px) {
    .layout {
        & .header {
            &_content {
                .logo {
                    .logo_icon {}
                }
            }
            &_input_wrapper {
            }
            &_input_layout {
                display: none;
            }
            &_input_icon_wrapper {
                a {}
            }
            &_input_icon {}
            &_btn_mobile {
                img {}
            }
        }
        & .content {}
        & .footer {}
    }
}
</style>
