<template>
    <router-view />
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    import { useChangeTitleAndIcon } from '@/composables/index';

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    ibcStatisticsChainsStore.initStateAction();
    useChangeTitleAndIcon();
</script>

<style>
    #app {
        text-align: center;
    }
</style>
