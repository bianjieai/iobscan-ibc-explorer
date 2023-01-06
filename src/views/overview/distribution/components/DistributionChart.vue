<template>
    <div class="distribution_chart">
        <div ref="distributionDom" class="distribution_chart__dom"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .distribution_chart {
    }
    @media screen and (max-width: 912px) {
        .distribution_chart {
            width: 800px;
        }
    }
</style>
