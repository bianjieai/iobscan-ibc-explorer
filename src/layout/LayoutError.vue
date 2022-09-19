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
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100vh;
        &__header_container {
            height: 80px;
        }
        &__content_container {
            flex: 1;
            display: flex;
        }
        &__footer_container {
            height: auto;
        }
    }
    @media screen and (max-width: 800px) {
        .layout_error_container {
            &__header_container {
                position: relative;
            }
            &__content_container {
            }
            &__footer_container {
            }
        }
    }
</style>
