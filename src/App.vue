<template>
    <router-view />
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    import { useChangeTitleAndIcon } from '@/composables/index';
    import { src } from '@/utils/getGtagSrc';

    let script: HTMLScriptElement = document.createElement('script');
    script.src = `https://s4.cnzz.com/z_stat.php?id=${import.meta.env.VITE_UMENG_ID}&web_id=${
        import.meta.env.VITE_UMENG_WEB_ID
    }`;
    document.body.appendChild(script);

    // 设置gtag运行环境
    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.src = src;
    document.head.appendChild(gtagScript);

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    ibcStatisticsChainsStore.initStateAction();
    useChangeTitleAndIcon();
</script>

<style>
    #app {
        text-align: center;
    }
</style>
