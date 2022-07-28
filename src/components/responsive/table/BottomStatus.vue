<template>
    <div class="status-container">
        <div class="flex justify-between items-center flex-wrap">
            <div>{{ type }} Status: </div>
            <div class="flex">
                <div class="flex items-center ml-16">
                    <img
                        :src="activeImgInfo.src"
                        :width="activeImgInfo.width"
                        :height="activeImgInfo.height"
                        class="mr-4"
                    />
                    <div>{{ type === BottomStatusType.CHANNEL ? CHANNEL_STATUS.OPEN : RELAYER_STATUS.RUNNING }}</div>
                </div>
                <div class="flex items-center ml-24">
                    <img
                        :src="inActiveImgInfo.src"
                        :width="inActiveImgInfo.width"
                        :height="inActiveImgInfo.height"
                        class="mr-4"
                    />
                    <div>{{ type === BottomStatusType.CHANNEL ? CHANNEL_STATUS.CLOSED : RELAYER_STATUS.UNKNOWN }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { BottomStatusType, TBottomStatus } from '../component.interface';
    import { RELAYER_STATUS } from '../../../views/relayers/constants';
    import { CHANNEL_STATUS } from '../../../views/channels/constants';

    interface IProps {
        type: TBottomStatus; // 目前支持 channels 和 relayers
    }

    const props = defineProps<IProps>();

    const activeImgInfo = computed(() => {
        if (props.type === BottomStatusType.CHANNEL) {
            return {
                src: new URL('../../../assets/channel-open.png', import.meta.url).href,
                height: 16,
                width: 46
            };
        } else {
            return {
                src: new URL('../../../assets/relayer-running.png', import.meta.url).href,
                height: 18.5,
                width: 18.5
            };
        }
    });

    const inActiveImgInfo = computed(() => {
        if (props.type === BottomStatusType.CHANNEL) {
            return {
                src: new URL('../../../assets/channel-closed.png', import.meta.url).href,
                height: 16,
                width: 46
            };
        } else {
            return {
                src: new URL('../../../assets/relayer-stopped.png', import.meta.url).href,
                height: 18.5,
                width: 18.5
            };
        }
    });
</script>

<style lang="less" scoped>
    .status-container {
        background: #f8f9fc;
        border-radius: 14px;
        line-height: 28px;
        color: var(--bj-text-third);
        padding: 0 16px 0 8px;
        display: inline-block;

        .icon {
            height: 20px;
            width: 20px;
            margin: 0 5px 0 24px;
            background: salmon;
            border-radius: 50%;
        }
    }

    @media screen and (min-width: 768px) {
    }

    // tablet
    @media screen and (min-width: 414px) and (max-width: 768px) {
    }

    // mobile
    @media screen and (max-width: 414px) {
        .status-container {
            line-height: 20px;
            padding: 8px 16px 8px 8px;
        }
    }
</style>
