<template>
  <a-menu class="header__menu" v-model:selectedKeys="currentMenu" mode="horizontal">
    <a-menu-item class="header__menu__item" v-for="item of menus" :key="item.value">
      {{ item.label }}
    </a-menu-item>
  </a-menu>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    menus: Array,
  },
  setup(props) {
    const currentMenu = ref([props.menus[0].value]);
    return {
      currentMenu,
    };
  },
};
</script>

<style lang="scss">
@import "../style/variable.scss";

.header__menu {
  height: $nav-height;
  line-height: $nav-height;
  background-color: transparent;
  border: 0;
  &__item {
    width: 120px;
    text-align: center;
  }
  .ant-menu-item {
    line-height: $nav-height;
  }
  .ant-menu-title-content {
    font-size: $font-size4;
    color: rgba(#ffffff, 0.65);
    font-weight: $nav-font-weight;
  }
  .ant-menu-item-selected {
    background-image: url("../assets/NavSelected.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 30% center;
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
    background-position: 30% center;
    .ant-menu-title-content {
      color: #ffffff !important;
    }
    &::after {
      display: none;
    }
  }
}
</style>
