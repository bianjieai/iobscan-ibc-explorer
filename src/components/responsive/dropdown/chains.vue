<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']">
    <div
      :class="['inline-flex', 'items-center', 'default_color', 'dropdown-container', visible ? 'visible_border' : '']">
      <div :class="['mr-8', 'ml-8', selectedChain[0] ? 'selected_color' : '', chain_a === defaultTitle.defaultChains? 'selected_color_default':'selected_color']" :style="{
        flex: !selectedDouble ? '1' : 'auto',
        textAlign: !selectedDouble ? 'center' : 'left'
      }">{{ chain_a }}</div>
      <template v-if="selectedDouble">
        - <div :class="['mr-8', 'ml-8', selectedChain[1] ? 'selected_color' : '',chain_b === defaultTitle.defaultChains? 'selected_color_default':'selected_color']">{{ chain_b }}</div>
      </template>
      <span class="button__icon flex justify-between items-center">
        <svg :style="{ transform: visible ? 'rotate(180deg)' : 'rotate(0)' }" focusable="false" data-icon="down"
          width="12px" height="12px" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"
          :class="[visible ? 'visible_color' : '']">
          <path
            d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">
          </path>
        </svg>
      </span>
    </div>

    <template #overlay>
      <div class="overlay">
        <div>
          <a-badge>
            <template #count v-if="needBadge && isSelected('allchain')">
              <span class="badge">{{ badgeText('allchain') }}</span>
            </template>
            <span :class="['chains-tag', isSelected('allchain') ? 'visible_color visible_border' : '']"
              :style="{ lineHeight: '24px' }" @click="onSelected('All Chains', 'allchain')">All Chains</span>
          </a-badge>
        </div>
        <div class="flex flex-wrap">
          <a-badge v-for="item in dropdownData">
            <template #count v-if="needBadge && isSelected(item.chain_id)">
              <span class="badge">{{ badgeText(item.chain_id) }}</span>
            </template>
            <span @click="onSelected(item.chain_name, item.chain_id)"
              :class="['chains-tag', isSelected(item.chain_id) ? 'visible_color visible_border' : '']"
              :key="item.chain_id">
              <img :src="item.icon" width="24" height="24" class="mr-8" />{{ item.chain_name }}
            </span>
          </a-badge>

        </div>
        <div class="flex items-center mt-24 flex-wrap">
          <a-input allowClear v-model:value="chainIdIput" class="chain-input"
            :placeholder="`Search by Chain ID${selectedDouble ? ', Chain ID' : ''}`"
            @input="() => selectedChain = []" />
          <a-button @click="confirmChains" type="primary" class="confirm-button ml-12">Confirm</a-button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import {defaultTitle} from '@/constants'

interface IProps {
  selectedDouble?: boolean // 需要选两个chain
  needBadge?: false // 需要角标
  chain_id?: string // 回填
  dropdownData: any[]
}

const props = withDefaults(defineProps<IProps>(), {
  dropdownData: (sessionStorage.getItem('allChains') && JSON.parse(sessionStorage.getItem('allChains')!)).all ?? []
})

type TChainName = string
type TChainID = string | 'allchain'

type TSelectedChain = {
  chain_id: TChainID,
  chain_name: TChainName,
}


onMounted(() => {
  if (props.chain_id) {
    const filterData = props.dropdownData.filter((item: any) => item.chain_id === props.chain_id)
    if (filterData.length > 0) {
      const chain_name = filterData[0].chain_name
      selectedChain.value = [{
        chain_id: props.chain_id,
        chain_name
      }]
    }
  }
})

const visible = ref(false)
const selectedChain = ref<TSelectedChain[]>([])
const chainIdIput = ref<string | undefined>(undefined)
const chain_a = computed(() => selectedChain.value[0]?.chain_name ?? 'All Chains')
const chain_b = computed(() => selectedChain.value[1]?.chain_name ?? 'All Chains')

const isSelected = computed(() => (chain_id: TChainID) => selectedChain.value.filter(item => item.chain_id === chain_id).length > 0)
const badgeText = computed(() => (chain_id: TChainID) => {
  if (selectedChain.value[0]?.chain_id === 'allchain' && selectedChain.value[1]?.chain_id === 'allchain') {
    return `Transfer - Receive`
  } else {
    if (selectedChain.value[0]?.chain_id === chain_id) {
      return `Transfer`
    }

    if (selectedChain.value[1]?.chain_id == chain_id) {
      return `Receive`
    }
  }
})

defineExpose({
  selectedChain
})

const emits = defineEmits<{
  (e: 'onSelectedChain', chain_id: string): void
}>()

const submitChain = (chain_id: string) => {
  emits('onSelectedChain', chain_id)
  visible.value = false
  chainIdIput.value = undefined // reset
}

const onSelected = (chain_name: TChainName, chain_id: TChainID) => {
  chainIdIput.value = undefined // 清空
  if (props.selectedDouble) { // 双选
    switch (selectedChain.value.length) {
      case 0:
        selectedChain.value.push({
          chain_name,
          chain_id
        })
        break
      case 1:
        if (chain_id !== selectedChain.value[0].chain_id || chain_id === 'allchain') {
          selectedChain.value.push({
            chain_name,
            chain_id
          })
          submitChain(`${selectedChain.value[0].chain_id},${selectedChain.value[1].chain_id}`)
        }
        break
      case 2:
        selectedChain.value = [] // 任意点击会清空
        selectedChain.value.push({
          chain_name,
          chain_id
        })
        break
      default:
        break
    }
  } else {// 单选
    if (selectedChain.value.length > 0 && chain_id === selectedChain.value[0].chain_id) {// 再次点击取消
      selectedChain.value = []
    } else {
      selectedChain.value = []
      selectedChain.value.push({
        chain_name,
        chain_id
      })

      submitChain(selectedChain.value[0].chain_id)
    }
  }
}

const confirmChains = () => {
  if (props.selectedDouble) {
    if (chainIdIput.value?.includes(',') || chainIdIput.value?.includes('，')) {
      submitChain(chainIdIput.value.replace(/，/, ','))
    } else {
      submitChain(`${chainIdIput.value},allchain`)
    }
  } else {
    submitChain(chainIdIput.value ?? 'allchain')
  }
}

</script>

<style lang="less" scoped>
.dropdown-container {
  height: 36px;
  border: 1px solid var(--bj-border-color);
  border-radius: 4px;
  background-color: #fff;
  cursor: url("../../../assets/mouse/shiftlight_mouse.png"), default !important;
  min-width: 124px;
  &:hover{
    border-color: #667aff;
  }
}

.button__icon {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 0 6px;
  border-left: 1px solid var(--bj-border-color);
  height: 36px;

  &>svg {
    color: var(--bj-text-third);
  }
}

.visible_border {
  border: 1px solid var(--bj-primary-color) !important;
}

.visible_color {
  color: var(--bj-primary-color) !important;
  background: #fff !important;
}

.default_color {
  color: var(--bj-text-third);
}

.selected_color {
  color: var(--bj-primary-color);
  &_default{
    color: var(--bj-text-second) 

  }
}

.overlay {
  width: 872px;
  background: #FFFFFF;
  box-shadow: 0px 2px 8px 0px #D9DEEC;
  border-radius: 4px;
  min-height: 200px;
  border: 1px solid var(--bj-border-color);
  padding: 16px 4px 24px 16px;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.chains-tag {
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-align: left;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  cursor: url("../../../assets/mouse/shiftlight_mouse.png"), default !important;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  padding: 5px 8px 5px 8px;
  border-radius: 4px;
  color: var(--bj-text-second);
  background: var(--bj-background-color);
  width: 158px;
  box-sizing: border-box;

  &:hover {
    border: 1px solid var(--bj-primary-color);
  }

  &:active {
    opacity: 0.7;
  }
}

.chain-input {
  width: 280px;
}

.confirm_button {
  color: #fff;
}

.badge {
  border-radius: 16px;
  line-height: 32px;
  color: #fff;
  background-color: var(--bj-primary-color);
  top: -8px;
  transform: translate(0, 0);
  transform: scale(.5);
  font-size: 20px; //  展示10px
  padding: 0 16px;
  white-space: nowrap;
}

:deep(.ant-badge) {
  margin-top: 12px;
  margin-right: 12px;
}


// pc
@media screen and (min-width: 768px) {}

// tablet
@media screen and (min-width: 414px) and (max-width: 768px) {
  .overlay {
    width: 702px;
  }
}

// mobile
@media screen and (max-width: 414px) {
  .overlay {
    width: 284px;
    height: 450px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
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

  .confirm-button {
    margin: 12px 0 0;
  }

  .chain-input {
    width: 245px;
  }
}
</style>