<template>
    <router-view />
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    import { useChangeTitleAndIcon } from '@/composables/index';
    import { src } from '@/utils/getGtagSrc';

    // 设置gtag运行环境
    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.src = src;
    document.head.appendChild(gtagScript);

    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    ibcStatisticsChainsStore.initStateAction();
    useChangeTitleAndIcon();

    // 判断是否聚焦到本页签
    const watchDocument = () => {
        ibcStatisticsChainsStore.isDocumentVisibility = document.hidden;
    };
    document.addEventListener('visibilitychange', watchDocument);
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', watchDocument);
    });
</script>

<style>
    #app {
        text-align: center;
    }
</style>
