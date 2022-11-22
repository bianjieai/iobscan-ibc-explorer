<template>
    <router-view />
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store';
    import { useChangeTitleAndIcon, useDocumentVisibility } from '@/composables';

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    ibcStatisticsChainsStore.initStateAction();
    useChangeTitleAndIcon();
    useDocumentVisibility();
    console.log();
</script>

<style>
    #app {
        text-align: center;
    }
</style>
