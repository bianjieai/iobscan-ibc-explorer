<template>
    <no-result
        title-label="Search Results"
        :title-value="searchInputValue"
        :title-chain="searchChainPrettyName"
        :button-fn="toHome"
    />
</template>

<script setup lang="ts">
    import { useNoResult } from '../composable';
    const { searchInputValue, searchChainPrettyName, toHome } = useNoResult();
</script>

<style scoped lang="less"></style>
