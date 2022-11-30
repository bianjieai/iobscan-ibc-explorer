<template>
    <div class="layout_main">
        <div class="layout_main__header_container">
            <div class="layout_main__header_content">
                <div class="layout_main__logo">
                    <img :src="logoIcon" alt="logo" />
                </div>
                <a class="layout_main__ioblink" href="https://www.iobscan.io/#/" target="_blank" rel="noreferrer noopener">
                    <img src="/src/assets/ioblink.png" alt="icon" />
                </a>
            </div>
        </div>
        <div class="layout_main__content_container">
            <router-view />
        </div>
        <div class="layout_main__footer_container">
            <ibc-footer :type="FOOTER_MODE.dark" />
        </div>
    </div>
</template>

<script setup>
    import { FOOTER_MODE } from '@/constants';
    const logoIcon = new URL(import.meta.env.VITE_LOGO_ICON, import.meta.url).href;
</script>

<style lang="less" scoped>
    .layout_main {
        flex: 1;
        display: flex;
        flex-direction: column;
        &__header_container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: url(../assets/main_nav_bg.png) no-repeat center / cover;
        }
        &__header_content {
            .flex(row, nowrap, space-between, center);
            margin: 0 auto;
            padding: 0 32px;
            max-width: 1200px;
            height: 80px;
            line-height: 80px;
        }
        &__logo {
            .flex(row, nowrap, space-between, center);
            img {
                width: 138px;
                height: 30px;
            }
        }
        &__ioblink {
            .flex(row, nowrap, center, center);
            img {
                width: 32px;
                height: 32px;
            }
        }
        &__content_container {
            flex: 1;
        }
        &__footer_container {
        }
    }
    @media screen and (max-width: 400px) {
        .layout_main {
            &__header_container {
            }
            &__header_content {
                padding: 0 16px;
            }
            &__logo {
            }
            &__logo_icon {
                img {
                }
            }
            &__logo_text {
                img {
                }
            }
            &__ioblink {
                img {
                }
            }
            &__content_container {
            }
            &__footer_container {
            }
        }
    }
</style>
