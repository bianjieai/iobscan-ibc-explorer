<template>
    <div class="layout_error_container">
        <div class="layout_error_container__header_container">
            <ibc-header />
        </div>
        <div class="layout_error_container__content_container">
            <router-view />
        </div>
        <div class="layout_error_container__footer_container">
            <ibc-footer :type="FooterMode.dark" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { FooterMode } from '@/types/interface/index.interface';
</script>

<style lang="less" scoped>
    .layout_error_container {
        flex: 1;
        display: flex;
        flex-direction: column;
        &__header_container {
        }
        &__content_container {
            flex: 1;
        }
        &__footer_container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            .footer_container {
                background-color: rgba(238, 240, 246, 0.1);
            }
        }
    }
</style>
