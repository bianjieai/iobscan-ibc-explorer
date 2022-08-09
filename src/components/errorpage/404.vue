<template>
    <!-- todo duanjie 404 三屏适配 -->
    <div class="error_page">
        <div class="error_page__content">
            <div class="error_page__content__img">
                <img src="/src/assets/error/404.png" alt="" />
            </div>
            <div class="error_page__content__text">
                <p class="title">Oops!</p>
                <p class="descripton"
                    >The planet you are looking for doesn't exist or has been moved.</p
                >
                <router-link :to="'/home'" class="button">Go Back</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
    .error_page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/error/default_bg.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/error/mouse_tree.png'), default !important;
        &__content {
            max-width: 808px;
            position: relative;
            &__img {
                width: 100%;

                img {
                    width: 100%;
                }
            }
            &__text {
                position: absolute;
                bottom: 3.33%;
                left: 0;
                right: 0;
                margin: 0 20px;
                .title {
                    font-size: 40px;
                    font-weight: 500;
                    line-height: 48px;
                    color: rgba(255, 255, 255, 1);
                    margin-top: 60px;
                }
                .descripton {
                    margin-top: 24px;
                    color: rgba(255, 255, 255, 0.75);
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    line-height: 16px;
                }
                .button {
                    display: inline-block;
                    width: 172px;
                    height: 36px;
                    border-radius: 18px;
                    background: rgba(61, 80, 255, 1);
                    color: rgba(255, 255, 255, 1);
                    font-size: 16px;
                    line-height: 36px;
                    margin: 40px auto 0 auto;
                }
            }
        }
    }
</style>
