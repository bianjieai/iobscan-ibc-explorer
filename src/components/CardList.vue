<template>
  <div class="chainlist">
    <a-menu
      class="chainlist__menu"
      v-model:selectedKeys="currentMenu"
      mode="horizontal"
      @select="onSelectedMenu"
    >
      <a-menu-item class="chainlist__item" v-for="item of menus" :key="item.value">
        {{ item.label }}
      </a-menu-item>
    </a-menu>
    <div class="chainlist__bottom">
      <a-list class="card__list" :grid="{ gutter: 16, column: 4 }" :data-source="chainList">
        <template #renderItem="{ item }">
          <a-list-item :id="item.chain_id">
            <a-card class="menu__card">
              <img class="card__img" :src="item.icon" alt="icon" />
              <p class="card__title">{{ item.chain_name }}</p>
              <p class="card__value">{{ item.chain_id }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>

      <a-anchor :affix="false" class="list__anchor">
        <a-anchor-link href="#cosmos" title="A-E" />
        <a-anchor-link href="#componens-anchor-demo-static" title="F-J" />
        <a-anchor-link href="#components-ancho-demo-static" title="K-O" />
        <a-anchor-link href="#components-anchor-d" title="P-T" />
        <a-anchor-link href="#bitcom3" title="U-Z" />
        <a-anchor-link href="#comonents-anchor-demo-static" title="#" />
      </a-anchor>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  props: {
    chainList: Array,
  },
  setup(props, context) {
    const menus = reactive([
      {
        label: 'Active',
        value: 'active',
      },
      {
        label: 'Inactive',
        value: 'inactive',
      },
      {
        label: 'All',
        value: 'all',
      },
    ]);
    const currentMenu = ref([menus[0].value]);

    const onSelectedMenu = ({ key }) => {
      context.emit('onMenuSelected', key);
    };

    return {
      menus,
      currentMenu,
      onSelectedMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/mixin.scss";
@import "../style/variable.scss";

.chainlist {
  width: 100%;
  &__menu {
    width: 100%;
    border: 0;
    .ant-menu-item-active {
      .ant-menu-title-content {
        color: $font-color3;
      }
    }
    .ant-menu-item-selected {
      .ant-menu-title-content {
        color: $font-color1;
      }
    }
  }
  &__bottom {
    margin-top: 8px;
    width: 100%;
    @include flex(row, nowrap, flex-start, flex-start);
  }
  &__item {
    font-size: 14px;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color3;
  }
  .card__list {
    width: calc(100% - 50px);
    height: 180px;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .menu__card {
    border-radius: $card-radio;
  }
  .card__img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid rgba(#000000, 0.2);
  }
  .card__title {
    margin-top: 12px;
    font-size: $font-size4;
    font-family: Montserrat-SemiBold, Montserrat;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.75);
  }
  .card__value {
    margin-top: 6px;
    font-size: $font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color1;
  }
  .list__anchor {
    width: 50px;
  }
}
</style>
