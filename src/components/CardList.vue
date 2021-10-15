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
      <a-list
        class="card__list ibc__scrollbar"
        id="card__list"
        v-show="chainList[currentMenu] && chainList[currentMenu].length"
        :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
        :data-source="chainList[currentMenu]"
        ref="listRef"
      >
        <template #renderItem="{ item }">
          <a-list-item
            :class="findClassName(item.chain_id)"
            :id="`list${findClassName(item.chain_id)}`"
            class="ibc__selected__border card__list__item"
            @click="clickListItem({ type: 'chainList', value: item.chain_id })"
          >
            <a-card class="menu__card">
              <img
                class="card__img"
                :src="item.icon ? item.icon : require('../assets/placeHoder.png')"
              />
              <p class="card__title">{{ item.chain_name }}</p>
              <p class="card__value">{{ item.chain_id }}</p>
            </a-card>
          </a-list-item>
        </template>
      </a-list>

      <a-anchor
        class="list__anchor"
        :affix="false"
        :getContainer="getBindElement"
        @change="onChangeAnchor"
        v-show="chainList[currentMenu] && chainList[currentMenu].length"
      >
        <a-anchor-link
          @click.prevent.stop="() => {}"
          class="list__anchor__item"
          v-for="item of anchors"
          :key="item.title"
          :title="item.title"
          :href="`#list${item.title}`"
        />
      </a-anchor>

      <no-datas
        class="card__list"
        v-if="!chainList[currentMenu] || !chainList[currentMenu].length"
      />
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { chainMenus, anchorsDatas } from '../constant';
import NoDatas from './NoDatas.vue';

export default {
  components: {
    NoDatas,
  },
  props: {
    chainList: Object,
  },
  setup(props, context) {
    const getBindElement = ref(null);
    onMounted(() => {
      getBindElement.value = () => document.querySelector(
        '#card__list',
      );
    });
    const menus = reactive(chainMenus);
    const currentMenu = ref([menus[0].value]);

    const anchors = reactive(anchorsDatas);
    const listRef = ref(null);
    const onSelectedMenu = ({ key }) => {
      context.emit('onMenuSelected', key);
    };

    const findClassName = (chainId) => {
      const chainQuery = chainId.substr(0, 1).toUpperCase();
      let className = '';

      try {
        anchors.forEach((anchor) => {
          className = anchor.collection.indexOf(chainQuery) !== -1 ? anchor.title : '#';
          if (anchor.collection.indexOf(chainQuery) !== -1) {
            throw new Error('find className');
          }
        });
      } catch (e) {
        // console.log(e.message);
      }

      return className;
    };

    const onChangeAnchor = (title) => {
      const findItem = document.getElementsByClassName(title.replace('#', ''))[0];
      if (findItem) {
        listRef.value.$el.scrollTop = findItem.parentElement.offsetTop;
      }
    };

    const clickListItem = ({ type, value }) => {
      context.emit('clickItem', { type, value });
    };

    return {
      getBindElement,
      menus,
      currentMenu,
      anchors,
      listRef,
      findClassName,
      onSelectedMenu,
      onChangeAnchor,
      clickListItem,
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
    ::v-deep .ant-menu-title-content {
      font-size: 14px;
      font-family: Montserrat-Regular, Montserrat;
      font-weight: 400;
    }
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
    height: 182px;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .menu__card {
    border-radius: $card-radio;
    ::v-deep .ant-card-body {
      padding: 12px;
    }
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
    line-height: $font-size4;
    font-family: Montserrat-SemiBold, Montserrat;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.75);
  }
  .card__value {
    margin: 6px 0;
    font-size: $font-size5;
    line-height: $font-size5;
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: $font-color1;
  }
  .list__anchor {
    width: 50px;
  }
  .nodatas__icon {
    width: 120px;
    margin-top: 24px;
  }
  .nodatas__title {
    margin-top: 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $font-color2;
  }
}
</style>
