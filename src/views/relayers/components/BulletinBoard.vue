<template>
    <div class="bulletin">
        <div class="bulletin__container">
            <div class="content">
                <div class="desc">
                    <i class="iconfont icon-zhiding"></i>
                    <span
                        >Relayer detailed page is launched! Welcome to register your relayers!</span
                    >
                </div>
                <div class="info" @click="gotoRegistry()">
                    <span>relayer registry</span>
                    <i class="iconfont icon-zhiding"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { RELAYER_REGISTE_ADDRESS } from '@/constants/relayers';
    const gotoRegistry = () => {
        window.open(RELAYER_REGISTE_ADDRESS);
    };
</script>
<style lang="less" scoped>
    .bulletin {
        background-color: var(--bj-background-color);
        width: 100%;
        &__container {
            // height: 46px;
            // line-height: 46px;
            background: rgba(61, 80, 255, 0.1);
            padding: 14px 48px;
            width: 100%;
            .content {
                margin: 0 auto;
                max-width: 1200px;
                display: flex;
                justify-content: space-between;
                .desc {
                    font-size: var(--bj-font-size-normal);
                    font-family: GolosUIWebRegular;
                    color: rgba(0, 0, 0, 0.65);
                }
                .info {
                    font-size: var(--bj-font-size-normal);
                    font-family: GolosUIWebRegular;
                    color: var(--bj-primary-color);
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .bulletin {
            &__container {
                padding: 14px 32px;
                .content {
                }
            }
        }
    }
    @media screen and (max-width: 630px) {
        .bulletin {
            &__container {
                padding: 14px 32px;
                .content {
                    display: flex;
                    flex-direction: column;
                    .desc {
                        text-align: left;
                    }
                    .info {
                        text-align: right;
                    }
                }
            }
        }
    }
    @media screen and (max-width: 530px) {
        .bulletin {
            &__container {
                padding: 14px 16px;
                .content {
                    display: flex;
                    flex-direction: column;
                    .desc {
                        text-align: left;
                    }
                    .info {
                        text-align: right;
                    }
                }
            }
        }
    }
</style>
