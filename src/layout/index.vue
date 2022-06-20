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
            <navigation :menus="headerMenus" @clickMenu="clickMenu" :currentMenu="currentMenu" />
            <div class="header_input_wrapper">
                <header-input class="header_input_layput" @pressedEnter="onPressEnter" disabled />
                <div class="header_input_icon_wrapper">
                    <a href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
                        <img class="header_input_icon" src="/src/assets/ioblink.png" alt="icon" />
                    </a>
                    <div class="header_btn_mobile">
                        <img src="../assets/menu_mobile.png" alt="menu icon">
                    </div>
                </div>
            </div>
        </div>
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
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: transparent;
    z-index: 10;
    .header_content {
        .flex(row, nowrap, space-between, center);
        margin: 0 auto;
        width: 100%;
        max-width: 1200px;
        height: 100%;
        .logo {
            width: 144px;
            .logo_icon {
                width: 100%;
            }
        }
        .header_input_wrapper {
            .flex(row, nowrap, space-between, center);
            .header_input_icon_wrapper {
                .flex(row, nowrap, space-between, center);
                margin-left: 12px;
                a {
                    .flex(row, nowrap, center, center);
                    .header_input_icon {
                        width: 32px;
                        height: 32px;
                    }
                }
                .header_btn_mobile {
                    .flex(row, nowrap, center, center);
                    margin-left: 12px;
                    cursor: url("../assets/mouse/shiftlight_mouse.png"), default !important;
                    display: none;
                    img {
                        width: 32px;
                        height: 32px;
                    }
                }
            }
        }
    }
  }
  & .content {
    box-sizing: border-box;
    .flex(column, nowrap, flex-start, center);
    flex: 1;
    z-index: 10;
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
            padding: 0 32px;
            .header_content {
                .logo {
                    .logo_icon {
                    }
                }
                .header_input_wrapper {
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {
                            }
                        }
                        .header_btn_mobile {
                            img {
                            }
                        }
                    }
                }
            }
        }
        & .content {
        }

        & .footer {
        }
    }
}

@media screen and (max-width: 1030px) {
    .layout {
        & .header {
            box-sizing: border-box;
            padding: 0 32px;
            .header_content {
                .logo {
                    .logo_icon {}
                }
                .header_input_wrapper {
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {}
                        }
                        .header_btn_mobile {
                            display: inline-block;
                            img {}
                        }
                    }
                }
            }
        }
        & .content {}
        & .footer {}
    }
}

@media screen and (max-width: 570px) {
    .layout {
        & .header {
            padding: 0 16px;
            .header_content {
                .logo {
                    width: 136px;
                    .logo_icon {}
                }
                .header_input_wrapper {
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {}
                        }
                        .header_btn_mobile {
                            img {}
                        }
                    }
                }
            }
        }
        & .content {}
        & .footer {}
    }
}
@media screen and (max-width: 460px) {
    .layout {
        & .header {
            padding: 0 16px;
            .header_content {
                .logo {
                    .logo_icon {}
                }
                .header_input_wrapper {
                    .header_input_layput {
                        display: none;
                    }
                    .header_input_icon_wrapper {
                        a {
                            .header_input_icon {}
                        }
                        .header_btn_mobile {
                            img {}
                        }
                    }
                }
            }
        }
        & .content {}
        & .footer {}
    }
}
</style>