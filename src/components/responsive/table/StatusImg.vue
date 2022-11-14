<template>
    <img :src="imgSrc" alt="" :height="height" :width="width" />
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import {
        BottomStatusType,
        RelayerStatus,
        TBottomStatus,
        TRelayerStatus,
        TChannelStatus,
        ChannelStatus
    } from '@/types/interface/components/table.interface';

    interface IProps {
        status: TRelayerStatus | TChannelStatus;
        type: TBottomStatus;
        height: number;
        width: number;
    }

    const props = defineProps<IProps>();

    const imgSrc = computed(() => {
        let src = '';
        if (props.type === BottomStatusType.RELAYER) {
            switch (props.status) {
                case RelayerStatus.RUNNING:
                    src = new URL('../../../assets/status/relayer_running.png', import.meta.url)
                        .href;
                    break;
                case RelayerStatus.UNKNOWN:
                    src = new URL('../../../assets/status/relayer_stopped.png', import.meta.url)
                        .href;
                    break;
                case RelayerStatus.UNSEARCH:
                    src = new URL('../../../assets/status/relayer_stopped.png', import.meta.url)
                        .href;
                    break;
                default:
                    break;
            }
        } else if (props.type === BottomStatusType.CHANNEL) {
            switch (props.status) {
                case ChannelStatus.OPEN:
                    src = new URL('../../../assets/status/channel_open.png', import.meta.url).href;
                    break;
                case ChannelStatus.CLOSED:
                    src = new URL('../../../assets/status/channel_closed.png', import.meta.url)
                        .href;
                    break;
                default:
                    break;
            }
        }

        return src;
    });
</script>

<style lang="less" scoped></style>
