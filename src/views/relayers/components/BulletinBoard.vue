<template>
    <div class="bulletin">
        <div class="bulletin__container">
            <div class="content">
                <div class="desc">
                    <i class="iconfont icon-notice"></i>
                    <span
                        >Relayer detailed page is launched! Welcome to register your relayers!</span
                    >
                </div>
                <div class="info" @click="gotoRegistry()">
                    <span>relayer registry</span>
                    <i class="iconfont icon-turnto1"></i>
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
            background: rgba(61, 80, 255, 0.1);
            padding: 14px 48px;
            width: 100%;
            // display: flex;
            // align-items: center;
            .content {
                margin: 0 auto;
                max-width: 1200px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .desc {
                    font-size: var(--bj-font-size-normal);
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.65);
                    align-self: flex-start;
                    .iconfont {
                        font-size: 14px;
                        color: var(--bj-primary-color);
                    }
                    span {
                        margin-left: 12px;
                    }
                }
                .info {
                    font-size: var(--bj-font-size-normal);
                    line-height: 18px;
                    color: var(--bj-primary-color);
                    align-self: flex-end;
                    .iconfont {
                        font-size: 14px;
                    }
                    span {
                        display: inline-block;
                        margin-right: 4px;
                    }
                }
            }
        }
    }
    @media screen and (max-width: 768px) {
        .bulletin {
            &__container {
                padding: 14px 32px;
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
                    .info {
                        margin-top: 8px;
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
                        margin-top: 8px;
                    }
                }
            }
        }
    }
</style>
