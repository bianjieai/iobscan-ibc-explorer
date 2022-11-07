<template>
    <div class="channel_pair">
        <div class="channel_pair__top">
            <ChainChannel :chain="chain" :channel="channel"></ChainChannel>
        </div>
        <div class="channel_pair__bottom" :style="{ height: `${height}px` }">
            <div
                v-for="item in chainAddressList"
                :key="item"
                class="channel_pair__chain_address_wrap"
            >
                <span class="channel_pair__chain_address">{{ item }}</span>
                <CopyComponent :copy-text="item"></CopyComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import ChainChannel from './ChainChannel.vue';
    interface IChannelPair {
        chain: string;
        channel: string;
        chainAddressList: string[];
        height: number;
    }
    defineProps<IChannelPair>();
</script>

<style lang="less" scoped>
    .channel_pair {
        min-width: 524px;
        min-height: 92px;
        border-radius: 8px;
        border: 1px solid #eaeaea;
        &__top {
            padding: 11px 16px;
            background: #f8fafd;
            border-radius: 8px 8px 0px 0px;
        }
        &__bottom {
            padding: 0 16px;
        }
        &__chain_address_wrap {
            padding: 8px 0 7px;
            border-bottom: 1px solid #eaeaea;
            &:last-child {
                border-bottom: 0;
            }
        }
        &__chain_address {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
        &__visible_border {
            border: 1px solid var(--bj-primary-color) !important;
            box-shadow: 0 0 0 2px rgb(61 80 255 / 20%);
        }
    }
</style>
