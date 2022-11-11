<template>
    <no-result
        title-label="Search Results"
        :title-value="searchInputValue.value[0]"
        :button-fn="toHome"
    />
</template>

<script setup lang="ts">
    import { useNoResult } from '../composable';
    const { searchInputValue, toHome } = useNoResult();
</script>

<style scoped lang="less"></style>
