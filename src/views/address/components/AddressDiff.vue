<template>
    <span v-if="txAddress === DEFAULT_DISPLAY_TEXT">{{ DEFAULT_DISPLAY_TEXT }}</span>
    <a-popover v-else placement="topLeft" destroy-tooltip-on-hide>
        <template #content>
            <span class="popover_c">{{ txAddress }}</span>
        </template>
        <router-link
            v-if="txAddress !== currentAddress"
            class="addr_diff__other cursor"
            :to="`/address/${txAddress}?chain=${currentChain}&address=${currentAddress}`"
        >
            <span>{{ getRestString(txAddress, 6, 6) }}</span>
        </router-link>
        <span v-else>{{ getRestString(txAddress, 6, 6) }}</span>
    </a-popover>
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

<style lang="less" scoped></style>
