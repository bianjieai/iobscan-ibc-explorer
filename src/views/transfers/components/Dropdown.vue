<template> 
  <a-dropdown
    :trigger="['click']"
    :placement="'bottomLeft'"
    :visible="isVisible"
    @visibleChange="visibleChange"
  >
    <a-button class="button">
        <div class="button_token_icon">
            <img
                class="button_pre_icon"
                :style="{ display: showIcon ? 'block' : 'none' }"
                :src="type === 'chain' ? findChainIcon() : findSymbolIcon()"
            />
            <span :class="content===defaultTitle.defaultTokens?'button_title_default':'button_title'">{{
                content
            }}</span>
        </div>
      <span class="button_icon">
        <svg
          :style="{ transform: isVisible ? 'rotate(180deg)' : 'rotate(0)' }"
          focusable="false"
          data-icon="down"
          width="12px"
          height="12px"
          fill="currentColor"
          aria-hidden="true"
          viewBox="64 64 896 896"
        >
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
          ></path>
        </svg>
      </span>
    </a-button>
    <template #overlay>
      <div class="overlay">
        <div class="overlay_wrap">
            <div class="overlay_title" @click="onClickAll">
              {{ type === "token" ? "All Tokens" : "All Chains" }}
            </div>
            <div class="overlay_item">
              <h2 class="overlay_item_title" v-if="type === 'token'">Authed IBC Tokens</h2>
              <div class="overlay_item_content">
                <template v-for="(item, key) of options" :key="type === 'chain' ? item.chain_id : key">
                  <div
                    class="content_item"
                    v-if="key !== ''"
                    :title="type === 'chain' ? item[titleKey] : key"
                    :class="
                      type === 'chain'
                        ? selectedChain &&
                          selectedChain.chain_id &&
                          selectedChain.chain_id === item.chain_id &&
                          'content_item_selected'
                        : selectedSymbol && selectedSymbol === key && 'content_item_selected'
                    "
                    @click="onClickItem(item, key)"
                  >
                    <img
                      class="content_item_icon"
                      :src="
                        item[iconKey] ||
                          isShowSymbol(key)?.symbolIcon ||
                          tokenDefaultImg
                      "
                    />
                    <span class="content_item_title">{{
                      getLasttyString(item[titleKey]) || isShowSymbol(key)?.symbolDenom
                    }}</span>
                  </div>
                </template>
              </div>
            </div>
    
            <div class="overlay_item" v-if="type === 'token'">
              <h2 class="overlay_item_title">Other IBC Tokens</h2>
              <div class="overlay_item_content">
                <div class="content_item" @click="onClickItem(undefined, unAuthed)">
                  <img class="content_item_icon" :src="tokenDefaultImg" />
                  <span class="content_item_title">Others</span>
                </div>
              </div>
            </div>
    
            <div class="overlay_item">
              <h2 class="overlay_item_title" v-if="type === 'token'">
                Custom IBC Tokens
                <a-popover destroyTooltipOnHide>
                  <template #content>
                    <div>
                      <p class="tip_color">
                        Hash (in hex format) of the denomination trace information.
                      </p>
                    </div>
                  </template>
                  <img class="tip hover" style="margin-left: 8px;" src="/src/assets/tip.png" />
                </a-popover>
              </h2>
              <div class="overlay_item_content flex-c">
                <a-input
                  class="overlay_item_input"
                  v-model:value="inputValue"
                  allowClear
                  :placeholder="type === 'token' ? 'Search by ibc/hash' : 'Search by Chain ID'"
                />
                <a-button type="primary" @click="onClickSearch">Confirm</a-button>
              </div>
            </div>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup>
import { getLasttyString } from '../../../helper/parseString';
import { useFindIcon, useIsVisible } from '../composable';
import { computed, ref, watch } from 'vue';
import {defaultTitle,selectedType} from '@/constants'
const tokenDefaultImg = new URL('../../../assets/token-default.png', import.meta.url).href;
const props = defineProps({
    type: String,
    options: {
      default: () => [],
    },
    ibcBaseDenoms: {
      default: () => [],
    },
    selectedChain: Object,
    selectedSymbol: {
      default: () => '',
    },
    clearInput: Number,
    showIcon: Boolean,
    iconKey: String,
    titleKey: String,
})
const emits = defineEmits(['clickItem','clickSearch']);
const { findSymbolIcon, findChainIcon, isShowSymbol } = useFindIcon(props);
const { isVisible, visibleChange } = useIsVisible();
const inputValue = ref('');
const content = computed(()=>props.type === selectedType.chain
          ? getLasttyString(props.selectedChain?.chain_name) || defaultTitle.defaultChains
          : isShowSymbol(props.selectedSymbol)?.symbolDenom)

watch(
    () => props.clearInput,
    () => {
        inputValue.value = '';
    },
);
const onClickItem = (item, key) => {
    inputValue.value = '';
    const selected = props.type === 'chain' ? item : key;
    emits('clickItem', props.type, selected);
    isVisible.value = false;
};
const onClickSearch = () => {
    emits('clickSearch', props.type, props.type === 'chain' ? { chain_id: inputValue.value } : inputValue.value.toLowerCase().replace('ibc/', '').replace('IBC/', ''));
    isVisible.value = false;
}
const onClickAll = () => {
    emits(
    'clickSearch',
    props.type,
    props.type === 'chain' ? { chain_id: undefined } : undefined,
    );
    isVisible.value = false;
};

</script>

<style lang="less" scoped>
.button {
  padding: 0 5px 0 5px;
  width: 146px;
  height: 36px;
  margin-right: 8px;
  .flex(row, wrap, space-between, center);
  font-weight: 400;
  height: 36px;
  border: 1px solid var(--bj-border-color);
  &_token_icon {
    .flex(row, wrap, flex-start, center);
  }
  &_title {
    max-width: 86px;
    // text-overflow: ellipsis;
    color: var(--bj-text-third);
    overflow: hidden;
    color: var(--bj-primary-color);
    &_default {
      color: var(--bj-text-second);
    }
  }
  &:hover {
    border-color: var(--bj-primary-color);
    .button_icon {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
  &_icon {
    height: 100%;
    padding-left: 6px;
    .flex(column, nowrap, center, center);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    color: rgba(0, 0, 0, 0.35);
    border-left: 1px solid var(--bj-border-color);
  }
  &_pre_icon {
    width: 18px;
    margin-right: 5px;
  }
}
.overlay {
  max-width: 870px;
  background-color: #fff;
  box-shadow: 0px 2px 8px 0px #d9deec;
  border-radius: 4px;
  border: 1px solid #d9dfee;
  padding: 16px;
  &_wrap {

  }
  &_title {
    display: inline-block;
    background: #f5f7fc;
    border-radius: 4px;
    padding: 6px 12px;
    border: 1px solid transparent;
    font-size: var(--bj-font-size-normal);
    font-family: Montserrat-Regular, Montserrat;
    font-weight: 400;
    color: var(--bj-font-color-65);
    margin-bottom: 16px;
    width: 140px;
    cursor:url("../../../assets/mouse/shiftlight_mouse.png"),default !important;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      border: 1px solid var(--bj-primary-color);
      // color: var(--bj-primary-color);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      // background-color: #ffffff;
    }
  }
  &_item {
    width: 100%;
    &_title {
      font-size: var(--bj-font-size-normal);
      font-weight: 400;
      color: #000000;
      margin-bottom: 14px;
    }
    &_content {
      width: 100%;
      .flex(row, wrap, flex-start, center);
      .content_item {
        width: 158px;
        background: #f5f7fc;
        border-radius: 4px;
        border: 1px solid transparent;
        margin: 0 8px 12px 0;
        padding: 6px 6px;
        cursor: url("../../../assets/mouse/shiftlight_mouse.png"),default  !important;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        .flex(row, nowrap, center, center);
          .content_item_title{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
          }
        &:hover {
          border: 1px solid var(--bj-primary-color);
          color: var(--bj-primary-color);
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          // background-color: #ffffff;
        }
        &_selected {
          border: 1px solid var(--bj-primary-color);
          color: var(--bj-primary-color);
          background-color: #ffffff;
          .content_item_title{
            color: var(--bj-primary-color)
          }
        }
        &_icon {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        &_title {
          font-size: var(--bj-font-size-normal);
          font-family: Montserrat-Regular, Montserrat;
          font-weight: 400;
          overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          color: var(--bj-font-color-65);
        }
      }
    }
    &_input {
      width: 240px;
      margin-right: 12px;
    }
  }
}
.flex-c {
  .flex(row, nowrap, flex-start, center);
}
.tip {
  width: 20px;
  z-index: 1;
  &_color {
    color: var(--bj-font-color-65);
  }
}
.hover {
  cursor: url("../../../assets/mouse/shiftlight_mouse.png"),default  !important;
}
.ant-dropdown-open {
    border-color: var(--bj-primary-color);
    .button_icon {
        color: var(--bj-primary-color);
      }
      &_title{
      color: var(--bj-primary-color);
      }
    }

@media screen and (max-width: 970px) {
    .button {
        &_title {
        }
        &:hover {
            .button_icon {
            }
        }
        &_icon {
        }
        &_pre_icon {
        }
    }
    .overlay {
        max-width: 680px;
        &_wrap {
            height: 454px;
            overflow: auto;
            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                box-shadow: inset006pxrgba(0, 0, 0, 0.3);
                border-radius: 2px;
                width: 8px;
                background: rgba(61, 80, 255, 0.1);
            }

            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                box-shadow: inset006pxrgba(0, 0, 0, 0.5);
                background: rgba(61, 80, 255, 0.5);
            }

            &::-webkit-scrollbar-thumb:window-inactive {
                background: rgba(61, 80, 255, 0.9);
            }
        }
        &_title {
            &:hover {
            }
        }
        &_item {
            &_title {
            }
            &_content {
            .content_item {
                max-width: 120px;
                .content_item_title{
                }
                &:hover {
                }
                &_selected {
                }
                &_icon {
                }
                &_title {
                }
            }
            }
            &_input {
            }
        }
    }
    .flex-c {
    }
    .tip {
        &_color {
        }
    }
    .hover {
    }
    .ant-dropdown-open {
        .button_icon {
        }
    }
}
@media screen and (max-width: 768px) {
    .button {
        &_title {
        }
        &:hover {
            .button_icon {
            }
        }
        &_icon {
        }
        &_pre_icon {
        }
    }
    .overlay {
        padding: 16px;
        &_wrap {

        }
        &_title {
            width: 120px;
            &:hover {
            }
        }
        &_item {
            &_title {
            }
            &_content {
                width: 95%;
            .content_item {
                max-width: 120px;
                .content_item_title{
                }
                &:hover {
                }
                &_selected {
                }
                &_icon {
                }
                &_title {
                }
            }
            }
            &_input {
                margin-right: 4px;
            }
        }
    }
    .flex-c {
    }
    .tip {
        &_color {
        }
    }
    .hover {
    }
    .ant-dropdown-open {
        .button_icon {
        }
    }
}
@media screen and (max-width: 574px) {
    .button {
        &_title {
        }
        &:hover {
            .button_icon {
            }
        }
        &_icon {
        }
        &_pre_icon {
        }
    }
    .overlay {
        max-width: 450px;
        &_wrap {

        }
        &_title {
            &:hover {
            }
        }
        &_item {
            &_title {
            }
            &_content {
            .content_item {
                .content_item_title{
                }
                &:hover {
                }
                &_selected {
                }
                &_icon {
                }
                &_title {
                }
            }
            }
            &_input {
            }
        }
    }
    .flex-c {
    }
    .tip {
        &_color {
        }
    }
    .hover {
    }
    .ant-dropdown-open {
        .button_icon {
        }
    }
}
@media screen and (max-width: 420px) {
    .button {
        &_title {
        }
        &:hover {
            .button_icon {
            }
        }
        &_icon {
        }
        &_pre_icon {
        }
    }
    .overlay {
        max-width: 310px;
        &_wrap {

        }
        &_title {
            &:hover {
            }
        }
        &_item {
            &_title {
            }
            &_content {
            .content_item {
                .content_item_title{
                }
                &:hover {
                }
                &_selected {
                }
                &_icon {
                }
                &_title {
                }
            }
            }
            &_input {
            }
        }
    }
    .flex-c {
    }
    .tip {
        &_color {
        }
    }
    .hover {
    }
    .ant-dropdown-open {
        .button_icon {
        }
    }
    .dropdown_token {
        width: 210px;
    }
}
</style>
