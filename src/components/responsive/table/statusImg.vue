<template>
  <img :src="imgSrc" alt="" :height="height" :width="width">
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { BottomStatusType, RelayerStatus, TBottomStatus, TRelayerStatus, TChannelStatus, ChannelStatus } from '../component.interface'

interface IProps {
  status: TRelayerStatus | TChannelStatus
  type: TBottomStatus
  height: number
  width: number
}

const props = defineProps<IProps>()

const imgSrc = computed(() => {
  let src = ''
  if (props.type === BottomStatusType.RELAYER) {
    switch (props.status) {
      case RelayerStatus.RUNNING:
        src = new URL('../../../assets/relayer-running.png', import.meta.url).href
        break
      case RelayerStatus.STOPPED:
        src = new URL('../../../assets/relayer-stopped.png', import.meta.url).href
        break
      default:
        break
    }
  } else if (props.type === BottomStatusType.CHANNEL) {
    switch (props.status) {
      case ChannelStatus.OPEN:
        src = new URL('../../../assets/channel-open.png', import.meta.url).href
        break
      case ChannelStatus.CLOSED:
        src = new URL('../../../assets/channel-closed.png', import.meta.url).href
        break
      default:
        break
    }
  }

  return src
})

</script>

<style lang="less" scoped>
</style>