<template>
    <div class="maintenance">
        <div class="maintenance__content">
            <div class="maintenance__content__img">
                <img :src="maintenanceImg" alt="">
            </div>
            <div class="maintenance__content__text">
                <p class="maintenance__content__text__top">We Are Under</p>
                <p class="maintenance__content__text__bottom">Maintenance</p>
            </div>
        </div>
    </div>
</template>
<script setup>
const maintenanceImg = new URL('../assets/maintenance_image.png', import.meta.url).href;
</script>
<style lang="less" scoped>
    .maintenance {
        width: 100%;
        height: 100%;
        background: url(../assets/main_bg.png) no-repeat center / cover;
        &__content {
            .flex(row, nowrap, center, flex-end);
            height: 100%;
            &__img {
                img {
                    max-width: 850px;
                }
            }
            &__text {
                position: absolute;
                top: 50%;
                text-align: center;
                &__top {
                    font-size: var(--bj-font-size-home-number);
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 24px;
                    letter-spacing: 2px;
                }
                &__bottom {
                    margin-top: 9px;
                    font-size: 32px;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 40px;
                }
            }
        }
    }
    @media screen and (max-width: 972px) {
        .maintenance {
            &__content {
                position: relative;
                &__img {
                    position: absolute;
                    top: 20%;
                    img {
                        max-width: 768px;
                    }
                }
                &__text {
                    &__top {
                    }
                    &__bottom {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .maintenance {
            &__content {
                &__img {
                    img {
                        max-width: 600px;
                    }
                }
                &__text {
                    top: 45%;
                    &__top {
                    }
                    &__bottom {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 600px) {
        .maintenance {
            &__content {
                &__img {
                    img {
                        max-width: 100%;
                    }
                }
                &__text {
                    &__top {
                    }
                    &__bottom {
                    }
                }
            }
        }
    }
    @media screen and (max-width: 500px) {
        .maintenance {
            &__content {
                &__img {
                    img {
                    }
                }
                &__text {
                    top: 40%;
                    &__top {
                        font-size: 20px;
                    }
                    &__bottom {
                        font-size: 28px;
                    }
                }
            }
        }
    }
    @media screen and (max-width: 400px) {
        .maintenance {
            &__content {
                &__img {
                    img {
                    }
                }
                &__text {
                    &__top {
                        font-size: 20px;
                    }
                    &__bottom {
                        font-size: 28px;
                    }
                }
            }
        }
    }
</style>