<template>
    <div class="addr_diff">
        <span
            v-if="txAddress === DEFAULT_DISPLAY_TEXT"
            class="addr_diff__text addr_diff__text_default"
            >{{ DEFAULT_DISPLAY_TEXT }}</span
        >
        <a-popover v-else destroy-tooltip-on-hide>
            <template #content>
                <span class="popover_c">{{ txAddress }}</span>
            </template>
            <router-link
                v-if="txAddress !== currentAddress"
                class="addr_diff__text addr_diff__other cursor"
                :to="`/address/${txAddress}?chain=${currentChain}`"
            >
                <span>{{ getRestString(txAddress, 6, 6) }}</span>
            </router-link>
            <span v-else class="addr_diff__text addr_diff__text_default">{{
                getRestString(txAddress, 6, 6)
            }}</span>
        </a-popover>
    </div>
</template>

<script setup lang="ts">
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import { getRestString } from '@/helper/parseStringHelper';
    interface IAddressDiff {
        currentChain: string;
        currentAddress: string;
        txAddress: string;
    }
    defineProps<IAddressDiff>();
</script>

<style lang="less" scoped>
    .addr_diff {
        &__text {
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            line-height: 14px;
        }
        &__text_default {
            color: var(--bj-text-second);
        }
        &__other {
            color: var(--bj-primary-color);
        }
    }
</style>
