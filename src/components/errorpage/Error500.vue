<template>
    <div class="error_network_container">
        <div class="content">
            <div class="content__img">
                <img class="content__img__large" src="/src/assets/error/500_large.png" alt="" />
                <img class="content__img__small" src="/src/assets/error/500_small.png" alt="" />
            </div>
            <div class="content__text">
                <p class="content__text__title">Something went wrong</p>
                <p class="content__text__description"
                    >Don't panic, we'll fix it soon. Please try again after some time.</p
                >
                <router-link :to="'/home'" class="content__text__button">Go Back</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useIbcStatisticsChains } from '@/store/index';
    const ibcStatisticsChainsStore = useIbcStatisticsChains();
    onBeforeUnmount(() => {
        console.log('onBeforeUnmount======error 500');
        ibcStatisticsChainsStore.isShow500 = false;
    });
</script>

<style scoped lang="less">
    .error_network_container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/error/default_bg.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/error/mouse_tree.png'), default !important;
        user-select: none;
        .content {
            max-width: 895px;
            position: relative;
            &__img {
                width: 100%;
                &__large {
                    display: inline-block;
                    width: 100%;
                }
                &__small {
                    display: none;
                    width: 100%;
                }
            }
            &__text {
                position: absolute;
                bottom: 170px;
                left: 0;
                right: 0;
                margin: 0 16px;
                &__title {
                    font-size: 24px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                    line-height: 24px;
                }
                &__description {
                    margin-top: 15px;
                    color: rgba(255, 255, 255, 0.75);
                    font-size: var(--bj-font-size-normal);
                    font-weight: 400;
                    line-height: 16px;
                }
                &__button {
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
    @media screen and (max-width: 900px) {
        .error_network_container {
            align-items: flex-start;
            .content {
                margin-top: 120px;
                max-width: 768px;
                &__img {
                    &__large {
                        display: none;
                    }
                    &__small {
                        display: inline-block;
                    }
                }
                &__text {
                    position: absolute;
                    bottom: 205px;
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 660px) {
        .error_network_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: 160px;
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 580px) {
        .error_network_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: 120px;
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 580px) {
        .error_network_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: 60px;
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 580px) {
        .error_network_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: 30px;
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 389px) {
        .error_network_container {
            .content {
                margin-top: 80px;
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    &__title {
                    }
                    &__description {
                    }
                    &__button {
                    }
                }
            }
        }
    }
</style>
