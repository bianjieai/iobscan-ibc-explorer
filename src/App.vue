<template>
    <router-view />
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    import { useChangeTitleAndIcon } from '@/composables/index';
    let script: HTMLScriptElement = document.createElement('script');
    script.src = `https://s4.cnzz.com/z_stat.php?id=${import.meta.env.VITE_UMENG_ID}&web_id=${
        import.meta.env.VITE_UMENG_WEB_ID
    }`;
    document.body.appendChild(script);
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    ibcStatisticsChainsStore.initStateAction();
    useChangeTitleAndIcon();
</script>

<style>
    #app {
        text-align: center;
    }
</style>
