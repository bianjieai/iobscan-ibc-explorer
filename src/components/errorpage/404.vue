<template>
    <div class="error_container">
        <div class="content">
            <div class="content__img">
                <img class="content__img__large" src="/src/assets/error/404_large.png" alt="" />
                <img class="content__img__small" src="/src/assets/error/404_small.png" alt="" />
            </div>
            <div class="content__text">
                <p class="content__text__title">Oops!</p>
                <p class="content__text__descripton"
                    >The planet you are looking for doesn't exist or has been moved.</p
                >
                <router-link :to="'/home'" class="content__text__button">Go Back</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
    .error_container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('../../assets/error/default_bg.png') no-repeat center center;
        background-size: cover;
        cursor: url('../../assets/error/mouse_tree.png'), default !important;
        .content {
            max-width: 808px;
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
                bottom: 19px;
                left: 0;
                right: 0;
                margin: 0 20px;
                &__title {
                    font-size: 40px;
                    font-weight: 500;
                    line-height: 48px;
                    color: rgba(255, 255, 255, 1);
                }
                &__descripton {
                    margin-top: 24px;
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
    @media screen and (max-width: 800px) {
        .error_container {
            align-items: flex-start;
            .content {
                margin-top: 120px;
                max-height: 543px;
                &__img {
                    &__large {
                        display: none;
                    }
                    &__small {
                        display: inline-block;
                    }
                }
                &__text {
                    &__title {
                    }
                    &__descripton {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 640px) {
        .error_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: -30px;
                    &__title {
                    }
                    &__descripton {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 460px) {
        .error_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: -60px;
                    &__title {
                    }
                    &__descripton {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 420px) {
        .error_container {
            .content {
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    bottom: -80px;
                    &__title {
                    }
                    &__descripton {
                    }
                    &__button {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 375px) {
        .error_container {
            .content {
                margin-top: 50px;
                &__img {
                    &__large {
                    }
                    &__small {
                    }
                }
                &__text {
                    &__title {
                    }
                    &__descripton {
                    }
                    &__button {
                    }
                }
            }
        }
    }
</style>
