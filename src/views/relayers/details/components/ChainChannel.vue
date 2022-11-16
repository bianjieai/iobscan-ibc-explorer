<template>
    <div class="chain_channel">
        <a-popover placement="right" destroy-tooltip-on-hide>
            <template #content>
                <span class="chain_channel__tooltip">
                    <TooltipLabelValue
                        label="Chain ID:"
                        :value="ChainHelper.formatChainId(chain)"
                    ></TooltipLabelValue>
                </span>
            </template>
            <div class="chain_channel__wrap">
                <img class="chain_channel__chain_logo" :src="chainIcon" alt="" />
                <div class="chain_channel__info">
                    <span class="chain_channel__chain">{{ chainName }}</span>
                    <span class="chain_channel__channel">{{
                        channel || DEFAULT_DISPLAY_TEXT
                    }}</span>
                </div>
            </div>
        </a-popover>
    </div>
</template>

<script setup lang="ts">
    import { useMatchChainInfo } from '@/composables';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import ChainHelper from '@/helper/chainHelper';

    interface IChainChannel {
        chain: string;
        channel: string;
    }
    const props = defineProps<IChainChannel>();
    const { chainIcon, chainName } = useMatchChainInfo(props.chain);
</script>

<style lang="less" scoped>
    .chain_channel {
        max-width: 150px;
        &__wrap {
            .flex(row, nowrap, flex-start, center);
        }
        &__chain_logo {
            width: 32px;
            height: 32px;
        }
        &__info {
            .flex(column, nowrap, flex-start, flex-start);
            margin-left: 8px;
        }
        &__chain {
            font-size: var(--bj-font-size-sub-title);
            font-family: GolosUI_Medium;
            color: var(--bj-text-normal);
            line-height: 20px;
        }
        &__channel {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
        }
    }
</style>
