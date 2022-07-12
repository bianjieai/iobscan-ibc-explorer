<template>
    <div class="loading_container">
        <a-spin></a-spin>
    </div>
</template>

<script setup>
</script>

<style scoped lang="less">
    .loading_container{
        flex: 1;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.6);
        z-index: 10;
    }
</style>
