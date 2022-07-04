<template>
  <a-menu
    class="header_menu"
    :selectedKeys="currentMenu"
    mode="horizontal"
    @click="clickMenuItem"
  >
    <!-- :class="isShowNav?'header_menu': 'header_menu_hide header_menu'" -->
    <a-menu-item class="header_menu_item" v-for="item of menus" :key="item.value">
      {{ item.label }}
    </a-menu-item>
  </a-menu>
</template>

<script>
import { reactive, onBeforeUnmount } from 'vue';

export default {
  props: {
    menus: Array,
    currentMenu: Array,
    isShowNav:Boolean
  },
  setup(props, context) {
    const timeOuter = reactive({ value: null });
    const clickMenuItem = ({ key }) => {
      context.emit('clickMenu', key);
    //   const el = document.getElementsByClassName('header_menu_item_img');
    //     for(let i = 0; i < el.length; i++) {
    //         console.log(el[i]);
    //         el[i].style.visibility = 'hidden';
    //     }
    };
    onBeforeUnmount(() => {
      clearTimeout(timeOuter.value);
    });

    return {
      clickMenuItem,
    };
  },
};
</script>

<style lang="less">

.header_menu {
    flex: 1;
    .flex(row, nowrap, center, center);
  height: @nav-height;
  line-height: @nav-height;
  background-color: transparent;
  border: 0;
  &_item {
    width: 110px;
    padding: 0 !important;
    text-align: center;
  }
  .ant-menu-item {
    line-height: @nav-height;
    &:hover{
        cursor: url("../assets/mouse/shiftlight_mouse.png"),default !important;
    }
  }
  .ant-menu-title-content {
    font-size: @font-size4;
    color: rgba(#ffffff, 0.65);
    font-weight: @nav-font-weight;
    font-family: Montserrat-Regular, Montserrat;
  }
  .ant-menu-item-selected {
    background-image: url("../assets/NavSelected.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 90%;
    .ant-menu-title-content {
      color: #ffffff !important;
    }
    &::after {
      display: none;
    }
  }
  .ant-menu-item-active {
    background-image: url("../assets/NavSelected.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 90%;
    .ant-menu-title-content {
      color: #ffffff !important;
    }
    &::after {
      display: none;
    }
  }
  .header_menu_item_img{
    display: none;
  }
}

@media screen and (max-width: 1200px) {
    .header_menu {
        &_item {
            width: 90px;
        }
    }
}
@media screen and (max-width: 1030px) {
    .header_menu {
        display: none;
    }
    // .ant-menu-item-selected{
    //   background-image: none !important;
    //   .header_menu_item_img{
    //     visibility: visible;
    //     }
    // }
    // .ant-menu-item-active {
    //   background-image: none !important;
    // }
}
@media screen and (max-width: 768px){
//   .header_menu_item{
//     margin-left: 16px;
//   }
}
</style>
